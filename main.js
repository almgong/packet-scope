const { app, BrowserWindow } = require('electron');
const MainIpc = require('./lib/ipc/main');
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

// TODO move into its own module
const network = require('network');
const pcap = require('pcap');

network.get_active_interface((err, obj) => {
  if (!err) {
    let pcap_session = pcap.createSession(obj.name, '');  // '' for filter means log all packets
     pcap_session.on('packet', (raw_packet) => {
      let packet = pcap.decode.packet(raw_packet);

      console.log('packet!');
      console.log(packet);

     });
  } else {
    console.log('Error in getting active interface')
  }
});



