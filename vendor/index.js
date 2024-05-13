'use strict';

const { simulatePickup, thankCustomer } = require('./handler');
const eventPool = require('../eventPool');

const storeName = '1-206-flowers';
simulatePickup(storeName);

eventPool.on('delivered', thankCustomer);
