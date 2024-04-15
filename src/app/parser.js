import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

export default function takeFiles(path1, path2) {
  path1 = takeFilePath(path1);
  path2 = takeFilePath(path2);

  const format1 = path1.split('.').at(-1) || null;
  const format2 = path2.split('.').at(-1) || null;

  const file1 = fs.readFileSync(path1);
  const file2 = fs.readFileSync(path2);

  const formatDispetcher = {
    json: (data) => JSON.parse(data),
  };

  const data1 = formatDispetcher[format1](file1);
  const data2 = formatDispetcher[format2](file2);

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
