import genDiff from '../../src/app/diff.js';
import { test, expect } from '@jest/globals';

let data1;
let data2;
let result;

test('genDiff - normal working', () => {
  data1 = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };

  data2 = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };

  result = `{
  - follow: false
   host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(genDiff(data1, data2)).toBe(result);
});
