// [key, value, symbol = '-'|' '|'+', depth] - diff tupple

export function plain(diff) {
  let skip = false;
  const result = [];

  const iter = (diffTupple, nextDiffTupple = [], acc = '') => {
    if (skip) {
      skip = false;
      return [];
    }
    const [key, value, symbol] = diffTupple;
    const [keyNext, valueNext, symbolNext] = nextDiffTupple;
    const path = acc.length === 0 ? key : acc + '.' + key;
    Array.isArray(value) ? value.flatMap((el, ind, arr) => iter(el, arr[ind + 1], path)) : void 0;
    const preparedValue = Array.isArray(value) ? '[complex value]' : typeof value === 'string' ? `'${value}'` : value;
    const preparedValueNext = Array.isArray(valueNext)
      ? '[complex value]'
      : typeof valueNext === 'string'
      ? `'${valueNext}'`
      : valueNext;

    if (symbol === '+') result.push(`Property '${path}' was added with value: ${preparedValue}`);
    else if (symbol === '-') {
      if (key === keyNext && symbolNext === '+') {
        result.push(`Property '${path}' was updated. From ${preparedValue} to ${preparedValueNext}`);
        skip = true;
      } else {
        result.push(`Property '${path}' was removed`);
      }
    }
  };
  diff.flatMap((el, ind, arr) => iter(el, arr[ind + 1]));
  return result.join('\n');
}
