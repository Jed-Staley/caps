'use strict';
const { simulateDropoff, thankCustomer } = require('./handler');
const eventPool = require('../eventPool');

const storeName = '1-206-flowers';
simulateDropoff(storeName);

eventPool.on('delivered', thankCustomer);
