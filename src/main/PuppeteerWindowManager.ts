import { BrowserWindow } from 'electron';
import path from 'node:path';

const ZOOM_FACTOR = 0.5;

export class PuppeteerWindowManager {
  static instance: PuppeteerWindowManager;
  window: BrowserWindow;

  static getInstance() {
    if (!PuppeteerWindowManager.instance) {
      PuppeteerWindowManager.instance = new PuppeteerWindowManager();
    }
    return PuppeteerWindowManager.instance;
  }

  createWindow(mainWindow: BrowserWindow) {

    const [width, height] = mainWindow.getSize();
    const { x, y } = mainWindow.getBounds();

    this.window = new BrowserWindow({
      frame: false,
      transparent: true,
      hasShadow: false,
      resizable: false,
      focusable: true,
      movable: false,
      roundedCorners: false,
      show: true,
      fullscreenable: false,
      skipTaskbar: true,
      width: width - 680,
      height: height - 100,
      x: x + 660,
      y: y + 80,
      parent: mainWindow,
      webPreferences: {
        zoomFactor: ZOOM_FACTOR,
        // contextIsolation: false,
        // nodeIntegration: true,
        preload: path.join(__dirname, './preload_puppeteer.js'),
      }
    });

    this.window.webContents.setWindowOpenHandler(({ url }) => {
      this.window.loadURL(url);
      return { action: 'deny' };
    })

    this.window.once('ready-to-show', () => {
      this.window.webContents.setZoomFactor(ZOOM_FACTOR);
      this.window.moveTop();
    })

    this.window.webContents.openDevTools({ mode: 'detach' });
  }

  openUrl(url: string) {
    this.window.loadURL(url);
  }

  updateWindowBounds(bounds: { x: number, y: number, width: number, height: number }) {
    const { x, y, width, height } = bounds;
    this.window.setBounds({ x: x + 660, y: y + 80, width: width - 680, height: height - 100 });
  }

  async sendCommand(command: string, ...args: any[]) {
    const isAttached = this.window.webContents.debugger.isAttached();
    if (!isAttached) {
      this.window.webContents.debugger.attach('1.3');
    }
    return this.window.webContents.send(command, ...args);
  }
}