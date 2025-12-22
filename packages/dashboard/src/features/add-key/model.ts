import { createEvent, createEffect, sample } from 'effector';

import { refreshLocaleFile, $selectedLocale } from 'entities/locale';
import { apiClient } from 'shared/api/client';

export interface AddKeyParams {
  key: string;
  value: string;
  force: boolean;
}

export const addKey = createEvent<AddKeyParams>();

export const addKeyFx = createEffect(apiClient.addKey);

sample({
  clock: addKey,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  fn: (file, params) => ({ file: file!, ...params }),
  target: addKeyFx,
});

sample({
  clock: addKeyFx.done,
  target: refreshLocaleFile,
});
