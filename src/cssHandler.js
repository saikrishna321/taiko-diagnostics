import { assert, formatCoverage } from './helpers';
import log from 'npmlog'

const stylesheets = [];
let cssRuleUsage;

class CSSCoverage {

    constructor(css, runtime) {
        this.css = css;
        this.runTime = runtime;
        this._enabled = false;
        this._stylesheetURLs = new Map();
        this._stylesheetSources = new Map();
        this._eventListeners = [];
        this._resetOnNavigation = false;
        Promise.all([this.css.enable()]);
    }

    async getStyleSheetText(header) {
        return await this.css.getStyleSheetText({ styleSheetId: header.styleSheetId })
    }
    async startCssTracking() {
        await this.css.startRuleUsageTracking();
        this._enabled = true;
        await this.css.styleSheetAdded(event => {
            const header = event.header;
            this.getStyleSheetText(header).then(response => {
                this._stylesheetURLs.set(header.styleSheetId, header.sourceURL);
                this._stylesheetSources.set(header.styleSheetId, response.text);
            });
        });
        await this.runTime.executionContextsCleared(() => {
            if (!this._resetOnNavigation)
                return;
            this._stylesheetURLs.clear();
            this._stylesheetSources.clear();
        })

    }

    async convertToDisjointRanges(nestedRanges) {
        const points = [];
        for (const range of nestedRanges) {
            points.push({ offset: range.startOffset, type: 0, range });
            points.push({ offset: range.endOffset, type: 1, range });
        }
        // Sort points to form a valid parenthesis sequence.
        points.sort((a, b) => {
            // Sort with increasing offsets.
            if (a.offset !== b.offset)
                return a.offset - b.offset;
            // All "end" points should go before "start" points.
            if (a.type !== b.type)
                return b.type - a.type;
            const aLength = a.range.endOffset - a.range.startOffset;
            const bLength = b.range.endOffset - b.range.startOffset;
            // For two "start" points, the one with longer range goes first.
            if (a.type === 0)
                return bLength - aLength;
            // For two "end" points, the one with shorter range goes first.
            return aLength - bLength;
        });

        const hitCountStack = [];
        const results = [];
        let lastOffset = 0;
        // Run scanning line to intersect all ranges.
        for (const point of points) {
            if (hitCountStack.length && lastOffset < point.offset && hitCountStack[hitCountStack.length - 1] > 0) {
                const lastResult = results.length ? results[results.length - 1] : null;
                if (lastResult && lastResult.end === lastOffset)
                    lastResult.end = point.offset;
                else
                    results.push({ start: lastOffset, end: point.offset });
            }
            lastOffset = point.offset;
            if (point.type === 0)
                hitCountStack.push(point.range.count);
            else
                hitCountStack.pop();
        }
        // Filter out empty ranges.
        return results.filter(range => range.end - range.start > 1);
    }

    async stopCssTracking() {
        assert(this._enabled, 'CSS Coverage has not started!!')
        let cssResults = await this.css.stopRuleUsageTracking();
        await Promise.all([this.css.disable()]);
        cssRuleUsage = await cssResults;
        this._enabled = false;
        const styleSheetIdToCoverage = new Map();
        for (const entry of cssRuleUsage.ruleUsage) {
            let ranges = styleSheetIdToCoverage.get(entry.styleSheetId);
            if (!ranges) {
                ranges = [];
                styleSheetIdToCoverage.set(entry.styleSheetId, ranges);
            }
            ranges.push({
                startOffset: entry.startOffset,
                endOffset: entry.endOffset,
                count: entry.used ? 1 : 0,
            });
        }

        const cssCoverage = [];
        for (const styleSheetId of this._stylesheetURLs.keys()) {
            const url = this._stylesheetURLs.get(styleSheetId);
            const text = this._stylesheetSources.get(styleSheetId);
            const ranges = await this.convertToDisjointRanges(styleSheetIdToCoverage.get(styleSheetId) || []);
            cssCoverage.push({ url, ranges, text });
        }
        const coverageAfter = [
            ...cssCoverage.map(results => ({
                ...results,
                type: 'CSS'
            })),
        ];
        const result = await formatCoverage(coverageAfter);
        return result;
    }

    async getCssCoverage() {
        if ( this._enabled == undefined || this._enabled === true)
            assert(false, 'startCssTracking() API has not been called nor stopCssTracking() API')
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