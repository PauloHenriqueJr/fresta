import { Client, SFTPWrapper } from 'ssh2'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { ConfigStore } from './store'
import { sshService } from './ssh'

export interface ContainerStatus {
  id: string
  names: string
  image: string
  status: string
  createdAt: string
  ports: string
}

export interface TraefikDiscovery {
  found: boolean
  containerName?: string
  networks: string[]
}

export interface ImageStatus {
  id: string
  repo: string
  tag: string
  size: string
  createdAt: string
}

export interface FileInfo {
  name: string
  size: string
  isDir: boolean
  modified: string
}

export class StatusService {
  private queue: Promise<any> = Promise.resolve()

  private async runSSHCommand<T>(action: (ssh: any) => Promise<T>): Promise<T> {
    // Sequential execution to avoid concurrent connection/disconnection races
    const result = this.queue.then(async () => {
      const vpsConfig = ConfigStore.get('vps')
      if (!vpsConfig || !vpsConfig.host) {
        throw new Error('VPS não configurada')
      }

      try {
        await sshService.connect({
          host: vpsConfig.host,
          port: Number(vpsConfig.port) || 22,
          username: vpsConfig.username,
          password: vpsConfig.password,
          privateKeyPath: vpsConfig.privateKeyPath
        })
        return await action(sshService)
      } finally {
        sshService.disconnect()
      }
    })

    this.queue = result.catch(() => {})
    return result
  }

  async getVPSContainers(): Promise<ContainerStatus[]> {
    return this.runSSHCommand(async (ssh) => {
      let output = ''
      const cmd = `docker ps -a --format '{"ID":"{{.ID}}", "Names":"{{.Names}}", "Image":"{{.Image}}", "Status":"{{.Status}}", "CreatedAt":"{{.CreatedAt}}", "Ports":"{{.Ports}}"}'`
      
      await ssh.exec(cmd, (data: string) => {
        output += data
      })

      return output
        .trim()
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const raw = JSON.parse(line)
            return {
              id: raw.ID,
              names: raw.Names,
              image: raw.Image,
              status: raw.Status,
              createdAt: raw.CreatedAt,
              ports: raw.Ports
            }
          } catch (e) {
            return null
          }
        })
        .filter((c): c is ContainerStatus => c !== null)
    })
  }

  async stopContainer(id: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`docker stop ${id}`)
    })
  }

  async startContainer(id: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`docker start ${id}`)
    })
  }

  async restartContainer(id: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`docker restart ${id}`)
    })
  }

  async removeContainer(id: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`docker rm -f ${id}`)
    })
  }

  async detectTraefik(): Promise<TraefikDiscovery> {
    return this.runSSHCommand(async (ssh) => {
      let psOutput = ''
      let netOutput = ''

      // Find traefik container
      await ssh.exec('docker ps --filter "name=traefik" --format "{{.Names}}"', (data: string) => {
        psOutput += data
      })

      // List all networks to find potential public/proxy ones
      await ssh.exec('docker network ls --format "{{.Name}}"', (data: string) => {
        netOutput += data
      })

      const networks = netOutput.trim().split('\n').filter(n => 
        n.includes('traefik') || n === 'proxy' || n === 'gateway' || n === 'web'
      )

      return {
        found: psOutput.trim().length > 0,
        containerName: psOutput.trim().split('\n')[0],
        networks
      }
    })
  }

  async getImages(): Promise<ImageStatus[]> {
    return this.runSSHCommand(async (ssh) => {
      let output = ''
      const cmd = `docker images --format '{"ID":"{{.ID}}", "Repo":"{{.Repository}}", "Tag":"{{.Tag}}", "Size":"{{.Size}}", "CreatedAt":"{{.CreatedAt}}"}'`
      await ssh.exec(cmd, (data: string) => output += data)

      return output.trim().split('\n').filter(l => l.trim()).map(line => {
        try {
          const raw = JSON.parse(line)
          return {
            id: raw.ID,
            repo: raw.Repo,
            tag: raw.Tag,
            size: raw.Size,
            createdAt: raw.CreatedAt
          }
        } catch (e) { return null }
      }).filter((i): i is ImageStatus => i !== null)
    })
  }

  async removeImage(id: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`docker rmi -f ${id}`)
    })
  }

  async listFiles(path: string = '.'): Promise<FileInfo[]> {
    return this.runSSHCommand(async (ssh) => {
      let output = ''
      // Quote path for safety
      const cmd = `ls -alhp --group-directories-first "${path}"`
      await ssh.exec(cmd, (data: string) => output += data)

      return output.trim().split('\n')
        .slice(1) // Remove "total X"
        .map(line => {
          const parts = line.split(/\s+/)
          if (parts.length < 9) return null
          const name = parts.slice(8).join(' ')
          if (name === './' || name === '../') return null
          
          return {
            name: name,
            size: parts[4],
            isDir: name.endsWith('/'),
            modified: `${parts[5]} ${parts[6]} ${parts[7]}`
          }
        })
        .filter((f): f is FileInfo => f !== null)
    })
  }

  async deleteFile(filePath: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.exec(`rm -rf "${filePath}"`)
    })
  }

  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      await ssh.uploadFile(localPath, remotePath)
    })
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    return this.runSSHCommand(async (ssh) => {
      return new Promise((resolve, reject) => {
        ssh.client.sftp((err: Error | undefined, sftp: SFTPWrapper) => {
          if (err) return reject(err)
          sftp.fastGet(remotePath, localPath, (err: Error | null | undefined) => {
            if (err) reject(err)
            else resolve()
          })
        })
      })
    })
  }
}

export const statusService = new StatusService()
