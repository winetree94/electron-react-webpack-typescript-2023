import { app, BrowserWindow, ipcMain } from 'electron';
import { chunk } from 'lodash';
import { createAppWindow } from './appWindow';
import { Worker } from 'worker_threads';

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', createAppWindow);

/**
 * Emitted when the application is activated. Various actions can
 * trigger this event, such as launching the application for the first time,
 * attempting to re-launch the application when it's already running,
 * or clicking on the application's dock or taskbar icon.
 */
app.on('activate', () => {
  /**
   * On OS X it's common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  if (BrowserWindow.getAllWindows().length === 0) {
    createAppWindow();
  }
});

/**
 * Emitted when all windows have been closed.
 */
app.on('window-all-closed', () => {
  /**
   * On OS X it is common for applications and their menu bar
   * to stay active until the user quits explicitly with Cmd + Q
   */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('search-keywords', async (event, data) => {
  // indexing
  const pathes: string[] = await new Promise((resolve) => {
    const worker = new Worker(new URL('./search-worker.ts', import.meta.url), {
      workerData: {
        path: data.path,
        extensions: data.extensions,
        ignorePatterns: data.ignorePatterns,
      }
    });
    worker.addListener('message', (message) => {
      resolve(message);
      worker.terminate();
    });
  });

  const result: Record<string, number> = {};
  const chunks = chunk(pathes, 300);

  // searching
  await Promise.all(chunks.map((chunk) => new Promise<void>(resolve => {
    const worker = new Worker(new URL('./find-worker.ts', import.meta.url), {
      workerData: {
        pathes: chunk,
        keywords: data.keywords,
      }
    });
    worker.addListener('message', (message) => {
      Object.keys(message).forEach((key) => {
        result[key] = (result[key] || 0) + message[key];
      });
      worker.terminate();
      resolve();
    });
  })));

  return result;
});

ipcMain.handle('change-key2', async (event, data) => {
  const pathes: string[] = await new Promise((resolve) => {
    const worker = new Worker(new URL('./search-worker.ts', import.meta.url), {
      workerData: {
        path: data.path,
        extensions: data.extensions,
        ignorePatterns: data.ignorePatterns,
      }
    });
    worker.addListener('message', (message) => {
      resolve(message);
      worker.terminate();
    });
  });

  const chunks = chunk(pathes, 300);

  await Promise.all(chunks.map((chunk) => new Promise<void>(resolve => {
    const worker = new Worker(new URL('./change-worker2.ts', import.meta.url), {
      workerData: {
        pathes: chunk,
        changes: data.changes,
      }
    });
    worker.addListener('message', (message) => {
      worker.terminate();
      resolve();
    });
  })));
});