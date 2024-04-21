// [key, value, symbol = '-'|' '|'+', depth] - diff tupple

const valuePresenter = (value) => {
  if (!Array.isArray(value)) {
    if (typeof value === 'string') return `'${value}'`;
    return value;
  }
  return '[complex value]';
};

export default function plain(diff) {
  const skip = { isSkiped: false };
  const result = [];

  const iter = (diffTupple, nextDiffTupple = [], acc = '') => {
    if (skip.isSkiped) {
      skip.isSkiped = false;
      return [];
    }
    const [key, value, symbol] = diffTupple;
    const [keyNext, valueNext, symbolNext] = nextDiffTupple;
    const path = acc.length === 0 ? key : `${acc}.${key}`;
    if (Array.isArray(value)) value.flatMap((el, ind, arr) => iter(el, arr[ind + 1], path));
    const preparedValue = valuePresenter(value);
    const preparedValueNext = valuePresenter(valueNext);

    if (symbol === '+') result.push(`Property '${path}' was added with value: ${preparedValue}`);
    else if (symbol === '-') {
      if (key === keyNext && symbolNext === '+') {
        result.push(`Property '${path}' was updated. From ${preparedValue} to ${preparedValueNext}`);
        skip.isSkiped = true;
      } else {
        result.push(`Property '${path}' was removed`);
      }
    }
    return [];
  };
  diff.flatMap((el, ind, arr) => iter(el, arr[ind + 1]));
  return result.join('\n');
}
