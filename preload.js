const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    moveWindow: (x, y) => ipcRenderer.send("move-window", x, y),
    getWindowBounds: () => ipcRenderer.sendSync("get-window-bounds"),
    openSettings: () => ipcRenderer.send("open-settings-window"),
    closeSettings: () => ipcRenderer.send("close-settings")
});