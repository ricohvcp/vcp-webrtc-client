/*eslint no-console:0, classes/space:0 */
import { EventEmitter } from 'events';

export class Channel extends EventEmitter {
  constructor(channel) {
    super();

    this.channel = channel;

    this.channel.onmessage = (e) => {
      console.log('channel message', e.data);
      this.emit('message', JSON.parse(e.data));
    };

    this.channel.onopen = (e) => {
      console.log('channel open', e);
      this.emit('open', e);
    };

    this.channel.onclose = (e) => {
      console.log('channel close', e);
      this.emit('close', e);
    };

    this.channel.onerror = (e) => {
      console.log('channel error', e);
      this.emit('error', e);
    };
  }

  get id() {
    return this.channel.id;
  }

  send(data) {
    console.log('channel send', data);
    this.channel.send(JSON.stringify(data));
  }

  close() {
    console.log('channel close');
    this.channel.close();
  }
}
