import _ from 'lodash';
import { stylish, plain, json } from '../formatters/index.js';

const formatterDispatcher = {
  stylish: stylish,
  plain: plain,
  json: json,
};

export default function genDiff(data1, data2, formater = 'stylish') {
  return formatterDispatcher[formater](makeDiff(data1, data2));
}

/**
 *
 * @param {Record<string, any>} data1
 * @param {Record<string, any>} data2
 */
export function makeDiff(data1, data2, depth = 0) {
  const arrayOfData1 = Object.entries(data1);
  const arrayOfData2 = Object.entries(data2);

  const diff =
    (data, symbol, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return [];
      if (typeof value === 'object' && typeof data[key] !== 'object' && !_.isNull(value))
        return [key, makeDiff(value, value, depth + 1), symbol, depth];
      if (!(key in data)) return [key, value, symbol, depth];
      else if (value !== data[key]) return [key, value, symbol, depth];
    };

  const stable =
    (data, depth = 0) =>
    ([key, value]) => {
      if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key]))
        return [key, makeDiff(value, data2[key], depth + 1), ' ', depth];
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
  return diffSort;
}
