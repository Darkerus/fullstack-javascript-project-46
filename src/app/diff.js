import _ from 'lodash';

let result = [];

/**
 *
 * @param {Record<string, any>} data1
 * @param {Record<string, any>} data2
 */
export default function genDiff(data1, data2, depth = 0) {
  const arrayOfData1 = Object.entries(data1);
  const arrayOfData2 = Object.entries(data2);

  const diff =
    (data, symbol, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return [];
      if (typeof value === 'object' && typeof data[key] !== 'object' && !_.isNull(value))
        return [key, genDiff(value, value, depth + 1), symbol, depth];
      if (!(key in data)) return [key, value, symbol, depth];
      else if (value !== data[key]) return [key, value, symbol, depth];
    };

  const stable =
    (data, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return [key, genDiff(value, data2[key], depth + 1), ' ', depth];
      if (!(key in data)) return undefined;
      else if (value !== data[key]) return undefined;
      else return [key, value, ' ', depth];
    };

  const diffMinus = arrayOfData1
    .map(diff(data2, '-', depth))
    .filter((el) => el !== undefined)
    .filter((el) => (Array.isArray(el) ? el.length > 0 : true));

  const diffPlus = arrayOfData2
    .map(diff(data1, '+', depth))
    .filter((el) => el !== undefined)
    .filter((el) => (Array.isArray(el) ? el.length > 0 : true));

  const diffStable = arrayOfData1
    .map(stable(data2, depth))
    .filter((el) => el !== undefined)
    .filter((el) => (Array.isArray(el) ? el.length > 0 : true));

  const diffSumm = [...diffMinus, ...diffPlus, ...diffStable];
  const diffSort = _.sortBy(diffSumm, [
    0,
    (o) => {
      return -o[2];
    },
  ]);

  // MARK: FORMATER

  const stringResult = diffSort;

  return depth === 0 ? JSON.stringify(diffSort) : diffSort;
}
