const { app, BrowserWindow, screen, Menu } = require('electron');
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
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
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
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // if (process.env.NODE_ENV === 'prod') {
  //   _window.webContents.openDevTools();
  //   _window.loadFile(__dirname + '/../client/dist/index.html');
  // } else {
  //   _window.loadURL('https://github.com/kingRayhan/');
  // }

  // _window.loadFile(__dirname + '/../client/dist/index.html');
  // _window.webContents.openDevTools();
  // if (process.env.NODE_ENV === 'dev') {
  //   _window.webContents.openDevTools();
  //   _window.loadURL('http://localhost:3000');
  // } else {
  //   fs.copySync('../client/dist', './dist');
  //   _window.loadFile('./dist/index.html');
  //   _window.webContents.openDevTools();
  // }

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../client-dist/index.html')}`;

  _window.loadURL(startURL);

  _window.webContents.openDevTools();

  console.log('---------- building ----------');
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
