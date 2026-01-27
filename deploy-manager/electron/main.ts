import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#09090b',
      symbolColor: '#10b981',
      height: 35
    },
    width: 1200,
    height: 800,
    backgroundColor: '#09090b', // dark background
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// IPC Handlers
import { ConfigStore } from './services/store'
import { sshService } from './services/ssh'
import { deployOrchestrator } from './services/orchestrator'

import { EnvDetector } from './services/env-detector'

ipcMain.handle('config:get', (_event: any, key: string) => ConfigStore.get(key as any))
ipcMain.handle('config:set', (_event: any, key: string, value: any) => ConfigStore.set(key as any, value))
ipcMain.handle('ssh:connect', async (_event: any, config: any) => sshService.connect(config))
ipcMain.handle('ssh:exec', async (event: any, cmd: string) => {
  return sshService.exec(cmd, (data: string) => {
    event.sender.send('terminal:data', data)
  })
})
ipcMain.handle('deploy:start', async (event: any, appId: string, env: 'production' | 'staging') => {
  return deployOrchestrator.deploy(appId, env, (data: string) => {
    event.sender.send('terminal:data', data)
  })
})
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  })
  if (canceled) return null
  return filePaths[0]
})

ipcMain.handle('dialog:openFile', async (_event, options) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    ...options
  })
  if (canceled) return null
  return filePaths[0]
})

ipcMain.handle('ssh:detectLocalKeys', async () => {
  const sshDir = path.join(os.homedir(), '.ssh')
  if (!fs.existsSync(sshDir)) return []
  
  const files = fs.readdirSync(sshDir)
  const privateKeys = files.filter((file: string) => {
    // Basic filter for potential private keys (no extension or .pem/.ppk, and not .pub)
    const isPublic = file.endsWith('.pub') || file.endsWith('.pub.ppk')
    const hasKnownName = file.startsWith('id_') || file.endsWith('.pem') || file.endsWith('.ppk')
    return hasKnownName && !isPublic
  })

  return privateKeys.map((name: string) => ({
    name,
    path: path.join(sshDir, name)
  }))
})

import { exec } from 'node:child_process'
import { promisify } from 'node:util'
const execAsync = promisify(exec)

ipcMain.handle('ssh:generateKey', async (_event, { email }: { email?: string }) => {
  const keyPath = path.join(os.homedir(), '.ssh', 'id_fresta_ed25519')
  const comment = email || 'fresta-deploy'
  
  try {
    // Check if key already exists
    if (fs.existsSync(keyPath)) {
      throw new Error('Uma chave "id_fresta_ed25519" já existe em ~/.ssh/. Por favor, use a existente ou renomeie-a.')
    }

    // Ensure .ssh exists
    const sshDir = path.join(os.homedir(), '.ssh')
    if (!fs.existsSync(sshDir)) fs.mkdirSync(sshDir, { recursive: true })

    await execAsync(`ssh-keygen -t ed25519 -C "${comment}" -f "${keyPath}" -N ""`)
    
    return {
      success: true,
      path: keyPath,
      publicKey: fs.readFileSync(`${keyPath}.pub`, 'utf-8')
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('env:detect', async (_event: any, projectPath: string) => {
  // If no path provided, try the parent directory (root of fresta)
  const targetPath = projectPath || path.join(process.env.APP_ROOT || '', '..')
  return EnvDetector.detect(targetPath)
})

ipcMain.handle('project:detect', async (_event: any, projectPath: string) => {
  const targetPath = projectPath || path.join(process.env.APP_ROOT || '', '..')
  const info = await EnvDetector.getProjectInfo(targetPath)
  const envVars = await EnvDetector.detect(targetPath)
  return { ...info, envVars, path: targetPath }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
