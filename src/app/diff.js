import _ from 'lodash';
/**
 *
 * @param {Record<string, any>} data1
 * @param {Record<string, any>} data2
 */
export default function (data1, data2) {
  const arrayOfData1 = Object.entries(data1);
  const arrayOfData2 = Object.entries(data2);

  const diffMinus = arrayOfData1
    .map(([key, value]) => {
      if (!(key in data2)) return [key, value, '-'];
      else if (value !== data2[key]) return [key, value, '-'];
      else return [key, value, ''];
    })
    .filter((el) => el !== undefined);

  const diffPlus = arrayOfData2
    .map(([key, value]) => {
      if (!(key in data1)) return [key, value, '+'];
      else if (value !== data1[key]) return [key, value, '+'];
    })
    .filter((el) => el !== undefined);

  const diff = [...diffMinus, ...diffPlus];
  const diffSort = _.sortBy(diff, [
    0,
    (o) => {
      return -o[2];
    },
  ]);

  const resultString = '{\n' + diffSort.reduce((acc, cur) => acc + `  ${cur[2]} ${cur[0]}: ${cur[1]}\n`, '') + '}';

  return resultString;
}
