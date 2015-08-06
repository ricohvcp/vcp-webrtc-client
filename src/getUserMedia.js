import getusermedia from 'getusermedia';

export function getUserMedia() {
  return new Promise((resolve, reject) => {
    getusermedia((err, stream) => {
      if (err) {
        return reject(err);
      }

      return resolve(stream);
    });
  });
}

export function getMediaDevices() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      // make device list like
      // {
      //   "device kind": [ device list... ],
      //   ...
      // }
      devices = devices.reduce((pre, curr) => {
        const kind = curr.kind;
        if (pre[kind] === undefined) {
          pre[kind] = [];
        }
        pre[kind].push(curr);
        return pre;
      }, {});
      resolve(devices);
    }).catch(reject);
  });
}
