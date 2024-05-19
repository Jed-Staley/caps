'use strict';

const Queue = require('./imports').Queue;

class Log extends Queue {
  list() {
    const requestedLogs = [];
    const storage = new Log();
    while (this.peek()) {
      const event = this.dequeue();
      requestedLogs.push(event);
      storage.enqueue(event);
    }
    while (storage.peek()) {
      const event = storage.dequeue();
      this.enqueue(event);
    }
    return requestedLogs;
  }

  remove(messageId) {
    const storage = new Log();
    while (this.peek()) {
      const event = this.dequeue();
      if (event.messageId !== messageId) {
        storage.enqueue(event);
      }
    }
    while (storage.peek()) {
      this.enqueue(storage.dequeue());
    }
  }

  clear() {
    while (this.peek()) {
      this.dequeue();
    }
  }
}

class Logs {
  constructor() {
    this.dropOffs = new Log();
    this.pickUps = new Log();
    this.deliveries = new Log();
  }

  list() {
    return {
      dropOffs: this.dropOffs.list(),
      pickUps: this.pickUps.list(),
      deliveries: this.deliveries.list(),
    };
  }

  clear() {
    this.dropOffs.clear();
    this.pickUps.clear();
    this.deliveries.clear();
  }
}

module.exports = Logs;
