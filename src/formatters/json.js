export function json(diff) {
  let skip = false;
  const result = [];

  const iter = (diffTupple, nextDiffTupple = [], acc = '') => {
    if (skip) {
      skip = false;
      return [];
    }
    const [key, value, symbol] = diffTupple;
    const [keyNext, valueNext, symbolNext] = nextDiffTupple;
    const path = acc.length === 0 ? key : `${acc}.${key}`;
    Array.isArray(value) ? value.flatMap((el, ind, arr) => iter(el, arr[ind + 1], path)) : void 0;
    const preparedValue = Array.isArray(value) ? '[complex value]' : value;
    const preparedValueNext = Array.isArray(value) ? '[complex value]' : valueNext;

    if (symbol === '+') {
      result.push({
        path, key, process: 'add', value: preparedValue,
      });
    } else if (symbol === '-') {
      if (key === keyNext && symbolNext === '+') {
        result.push({
          path,
          key,
          process: 'update',
          previousValue: preparedValueNext,
          value: preparedValue,
        });
        skip = true;
      } else {
        result.push({
          path,
          key,
          process: 'remove',
          removedValue: preparedValue,
        });
      }
    }
  };
  diff.flatMap((el, ind, arr) => iter(el, arr[ind + 1]));
  return JSON.stringify(result);
}
