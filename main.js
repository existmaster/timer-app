const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, nativeImage } = require('electron');
const path = require('path');
const url = require('url');
const nodeNotifier = require('node-notifier');

// 개발 모드인지 확인
const isDev = process.env.NODE_ENV !== 'production';
const port = 3000;

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const startUrl = isDev
    ? `http://localhost:${port}`
    : url.format({
        pathname: path.join(__dirname, '../.next/server/app/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 트레이 아이콘 생성 - 빈 이미지 사용
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: '열기', click: () => mainWindow.show() },
    { label: '종료', click: () => app.quit() }
  ]);
  tray.setToolTip('시간표 알림 앱');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
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

// 알림 함수
function showNotification(title, message) {
  if (process.platform === 'darwin') {
    nodeNotifier.notify({
      title: title,
      message: message,
      sound: true,
    });
  } else {
    new Notification({
      title: title,
      body: message,
    }).show();
  }
}

// IPC 통신 설정
ipcMain.on('show-notification', (event, { title, message }) => {
  showNotification(title, message);
});

ipcMain.on('quit-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
}); 