import log from 'npmlog';
import Table from 'cli-table';
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import progressBar from './progressBar';
import truncateUrl from 'truncate-url';

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
  var cssCoverageDetails = coverage.map(({ url, text, ranges, type }) => {
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

async function formatCoverageAsTable(coverage) {
  const table = new Table({
    head: ['Url', 'Type', 'TotalBytes', 'UsedBytesTotal', 'UsedPercentage'].map(
      header => chalk.magenta.bold(header)
    ),
    colAligns: ['left', 'left', 'left', 'left', 'left', 'left', 'left']
  });

  coverage.forEach(
    ({ url, type, totalBytes, usedBytesTotal, usedPercentage }) => {
      const totalBytesFormatted = chalk.green.bold(prettyBytes(totalBytes));
      const usedBytesFormatted = `${chalk.green.bold(
        prettyBytes(usedBytesTotal)
      )} ${chalk.dim(`(${usedPercentage.toFixed(2)}%)`)}`;
      table.push([
        truncateUrl(url, 50),
        type,
        totalBytesFormatted,
        usedBytesFormatted,
        progressBar(usedPercentage)
      ]);
    }
  );
  console.log(table.toString());
}

module.exports = { assert, logger, formatCoverage, formatCoverageAsTable };
