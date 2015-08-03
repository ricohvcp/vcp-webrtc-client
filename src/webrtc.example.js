/*eslint no-console:0, no-extra-parens:0 */
import attachMediaStream from 'attachmediastream';
import { getUserMedia } from './getUserMedia';
import { WS } from './ws';
import { WebRTC } from './webrtc';

let $ = document.querySelector.bind(document);

let media = {
  autoplay: true,
  mirror: true,
  muted: true,
  audio: false
};

function main() {
  $('#view').value = '';

  let id = localStorage.id;
  let peerid = (id === 'chrome') ? 'firefox' : 'chrome';

  let ws = new WS(wsshost);
  let webrtc = new WebRTC(id, peerid, ws);

  webrtc.on('channel', (channel) => {
    channel.on('message', (message) => {
      $('#view').value += (message + '\n');
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

    let video = attachMediaStream(stream, $('#remote'));
    video.stream = stream;
  });

  $('#start').addEventListener('click', () => {
    getUserMedia(media).then((stream) => {
      console.info('-------getUserMedia', stream.id, stream);

      let video = attachMediaStream(stream, $('#local'));
      video.stream = stream;

      webrtc.addStream(stream);
    });
  });

  webrtc.on('error', console.error.bind(console));
}

main();
