import { Command } from 'commander';
import {
  readLocaleFile,
  writeLocaleFile,
  sortLocaleData,
  findLocaleFiles,
  validateFilePath,
  validateDirectoryPath,
} from '@localeasy/core';
import type { LocaleData } from '@localeasy/core';

export const sortCommand = new Command('sort')
  .description('Sort translation entries in locale files')
  .option('-f, --file <path>', 'Path to the locale file to sort')
  .option('-d, --directory <path>', 'Directory containing locale files to sort')
  .option('--dry-run', 'Show what would be sorted without making changes')
  .action((options) => {
    try {
      const { file, directory, dryRun } = options;

      if (file && directory) {
        console.error(
          '❌ Please specify either --file or --directory, not both'
        );
        process.exit(1);
      }

      if (!file && !directory) {
        console.error('❌ Please specify either --file or --directory');
        process.exit(1);
      }

      if (file) {
        sortSingleFile(file, dryRun);
      } else if (directory) {
        sortDirectory(directory, dryRun);
      }
    } catch (error) {
      console.error('❌ Error sorting translations:', error);
      process.exit(1);
    }
  });

function sortSingleFile(filePath: string, dryRun: boolean) {
  if (!validateFilePath(filePath)) {
    console.error('❌ Invalid file path. File should be a .json file');
    process.exit(1);
  }

  let data: LocaleData;
  try {
    data = readLocaleFile(filePath);
  } catch {
    console.error(`❌ Failed to read locale file: ${filePath}`);
    console.error('Make sure the file exists and is a valid JSON file');
    process.exit(1);
  }

  // Sort entries
  const sortedData = sortLocaleData(data);

  // Check if the order has changed
  const isAlreadySorted = JSON.stringify(data) === JSON.stringify(sortedData);

  if (isAlreadySorted) {
    console.log(`✅ File ${filePath} is already sorted`);
    return;
  }

  if (dryRun) {
    console.log(`🔍 Dry run - would sort ${filePath}:`);
    console.log('Current order:');
    Object.keys(data).forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });
    console.log('\nSorted order:');
    Object.keys(sortedData).forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });

    return;
  }

  writeLocaleFile(filePath, sortedData);

  console.log(`✅ Successfully sorted ${filePath}`);
  console.log(
    `📝 Sorted ${Object.keys(sortedData).length} translation entries`
  );
}

function sortDirectory(dirPath: string, dryRun: boolean) {
  if (!validateDirectoryPath(dirPath)) {
    console.error('❌ Invalid directory path');
    process.exit(1);
  }

  let localeFiles: string[];
  try {
    localeFiles = findLocaleFiles(dirPath);
  } catch {
    console.error(`❌ Failed to read directory: ${dirPath}`);
    process.exit(1);
  }

  if (localeFiles.length === 0) {
    console.log(`⚠️  No locale files found in directory: ${dirPath}`);
    return;
  }

  console.log(`🔍 Found ${localeFiles.length} locale files in ${dirPath}`);

  let sortedCount = 0;
  let alreadySortedCount = 0;

  for (const filePath of localeFiles) {
    try {
      const data = readLocaleFile(filePath);
      const sortedData = sortLocaleData(data);

      const isAlreadySorted =
        JSON.stringify(data) === JSON.stringify(sortedData);

      if (isAlreadySorted) {
        alreadySortedCount++;
        if (dryRun) {
          console.log(`✅ ${filePath} - already sorted`);
        }
      } else {
        if (dryRun) {
          console.log(`🔄 ${filePath} - would be sorted`);
        } else {
          writeLocaleFile(filePath, sortedData);
          console.log(`✅ Sorted ${filePath}`);
        }
        sortedCount++;
      }
    } catch {
      console.error(`❌ Error processing ${filePath}`);
    }
  }

  console.log(`\n📊 Summary:`);
  if (dryRun) {
    console.log(`  Files that would be sorted: ${sortedCount}`);
  } else {
    console.log(`  Files sorted: ${sortedCount}`);
  }

  console.log(`  Files already sorted: ${alreadySortedCount}`);
}
