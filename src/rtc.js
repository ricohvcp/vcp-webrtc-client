import { RTCPeerConnection } from 'webrtc-adapter-test';
import { EventEmitter } from 'events';
import { Channel } from './channel';

export class RTC extends EventEmitter {
  constructor(id) {
    super();

    this.id = id;

    this.connection = new RTCPeerConnection({
      iceServers: [],
    });

    this.connection.onicecandidate = (e) => {
      console.log(this.id, 'onicecandidate', e);

      if (e.candidate === null) return;
      this.emit('icecandidate', e.candidate, e);
    };

    this.connection.oniceconnectionstatechange = (e) => {
      console.log(this.id, 'oniceconnectionstatechange', this.iceConnectionState, this.iceGatheringState, e);

      this.emit('iceconnectionstatechange', this.iceConnectionState, e);
    };

    this.connection.onsignalingstatechange = (e) => {
      console.log(this.id, 'onsignalingstatechange', this.signalingState);

      this.emit('signalingstatechange', this.signalingState, e);
    };

    this.connection.onnegotiationneeded = (e) => {
      console.log(this.id, 'negotiationneeded', e);

      this.emit('negotiationneeded', e);
    };

    // DataChannel
    this.connection.ondatachannel = (e) => {
      console.log(this.id, 'channel', e);

      this.emit('channel', new Channel(e.channel));
    };

    this.connection.onaddstream = (e) => {
      console.log(this.id, 'addStream', e);

      this.emit('addStream', e.stream, e);
    };

    this.connection.onremovestream = (e) => {
      console.log(this.id, 'removeStream', e);

      this.emit('removeStream', e.stream, e);
    };
  }

  get signalingState() {
    return this.connection.signalingState;
  }

  get iceConnectionState() {
    return this.connection.iceConnectionState;
  }

  get iceGatheringState() {
    return this.connection.iceGatheringState;
  }

  createDataChannel(label, option) {
    console.log(this.id, 'createDataChannel', label, option);

    // DataChannel
    const channel = this.connection.createDataChannel(label, option);
    this.emit('channel', new Channel(channel));
  }

  addIceCandidate(ice) {
    console.log(this.id, 'addIceCandidate', ice);

    const candidate = new RTCIceCandidate(ice);
    return new Promise((resolve, reject) => {
      this.connection.addIceCandidate(candidate, resolve, reject);
    });
  }

  createOffer() {
    console.log(this.id, 'createOffer');

    return new Promise((resolve, reject) => {
      this.connection.createOffer(resolve, reject);
    });
  }

  createAnswer() {
    console.log(this.id, 'createAnswer');

    return new Promise((resolve, reject) => {
      this.connection.createAnswer(resolve, reject);
    });
  }

  setLocalDescription(sdp) {
    if (!(sdp instanceof RTCSessionDescription)) {
      sdp = new RTCSessionDescription(sdp);
    }
    console.log(this.id, 'setLocalDescription', sdp);

    return new Promise((resolve, reject) => {
      // resolve with sdp
      this.connection.setLocalDescription(sdp, resolve.bind(resolve, sdp), reject);
    });
  }

  setRemoteDescription(sdp) {
    if (!(sdp instanceof RTCSessionDescription)) {
      sdp = new RTCSessionDescription(sdp);
    }
    console.log(this.id, 'setRemoteDescription', sdp);

    return new Promise((resolve, reject) => {
      // resolve with sdp
      this.connection.setRemoteDescription(sdp, resolve.bind(resolve, sdp), reject);
    });
  }

  addStream(stream) {
    console.log(this.id, 'addStream', stream);

    this.connection.addStream(stream);
  }

  removeStream(stream) {
    console.log(this.id, 'removeStream', stream);

    this.connection.removeStream(stream);
  }
}
