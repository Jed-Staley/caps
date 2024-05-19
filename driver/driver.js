'use strict';

const Chance = require('chance');
const chance = new Chance();

require('dotenv').config();
const HUB_URL = process.env.HUB_URL || 'http://localhost:3000';

const io = require('socket.io-client');
const socket = io.connect(HUB_URL);

const clientId = chance.guid(); // Generate a unique identifier for the driver

// Emit clientId upon connection
socket.emit('register', { clientId });

// Request a package to pick up
function requestPackage() {
  socket.emit('request-pickup', { clientId });
}

socket.on('pickup', (payload) => {
  console.log('Picking up order:', payload);
  socket.emit('in-transit', { clientId, ...payload });

  setTimeout(() => {
    console.log('Order delivered', payload);
    socket.emit('delivered', { clientId, ...payload });
    requestPackage(); // Request next package after delivery
  }, 5000);
});

socket.on('no-packages', (payload) => {
  console.log(payload.message);
  setTimeout(requestPackage, 5000); // Retry after 5 seconds
});

// Initial package request
requestPackage();
