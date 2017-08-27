const network = require('network');
const nodeIpc = require('node-ipc');
const pcap = require('pcap');

/* Subprocess logic used in packet-listener.js */
nodeIpc.config.retry = 5000;
nodeIpc.connectTo('PacketListener', () => {
  nodeIpc.log('what client')
  nodeIpc.of.PacketListener.on('connect', () => {
    nodeIpc.of.PacketListener.emit('message', 'hello world! child process!!')
  })
});

const helpers = {
  notifyParentOnPacket: (packet) => {
    nodeIpc.of.PacketListener.emit('packet', {
      content: packet
    });
  }
}

network.get_active_interface((err, obj) => {
  if (!err) {
    let pcap_session = pcap.createSession(obj.name, '');  // '' for filter means log all packets
     pcap_session.on('packet', (raw_packet) => {
      let packet = pcap.decode.packet(raw_packet);

      helpers.notifyParentOnPacket(packet);
     });
  } else {
    console.log('Error in getting active interface')
  }
});