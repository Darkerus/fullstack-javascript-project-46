import { Command } from 'commander';
import takeFiles from '../app/parser.js';
import genDiff from '../app/diff.js';

export const program = new Command();

program
  .name('gendiff')
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format (default: "stylish")')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((...args) => {
    const { format = 'stylish' } = program.opts();
    const [path1, path2] = args;
    const { data1, data2 } = takeFiles(path1, path2);
    console.log(genDiff(data1, data2, format));
  });
