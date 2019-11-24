import { openBrowser, goto, closeBrowser, diagnostics } from 'taiko';
const {
  startCssTracing,
  stopCssTracing,
  prettyCSS,
  getLh,
  getLHResults
} = diagnostics;
import path from 'path';
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

jest.setTimeout(100000);
beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
  //await getLHResults();
});

test('Should report css coverage', async () => {
  let fielPath = path.resolve('./integration/__tests__/data/simple.html');
  await startCssTracing();
  await goto(path.join('file://', fielPath));
  const coverage = await stopCssTracing();
  const responseData = {
    url: expect.any(String),
    type: 'CSS',
    totalBytes: 42,
    usedBytesTotal: 20,
    unusedBytesTotal: 22,
    usedPercentage: 47.61904761904762,
    unusedPercentage: 52.38095238095238
  };
  expect(coverage[0]).toEqual(responseData);
  expect(coverage.length).toBe(1);
});

test('Should report multiple css coberage', async () => {
  let fielPath = path.resolve('./integration/__tests__/data/multiple.html');
  await startCssTracing();
  await goto(path.join('file://', fielPath));
  const coverage = await stopCssTracing();
  await prettyCSS(coverage);
  expect(coverage.length).toBe(3);
});

test.only('hello', async () => {
  await getLh();
});
