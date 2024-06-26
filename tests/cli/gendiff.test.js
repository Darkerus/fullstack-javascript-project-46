import { expect, jest, test } from '@jest/globals';
import program from '../../src/cli/gendiff.js';

jest.spyOn(console, 'log');

test('cli instrument', () => {
  const expectData1 = `{
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
  jest.mocked(console.log).mockImplementationOnce((string) => {
    expect(string).toEqual(expectData1);
  });
  program.parse(['', '', './__fixtures__/file1nested.json', './__fixtures__/file2nested.json']);
});

test('e2e - plain formater', () => {
  const expectData2 = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

  jest.mocked(console.log).mockImplementationOnce((string) => {
    expect(expectData2).toEqual(string);
  });
  program.parse(['', '', './__fixtures__/file1nested.json', './__fixtures__/file2nested.json', '--format', 'plain']);
});

test('e2e - json formater', () => {
  const expectData3 = '[{"path":"common.follow","key":"follow","process":"add","value":false},{"path":"common.setting2","key":"setting2","process":"remove","removedValue":200},{"path":"common.setting3","key":"setting3","process":"update","previousValue":true,"value":null},{"path":"common.setting4","key":"setting4","process":"add","value":"blah blah"},{"path":"common.setting5","key":"setting5","process":"add","value":"[complex value]"},{"path":"common.setting6.doge.wow","key":"wow","process":"update","previousValue":"","value":"so much"},{"path":"common.setting6.ops","key":"ops","process":"add","value":"vops"},{"path":"group1.baz","key":"baz","process":"update","previousValue":"bas","value":"bars"},{"path":"group1.nest","key":"nest","process":"update","previousValue":"[complex value]","value":"str"},{"path":"group2","key":"group2","process":"remove","removedValue":"[complex value]"},{"path":"group3","key":"group3","process":"add","value":"[complex value]"}]';

  jest.mocked(console.log).mockImplementationOnce((string) => {
    expect(expectData3).toEqual(string);
  });
  program.parse(['', '', './__fixtures__/file1nested.json', './__fixtures__/file2nested.json', '--format', 'json']);
});
