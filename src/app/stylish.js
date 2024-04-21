// [key, value, symbol = '-'|' '|'+', depth] - diff tupple
import _ from 'lodash';
export default function formatter(diff) {
  const format = (diffTupple) => {
    const [key, value, symbol, depth] = diffTupple;
    const preparedValue = Array.isArray(value) ? value.reduce((acc, cur) => acc + format(cur), '') : value;

    if (typeof value === 'object' && !_.isNull(value))
      return `${'  '.repeat((depth + 1) * 2)}${symbol} ${key}: {\n${preparedValue}${'  '.repeat((depth + 1) * 2)}}\n`;
    else return `${'  '.repeat((depth + 1) * 2)}${symbol} ${key}: ${preparedValue}\n`;
  };

  const resultString = diff.reduce((acc, cur) => acc + format(cur), '');
  const result = '{\n' + resultString + '}';
  return result;
}
