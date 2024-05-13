'use strict';

const eventPool = require('../eventPool');
const { handlePickup, handleInTransit } = require('./handler');

jest.mock('../eventPool', () => {
  return {
    emit: jest.fn(),
    on: jest.fn(),
  };
});

describe('Driver Handlers', () => {
  console.log = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log a message and emit in-transit event when handlePickup is called', () => {
    const payload = { orderId: '12345' };

    handlePickup(payload);

    expect(console.log).toHaveBeenCalledWith('DRIVER: picked up 12345');
    expect(eventPool.emit).toHaveBeenCalledWith('in-transit', payload);
  });

  it('should log a message and emit delivered event when handleInTransit is called', () => {
    const payload = { orderId: '12345' };

    handleInTransit(payload);

    expect(console.log).toHaveBeenCalledWith('DRIVER: delivered 12345');
    expect(eventPool.emit).toHaveBeenCalledWith('delivered', payload);
  });
});
