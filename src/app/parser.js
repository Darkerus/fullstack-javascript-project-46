import fs from 'fs';
import jsYaml from 'js-yaml';
import path from 'path';
import { cwd } from 'process';

export default function takeFiles(path1, path2) {
  path1 = takeFilePath(path1);
  path2 = takeFilePath(path2);

  const format1 = path.extname(path1);
  const format2 = path.extname(path2);

  const file1 = fs.readFileSync(path1);
  const file2 = fs.readFileSync(path2);

  const formatDispetcher = new Map();
  formatDispetcher.set('.json', (data) => JSON.parse(data));
  formatDispetcher.set('.yaml', (data) => jsYaml.load(data));
  formatDispetcher.set('.yml', (data) => jsYaml.load(data));

  const data1 = formatDispetcher.get(format1)(file1);
  const data2 = formatDispetcher.get(format2)(file2);

  return { data1, data2 };
}

/**
 * @function
 * @param {string} path
 * @property  mode
 */

export function takeFilePath(pathString) {
  /**
   * @type { 'relative' | 'absolute' }
   */
  let mode = 'relative';

  if (pathString[0] === '/') mode = 'absolute';

  const absolutePath = path.resolve(pathString);
  const relativePath = path.resolve(cwd(), pathString);

  return mode === 'absolute' ? absolutePath : relativePath;
}
