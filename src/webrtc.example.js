/* eslint no-extra-parens:0 */
import attachMediaStream from 'attachmediastream';
import { getUserMedia } from './getUserMedia';
import { WS } from './ws';
import { WebRTC } from './webrtc';

const $ = document.querySelector.bind(document);
const wsshost = localStorage.wsshost;

const media = {
  autoplay: true,
  mirror: true,
  muted: true,
  audio: false,
};

function main() {
  $('#view').value = '';

  const id = localStorage.id;
  const peerid = (id === 'chrome') ? 'firefox' : 'chrome';

  const ws = new WS(wsshost);
  const webrtc = new WebRTC(id, peerid, ws);

  webrtc.on('channel', (channel) => {
    channel.on('message', (message) => {
      message += '\n';
      $('#view').value += message;
    });
    setInterval(() => {
      channel.send(`${id} ${Date.now()}`);
    }, 800);
  });

  $('#send').addEventListener('click', () => {
    webrtc.createDataChannel('rtc');
  });

  webrtc.on('addStream', (stream) => {
    console.info('-------onAddStream', stream.id, stream);

    const video = attachMediaStream(stream, $('#remote'));
    video.stream = stream;
  });

  $('#start').addEventListener('click', () => {
    getUserMedia(media).then((stream) => {
      console.info('-------getUserMedia', stream.id, stream);

      const video = attachMediaStream(stream, $('#local'));
      video.stream = stream;

      webrtc.addStream(stream);
    });
  });

  webrtc.on('error', console.error.bind(console));
}

main();
