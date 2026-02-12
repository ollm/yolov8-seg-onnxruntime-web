const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    loadModel: (modelName) => ipcRenderer.invoke('load-model', modelName),
    getModelPath: (modelName) => ipcRenderer.invoke('get-model-path', modelName),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    // Add onnxruntime-node API exposure
    ort: {
      InferenceSession: require('onnxruntime-node').InferenceSession,
      Tensor: require('onnxruntime-node').Tensor
    }
  }
);
