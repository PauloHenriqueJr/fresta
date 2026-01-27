import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'node:path'
import os from 'node:os'
import * as fs from 'node:fs'

// Correct path resolution for packaged app
// In packaged app: app.getAppPath() returns the root of the asar (where dist/ and dist-electron/ live)
// In dev: __dirname is dist-electron, so we go up one level
const APP_ROOT = app.isPackaged ? app.getAppPath() : path.join(__dirname, '..')
const DIST = path.join(APP_ROOT, 'dist')
const DIST_ELECTRON = path.join(APP_ROOT, 'dist-electron')

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(DIST_ELECTRON, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#09090b',
      symbolColor: '#10b981',
      height: 35
    },
    width: 1200,
    height: 800,
    backgroundColor: '#09090b',
  })

  // Open DevTools only in development
  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools()
  }

  // Load the app
  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(DIST, 'index.html'))
  }

  win.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load: ${validatedURL}`, errorDescription, errorCode)
  })
}

// IPC Handlers
import { ConfigStore } from './services/store'
import { sshService } from './services/ssh'
import { deployOrchestrator } from './services/orchestrator'
import { EnvDetector } from './services/env-detector'
import { statusService } from './services/status-service'

function registerIpcHandlers() {
  ipcMain.handle('config:get', (_, key: string) => ConfigStore.get(key as any))
  ipcMain.handle('config:set', (_, key: string, value: any) => ConfigStore.set(key as any, value))
  ipcMain.handle('ssh:connect', async (_, config: any) => sshService.connect(config))
  ipcMain.handle('ssh:exec', async (event, cmd: string) => {
    return sshService.exec(cmd, (data: string) => event.sender.send('terminal:data', data))
  })
  ipcMain.handle('deploy:start', async (event, appId: string, env: 'production' | 'staging') => {
    return deployOrchestrator.deploy(appId, env, (data: string) => event.sender.send('terminal:data', data))
  })
  ipcMain.handle('deploy:get-status', async () => statusService.getVPSContainers())
  ipcMain.handle('deploy:stop-container', async (_, id: string) => statusService.stopContainer(id))
  ipcMain.handle('deploy:start-container', async (_, id: string) => statusService.startContainer(id))
  ipcMain.handle('deploy:restart-container', async (_, id: string) => statusService.restartContainer(id))
  ipcMain.handle('deploy:remove-container', async (_, id: string) => statusService.removeContainer(id))
  ipcMain.handle('deploy:detect-traefik', async () => statusService.detectTraefik())
  ipcMain.handle('deploy:get-images', async () => statusService.getImages())
  ipcMain.handle('deploy:remove-image', async (_, id: string) => statusService.removeImage(id))
  ipcMain.handle('deploy:list-files', async (_, pathArg: string) => statusService.listFiles(pathArg))
  ipcMain.handle('deploy:delete-file', async (_, pathArg: string) => statusService.deleteFile(pathArg))
  ipcMain.handle('deploy:upload-file', async (_, localPath: string, remotePath: string) => statusService.uploadFile(localPath, remotePath))

  ipcMain.handle('deploy:open-remote-file', async (_, remotePath: string) => {
    const tempDir = path.join(app.getPath('temp'), 'fresta-remote-files')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    const fileName = remotePath.split('/').pop() || 'file'
    const localTempPath = path.join(tempDir, `${Date.now()}-${fileName}`)
    await statusService.downloadFile(remotePath, localTempPath)
    await shell.openPath(localTempPath)
    return { success: true, localPath: localTempPath }
  })

  ipcMain.handle('deploy:download-file-save-as', async (_, remotePath: string) => {
    const fileName = remotePath.split('/').pop() || 'file'
    const { canceled, filePath } = await dialog.showSaveDialog({ defaultPath: fileName, title: 'Salvar Arquivo' })
    if (canceled || !filePath) return { success: false, canceled: true }
    await statusService.downloadFile(remotePath, filePath)
    return { success: true, filePath }
  })

  ipcMain.handle('dialog:selectFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] })
    return canceled ? null : filePaths[0]
  })

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
    return canceled ? null : filePaths[0]
  })

  ipcMain.handle('ssh:detectLocalKeys', async () => {
    const sshDir = path.join(os.homedir(), '.ssh')
    if (!fs.existsSync(sshDir)) return []
    const files = fs.readdirSync(sshDir)
    const privateKeys = files.filter(f => !f.endsWith('.pub') && (f.startsWith('id_') || f.endsWith('.pem') || f.endsWith('.ppk')))
    return privateKeys.map(name => ({ name, path: path.join(sshDir, name) }))
  })

  ipcMain.handle('ssh:generateKey', async (_event, { email }: { email?: string }) => {
    const keyPath = path.join(os.homedir(), '.ssh', 'id_fresta_ed25519')
    const comment = email || 'fresta-deploy'
    try {
      if (fs.existsSync(keyPath)) throw new Error('Chave já existe.')
      const sshDir = path.join(os.homedir(), '.ssh')
      if (!fs.existsSync(sshDir)) fs.mkdirSync(sshDir, { recursive: true })
      const { exec: cpExec } = require('node:child_process')
      const { promisify: cpPromisify } = require('node:util')
      const execAsync = cpPromisify(cpExec)
      await execAsync(`ssh-keygen -t ed25519 -C "${comment}" -f "${keyPath}" -N ""`)
      return { success: true, path: keyPath, publicKey: fs.readFileSync(`${keyPath}.pub`, 'utf-8') }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('env:detect', async (_, projectPath: string) => {
    const targetPath = projectPath || path.join(APP_ROOT, '..', '..')
    return EnvDetector.detect(targetPath)
  })

  ipcMain.handle('project:detect', async (_, projectPath: string) => {
    const targetPath = projectPath || path.join(APP_ROOT, '..', '..')
    const info = await EnvDetector.getProjectInfo(targetPath)
    const envVars = await EnvDetector.detect(targetPath)
    return { ...info, envVars, path: targetPath }
  })
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
