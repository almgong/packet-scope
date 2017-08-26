const { ipcRenderer } = require('electron');

/**
 * Renderer processes should use this interface to communicate with the main process.
 * 
 * The reason we use an interface rather than, say, vanilla electron ipcX is so that
 * we have complete control over what types of messages can be sent and there will
 * be an easy place to find "self-documentation" for such events. Also this modularizes
 * IPC logic so that if newer conventions arise, a simple update to this module will
 * suffice.
**/

class RendererIpc {
  // onMessage should be in form: (event, arg) => {}
  static listenFor(channel, onMessage, callback) {
    if (_validChannel(channel)) {
      ipcRenderer.on(channel, onMessage);
      callback();
    } else {
      callback({ message: 'Invalid channel passed in!' }, null);
    }
  }

  static sendMessage(message, callback) {
    if (_validMessage(message)) {
      const { channel, messageContent } = message;

      ipcRenderer.send(channel, messageContent);
      callback(); // no errors!
    } else {
      callback({ message: 'Invalid message object!' }, null);
    }
  }

  static _validMessage(message) {
    return _validChannel(channel) && message.messageContent;
  }

  static _validChannel(channel) {
    return (channel.constructor == String) && (Messages.keys.indexOf(channel) > -1);
  }
}