'use strict';

const eventPool = require('./eventPool');
const { handlePickup, handleInTransit } = require('./driver/handler');
const { simulateDropoff, thankCustomer } = require('./vendor/handler');
const logEvent = require('./logger');

// Log all events
eventPool.on('dropoff', (payload) => logEvent('dropoff', payload));
eventPool.on('pickup', (payload) => logEvent('pickup', payload));
eventPool.on('in-transit', (payload) => logEvent('in-transit', payload));
eventPool.on('delivered', (payload) => logEvent('delivered', payload));

// Driver event handlers
eventPool.on('dropoff', handlePickup);
eventPool.on('in-transit', handleInTransit);

// Vendor event handlers
eventPool.on('delivered', thankCustomer);

// Simulate a dropoff event
simulateDropoff('1-206-flowers');
