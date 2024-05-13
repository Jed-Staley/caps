'use strict';

const eventPool = require('./eventPool');

eventPool.on('pickup', (payload) => logEvent('pickup', payload));
eventPool.on('in-transit', (payload) => logEvent('in-transit', payload));
eventPool.on('delivered', (payload) => logEvent('delivered', payload));

function logEvent(event, payload) {
  const time = new Date().toISOString();
  console.log(`EVENT { event: '${event}', time: ${time}, payload: ${JSON.stringify(payload)} }`);
}

module.exports = { logEvent };
