'use strict';

const Chance = require('chance');
const chance = new Chance();

require('dotenv').config();
const HUB_URL = process.env.HUB_URL || 'http://localhost:3000';

const io = require('socket.io-client');
const socket = io.connect(HUB_URL);

const clientId = chance.guid(); // Generate a unique identifier for the vendor

// Emit clientId upon connection
socket.emit('register', { clientId });

function simulateOrders() {
  setInterval(() => {
    const order = {
      clientId,
      store: chance.company(),
      orderID: chance.guid(),
      customer: chance.name(),
      address: chance.address(),
      value: chance.dollar(),
    };

    console.log('Submitting order for pickup:', order);
    socket.emit('ready-for-pickup', order);
  }, 15000);
}

socket.on('pickup-submitted', (payload) => {
  console.log(`Order submitted: ${payload.orderID}`);
});

socket.on('in-transit', (payload) => {
  if (payload.clientId === clientId) {
    console.log(`${payload.customer}, your order has shipped and is on its way!`);
  }
});

socket.on('delivered', (payload) => {
  if (payload.clientId === clientId) {
    console.log(`${payload.customer}, your order has been delivered.`);
  }
});

simulateOrders();
