'use strict';

const eventPool = require('../eventPool');

function handlePickup(payload) {
  console.log(`DRIVER: picked up ${payload.orderId}`);
  eventPool.emit('in-transit', payload);
}

function handleInTransit(payload) {
  console.log(`DRIVER: delivered ${payload.orderId}`);
  eventPool.emit('delivered', payload);
}

module.exports = { handlePickup, handleInTransit };
