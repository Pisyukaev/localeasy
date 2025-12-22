import { createEvent, createEffect, sample } from 'effector';

import {
  $locales,
  $selectedLocale,
  $loading,
  loadLocales,
  refreshLocaleFile,
} from 'entities/locale';
import { apiClient } from 'shared/api/client';

export interface AddKeyToAllParams {
  key: string;
  value: string;
  force: boolean;
}

export const addKeyToAll = createEvent<AddKeyToAllParams>();

export const addKeyToAllFx = createEffect(
  async ({
    locales,
    key,
    value,
    force,
  }: { locales: string[] } & AddKeyToAllParams) => {
    const results = await Promise.allSettled(
      locales.map((file) => apiClient.addKey({ file, key, value, force }))
    );

    const errors: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        errors.push(
          `${locales[index]}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`
        );
      }
    });

    if (errors.length > 0) {
      throw new Error(`Failed to add key to some files:\n${errors.join('\n')}`);
    }

    return results;
  }
);

$loading.on(addKeyToAllFx.pending, (_, pending) => pending);

sample({
  clock: addKeyToAll,
  source: $locales,
  fn: (locales, params) => ({
    locales: locales.map((locale) => locale.code),
    ...params,
  }),
  target: addKeyToAllFx,
});

sample({
  clock: addKeyToAllFx.done,
  target: loadLocales,
});

// Refresh current file if one is selected
sample({
  clock: addKeyToAllFx.done,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  target: refreshLocaleFile,
});
