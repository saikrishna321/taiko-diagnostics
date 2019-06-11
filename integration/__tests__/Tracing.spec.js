import { openBrowser, goto, closeBrowser, diagnostics } from 'taiko';
const {
  startTracing,
  startCssTracing,
  stopCssTracing,
  endTracing,
  getSpeedIndex,
  getPerformanceMetrics
} = diagnostics;

jest.setTimeout(30000);
beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
});

test('Should return speedindex and perceptualSpeedIndex', async () => {
  await startTracing();
  await goto('https://github.com/');
  await endTracing();
  const { speedIndex, perceptualSpeedIndex } = await getSpeedIndex();
  expect(speedIndex).toBeTruthy();
  expect(perceptualSpeedIndex).toBeTruthy();
});

test('Should return performance metric', async () => {
  await startTracing();
  await goto('https://jasper-bison.glitch.me/');
  await endTracing();
  const performance = await getPerformanceMetrics();
  expect(performance.firstPaint).toBeLessThan(5 * 1000);
});

test('Should return unused coverage', async () => {
  await startCssTracing();
  await goto('http://github.com/macku/page-coverage');
  const cssCoverage = await stopCssTracing();
  expect(cssCoverage[0].type).toBe('CSS');
  expect(cssCoverage.length).toBeGreaterThan(1);
});
