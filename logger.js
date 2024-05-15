'use strict';

function logEvent(event, payload) {
  const time = new Date().toISOString();
  console.log(`EVENT { event: '${event}', time: ${time}, payload: ${JSON.stringify(payload)} }`);
}

module.exports = logEvent;
