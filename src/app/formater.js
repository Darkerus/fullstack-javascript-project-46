// [key, value, symbol = '-'|' '|'+', depth] - diff tupple
export default function formatter(diff) {
  const beginSpell = '{\n';
  const endSpell = '\n}';

  const recursive = (diffTupple) => {
    const [key, value, symbol, depth] = diffTupple;
    const preparedValue = Array.isArray(value) ? recursive(value) : value;
    return beginSpell + `${' '.repeat(depth * 2)}${symbol} ${key}: ${preparedValue}` + endSpell;
  };

  const resultString = diff.reduce((acc, cur) => acc + recursive(cur), '');

  return beginSpell + resultString + endSpell;
}
