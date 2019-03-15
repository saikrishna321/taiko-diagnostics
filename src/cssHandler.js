import { assert } from './helpers';
var log = require('npmlog');

const stylesheets = [];
let css;
let cssRuleUsage;

class CSSCoverage {

    constructor(client) {
        css = client;
        Promise.all([css.enable()]);
    }

    async startCssTracking() {
        await css.startRuleUsageTracking();
        this._enabled = true;
        await css.styleSheetAdded(stylesheet => {
            stylesheets.push(stylesheet.header);
        });
    }

    async stopCssTracking() {
        assert(this._enabled, 'CSS Coverage has not started!!')
        let cssResults = await css.stopRuleUsageTracking();
        await Promise.all([css.disable()]);
        cssRuleUsage = await cssResults;
    }

    async getCssCoverage() {
        let usedLength = 0, totalLength = 0;
        await stylesheets.forEach(function(stylesheet) {
            totalLength += stylesheet.length;
            const stylesheetRuleUsages = cssRuleUsage.ruleUsage.filter(y => y.styleSheetId === stylesheet.styleSheetId);
            usedLength += stylesheetRuleUsages.reduce((sum, x) => sum + x.endOffset - x.startOffset, 0);
        });
        let unUsedCss = 100 - Math.round(usedLength / totalLength * 100);
        log.info(`-CSS-logger- ${unUsedCss}% is unused css`);
        return { unUsedCss }
    }
}

export default CSSCoverage;