import Store from 'electron-store'

interface ConfigSchema {
  vps: {
    host: string
    username: string
    port: number
    privateKeyPath?: string
    password?: string
  }
  apps: Record<string, any>
}

const store = new Store<ConfigSchema>({
  defaults: {
    vps: {
      host: '',
      username: 'root',
      port: 22,
    },
    apps: {},
  },
})

export const ConfigStore = {
  get: <K extends keyof ConfigSchema>(key: K): ConfigSchema[K] => store.get(key),
  set: <K extends keyof ConfigSchema>(key: K, value: ConfigSchema[K]) => store.set(key, value),
  getAll: () => store.store,
  clear: () => store.clear(),
}
