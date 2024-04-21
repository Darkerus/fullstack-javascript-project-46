import { makeDiff } from '../../src/app/diff.js';
import { test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('gendiff - nested files', () => {
  const __dirname = fileURLToPath(import.meta.url);
  const data1 = JSON.parse(fs.readFileSync(path.join(__dirname, './../../../__fixtures__/file1nested.json')));
  const data2 = JSON.parse(fs.readFileSync(path.join(__dirname, './../../../__fixtures__/file2nested.json')));

  const expected = JSON.parse(fs.readFileSync(path.join(__dirname, './../../../__fixtures__/result.json')));

  const result = makeDiff(data1, data2);
  expect(result).toEqual(expected);
});
