const Messages = require('../messages');

/**
 * The main process should use this interface to communicate with the main process.
 * 
 * The reason we use an interface rather than, say, vanilla electron ipcX is so that
 * we have complete control over what types of messages can be sent and there will
 * be an easy place to find "self-documentation" for such events. Also this modularizes
 * IPC logic so that if newer conventions arise, a simple update to this module will
 * suffice.
**/

// Static class for sending IPC messages to renderer processes
class MainIpc {
	static sendMessage(windowHandle, message, callback) {
		if (validateMessage(message)) {
			const { channel, messageContent } = message;

			windowHandle.webContents.send(channel, messageContent);
			callback();	// no errors!
		} else {
			callback({ message: 'Invalid message object!' }, null);
		}
	}

	static validateMessage(message) {
		if (!message.channel || !message.constructor == String || !message.messageContent) {
			return false;
		}

		let validChannel = Messages.keys.indexOf(message.channel) > -1;

		return validChannel;	// Add more as needed; for now we just need to make sure it's a valid channel
	}
}

module.exports = MainIpc;