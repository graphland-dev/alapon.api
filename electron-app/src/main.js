const { app, BrowserWindow, screen, Menu, Notification } = require('electron');
const path = require('path');
const isDev = app.isPackaged ? false : true;

const isMac = process.platform === 'darwin';

const menu = Menu.buildFromTemplate([
  ...(isMac
    ? [
        {
          label: 'Blackmagic',
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Contact Developer',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/kingRayhan/');
        },
      },
    ],
  },
]);

if (isMac) {
  Menu.setApplicationMenu(menu);
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const _window = new BrowserWindow({
    width: width - 200,
    height: height - 200,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const _splashWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: true,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  _splashWindow.loadFile(path.join(__dirname, '/splash.html'));

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../client-dist/index.html')}`;
  _window.loadURL(startURL);

  setTimeout(() => {
    _splashWindow.close();
    _window.show();
  }, 5000);

  // if (isDev) _window.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit the app on macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
