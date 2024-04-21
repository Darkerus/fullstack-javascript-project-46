// [key, value, symbol = '-'|' '|'+', depth] - diff tupple
import _ from 'lodash';
export function stylish(diff) {
  const format = (diffTupple) => {
    const [key, value, symbol, depth] = diffTupple;
    const preparedValue = Array.isArray(value) ? value.reduce((acc, cur) => acc + format(cur), '') : value;
    const repeat = depth === 0 ? 1 : depth * 2 + 1;
    if (typeof value === 'object' && !_.isNull(value))
      return `${'  '.repeat(repeat)}${symbol} ${key}: {\n${preparedValue}${'  '.repeat(repeat + 1)}}\n`;
    else return `${'  '.repeat(repeat)}${symbol} ${key}: ${preparedValue}\n`;
  };

  const resultString = diff.reduce((acc, cur) => acc + format(cur), '');
  const result = '{\n' + resultString + '}';
  return result;
}
