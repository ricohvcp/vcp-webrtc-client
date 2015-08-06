/* eslint no-extra-parens:1 */
import { EventEmitter } from 'events';
import { RTC } from './rtc';

export class WebRTC extends EventEmitter {
  constructor(id, peerid, socket) {
    super();

    this.id = id;
    this.peerid = peerid;
    this.socket = socket;
    this.rtc = new RTC(this.id);

    this.side = 'none'; // 'none', 'offer' or 'answer'

    this.socket.on('message', (message) => {
      if (message.to !== this.id) return;

      const type = message.type;
      const data = message.data;

      console.log(this.id, 'receive', type);

      switch (type) {
        case 'offer':
          this.answer(data).catch(this.catch);
          break;
        case 'answer':
          this.rtc.setRemoteDescription(data).catch(this.catch);
          break;
        case 'ice':
          this.rtc.addIceCandidate(data).catch(this.catch);
          break;
        case 'offerRequest':
          this.offer().catch(this.catch);
          break;
        default:
          console.trace('default');
      }
    });

    this.rtc.on('icecandidate', (ice) => {
      this.send({
        type: 'ice',
        data: ice,
      });
    });

    this.rtc.on('negotiationneeded', (e) => {
      if (this.side === 'none' || this.side === 'offer') {
        this.offer().catch(this.catch);
      }
      if (this.side === 'answer') {
        console.info(e);
        this.offerRequest();
      }
    });

    this.rtc.on('channel', (channel) => {
      channel.on('error', console.error.bind(console));
      channel.on('close', console.error.bind(console));

      channel.on('open', () => {
        this.emit('channel', channel);
      });
    });

    this.rtc.on('addStream', (stream) => {
      this.emit('addStream', stream);
    });

    this.catch = (err) => this.emit('error', err);
    this.on('error', console.error.bind(console));
  }

  createDataChannel(label) {
    return this.rtc.createDataChannel(label);
  }

  addStream(stream) {
    return this.rtc.addStream(stream);
  }

  offer() {
    this.side = 'offer';
    return this.rtc.createOffer().then((sdp) => {
      return this.rtc.setLocalDescription(sdp);
    }).then((sdp) => {
      // sdp comes here too
      this.send({
        type: 'offer',
        data: sdp,
      });
    });
  }

  answer(offer) {
    this.side = 'answer';
    return this.rtc.setRemoteDescription(offer).then(() => {
      return this.rtc.createAnswer();
    }).then((sdp) => {
      return this.rtc.setLocalDescription(sdp);
    }).then((sdp) => {
      // sdp comes here too
      this.send({
        type: 'answer',
        data: sdp,
      });
    });
  }

  offerRequest() {
    this.send({
      type: 'offerRequest',
    });
  }

  send(message) {
    console.log(this.id, 'send', message.type);
    message.from = this.id;
    message.to = this.peerid;
    this.socket.send(message);
  }
}
