import genDiff from '../../src/app/diff.js';
import { test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

test('gendiff - nested files', () => {
  const __dirname = fileURLToPath(import.meta.url);
  const data1 = JSON.parse(fs.readFileSync(path.join(__dirname, './../../../__fixtures__/file1nested.json')));
  const data2 = JSON.parse(fs.readFileSync(path.join(__dirname, './../../../__fixtures__/file2nested.json')));

  const expected = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

  const result = genDiff(data1, data2);
  expect(result).toEqual(expected);
});
