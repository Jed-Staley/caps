'use strict';

const Chance = require('chance');
const chance = new Chance();
const eventPool = require('../eventPool');

function simulateDropoff(storeName) {
  const payload = {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state()}`,
  };
  eventPool.emit('dropoff', payload);
}

function thankCustomer(payload) {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
}

module.exports = { simulateDropoff, thankCustomer };
