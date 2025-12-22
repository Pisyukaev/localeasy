import express from 'express';
import cors from 'cors';
import path from 'path';

import {
  readLocaleFile,
  writeLocaleFile,
  findLocaleFiles,
  sortLocaleData,
  addKey,
  removeKey,
  hasKey,
  readDir,
  isDirectory,
} from '@localeasy/core';
import type { LocaleData } from '@localeasy/core';

export interface ServerOptions {
  port?: number;
  host?: string;
  directory?: string;
}

export function createServer(options: ServerOptions = {}) {
  const app = express();
  const PORT = options.port || Number(process.env.PORT) || 3001;
  const HOST = options.host || process.env.HOST || 'localhost';
  const LOCALES_DIR = options.directory || process.env.LOCALES_DIR || path.join(process.cwd(), 'locales');

  app.use(cors());
  app.use(express.json());

// Get locales directory
app.get('/api/directory', (_req, res) => {
  try {
    const exists = isDirectory(LOCALES_DIR);
    const isEmpty = exists ? readDir(LOCALES_DIR).length === 0 : undefined;

    res.json({
      directory: LOCALES_DIR,
      exists,
      isEmpty,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check directory',
      message: (error as Error).message,
    });
  }
});

// Get all locale files
app.get('/api/locales', (_req, res) => {
  try {
    const files = findLocaleFiles(LOCALES_DIR);
    const locales = files.map((file: string) => {
      const filename = path.basename(file, '.json');
      return {
        code: filename,
        path: file,
        name: filename,
      };
    });
    res.json(locales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read locale files', message: (error as Error).message });
  }
});

// Get locale file content
app.get('/api/locales/:file', (req, res) => {
  try {
    const { file } = req.params;
    const filePath = path.join(LOCALES_DIR, `${file}.json`);
    const data = readLocaleFile(filePath);
    res.json({ file, data });
  } catch (error) {
    res.status(404).json({ error: 'Locale file not found', message: (error as Error).message });
  }
});

// Update locale file
app.put('/api/locales/:file', (req, res) => {
  try {
    const { file } = req.params;
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const filePath = path.join(LOCALES_DIR, `${file}.json`);
    writeLocaleFile(filePath, data as LocaleData);
    res.json({ file, data, message: 'Locale file updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update locale file', message: (error as Error).message });
  }
});

// Add key to locale file
app.post('/api/locales/:file/keys', (req, res) => {
  try {
    const { file } = req.params;
    const { key, value, force } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    const filePath = path.join(LOCALES_DIR, `${file}.json`);
    let data: LocaleData;

    try {
      data = readLocaleFile(filePath);
    } catch {
      data = {};
    }

    if (hasKey(data, key) && !force) {
      return res.status(409).json({
        error: 'Key already exists',
        existingValue: data[key],
        message: 'Use force=true to overwrite',
      });
    }

    data = addKey(data, key, value);
    writeLocaleFile(filePath, data);

    res.json({ file, key, value, data, message: 'Key added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add key', message: (error as Error).message });
  }
});

// Delete key from locale file
app.delete('/api/locales/:file/keys/:key', (req, res) => {
  try {
    const { file, key } = req.params;
    const filePath = path.join(LOCALES_DIR, `${file}.json`);

    let data: LocaleData;
    try {
      data = readLocaleFile(filePath);
    } catch {
      return res.status(404).json({ error: 'Locale file not found' });
    }

    if (!hasKey(data, key)) {
      return res.status(404).json({ error: 'Key not found' });
    }

    data = removeKey(data, key);
    writeLocaleFile(filePath, data);

    res.json({ file, key, data, message: 'Key deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete key', message: (error as Error).message });
  }
});

// Sort keys in locale file
app.post('/api/locales/:file/sort', (req, res) => {
  try {
    const { file } = req.params;
    const filePath = path.join(LOCALES_DIR, `${file}.json`);

    const data = readLocaleFile(filePath);
    const sortedData = sortLocaleData(data);
    writeLocaleFile(filePath, sortedData);

    res.json({ file, data: sortedData, message: 'Keys sorted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sort keys', message: (error as Error).message });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

  return { app, PORT, HOST, LOCALES_DIR };
}

export function startServer(options: ServerOptions = {}) {
  const { app, PORT, HOST, LOCALES_DIR } = createServer(options);

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📁 Locales directory: ${LOCALES_DIR}`);
  });

  return app;
}

// Start server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.includes('server.ts')) {
  startServer();
}
