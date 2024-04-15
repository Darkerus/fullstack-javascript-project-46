import { program } from './../../src/cli/gendiff.js';
import { expect, jest, test } from '@jest/globals';

jest.spyOn(console, 'log');

test('test cli instrument', () => {
  let result;

  jest.mocked(console.log).mockImplementation((string) => {
    result = string;
  });

  program.parse(['', '', './__fixtures__/file1.json', './__fixtures__/file2.json']);
  const expectData = `{
  - follow: false
   host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(result).toEqual(expectData);
});
