export interface IElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>
  on: (channel: string, callback: (...args: any[]) => void) => void
  send: (channel: string, ...args: any[]) => void
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI
  }
}
