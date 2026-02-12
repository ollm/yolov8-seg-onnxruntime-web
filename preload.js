// With nodeIntegration enabled, the renderer process can directly require Node.js modules
// This preload script is kept for potential future use
const path = require('path');

window.getModelPath = (modelName) => {
  return path.join(__dirname, 'public', 'model', modelName);
};
