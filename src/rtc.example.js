import { RTC } from './rtc';

function main() {
  const local = new RTC('local');
  const remote = new RTC('remote');

  const localChanPromise = new Promise((resolve, reject) => {
    local.on('channel', (chan) => {
      chan.on('message', (e) => {
        console.info(e);
      });

      chan.on('open', () => {
        resolve(chan);
      });

      chan.on('error', (err) => {
        reject(err);
      });

      chan.on('close', () => {
        console.info('close');
      });
    });
  });

  const remoteChanPromise = new Promise((resolve, reject) => {
    remote.on('channel', (chan) => {
      chan.on('message', (e) => {
        console.info(e);
      });

      chan.on('open', () => {
        resolve(chan);
      });

      chan.on('error', (err) => {
        reject(err);
      });

      chan.on('close', () => {
        console.info('close');
      });
    });
  });

  Promise.all([localChanPromise, remoteChanPromise]).then(([localChan, remoteChan]) => {
    localChan.send({ msg: 'local' });
    remoteChan.send({ msg: 'remote' });
  }).catch(console.error.bind(console));


  local.on('icecandidate', (ice) => {
    remote.addIceCandidate(ice).catch(console.error.bind(console));
  });

  remote.on('icecandidate', (ice) => {
    local.addIceCandidate(ice).catch(console.error.bind(console));
  });

  const localNegotiatePromise = new Promise((resolve) => {
    local.on('negotiationneeded', () => {
      resolve();
    });
  });

  const remoteNegotiatePromise = new Promise((resolve) => {
    remote.on('negotiationneeded', () => {
      resolve();
    });
  });

  Promise.all([localNegotiatePromise, remoteNegotiatePromise]).then(() => {
    return local.createOffer();
  }).then((sdp) => {
    return Promise.all([
      local.setLocalDescription(sdp),
      remote.setRemoteDescription(sdp),
    ]);
  }).then(() => {
    return remote.createAnswer();
  }).then((sdp) => {
    return Promise.all([
      local.setRemoteDescription(sdp),
      remote.setLocalDescription(sdp),
    ]);
  }).catch(console.error.bind(console));

  local.createDataChannel('localchannel');
  remote.createDataChannel('remotechannel');
}

main();
