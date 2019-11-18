jest.mock('../../src/helpers');
// eslint-disable-next-line import/named
import { logger } from '../../src/helpers';
import LogHandler from '../../src/logHandler';

let entryAdded,
  loadEventFired,
  runTime,
  logHandler,
  exceptionThrown,
  consoleAPICalled,
  emitter;
beforeEach(() => {
  entryAdded = jest.fn();
  loadEventFired = jest.fn();
  exceptionThrown = jest.fn();
  consoleAPICalled = jest.fn();
  emitter = {
    emitObject: jest.fn()
  };
  runTime = {
    exceptionThrown: exceptionThrown,
    consoleAPICalled: consoleAPICalled
  };
  logHandler = new LogHandler(entryAdded, loadEventFired, runTime);
  logHandler.logEntry(emitter);
});

test('Should invoke exceptionThrown callback with a listener function', async () => {
  expect(runTime.exceptionThrown.mock.calls.length).toBe(1);
  expect(typeof runTime.exceptionThrown.mock.calls[0][0]).toBe('function');
});

test('Should invoke consoleAPI callback with a listener function', async () => {
  expect(runTime.consoleAPICalled.mock.calls.length).toBe(1);
  expect(typeof runTime.consoleAPICalled.mock.calls[0][0]).toBe('function');
});

test('Should invoke entryAdded callback with a listner function', async () => {
  expect(entryAdded.mock.calls.length).toBe(1);
  expect(typeof entryAdded.mock.calls[0][0]).toBe('function');
});
