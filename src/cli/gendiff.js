import { Command } from 'commander';
import genDiff from '../app/diff.js';

const program = new Command();

program
  .name('gendiff')
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format (default: "stylish")')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((path1, path2) => {
    const { format = 'stylish' } = program.opts();
    console.log(genDiff(path1, path2, format));
  });

export default program;
