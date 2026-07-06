const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // You can add methods here if needed
  appVersion: process.env.REACT_APP_VERSION
});
