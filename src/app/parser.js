import fs from 'fs';
import jsYaml from 'js-yaml';
import path from 'path';
import { cwd } from 'process';

/**
 * @function
 * @param {string} path
 * @property  mode
 */

export function takeFilePath(pathString) {
  /**
   * @type { 'relative' | 'absolute' }
   */

  if (pathString[0] === '/') return path.resolve(pathString);
  return path.resolve(cwd(), pathString);
}

export default function takeFiles(path1, path2) {
  const path1Data = takeFilePath(path1);
  const path2Data = takeFilePath(path2);

  const format1 = path.extname(path1Data);
  const format2 = path.extname(path2Data);

  const file1 = fs.readFileSync(path1Data);
  const file2 = fs.readFileSync(path2Data);

  const formatDispetcher = new Map();
  formatDispetcher.set('.json', (data) => JSON.parse(data));
  formatDispetcher.set('.yaml', (data) => jsYaml.load(data));
  formatDispetcher.set('.yml', (data) => jsYaml.load(data));

  const data1 = formatDispetcher.get(format1)(file1);
  const data2 = formatDispetcher.get(format2)(file2);

  return { data1, data2 };
}
