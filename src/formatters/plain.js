// [key, value, symbol = '-'|' '|'+', depth] - diff tupple

const valuePresenter = (value) => {
  if (!Array.isArray(value)) {
    if (typeof value === 'string') return `'${value}'`;
    return value;
  }
  return '[complex value]';
};

export default function plain(diff) {
  const iter = (diffTupple, [prevDiffTupple = [], nextDiffTupple = []] = [], acc = '') => {
    const [key, value, symbol] = diffTupple;
    const [keyNext, , symbolNext] = nextDiffTupple;
    const [keyPrev, valuePrev, symbolPrev] = prevDiffTupple;

    const path = acc.length === 0 ? key : `${acc}.${key}`;
    const deep = Array.isArray(value)
      ? value.flatMap((el, ind, arr) => iter(el, [arr[ind - 1], arr[ind + 1]], path))
      : [];
    const preparedValue = valuePresenter(value);
    const preparedValuePrev = valuePresenter(valuePrev);

    if (symbol === '+') {
      if (key === keyPrev && symbolPrev === '-') {
        return [`Property '${path}' was updated. From ${preparedValuePrev} to ${preparedValue}`, ...deep];
      }
      return [`Property '${path}' was added with value: ${preparedValue}`, ...deep];
    }
    if (symbol === '-') {
      if (key === keyNext && symbolNext === '+') return [...deep];
      return [`Property '${path}' was removed`, ...deep];
    }
    return [...deep];
  };
  return diff.flatMap((el, ind, arr) => iter(el, [arr[ind - 1], arr[ind + 1]])).join('\n');
}
