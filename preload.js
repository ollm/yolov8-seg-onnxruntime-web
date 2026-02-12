// With nodeIntegration enabled, we can use process and path directly
const path = require('path');

// The app will be running from the root directory, so models are at public/model
window.getModelPath = (modelName) => {
  // When running from npm start, cwd is the app root
  // When packaged, we need to use process.resourcesPath or app.getAppPath()
  const appPath = process.cwd();
  return path.join(appPath, 'public', 'model', modelName);
};
