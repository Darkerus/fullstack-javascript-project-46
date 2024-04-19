import _ from 'lodash';
/**
 *
 * @param {Record<string, any>} data1
 * @param {Record<string, any>} data2
 */
export default function genDiff(data1, data2) {
  const arrayOfData1 = Object.entries(data1);
  const arrayOfData2 = Object.entries(data2);

  const diff =
    (data, symbol, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return genDiff(value, data2[key]);
      if (!(key in data)) return [key, value, symbol, depth];
      else if (value !== data[key]) return [key, value, symbol, depth];
    };

  const stable =
    (data, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return genDiff(value, data2[key]);
      if (!(key in data)) return undefined;
      else if (value !== data[key]) return undefined;
      else return [key, value, ' ', depth];
    };

  const diffMinus = arrayOfData1.map(diff(data2, '-')).filter((el) => el !== undefined);

  const diffPlus = arrayOfData2.map(diff(data1, '+')).filter((el) => el !== undefined);

  const diffStable = arrayOfData1.map(stable(data2)).filter((el) => el !== undefined);

  const diffSumm = [...diffMinus, ...diffPlus, ...diffStable];
  const diffSort = _.sortBy(diffSumm, [
    0,
    (o) => {
      return -o[2];
    },
  ]);

  const resultString =
    '{\n' +
    diffSort.reduce((acc, cur) => {
      acc + `  ${cur[2]} ${cur[0]}: ${cur[1]}\n`, '';
    }) +
    '}';

  return JSON;
}
