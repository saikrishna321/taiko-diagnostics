<h1 align="center">
	<br>
	<img src="images/TaikoDiagnostics.png" alt="TaikoDiagnostics">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://dev.azure.com/saikrishna321/taiko-diagnostics/_apis/build/status/saikrishna321.taiko-diagnostics?branchName=master)](https://dev.azure.com/saikrishna321/taiko-diagnostics/_build/latest?definitionId=4&branchName=master) [![npm version](https://badge.fury.io/js/taiko-diagnostics.svg)](https://badge.fury.io/js/taiko-diagnostics)[![Greenkeeper badge](https://badges.greenkeeper.io/saikrishna321/taiko-diagnostics.svg)](https://greenkeeper.io/)
[![CodeFactor](https://www.codefactor.io/repository/github/saikrishna321/taiko-diagnostics/badge)](https://www.codefactor.io/repository/github/saikrishna321/taiko-diagnostics)

[![NPM](https://nodei.co/npm/taiko-diagnostics.png)](https://nodei.co/npm/taiko-diagnostics/)

# taiko-diagnostics

A plugin for taiko which provides some diagnostics features like measuring speedindex, performance metrics of webpage.

## Installation

- `npm install taiko-diagnostics --save`

## Usage

```javascript
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
```

### `startTracing()` Command

Start tracing the browser.

```js
startTracing();
```

### `endTracing` Command

Stop tracing the browser.

```js
endTracing();
```

### `getTracingLogs` Command

Returns the tracelogs that was captured within the tracing period. You can use this command to store the trace logs on the file system to analyse the trace via Chrome DevTools interface.

```js
startTracing();
goto('https://github.com/');
endTracing();

fs.writeFileSync(
  '/path/to/tracelog.json',
  JSON.stringify(await getTracingLogs())
);
```

### `getSpeedIndex` Command

Returns the [Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index) and [Perceptual Speed Index](https://developers.google.com/web/tools/lighthouse/audits/speed-index) from the page load that happened between the tracing period.

```js
startTracing();
goto('https://github.com/');
endTracing();

console.log(getSpeedIndex());
// outputs
// { speedIndex: 789.6634800064564,
//   perceptualSpeedIndex: 876.0901860232523 }
```

### `getPerformanceMetrics` Command

```js
startTracing();
goto('https://github.com/');
endTracing();

console.log(getPerformanceMetrics());
// outputs
//{
//    firstPaint: 735.666,
//    firstContentfulPaint: 735.669,
//    firstMeaningfulPaint: 735.671,
//    domContentLoaded: 574.546,
//    timeToFirstInteractive: 735.671,
//    load: 1379.895
//    }
```

### `getCssCoverage` Command

```js
startCssTracing();
goto('https://unused-css-example-site-qijunirqpu.now.sh');
const cssCoverage = await stopCssTracing();
//[ { url: 'https://unused-css-example-site-qijunirqpu.now.sh/main.css',
//        type: 'CSS',
//        totalBytes: 1453,
//        usedBytesTotal: 653,
//        unusedBytesTotal: 800,
//       usedPercentage: 44.941500344115624,
//        unusedPercentage: 55.058499655884376 } ]
```

![Coverage tab](https://raw.githubusercontent.com/saikrishna321/taiko-diagnostics/master/images/css.png)

### Pretty print cssCoverage in table

```
await prettyCSS(coverage);
```

![CSS Table](https://raw.githubusercontent.com/saikrishna321/taiko-diagnostics/master/images/cssTable.png)

### `logConsoleInfo` command

```js
logConsoleInfo();
await goto('gauge.org/sdfsd');
Make sure not to add `await` as logConsoleInfo enables log Listener.

//{
//"source":"network",
//"level":"error",
//"text":"Failed to load resource: the server responded with a status of 404 ()",
//"timestamp":1553288625400,
//"url":"https://gauge.org/sdfsd",
//"networkRequestId":"D56332F8080344A2696C18D0771EC383"
//}

```

## Use in Taiko REPL

To launch the REPL type `taiko --plugin taiko-diagnostics` in your favorite terminal application. This will launch the Taiko Prompt.

e.g
`Version: 0.7.0 (Chromium:74.0.3723.0) Type .api for help and .exit to quit`

You should now have full access to all of the diagnostics in the taiko REPL window

## REPL example

```js
> openBrowser()
 ✔ Browser opened
> startTracing()
 ✔ Browser tracing started
> goto('https://github.com/');
 ✔ Navigated to url "https://github.com/"
> endTracing();
 ✔ Browser tracing ended
> getSpeedIndex();
{ speedIndex: 30631.375729995667,
  perceptualSpeedIndex: 30634.177980202476 }
> getPerformanceMetrics();
info Detected renderer thread by 'TracingStartedInBrowser' event: pid 69317, tid 775
{ firstPaint: 834.819,
  firstContentfulPaint: 834.821,
  firstMeaningfulPaint: 997.381,
  domContentLoaded: 1073.878,
  timeToFirstInteractive: 1194.132,
  load: 1208.64 }
```

Note that `startTracing`,`endTracing`, and `getSpeedIndex` apis are not from `taiko`. These are given by the plugin.
