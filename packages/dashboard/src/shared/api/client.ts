import type { LocaleData } from '@localeasy/core';

export interface LocaleFile {
  code: string;
  path: string;
  name: string;
}

export interface LocaleFileContent {
  file: string;
  data: LocaleData;
}

export interface DirectoryInfo {
  directory: string;
  exists: boolean;
  isEmpty?: boolean;
}

const API_BASE = '/api';

export async function getDirectory(): Promise<DirectoryInfo> {
  const response = await fetch(`${API_BASE}/directory`);
  if (!response.ok) {
    throw new Error('Failed to get directory info');
  }
  return response.json();
}

export async function getLocales(): Promise<LocaleFile[]> {
  const response = await fetch(`${API_BASE}/locales`);
  if (!response.ok) {
    throw new Error('Failed to get locales');
  }
  return response.json();
}

export async function getLocaleFile(file: string): Promise<LocaleFileContent> {
  const response = await fetch(`${API_BASE}/locales/${file}`);
  if (!response.ok) {
    throw new Error('Failed to get locale file');
  }
  return response.json();
}

export async function updateLocaleFile(
  file: string,
  data: LocaleData
): Promise<LocaleFileContent> {
  const response = await fetch(`${API_BASE}/locales/${file}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update locale file');
  }
  return response.json();
}

export async function addKey({
  file,
  key,
  value,
  force,
}: {
  file: string;
  key: string;
  value: string;
  force: boolean;
}): Promise<LocaleFileContent> {
  const response = await fetch(`${API_BASE}/locales/${file}/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, value, force }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add key');
  }
  return response.json();
}

export async function addKeyToAllFiles({
  key,
  value,
  force = false,
}: {
  key: string;
  value: string;
  force: boolean;
}) {
  console.log(key, value, force);
  const response = await fetch(`${API_BASE}/locales/add/key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value,
      force,
    }),
  });

  return response.json();
}

export async function deleteKey({
  file = '',
  key,
  force = false,
}: {
  key: string;
  file?: string;
  force: boolean;
}): Promise<LocaleFileContent> {
  const response = await fetch(`${API_BASE}/locales/delete/key`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file,
      key,
      force,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete key');
  }
  return response.json();
}

export async function sortLocaleFile(file: string): Promise<LocaleFileContent> {
  const response = await fetch(`${API_BASE}/locales/${file}/sort`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sort locale file');
  }
  return response.json();
}

export async function healthCheck(): Promise<{
  status: string;
  timestamp: string;
}> {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

export const apiClient = {
  getDirectory,
  getLocales,
  getLocaleFile,
  updateLocaleFile,
  addKey,
  deleteKey,
  sortLocaleFile,
  healthCheck,
  addKeyToAllFiles,
};
