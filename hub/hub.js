'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const Logs = require('./lib/queue');
const logs = new Logs();

const clients = new Map();

io.on('connection', (socket) => {
  console.log('Connection established with', socket.id);

  socket.on('register', (payload) => {
    socket.clientId = payload.clientId;
    clients.set(payload.clientId, socket);
    console.log(`Client registered: ${payload.clientId}`);
  });

  socket.on('ready-for-pickup', (payload) => {
    console.log('New order is awaiting pickup:', payload);
    logs.dropOffs.enqueue(payload);
    emitToClient(payload.clientId, 'pickup-submitted', payload); // Notify vendor
  });

  socket.on('request-pickup', (payload) => {
    const packageToDeliver = logs.dropOffs.dequeue();
    if (packageToDeliver) {
      packageToDeliver.driverId = payload.clientId;
      logs.pickUps.enqueue(packageToDeliver);
      socket.emit('pickup', packageToDeliver);
    } else {
      socket.emit('no-packages', { message: 'No packages available for pickup' });
      setTimeout(() => {
        socket.emit('request-pickup', { clientId: payload.clientId });
      }, 5000); // Retry after 5 seconds
    }
  });

  socket.on('in-transit', (payload) => {
    console.log('Order has been picked up:', payload);
    io.emit('in-transit', payload); // Broadcast to all clients
  });

  socket.on('delivered', (payload) => {
    console.log('Order delivered:', payload);
    logs.deliveries.enqueue(payload);
    emitToClient(payload.clientId, 'delivered', payload);
  });

  socket.on('getAll', (payload) => {
    const { clientId, event } = payload;
    const queue = logs[event];
    const messages = queue ? queue.list().filter(message => message.clientId === clientId) : [];
    messages.forEach(message => {
      socket.emit(event, message);
    });
  });

  socket.on('received', (payload) => {
    const { clientId, event, messageId } = payload;
    const queue = logs[event];
    if (queue) {
      queue.remove(messageId);
    }
  });

  socket.on('disconnect', () => {
    clients.delete(socket.clientId);
    console.log(`Client disconnected: ${socket.clientId}`);
  });

  function emitToClient(clientId, event, payload) {
    const clientSocket = clients.get(clientId);
    if (clientSocket) {
      clientSocket.emit(event, payload);
    }
  }
});
