const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.disableHardwareAcceleration();

require("electron-reload")(path.join(__dirname, "frontend"), {
    electron: path.join(__dirname, "node_modules", ".bin", "electron")
});

let mainWindow;
let settingsWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 103,
        frame: false,
        transparent: true,
        minimizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.setMinimumSize(600, 103);
    mainWindow.setAlwaysOnTop(true, "exclusive-fullscreen");
    mainWindow.loadFile(path.join(__dirname, "frontend", "index.html"));

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});

ipcMain.on("move-window", (event, x, y) => {
    if (!mainWindow) return;
    mainWindow.setPosition(x, y);
});

ipcMain.on("get-window-bounds", (event) => {
    if (!mainWindow) return;
    event.returnValue = mainWindow.getBounds();
});

ipcMain.on("open-settings-window", () => {
    if (!settingsWindow) {
        settingsWindow = new BrowserWindow({
            width: 750,
            height: 400,
            frame: false,
            transparent: true,
            modal: true,
            parent: mainWindow,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        settingsWindow.loadURL(`file://${__dirname}/frontend/configuracoes.html`);

        settingsWindow.on("closed", () => {
            settingsWindow = null;
        });
    }
});

ipcMain.on("close-settings", () => {
    if (settingsWindow) {
        settingsWindow.close();
    }
});