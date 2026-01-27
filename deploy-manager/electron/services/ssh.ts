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

  constructor() {
    this.client = new Client()
  }

  async connect(config: SSHConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const connConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username,
      }

      if (config.privateKeyPath) {
        connConfig.privateKey = fs.readFileSync(config.privateKeyPath)
      } else if (config.password) {
        connConfig.password = config.password
      } else {
         // Agent or other auth?
      }

      this.client.on('ready', () => {
        this.connected = true
        resolve()
      }).on('error', (err) => {
        this.connected = false
        reject(err)
      }).connect(connConfig)
    })
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
