import { program } from './../../src/cli/gendiff.js';
import { expect, jest, test } from '@jest/globals';

jest.spyOn(console, 'log');

test('test cli instrument', () => {
  let result;

  jest.mocked(console.log).mockImplementation((string) => {
    result = string;
  });

  program.parse(['', '', './__fixtures__/file1nested.json', './__fixtures__/file2nested.json']);
  const expectData = `{
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

  expect(result).toEqual(expectData);
});
