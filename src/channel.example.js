/*eslint no-console:0, no-extra-parens:0 */
import { WebRTC } from './webrtc';
import { WS } from './ws';

function chat(channel) {
  var id = channel.id;

  var t = document.querySelector('#chattmpl');
  var clone = document.importNode(t.content, true);

  clone.querySelector('textarea').setAttribute('class', `x-${id}`);
  clone.querySelector('input').setAttribute('class', `x-${id}`);
  clone.querySelector('input').setAttribute('value', `send(${id})`);

  var chats = document.querySelector('#chats');
  chats.appendChild(clone);

  channel.on('message', (message) => {
    document.querySelector(`textarea.x-${id}`).value += message;
  });

  document.querySelector(`input.x-${id}`).addEventListener('click', () => {
    channel.send(`${localStorage.id} ${id}\n`);
  });
}

function main() {
  let id = localStorage.id;
  let peerid = (id === 'chrome') ? 'firefox' : 'chrome';

  console.log(id, peerid);
  let ws = new WS(wsshost);
  let webrtc = new WebRTC(id, peerid, ws);

  webrtc.on('channel', (channel) => {
    chat(channel);
  });

  document.getElementById('channel').addEventListener('click', () => {
    webrtc.createDataChannel('rtc');
  });
}

main();
