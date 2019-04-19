jest.mock('../../src/helpers');
import { logger } from '../../src/helpers';
import LogHandler from '../../src/logHandler';

let entryAdded, loadEventFired, messageAdded, exceptionThrown, logHandler;
beforeEach(() => {
    entryAdded = jest.fn();
    loadEventFired = jest.fn();
    messageAdded = jest.fn();
    exceptionThrown = jest.fn();
    logHandler = new LogHandler(entryAdded, loadEventFired, messageAdded, exceptionThrown);
    logHandler.logEntry();
});

test('Should invoke exceptionThrown callback with a listener function', async () => {
    expect(exceptionThrown.mock.calls.length).toBe(1)
    expect(typeof exceptionThrown.mock.calls[0][0]).toBe('function')
});

test('Should invoke logger with appropriate log message when listener passed to exceptionThrown is invoked', async () => {
    const exceptionThrownListner = exceptionThrown.mock.calls[0][0];
    exceptionThrownListner({ exceptionDetails: { exception: { description: 'error message' } } });
    expect(logger.mock.calls[2][0]).toBe('error message')
});

test('Should invoke entryAdded callback with a listner function', async () => {
    expect(entryAdded.mock.calls.length).toBe(1);
    expect(typeof entryAdded.mock.calls[0][0]).toBe('function')
})

test('Should invoke logger with appropriate log message when listener passed to entryAdded is invoked', async () => {
    const logEntry = entryAdded.mock.calls[0][0];
    logEntry( { entry: { level: 'error', source: 'network', url: 'http://localhost:8080' } });
    expect(logger.mock.calls[5][0]).toBe({ 'level': 'error', 'source': 'network', 'url': 'http://localhost:8080' })
});