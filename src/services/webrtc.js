import Peer from 'simple-peer';

export function createPeer(initiator, stream) {
  return new Peer({
    initiator,
    stream,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });
}

export function setupCall(peer, remoteVideoRef) {
  peer.on('stream', (stream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  });

  peer.on('close', () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  });

  return peer;
}
