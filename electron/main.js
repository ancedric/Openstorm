const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess;

function startBackend() {
  const backendPath = path.join(__dirname, '..', 'backend', 'server.js');

  backendProcess = spawn(process.execPath, [backendPath], {
    cwd: path.join(__dirname, '..', 'backend'),
    env: { ...process.env },
    stdio: 'inherit'
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`Backend process exited with code=${code} signal=${signal}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.ELECTRON_DEV === 'true') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    try { backendProcess.kill(); } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
