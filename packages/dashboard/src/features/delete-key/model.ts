import { createEvent, createEffect, sample } from 'effector';

import { refreshLocaleFile, $selectedLocale } from 'entities/locale';
import { apiClient } from 'shared/api/client';

export const deleteKey = createEvent<string>();
export const resetDeleteKey = createEvent();

export const deleteKeyFx = createEffect(apiClient.deleteKey);

sample({
  clock: deleteKey,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  fn: (file, key) => ({ file: file!, key }),
  target: deleteKeyFx,
});

sample({
  clock: deleteKeyFx.done,
  target: refreshLocaleFile,
});
