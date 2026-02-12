const path = require('path');

export const download = async (modelPath, logger = null) => {
  try {
    if (logger) {
      const [log, setState] = logger;
      setState({ text: log, progress: null });
    }

    // In Electron, we load models directly from the file system
    // Get the model path from the main process
    const fileName = path.basename(modelPath);
    const modelData = await window.electron.getModelPath(fileName);
    
    if (logger) {
      const [log, setState] = logger;
      setState({ text: `${log} - Complete`, progress: 100 });
    }

    return modelData;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
};
