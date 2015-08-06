import attachMediaStream from 'attachmediastream';
import { getUserMedia } from './getUserMedia';
import { getMediaDevices } from './getUserMedia';

function main() {
  getMediaDevices().then((devices) => {
    document.getElementById('devices').textContent = JSON.stringify(devices, null, '  ');
  });

  const option = {
    autoplay: true,
    mirror: true,
    muted: true,
    audio: false,
  };

  getUserMedia(option).then((stream) => {
    const video = attachMediaStream(stream, null, option);
    document.getElementById('video').appendChild(video);
  }).catch((err) => {
    console.error(err);
  });
}

main();
