'use strict';

const { handlePickup, handleInTransit } = require('./handler');
const eventPool = require('../eventPool');

eventPool.on('pickup', handlePickup);
eventPool.on('in-transit', handleInTransit);
