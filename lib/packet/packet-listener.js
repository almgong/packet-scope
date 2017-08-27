const nodeIpc = require('node-ipc');
const path = require('path');
const Sudoer = require('electron-sudo').default;

/**
 * Module that listens for network packets.
 *
 * The current implementation spawns a child process with sudo access to
 * obtain the necessary permissions to listen for in/outbound packets.
 **/

// possible states of the listener
const STATES = {
  IDLE: 0,
  LISTENING: 1
};

class PacketListener {
  constructor(onPacket) {
    // privates
    this._childProcess = null;
    this._ipcChannelId = 'PacketListener';
    this._sudoerOptions = {
      name: 'Packet-scope'  // TODO: abstract this!
    };
    this._state = STATES.IDLE;

    // callback to invoke when a network packet is received ((packet) => {...})
    this.onPacket = onPacket;
  }

  start() {
    if (this._state == STATES.IDLE && !this._childProcess) {
      // spawn a child process to listen to packets (using electron-sudo)
      // see: https://www.npmjs.com/package/electron-sudo
      let sudoer = new Sudoer(this._sudoerOptions);
      sudoer.spawn('node', [path.join(__dirname, 'packet-listener-sub.js')], {
        stdio: 'pipe'
      }).then((cp) => {
        this._childProcess = cp;
        this._state = STATES.LISTENING;

        this._childProcess.stderr.on('data', (data) => {
          console.log("error!")
          console.log(data.toString())
        })
      });

      // initialize local (Unix/Windows) domain socket for IPC:
      // listens for child's messages, and on packet, invoke the specified callback
      // note we can't simply use node's spawn IPC because the process is exec'ed with
      // sudo. therefore, we will use node-ipc in its place.
      nodeIpc.config.retry = 5000;
      nodeIpc.serve(this._ipcChannelId, () => {
        // after local socket is ready, bind data events
        nodeIpc.server.on('packet', (packet, _socket) => {
          console.log('[PacketListener]: Parent received a packet!');
          console.log(packet)

          if (this.onPacket && this.onPacket.constructor == Function) {
            this.onPacket(packet.content);
          }
        });
      });

      // start Ipc server
      nodeIpc.server.start();
    } else {
      console.log("[PacketListener]: Already listening!")
    }
  }

  stop() {
    if (this._state == STATES.LISTENING && this._childProcess) {
      // kill subprocess
      this._childProcess.kill();
      this._childProcess = null;
      this._state = STATES.IDLE;
    }
  }
}

module.exports = PacketListener;