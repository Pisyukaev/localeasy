# 🌍 Localeasy

> Simple and powerful CLI tool for managing localization files

English | [Русский](README.ru.md)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Localeasy is a convenient command-line tool for managing localization files in JSON format. It allows you to quickly initialize a localization project, add, remove, and sort translation keys.

## ✨ Features

- 🚀 **Quick initialization** - create localization structure with a single command
- ➕ **Easy key addition** - add translations to one or multiple files
- 🗑️ **Safe deletion** - remove keys with confirmation
- 📊 **Automatic sorting** - maintain key order in files
- ✅ **Validation** - validate key format and language codes
- 🔄 **Batch processing** - work with multiple files simultaneously
- 🎯 **TypeScript** - full type support

## 📦 Installation

### Global Installation

```bash
npm install -g @localeasy/cli
```

### Local Installation

```bash
npm install --save-dev @localeasy/cli
```

### Using with npx

```bash
npx @localeasy/cli init
```

## 🚀 Quick Start

### 1. Initialize Project

```bash
localeasy init
```

This will create a `./locales` directory with `en.json` and `ru.json` files:

```json
// locales/en.json
{
  "welcome": "Welcome to en",
  "hello": "Hello in en"
}
```

### 2. Add Translations

```bash
# Add key to a single file
localeasy add -f ./locales/en.json -k greeting -v "Hello, World!"

# Add key to all files in directory
localeasy add -d ./locales --all -k greeting -v "Hello, World!" --force
```

### 3. Delete Keys

```bash
localeasy delete -f ./locales/en.json -k greeting
```

### 4. Sort Keys

```bash
# Sort a single file
localeasy sort -f ./locales/en.json

# Sort all files in directory
localeasy sort -d ./locales

# Preview changes (dry-run)
localeasy sort -d ./locales --dry-run
```

## 📚 Commands

### `init` - Initialize Project

Creates localization structure with files for specified languages.

```bash
localeasy init [options]
```

**Options:**
- `-d, --directory <path>` - Directory to initialize (default: `./locales`)
- `-l, --languages <languages>` - Comma-separated list of languages (default: `en,ru`)

**Examples:**
```bash
# Basic usage
localeasy init

# Custom directory and languages
localeasy init -d ./src/locales -l en,ru,fr,de
```

### `add` - Add Translation Key

Adds a new translation key to one or multiple files.

```bash
localeasy add [options]
```

**Options:**
- `-f, --file <path>` - Path to locale file (default: `./locales/en.json`)
- `-d, --directory <path>` - Directory containing locale files
- `-k, --key <key>` - Translation key (required)
- `-v, --value <value>` - Translation value (required)
- `--all` - Add key to all files in directory
- `--force` - Force overwrite existing key

**Examples:**
```bash
# Add to a single file
localeasy add -f ./locales/en.json -k welcome -v "Welcome"

# Add to all files in directory
localeasy add -d ./locales --all -k welcome -v "Welcome"

# Overwrite existing key
localeasy add -f ./locales/en.json -k welcome -v "New Welcome" --force
```

**Key Format:**
- Only letters, numbers, dots, underscores, and hyphens are allowed
- Valid key examples: `welcome`, `user.name`, `button.submit`, `page-title`

### `delete` - Delete Key

Removes a translation key from a file with confirmation.

```bash
localeasy delete [options]
```

**Options:**
- `-f, --file <path>` - Path to locale file (default: `./locales/en.json`)
- `-k, --key <key>` - Key to delete (required)
- `--force` - Delete without confirmation

**Examples:**
```bash
# Delete with confirmation
localeasy delete -f ./locales/en.json -k welcome

# Delete without confirmation
localeasy delete -f ./locales/en.json -k welcome --force
```

### `sort` - Sort Keys

Sorts translation keys in files alphabetically.

```bash
localeasy sort [options]
```

**Options:**
- `-f, --file <path>` - Path to file to sort
- `-d, --directory <path>` - Directory containing files to sort
- `--dry-run` - Show what would be sorted without making changes

**Examples:**
```bash
# Sort a single file
localeasy sort -f ./locales/en.json

# Sort all files in directory
localeasy sort -d ./locales

# Preview changes
localeasy sort -d ./locales --dry-run
```

## 🏗️ Project Structure

Localeasy consists of two main packages:

```
localeasy/
├── packages/
│   ├── core/          # Core localization logic
│   │   ├── src/
│   │   │   ├── utils/     # Utilities for file operations and validation
│   │   │   └── types/     # TypeScript types
│   │   └── dist/          # Compiled code
│   │
│   └── cli/            # CLI interface
│       ├── src/
│       │   └── commands/  # CLI commands
│       └── dist/          # Compiled code
│
├── package.json
└── README.md
```

### Packages

#### `@localeasy/core`

Core package with localization logic.

#### `@localeasy/cli`

CLI tool for managing localization from the command line.

## 🎯 Best Practices

1. **Use structured keys**: `page.home.title`, `button.submit` instead of `homeTitle`, `submitButton`
2. **Sort files regularly**: helps find keys and avoid duplication
3. **Use `--dry-run`**: check results before bulk operations
4. **Key validation**: use only allowed characters (letters, numbers, dots, underscores, hyphens)
5. **Version control**: store localization files in version control system

## 🙏 Acknowledgments

Thanks to everyone who uses and contributes to Localeasy!

---

**Made with ❤️ for developers**