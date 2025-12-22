import { createEvent, createEffect, sample } from 'effector';

import { refreshLocaleFile, $selectedLocale } from 'entities/locale';
import { apiClient } from 'shared/api/client';

export const sortKeys = createEvent();
export const resetSortKeys = createEvent();

export const sortKeysFx = createEffect(apiClient.sortLocaleFile);

sample({
  clock: sortKeys,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  target: sortKeysFx,
});

sample({
  clock: sortKeysFx.done,
  target: refreshLocaleFile,
});
