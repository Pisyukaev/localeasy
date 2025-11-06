import { Command } from 'commander';
import {
  addToFiles,
  validateKey,
  validateValue,
  validateFilePath,
  validateDirectoryPath,
} from '@localeasy/core';

export const addCommand = new Command('add')
  .description('Add a new translation entry')
  .option('-f, --file <path>', 'Path to the locale file')
  .option('-d, --directory <path>', 'Directory containing locale files')
  .option('-k, --key <key>', 'Translation key')
  .option('-v, --value <value>', 'Translation value')
  .option('--all', 'Add key to all locale files in directory')
  .option('--force', 'Force overwrite existing key')
  .action((options) => {
    try {
      const { file, directory, key, value, all, force } = options;

      if (!validateKey(key)) {
        console.error(
          '❌ Invalid key format. Key should contain only letters, numbers, dots, underscores and hyphens'
        );
        process.exit(1);
      }

      if (!validateValue(value)) {
        console.error('❌ Invalid value. Value cannot be empty');
        process.exit(1);
      }

      if (all) {
        // Add to all files in directory
        if (!directory) {
          console.error('❌ Directory is required when using --all option');
          process.exit(1);
        }

        if (!validateDirectoryPath(directory)) {
          console.error('❌ Invalid directory path');
          process.exit(1);
        }

        addToFiles(directory, key, value, force);

        return;
      }
      // Add to single file
      if (!file) {
        console.error('❌ File is required when not using --all option');
        process.exit(1);
      }

      if (!validateFilePath(file)) {
        console.error('❌ Invalid file path. File should be a .json file');
        process.exit(1);
      }

      addToFiles(file, key, value, force);
    } catch (error) {
      console.error('❌ Error adding translation:', error);
      process.exit(1);
    }
  });
