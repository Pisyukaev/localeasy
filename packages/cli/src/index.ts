import { Command } from 'commander';

import {
  addCommand,
  deleteCommand,
  initCommand,
  sortCommand,
} from './commands';

import { version } from '../package.json';

const program = new Command();

program
  .name('localeasy')
  .description('A CLI tool for managing localization files')
  .version(version);

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(deleteCommand);
program.addCommand(sortCommand);

program.parse();
