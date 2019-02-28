# taiko-diagnostics [Experimental]

A plugin for taiko which provides some diagnostics features

This is a experimental plugin for taiko and used for validating and experimenting an plugin architecture for taiko.

## Usages

* `npm init -y`
* `npm install git://github.com/getgauge/taiko.git#plugin-support --save`
* `npm install git://github.com/getgauge-contrib/taiko-diagnostics.git --save`
* Create a file `test.js` with content

```javascript
const { openBrowser, loadPlugin, goto, closeBrowser } = require('taiko');
const { startTracing, endTracing, getSpeedIndex } = loadPlugin(require('taiko-diagnostics'));

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

Note that `startTracing`,`endTracing`, and `getSpeedIndex` apis are not from `taiko`. These are given by the plugin.

* Run `node foo.js`
