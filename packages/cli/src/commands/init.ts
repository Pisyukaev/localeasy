import { Command } from 'commander';

import {
  createDir,
  readDir,
  validateDirectoryPath,
  validateLanguage,
  writeLocaleFile,
} from '@localeasy/core';

export const initCommand = new Command('init')
  .description('Initialize a new locale project')
  .option(
    '-d, --directory <path>',
    'Directory to initialize the project in',
    './locales'
  )
  .option(
    '-l, --languages <languages>',
    'Comma-separated list of languages to create',
    'en,ru'
  )
  .action(async (options) => {
    const { directory, languages } = options;

    if (!validateDirectoryPath(directory)) {
      console.error('❌ Invalid directory path');
      process.exit(1);
    }

    const languageList = languages
      .split(',')
      .map((lang: string) => lang.trim());

    for (const lang of languageList) {
      if (!validateLanguage(lang)) {
        console.error(`❌ Invalid language code: ${lang}`);
        process.exit(1);
      }
    }

    // Create directory if it does not exist
    try {
      readDir(directory);
    } catch {
      // Directory does not exist, create it
      createDir(directory);
      console.log(`📁 Created directory: ${directory}`);
    }

    // Create locale files for each language
    for (const language of languageList) {
      const data = {
        welcome: `Welcome to ${language}`,
        hello: `Hello in ${language}`,
      };

      const filePath = `${directory}/${language}.json`;
      writeLocaleFile(filePath, data);

      console.log(`✅ Created locale file: ${filePath}`);
    }

    console.log(`🎉 Successfully initialized locale project in ${directory}`);
    console.log(`📝 Created files for languages: ${languageList.join(', ')}`);
  });
