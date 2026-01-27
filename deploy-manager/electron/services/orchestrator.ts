import { sshService } from './ssh'
import { ConfigStore } from './store'
import path from 'node:path'

export class DeployOrchestrator {
  private swapFile = '/temp_deploy_swap'

  async deploy(appId: string, targetEnv: 'production' | 'staging', onStatus: (msg: string) => void) {
    const apps = ConfigStore.get('apps') as Record<string, any>
    const appConfig = apps[appId]
    const vpsConfig = ConfigStore.get('vps') as any
    const envConfig = appConfig.environments[targetEnv]

    if (!appConfig) throw new Error(`App ${appId} not found`)

    const { exec: localExec } = await import('node:child_process')
    const { exec: localExecSync } = await import('node:child_process') // Just in case, but let's be careful with names
    const { unlink } = await import('node:fs/promises')
    const fs = await import('node:fs')

    try {
      onStatus(`🚀 Iniciando deploy em ${targetEnv.toUpperCase()} para ${appConfig.name}...\r\n`)
      onStatus(`🌿 Branch alvo: ${envConfig.branch}\r\n`)

      // 1. SSH Connect
      onStatus('🔌 Conectando à VPS...\r\n')
      await sshService.connect(vpsConfig)

      // 2. Code Setup
      const repoDir = envConfig.remotePath
      
      if (appConfig.sourceType === 'local') {
        onStatus(`📦 Comprimindo e enviando arquivos locais (Ambiente: ${targetEnv.toUpperCase()})...\r\n`)
        let localPath = appConfig.localPath
        const tarName = `deploy_${appId}.tar`
        // Use a temporary path that doesn't trigger tar's "remote host" detection
        const tempDir = process.env.TEMP || process.env.TMP || '/tmp'
        const localTarPath = path.join(tempDir, tarName)
        const remoteTarPath = `/tmp/${tarName}`

        // Compress locally (excluding node_modules and .git)
        const { exec: localExec } = await import('node:child_process')
        // Fix for Windows tar: use --force-local to prevent it from treating ":" as a remote host
        const tarCmd = `tar --force-local --exclude="node_modules" --exclude=".git" -cvf "${localTarPath}" -C "${localPath}" .`
        
        await new Promise((resolve, reject) => {
          localExec(tarCmd, (err) => {
            if (err) reject(new Error(`Falha na compressão local: ${err.message}`))
            else resolve(true)
          })
        })

        // Upload
        onStatus('📤 Transferindo arquivo para VPS...\r\n')
        await sshService.uploadFile(localTarPath, remoteTarPath)

        // Extract remotely
        onStatus('📦 Extraindo arquivos no servidor...\r\n')
        const extractCmd = `
          mkdir -p ${repoDir}
          tar -xvf ${remoteTarPath} -C ${repoDir}
          rm ${remoteTarPath}
        `
        await sshService.exec(extractCmd, onStatus)
        
        // Cleanup local tar
        const { unlink } = await import('node:fs/promises')
        await unlink(localTarPath).catch(() => {})

      } else {
        onStatus(`📂 Preparando repositório Git na VPS (Branch: ${envConfig.branch})...`)
        const repoUrl = appConfig.repoUrl
        const branch = envConfig.branch
        const gitCmd = `
          if [ ! -d "${repoDir}/.git" ]; then
            mkdir -p ${repoDir}
            git clone -b ${branch} ${repoUrl} ${repoDir}
          else
            cd ${repoDir} && git fetch origin ${branch} && git checkout ${branch} && git pull origin ${branch}
          fi
        `
        await sshService.exec(gitCmd, onStatus)
      }

      // 3. Swap Setup (Prevent OOM)
      onStatus('🧠 Alocando swap temporário (2GB) para estabilidade do build...')
      const swapSetupCmd = `
        sudo fallocate -l 2G ${this.swapFile}
        sudo chmod 600 ${this.swapFile}
        sudo mkswap ${this.swapFile}
        sudo swapon ${this.swapFile}
      `
      // We wrap in try-catch because swap might already exist or fail on some systems (permissions)
      try {
        await sshService.exec(swapSetupCmd, onStatus)
      } catch (e) {
        onStatus('⚠️ Falha ao configurar swap (isso pode ser normal se já existir ou sem permissão sudo). Continuando...')
      }

      // 4. Build Strategy
      if (appConfig.buildLocation === 'local') {
        onStatus('🏗️ Estratégia de Build: LOCAL selecionada.\r\n')
        onStatus('🔍 Verificando se o Docker está rodando no seu PC...\r\n')

        const { exec: localExec } = await import('node:child_process')
        
        // Check if docker is running locally
        try {
          await new Promise((resolve, reject) => {
            localExec('docker info', (err) => {
              if (err) reject(new Error('Docker Desktop não encontrado ou não está rodando. Por favor, inicie o Docker para prosseguir com o build local.'))
              else resolve(true)
            })
          })
          onStatus('✅ Docker detectado localmente.\r\n')
        } catch (dockerErr: any) {
          onStatus(`❌ ERRO: ${dockerErr.message}\r\n`)
          throw dockerErr
        }

        onStatus('🏗️ Iniciando build Docker LOCAL no seu PC...')
        
        const localPath = appConfig.sourceType === 'local' 
          ? appConfig.localPath 
          : path.join(process.env.TEMP || process.env.TMP || '/tmp', `repo_${appId}_${targetEnv}`)

        // If it's a github repo but local build, we might need to clone it locally first
        if (appConfig.sourceType === 'github') {
          onStatus(`📂 Clonando branch ${envConfig.branch} localmente para o build...`)
          if (fs.existsSync(localPath)) fs.rmSync(localPath, { recursive: true, force: true })
          const { execSync } = await import('node:child_process')
          execSync(`git clone -b ${envConfig.branch} ${appConfig.repoUrl} ${localPath}`)
        }

        const buildArgs = [
          ...Object.entries(envConfig.envVars || {}),
          ['APP_ENV', targetEnv],
          ['NODE_ENV', targetEnv === 'production' ? 'production' : 'development']
        ].map(([k, v]) => `--build-arg ${k}="${v}"`).join(' ')

        const imageName = `deploy_${appId.toLowerCase()}:${targetEnv}`
        const localImagePath = path.join(process.env.TEMP || process.env.TMP || '/tmp', `image_${appId}.tar`)
        const remoteImagePath = `/tmp/image_${appId}.tar`

        // Build Locally
        onStatus('🔨 Construindo imagem Docker...')
        await new Promise((resolve, reject) => {
          localExec(`docker build ${buildArgs} -t ${imageName} "${localPath}"`, (err) => {
            if (err) reject(new Error(`Falha no build Docker local: ${err.message}`))
            else resolve(true)
          })
        })

        // Save image to tar
        onStatus('💾 Salvando imagem Docker para transferência...')
        await new Promise((resolve, reject) => {
          localExec(`docker save -o "${localImagePath}" ${imageName}`, (err) => {
            if (err) reject(new Error(`Falha ao salvar imagem Docker: ${err.message}`))
            else resolve(true)
          })
        })

        // Upload to VPS
        onStatus('📤 Transferindo imagem para VPS (isso pode demorar dependendo do tamanho)...')
        await sshService.uploadFile(localImagePath, remoteImagePath)

        // Load on VPS
        onStatus('🗳️ Carregando imagem na VPS...')
        await sshService.exec(`docker load -i ${remoteImagePath} && rm ${remoteImagePath}`, onStatus)

        // Cleanup local image tar
        const { unlink } = await import('node:fs/promises')
        await unlink(localImagePath).catch(() => {})

        // Run on VPS
        onStatus('🚀 Subindo containers na VPS...')
        const deployCmd = `
          cd ${repoDir}
          export IMAGE_TAG=${targetEnv}
          docker compose up -d --force-recreate
        `
        await sshService.exec(deployCmd, onStatus)

      } else {
        // 4. Remote Docker Build & Up
        onStatus(`🏗️ Estratégia de Build: REMOTA (VPS) selecionada (${targetEnv.toUpperCase()}).\r\n`)
        onStatus('🔨 Iniciando build Docker diretamente no servidor...\r\n')
        
        const buildArgs = [
          ...Object.entries(envConfig.envVars || {}),
          ['APP_ENV', targetEnv],
          ['NODE_ENV', targetEnv === 'production' ? 'production' : 'development']
        ].map(([k, v]) => `--build-arg ${k}="${v}"`).join(' ')

        const deployCmd = `
          cd ${repoDir}
          export IMAGE_TAG=${targetEnv}
          docker compose build ${buildArgs}
          docker compose up -d --force-recreate
        `
        await sshService.exec(deployCmd, onStatus)
      }

      onStatus(`✅ Deploy em ${targetEnv.toUpperCase()} concluído com sucesso!`)
      
      // Update app status
      appConfig.lastDeploy = new Date().toISOString()
      appConfig.lastEnv = targetEnv
      appConfig.status = 'running'
      ConfigStore.set('apps', { ...(apps as object), [appId]: appConfig })

    } catch (err: any) {
      onStatus(`❌ ERRO NO DEPLOY: ${err.message}`)
      throw err
    } finally {
      // 5. Cleanup Swap
      onStatus('🧹 Limpando recursos temporários...\r\n')
      const cleanupCmd = `
        sudo swapoff ${this.swapFile} 2>/dev/null || true
        sudo rm ${this.swapFile} 2>/dev/null || true
      `
      try {
        await sshService.exec(cleanupCmd, onStatus)
      } catch (e) {
        // Ignore cleanup errors
      }
      
      sshService.disconnect()
    }
  }
}

export const deployOrchestrator = new DeployOrchestrator()
