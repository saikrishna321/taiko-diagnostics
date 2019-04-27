import { openBrowser, loadPlugin, goto, closeBrowser } from 'taiko';
import {
  ID,
  clientHandler,
  startCssTracing,
  stopCssTracing
} from '../../src/index';
import path from 'path';
loadPlugin(ID, clientHandler);

jest.setTimeout(30000);
beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
});

test('Should report css coverage', async () => {
  let fielPath = path.resolve('./integration/__tests__/data/simple.html');
  await startCssTracing();
  await goto(path.join('file://', fielPath));
  const coverage = await stopCssTracing();
  const responseData = {
    url:
      'file:///Users/saikrisv/git/taiko-diagnostics/integration/__tests__/data/simple.html',
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

test("Should report multiple css coberage" , () => {
    
})
