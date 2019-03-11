# taiko-diagnostics

A plugin for taiko which provides some diagnostics features like measuring speedindex, performance metrics of webpage.


## Installation

* `npm install git://github.com/getgauge/taiko.git --save`
* `npm install git://github.com/getgauge-contrib/taiko-diagnostics.git --save`


## Usage

```javascript
const { openBrowser, loadPlugin, goto, closeBrowser } = require('taiko');
const {ID, clientHandler, startTracing, endTracing, getSpeedIndex } = require('taiko-diagnostics');
loadPlugin(ID, clientHandler);

(async () => {
    try {
        await openBrowser();
        await startTracing();
        await goto('https://github.com/');
        await endTracing();
        let si = await getSpeedIndex();
        console.log(si);
    } catch (e) {
        console.error(e);
    } finally {
        await closeBrowser();
    }
})();
```

### `startTracing()` Command

Start tracing the browser.

```js
startTracing()
```

### `endTracing` Command

Stop tracing the browser.

```js
endTracing()
```

### `getTraceLogs` Command

Returns the tracelogs that was captured within the tracing period. You can use this command to store the trace logs on the file system to analyse the trace via Chrome DevTools interface.

```js
startTracing()
goto('https://github.com/');
endTracing()

fs.writeFileSync('/path/to/tracelog.json', JSON.stringify(await getTraceLogs()))
```

### `getSpeedIndex` Command

Returns the [Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index) and [Perceptual Speed Index](https://developers.google.com/web/tools/lighthouse/audits/speed-index) from the page load that happened between the tracing period.

```js
startTracing()
goto('https://github.com/');
endTracing()

console.log(getSpeedIndex())
// outputs
// { speedIndex: 789.6634800064564,
//   perceptualSpeedIndex: 876.0901860232523 }
```


Note that `startTracing`,`endTracing`, and `getSpeedIndex` apis are not from `taiko`. These are given by the plugin.
