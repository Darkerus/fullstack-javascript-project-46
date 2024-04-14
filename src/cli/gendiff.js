#!/usr/bin/env node

import { Command } from 'commander';
import takeFiles from '../app/parser.js';

const program = new Command();

program
  .name('gendiff')
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format (default: "stylish")')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((...args) => {
    const [path1, path2, options, ctx] = args;
    const datas = takeFiles(path1, path2);
    console.log(datas);
  });
program.parse();
