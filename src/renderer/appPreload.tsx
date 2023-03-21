import {
  contextBridge,
  ipcRenderer,
} from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    invoke: <T,>(channel: string, data: T) => {
      return ipcRenderer.invoke(channel, data);
    },
    send: <T, >(channel: string, data: T) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel: string, listener: (data: any) => void) => {
      const subscription = (event: Electron.IpcRendererEvent, data: any) => {
        listener(data);
      };
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
  },
);
