jest.mock('../../src/helpers');
import { openBrowser, goto, closeBrowser, diagnostics } from 'taiko';
const { logConsoleInfo } = diagnostics;
// eslint-disable-next-line import/named
import { logger } from '../../src/helpers';
import path from 'path';

jest.setTimeout(30000);
beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
});

test('Should print unhandled exception message into console', async () => {
  let fielPath = path.resolve(
    './integration/__tests__/data/unhandledException.html'
  );
  const error = [];
  let emitter = await logConsoleInfo();
  emitter.on('pageError', e => {
    error.push(e);
  });

  await goto(path.join('file://', fielPath));
  let expectedMessage = `Error: Test unhandled exception
    at throwsException (file://${fielPath}:4:19)
    at file://${fielPath}:6:9`;
  expect(error[0].exception.description).toEqual(expectedMessage);
});

test('Should print error message into console', async () => {
  const logEntry = [];
  const emitter = await logConsoleInfo();
  emitter.on('logEntry', log => {
    logEntry.push(log);
  });
  await goto('https://www.reddit.com/');
  const responseData = {
    level: expect.any(String),
    source: expect.any(String),
    url: expect.any(String)
  };
  expect(logEntry[0]).toEqual(responseData);
});

test('Should print console.log', async () => {
  const console = [];
  const emitter = await logConsoleInfo();
  emitter.on('consoleLog', log => {
    console.push(log);
  });
  let fielPath = path.resolve('./integration/__tests__/data/console.html');
  await goto(path.join('file://', fielPath));
  const responseData = {
    type: expect.any(String),
    value: expect.any(String),
    url: expect.any(String)
  };
  expect(console[0]).toEqual(responseData);
});
