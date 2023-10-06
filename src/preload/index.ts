import { contextBridge, ipcRenderer } from 'electron'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = [
  'request_app_version',
  'open_external_url',
  'request_api_port',
  'get_flask_response',
  'get_api_port'];
const rendererAvailChannels: string[] = [
  'received_app_version',
  'received_api_port'];

contextBridge.exposeInMainWorld('mainApi', {
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data]);
    } else {
      throw new Error(`Send failed: Unknown ipc channel name: ${channel}`);
    }
  },
  receive: (channel: string, cbFunc: Function): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cbFunc(event, ...args));
    } else {
      throw new Error(`Receive failed: Unknown ipc channel name: ${channel}`);
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      return await ipcRenderer.invoke.apply(null, [channel, ...data]);
    }
    throw new Error(`Invoke failed: Unknown ipc channel name: ${channel}`);
  },
});
