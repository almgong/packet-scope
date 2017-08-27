const { app, BrowserWindow } = require('electron');
const MainIpc = require('./lib/ipc/main');
const PacketListener = require('./lib/packet/packet-listener');
const path = require('path');
const url = require('url');

/**
 * Main entry point for the electron app. This file should contain/invoke the core logic 
 * that registers windows and handles appropriate events.
**/

// convenience config object
let config = {
  appWindowWidth: 800,
  appWindowHeight: 600,
  appMainWindowPath: path.join(__dirname, 'views/index.html')
};

// Main window
let win;

/**
 * Creates and loads the main window
**/
function createPacketScopeMainWindow() {
  win = new BrowserWindow({
    width: config.appWindowWidth,
    height: config.appWindowHeight
  });

  win.loadURL(url.format({
    pathname: config.appMainWindowPath,
    protocol: 'file',
    slashes: true
  }));

  win.webContents.openDevTools();
}

/* Register events */

app.on('ready', createPacketScopeMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createPacketScopeMainWindow();
  }
});

// start listening for packets
const onPacket = (packet) => {
  console.log('[Main Process]: Got a packet!');
  console.log(packet)
};
packetListener = new PacketListener(onPacket);
packetListener.start();

