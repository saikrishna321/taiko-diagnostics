import { green, red } from 'chalk';

const defaultBarChar = '▀';
const defaultBarSize = 75;
const usedCss = green;
const unusedCss = red;

const defaultOptions = {
  barChar: defaultBarChar,
  barSize: defaultBarSize,
  barColor: usedCss,
  barBgColor: unusedCss
};

const fillBarPart = ({ size, fillWith, fillWithColor }) =>
  new Array(size).join(fillWithColor(fillWith));

const progressBar = value => {
  const { barChar, barSize, barColor, barBgColor } = {
    ...defaultOptions
  };

  const valueBarSize = Number(((value * barSize) / 100).toFixed(0));
  const bgBarSize = barSize - valueBarSize;

  const valueBar = fillBarPart({
    size: valueBarSize,
    fillWith: barChar,
    fillWithColor: barColor
  });
  const bgBar = fillBarPart({
    size: bgBarSize,
    fillWith: barChar,
    fillWithColor: barBgColor
  });

  return `${valueBar}${bgBar}`;
};

export default progressBar;
