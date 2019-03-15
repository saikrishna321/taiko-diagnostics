import { openBrowser, loadPlugin, goto, closeBrowser } from 'taiko';
import { ID, clientHandler, startTracing, startCssTracing,
    stopCssTracing, endTracing, getSpeedIndex,
    getCssCoverage, getPerformanceMetrics } from '../../src/index';
loadPlugin(ID, clientHandler);

beforeEach(async () => {
    await openBrowser();
});

afterEach(async () => {
    await closeBrowser();
});

test('Should return speedindex and perceptualSpeedIndex', async () => {
    jest.setTimeout(30000);
    await startTracing();
    await goto('https://github.com/');
    await endTracing();
    const { speedIndex, perceptualSpeedIndex } = await getSpeedIndex();
    expect(speedIndex).toBeTruthy();
    expect(perceptualSpeedIndex).toBeTruthy();
});

test('Should return performance metric', async () => {
    jest.setTimeout(30000);
    await startTracing();
    await goto('https://jasper-bison.glitch.me/');
    await endTracing();
    const performance = await getPerformanceMetrics();
    expect(performance.firstPaint).toBeLessThan(4 * 1000)
});

test('Should return unused coverage', async () => {
    jest.setTimeout(30000);
    await startCssTracing();
    await goto('https://unused-css-example-site-qijunirqpu.now.sh');
    await stopCssTracing();
    const cssCoverage = await getCssCoverage();
    expect(cssCoverage.unUsedCss).toBeGreaterThan(50);
});