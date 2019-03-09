
import { openBrowser, loadPlugin, goto, closeBrowser } from 'taiko';
import { ID, clientHandler, startTracing, endTracing, getSpeedIndex } from '../source/index';
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
