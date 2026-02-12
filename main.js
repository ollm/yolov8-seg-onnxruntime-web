const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const ort = require('onnxruntime-node');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for model loading and inference
ipcMain.handle('load-model', async (event, modelName) => {
  try {
    const modelPath = path.join(__dirname, 'public', 'model', modelName);
    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['cpu']
    });
    return { success: true, sessionId: modelPath };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-model-path', async (event, modelName) => {
  return path.join(__dirname, 'public', 'model', modelName);
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    return { success: true, data: buffer };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
