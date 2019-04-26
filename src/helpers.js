import log from 'npmlog';

function assert(value, message) {
    if (!value) throw new Error(message);
}

function logger(value) {
    typeof value === 'object'
        ? log.info(JSON.stringify(value))
        : log.info(`-${value}`);
}
const sumRangeUsage = ranges => {
    return ranges.reduce((total, range) => {
        return total + range.end - range.start - 1;
    }, 0);
};

async function formatCoverage(coverage) {
    var cssCoverageDetails = coverage
        .map(({ url, text, ranges, type }) => {
            const usedBytesTotal = sumRangeUsage(ranges);
            const totalBytes = text.length;
            const unusedBytesTotal = totalBytes - usedBytesTotal;

            const unusedPercentage = totalBytes
                ? (unusedBytesTotal * 100) / totalBytes
                : 0;
            const usedPercentage = 100 - unusedPercentage;
            return {
                url,
                type,
                totalBytes,
                usedBytesTotal,
                unusedBytesTotal,
                usedPercentage,
                unusedPercentage
            };
        });
    return cssCoverageDetails;
}

module.exports = { assert, logger, formatCoverage };