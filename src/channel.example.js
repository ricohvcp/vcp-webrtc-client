/* eslint no-extra-parens:0 */
import { WebRTC } from './webrtc';
import { WS } from './ws';

const wsshost = localStorage.wsshost;

function chat(channel) {
  const id = channel.id;

  const t = document.querySelector('#chattmpl');
  const clone = document.importNode(t.content, true);

  clone.querySelector('textarea').setAttribute('class', `x-${id}`);
  clone.querySelector('input').setAttribute('class', `x-${id}`);
  clone.querySelector('input').setAttribute('value', `send(${id})`);

  const chats = document.querySelector('#chats');
  chats.appendChild(clone);

  channel.on('message', (message) => {
    document.querySelector(`textarea.x-${id}`).value += message;
  });

  document.querySelector(`input.x-${id}`).addEventListener('click', () => {
    channel.send(`${localStorage.id} ${id}\n`);
  });
}

function main() {
  const id = localStorage.id;
  const peerid = (id === 'chrome') ? 'firefox' : 'chrome';

  console.log(id, peerid);
  const ws = new WS(wsshost);
  const webrtc = new WebRTC(id, peerid, ws);

  webrtc.on('channel', (channel) => {
    chat(channel);
  });

  document.getElementById('channel').addEventListener('click', () => {
    webrtc.createDataChannel('rtc');
  });
}

main();
