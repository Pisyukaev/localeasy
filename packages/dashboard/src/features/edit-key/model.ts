import { createEvent, createEffect, sample } from 'effector';
import type { LocaleData } from '@localeasy/core';

import { refreshLocaleFile, $selectedLocale } from 'entities/locale';
import { apiClient } from 'shared/api/client';

export interface EditKeyParams {
  key: string;
  value: string;
}

export interface EditKeyAndNameParams {
  oldKey: string;
  newKey: string;
  value: string;
}

export const editKey = createEvent<EditKeyParams>();
export const editKeyAndName = createEvent<EditKeyAndNameParams>();
export const resetEditKey = createEvent();

export const editKeyFx = createEffect(
  async ({ file, key, value }: { file: string } & EditKeyParams) => {
    const currentData = await apiClient.getLocaleFile(file);
    const updatedData: LocaleData = { ...currentData.data, [key]: value };
    return await apiClient.updateLocaleFile(file, updatedData);
  }
);

export const editKeyAndNameFx = createEffect(
  async ({
    file,
    oldKey,
    newKey,
    value,
  }: { file: string } & EditKeyAndNameParams) => {
    const currentData = await apiClient.getLocaleFile(file);

    // Check if new key already exists (and it's not the same as old key)
    if (currentData.data[newKey] !== undefined && newKey !== oldKey) {
      throw new Error(`Key "${newKey}" already exists`);
    }

    // Create new data object with renamed key and updated value
    const newData: LocaleData = {};
    for (const [key, val] of Object.entries(currentData.data)) {
      if (key === oldKey) {
        newData[newKey] = value;
      } else {
        newData[key] = val;
      }
    }

    return await apiClient.updateLocaleFile(file, newData);
  }
);

sample({
  clock: editKey,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  fn: (file, params) => ({ file: file!, ...params }),
  target: editKeyFx,
});

sample({
  clock: editKeyAndName,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  fn: (file, params) => ({ file: file!, ...params }),
  target: editKeyAndNameFx,
});

sample({
  clock: editKeyFx.done,
  target: refreshLocaleFile,
});

sample({
  clock: editKeyAndNameFx.done,
  target: refreshLocaleFile,
});
