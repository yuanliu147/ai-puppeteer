import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { PuppeteerWindowManager } from './main/PuppeteerWindowManager';
import { sleep } from './utils';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    resizable: false, // 禁用resize

    webPreferences: {
      webviewTag: true,
      nodeIntegration: true, // 启用Node.js集成，BrowserWindow可以使用Node.js API
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
  mainWindow.webContents.openDevTools({ mode: 'detach' });


  const puppeteerWindowManager = PuppeteerWindowManager.getInstance();
  puppeteerWindowManager.createWindow(mainWindow);


  puppeteerWindowManager.openUrl('https://www.baidu.com');

  sleep(3000).then(async () => {
    const interactiveElements = await puppeteerWindowManager.window.webContents.executeJavaScript('aiOperator.markInteractiveElements()');
    console.log('interactiveElements: ', interactiveElements);
    const nativeImage = await puppeteerWindowManager.window.capturePage()

    const image = nativeImage.toDataURL();
    const markedImageUrl = await puppeteerWindowManager.window.webContents.executeJavaScript(`
      const elems = ${JSON.stringify(interactiveElements)}
      const imageUrl = ${JSON.stringify(image)}
      aiOperator.highlightMarkedElements(elems, imageUrl);
      `);

    console.log('markedImageUrl: ', markedImageUrl.slice(0, 100));

  });

  mainWindow.on('will-resize', (e, newBounds) => {
    puppeteerWindowManager.updateWindowBounds(newBounds);
  });

  mainWindow.on('move', () => {
    const [width, height] = mainWindow.getSize();
    const { x, y } = mainWindow.getBounds();
    puppeteerWindowManager.updateWindowBounds({ x, y, width, height });
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
