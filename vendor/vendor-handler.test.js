'use strict';

const eventPool = require('../eventPool');
const { simulateDropoff, thankCustomer } = require('./handler');
const Chance = require('chance');

jest.mock('../eventPool', () => {
  return {
    emit: jest.fn(),
    on: jest.fn(),
  };
});

jest.mock('chance', () => {
  return jest.fn().mockImplementation(() => {
    return {
      guid: jest.fn().mockReturnValue('12345'),
      name: jest.fn().mockReturnValue('John Doe'),
      city: jest.fn().mockReturnValue('Seattle'),
      state: jest.fn().mockReturnValue('WA'),
    };
  });
});

describe('Vendor Handlers', () => {
  console.log = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should emit a dropoff event with payload when simulateDropoff is called', () => {
    const storeName = '1-206-flowers';

    simulateDropoff(storeName);

    const expectedPayload = {
      store: storeName,
      orderId: '12345',
      customer: 'John Doe',
      address: 'Seattle, WA',
    };

    expect(eventPool.emit).toHaveBeenCalledWith('dropoff', expectedPayload);
  });

  it('should log a thank you message when thankCustomer is called', () => {
    const payload = { orderId: '12345' };

    thankCustomer(payload);

    expect(console.log).toHaveBeenCalledWith('VENDOR: Thank you for delivering 12345');
  });
});
