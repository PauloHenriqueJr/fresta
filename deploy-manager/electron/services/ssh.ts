import { Client } from 'ssh2'
import fs from 'node:fs'

interface SSHConfig {
  host: string
  port: number
  username: string
  password?: string
  privateKeyPath?: string
}

export class SSHService {
  public client: Client
  private connected: boolean = false
  private connecting: Promise<void> | null = null

  constructor() {
    this.client = new Client()
    // Global error handler to prevent "Uncaught Exception" crashes
    this.client.on('error', (err) => {
      console.error('SSH Client Global Error:', err)
      this.connected = false
      this.connecting = null
    })
  }

  async connect(config: SSHConfig): Promise<void> {
    if (this.connected) return
    if (this.connecting) return this.connecting

    this.connecting = new Promise((resolve, reject) => {
      const connConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username,
        readyTimeout: 10000, // 10s timeout for handshake
      }

      if (config.privateKeyPath) {
        try {
          connConfig.privateKey = fs.readFileSync(config.privateKeyPath)
        } catch (e: any) {
          this.connecting = null
          return reject(new Error(`Falha ao ler chave privada: ${e.message}`))
        }
      } else if (config.password) {
        connConfig.password = config.password
      }

      // Cleanup previous task-specific listeners
      this.client.removeAllListeners('ready')
      this.client.removeAllListeners('close')
      this.client.removeAllListeners('end')

      const onReady = () => {
        this.connected = true
        this.connecting = null
        this.client.removeListener('error', onError)
        resolve()
      }

      const onError = (err: Error) => {
        this.connected = false
        this.connecting = null
        this.client.removeListener('ready', onReady)
        reject(err)
      }

      this.client.once('ready', onReady)
      this.client.once('error', onError)
      
      this.client.once('close', () => {
        this.connected = false
        this.connecting = null
      })

      try {
        this.client.connect(connConfig)
      } catch (e: any) {
        this.connecting = null
        reject(e)
      }
    })

    return this.connecting
  }

  async exec(command: string, onData?: (data: string) => void): Promise<void> {
    if (!this.connected) throw new Error('Not connected')

    return new Promise((resolve, reject) => {
      this.client.exec(command, (err, stream) => {
        if (err) return reject(err)
        
        stream.on('close', (code: any, signal: any) => {
          if (code === 0) resolve()
          else reject(new Error(`Command failed with code ${code}`))
        }).on('data', (data: any) => {
          if (onData) onData(data.toString())
        }).stderr.on('data', (data: any) => {
          if (onData) onData(data.toString())
        })
      })
    })
  }

  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    if (!this.connected) throw new Error('Not connected')
    return new Promise((resolve, reject) => {
      this.client.sftp((err, sftp) => {
        if (err) return reject(err)
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    })
  }

  disconnect() {
    this.client.end()
    this.connected = false
  }
}

export const sshService = new SSHService()
