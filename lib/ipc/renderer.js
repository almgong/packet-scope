/**
 * Renderer processes should use this interface to communicate with the main process.
 * 
 * The reason we use an interface rather than, say, vanilla electron ipcX is so that
 * we have complete control over what types of messages can be sent and there will
 * be an easy place to find "self-documentation" for such events. Also this modularizes
 * IPC logic so that if newer conventions arise, a simple update to this module will
 * suffice.
**/

// TODO 