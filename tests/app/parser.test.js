import fileParser from '../../src/app/parser.js';

test('JSON - fileParser', () => {
  const { expect1, expect2 } = {
    expect1: {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    },
    expect2: {
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    },
  };

  const { data1, data2 } = fileParser('./__fixtures__/file1.json', './__fixtures__/file2.json');
  expect(data1).toEqual(expect1);
  expect(data2).toEqual(expect2);
});

test('YML - fileParser', () => {
  const { expect1, expect2 } = {
    expect1: {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    },
    expect2: {
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    },
  };

  const { data1, data2 } = fileParser('./__fixtures__/file1.yml', './__fixtures__/file2.yml');
  expect(data1).toEqual(expect1);
  expect(data2).toEqual(expect2);
});
