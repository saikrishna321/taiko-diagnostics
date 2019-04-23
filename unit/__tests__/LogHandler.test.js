jest.mock('../../src/helpers');
import { logger } from '../../src/helpers';
import LogHandler from '../../src/logHandler';

let entryAdded, loadEventFired, runTime, logHandler;
beforeEach(() => {
    entryAdded = jest.fn();
    loadEventFired = jest.fn();
    runTime = jest.fn(() => ({
        Runtime: { exceptionThrown: jest.fn(), consoleAPICalled: jest.fn() }
    }))
    runTime = runTime().Runtime;
    logHandler = new LogHandler(entryAdded, loadEventFired, runTime);
    logHandler.logEntry();
});

test('Should invoke exceptionThrown callback with a listener function', async () => {
    expect(runTime.exceptionThrown.mock.calls.length).toBe(1)
    expect(typeof runTime.exceptionThrown.mock.calls[0][0]).toBe('function')
});

test('Should invoke logger with appropriate log message when listener passed to exceptionThrown is invoked', async () => {
    const exceptionThrownListner = await runTime.exceptionThrown.mock.calls[0][0];
    exceptionThrownListner({ exceptionDetails: { exception: { description: 'error message' } } });
    expect(logger.mock.calls[0][0]).toBe('error message')
});

test('Should invoke consoleAPI callback with a listener function', async () => {
    expect(runTime.consoleAPICalled.mock.calls.length).toBe(1)
    expect(typeof runTime.consoleAPICalled.mock.calls[0][0]).toBe('function')
});

test('Should invoke entryAdded callback with a listner function', async () => {
    expect(entryAdded.mock.calls.length).toBe(1);
    expect(typeof entryAdded.mock.calls[0][0]).toBe('function')
})

test('Should invoke logger with appropriate log message when listener passed to entryAdded is invoked', async () => {
    const logEntry = entryAdded.mock.calls[0][0];
    logEntry( { entry: { level: 'error', source: 'network', url: 'http://localhost:8080' } });
    expect(logger.mock.calls[1][0]).toEqual({ 'level': 'error', 'source': 'network', 'url': 'http://localhost:8080' })
});