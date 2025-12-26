import { createEvent, createEffect, sample } from 'effector';

import {
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

export const addKeyToAllFx = createEffect(apiClient.addKeyToAllFiles);

$loading.on(addKeyToAllFx.pending, (_, pending) => pending);

sample({
  clock: addKeyToAll,
  filter: ({ key, value }) => key !== '' && value !== '',
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
