import { Command } from 'commander';
import { createInterface } from 'readline';

import {
  readLocaleFile,
  writeLocaleFile,
  hasKey,
  removeKey,
  validateKey,
  validateFilePath,
} from '@localeasy/core';
import type { LocaleData } from '@localeasy/core';

function performDeletion(data: LocaleData, key: string, file: string) {
  const newData = removeKey(data, key);

  writeLocaleFile(file, newData);

  console.log(`✅ Successfully deleted translation entry: ${key}`);
  console.log(`📄 Updated file: ${file}`);
}

export const deleteCommand = new Command('delete')
  .description('Delete a translation entry')
  .option('-f, --file <path>', 'Path to the locale file')
  .option('-k, --key <key>', 'Translation key to delete')
  .option('--force', 'Force deletion without confirmation')
  .action((options) => {
    const { file, key, force } = options;

    if (!validateKey(key)) {
      console.error(
        '❌ Invalid key format. Key should contain only letters, numbers, dots, underscores and hyphens'
      );
      process.exit(1);
    }

    if (!validateFilePath(file)) {
      console.error('❌ Invalid file path. File should be a .json file');
      process.exit(1);
    }

    let data: LocaleData;

    try {
      data = readLocaleFile(file);
    } catch {
      console.error(`❌ Failed to read locale file: ${file}`);
      console.error('Make sure the file exists and is a valid JSON file');
      process.exit(1);
    }

    if (!hasKey(data, key)) {
      console.error(`❌ Key '${key}' not found in file: ${file}`);
      process.exit(1);
    }

    // Show information about the entry we are going to delete
    console.log(`🔍 Found translation entry:`);
    console.log(`   Key: ${key}`);
    console.log(`   Value: ${data[key]}`);

    // Ask for confirmation if the --force flag is not specified
    if (!force) {
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      readline.question(
        'Are you sure you want to delete this entry? (y/N): ',
        (answer: string) => {
          readline.close();

          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            performDeletion(data, key, file);

            return;
          }

          console.log('❌ Deletion cancelled');
          process.exit(0);
        }
      );

      return;
    }

    performDeletion(data, key, file);
  });
