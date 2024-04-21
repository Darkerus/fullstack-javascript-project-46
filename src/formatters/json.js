export default function json(diff) {
  const iter = (diffTupple, [prevDiffTupple = [], nextDiffTupple = []] = [], acc = '') => {
    const [key, value, symbol] = diffTupple;
    const [keyPrev, valuePrev, symbolPrev] = prevDiffTupple;
    const [keyNext, , symbolNext] = nextDiffTupple;
    const path = acc.length === 0 ? key : `${acc}.${key}`;
    const deep = Array.isArray(value)
      ? value.flatMap((el, ind, arr) => iter(el, [arr[ind - 1], arr[ind + 1]], path))
      : [];
    const preparedValue = Array.isArray(value) ? '[complex value]' : value;
    const preparedValuePrev = Array.isArray(valuePrev) ? '[complex value]' : valuePrev;
    if (symbol === '+') {
      if (key === keyPrev && symbolPrev === '-') {
        return [
          {
            path,
            key,
            process: 'update',
            previousValue: preparedValuePrev,
            value: preparedValue,
          },
          ...deep,
        ];
      }
      return [
        {
          path,
          key,
          process: 'add',
          value: preparedValue,
        },
        ...deep,
      ];
    }
    if (symbol === '-') {
      if (key === keyNext && symbolNext === '+') return [];
      return [
        {
          path,
          key,
          process: 'remove',
          removedValue: preparedValue,
        },
        ...deep,
      ];
    }
    return [...deep];
  };

  return JSON.stringify(diff.flatMap((el, ind, arr) => iter(el, [arr[ind - 1], arr[ind + 1]])));
}
