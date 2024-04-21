import _ from 'lodash';
import { stylish, plain, json } from '../formatters/index.js';
import takeFiles from './parser.js';

const formatterDispatcher = {
  stylish,
  plain,
  json,
};

/**
 *
 * @param {Record<string, any>} data1
 * @param {Record<string, any>} data2
 */
export function makeDiff(data1, data2, depth = 0) {
  const arrayOfData1 = Object.entries(data1);
  const arrayOfData2 = Object.entries(data2);

  const diff = (data, symbol, depthDeep = 0) => ([key, value]) => {
    if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key])) return [];
    if (typeof value === 'object' && typeof data[key] !== 'object' && !_.isNull(value)) return [key, makeDiff(value, value, depth + 1), symbol, depthDeep];
    if (!(key in data)) return [key, value, symbol, depthDeep];
    if (value !== data[key]) return [key, value, symbol, depthDeep];
    return [];
  };

  const stable = (data, depthDeep2 = 0) => ([key, value]) => {
    if (typeof value === 'object' && typeof data[key] === 'object' && !_.isNull(value) && !_.isNull(data[key])) {
      return [key, makeDiff(value, data2[key], depthDeep2 + 1), ' ', depthDeep2];
    }
    if (!(key in data)) return undefined;
    if (value !== data[key]) return undefined;
    return [key, value, ' ', depth];
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
    (o) => -o[2],
  ]);

  // MARK: FORMATER
  return diffSort;
}

export default function genDiff(filepath1, filepath2, formater = 'stylish') {
  const { data1, data2 } = takeFiles(filepath1, filepath2);

  return formatterDispatcher[formater](makeDiff(data1, data2));
}
