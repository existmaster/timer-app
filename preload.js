const { contextBridge, ipcRenderer } = require('electron');

// 렌더러 프로세스에 노출할 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 알림 보내기
  sendNotification: (title, message) => {
    ipcRenderer.send('show-notification', { title, message });
  },
  
  // 앱 종료
  quitApp: () => {
    ipcRenderer.send('quit-app');
  },
  
  // 앱 최소화
  minimizeApp: () => {
    ipcRenderer.send('minimize-app');
  }
}); 