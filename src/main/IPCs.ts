import { BrowserWindow, ipcMain, shell } from 'electron';
import { version } from '../../package.json';

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(window: BrowserWindow): void {
    // Get application version
    ipcMain.on('request_app_version', () => {
      window.webContents.send('received_app_version', version)
    })

    // Get API Port
    ipcMain.on('request_api_port', () => {
      window.webContents.send('received_api_port', global.API_PORT)
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event, url) => {
      await shell.openExternal(url)
    })

    // Get the Flask API port
    ipcMain.handle('get_api_port', async () => global.API_PORT)

    // Request a response from Flask server
    ipcMain.handle('get_flask_response', async (event, url) =>
      await fetch(`http://127.0.0.1:${global.API_PORT}${url}`)
        .then(response => response.json())
        .then(data => data.message.toString())
        .catch((reason) => {
          console.log(reason)
          return 'No response'
        }))
  }
}
