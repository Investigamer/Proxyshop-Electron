import { app, BrowserWindow, systemPreferences } from 'electron'
import getPort from 'get-port';

import { join } from 'path'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-extension-installer'
import IPCs from './IPCs'

const { spawn } = require('child_process')
const path = require('path')

global.IS_DEV = process.env.NODE_ENV === 'development'
global.API_PORT = 8000

let mainWindow;

const exitApp = (): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
  mainWindow.destroy()
  app.exit()
}

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: global.IS_DEV ? 1300 : 720,
    height: 540,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      devTools: global.IS_DEV,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  mainWindow.setMenu(null);

  mainWindow.on('close', (event: Event): void => {
    event.preventDefault();
    exitApp();
  })

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (global.IS_DEV) {
      mainWindow.webContents.openDevTools();
    }
  })

  mainWindow.once('ready-to-show', (): void => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
  })

  // Initialize IPC Communication
  IPCs.initialize(mainWindow);

  if (global.IS_DEV) {
    await mainWindow.loadURL('http://localhost:5173')
  } else {
    await mainWindow.loadFile(join(__dirname, '../index.html'))
  }
};

app.whenReady().then(async () => {
  // Flask port
  global.API_PORT = await getPort()

  // Build the correct path to PY file or EXE
  const API_PATH = path.join(__dirname, '..', '..', 'backend')
  const API_ENTRY_POINT =  global.IS_DEV ? 'api.py' : 'api.exe'

  // Use the poetry args + port OR just port
  const API_ARGS = global.IS_DEV ? ['run', API_ENTRY_POINT] : []

  // Python child process
  const python = spawn(
    global.IS_DEV ? 'poetry' : API_ENTRY_POINT,
    [...API_ARGS, global.API_PORT],
    {'cwd': API_PATH})

  // Python backend console log
  python.stdout.on('data', (data) => {
    console.log(`Python backend output: ${data}`)
  });
  python.stderr.on('data', (data) => {
    console.error(`Python backend error: ${data}`)
  })

  if (process.platform === 'darwin') {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }

  if (global.IS_DEV) {
    await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
    await installExtension(REDUX_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    })
  }

  await createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    fetch(`http://127.0.0.1:${global.API_PORT}/shutdown`)
      .catch((reason) => console.log(reason))
      .finally(() => app.quit())
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
