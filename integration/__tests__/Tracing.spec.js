import { openBrowser, loadPlugin, goto, closeBrowser, write, press, goBack } from 'taiko';
import { ID, clientHandler, startTracing, startCssTracing,
    stopCssTracing, endTracing, getSpeedIndex, stopScreenRecord, getCssCoverage,
    getPerformanceMetrics, startScreenRecord } from '../../src/index';

loadPlugin(ID, clientHandler);

jest.setTimeout(30000);
beforeEach(async () => {
    await openBrowser( { headless: false });
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
    expect(performance.firstPaint).toBeLessThan(5 * 1000)
});

test('Should return unused coverage', async () => {
    await startCssTracing();
    await goto('https://unused-css-example-site-qijunirqpu.now.sh');
    await stopCssTracing();
    const cssCoverage = await getCssCoverage();
    expect(cssCoverage.unUsedCss).toBeGreaterThan(50);
});

test.only('Should return unused coverage', async () => {
    await goto('https://www.google.com');
    await startScreenRecord();
    await write('taiko testing');
    await press('Enter');
    await goBack();
    await stopScreenRecord();
    // await a.traceEvents.filter( screen => {
    //     if (screen.name === 'screenshot') {
    //         console.log(screen.tts);
    //     }
    // })
    //fs.writeFileSync('tracelog.json', )
});