import { createStore, createEvent, createEffect, sample } from 'effector';

import { apiClient, type LocaleFile, type LocaleFileContent } from 'shared/api/client';

// Events
export const loadLocales = createEvent();
export const selectLocale = createEvent<string | null>();
export const loadLocaleFile = createEvent<string>();
export const refreshLocaleFile = createEvent();

// Effects
export const fetchLocalesFx = createEffect(apiClient.getLocales);

export const fetchLocaleFileFx = createEffect(apiClient.getLocaleFile);

// Stores
export const $locales = createStore<LocaleFile[]>([]);
export const $selectedLocale = createStore<string | null>(null);
export const $localeFile = createStore<LocaleFileContent | null>(null);
export const $loading = createStore(false);
export const $error = createStore<string | null>(null);

// Logic
$locales.on(fetchLocalesFx.doneData, (_, locales) => locales);

$selectedLocale.on(selectLocale, (_, locale) => locale);

$localeFile
  .on(fetchLocaleFileFx.doneData, (_, content) => content)
  .reset(selectLocale);

$loading
  .on(fetchLocalesFx.pending, (_, pending) => pending)
  .on(fetchLocaleFileFx.pending, (_, pending) => pending);

$error
  .on(fetchLocalesFx.failData, (_, error) => error instanceof Error ? error.message : String(error))
  .on(fetchLocaleFileFx.failData, (_, error) => error instanceof Error ? error.message : String(error))
  .reset([fetchLocalesFx, fetchLocaleFileFx]);

// Samples
sample({
  clock: loadLocales,
  target: fetchLocalesFx,
});

sample({
  clock: loadLocaleFile,
  target: fetchLocaleFileFx,
});

sample({
  clock: selectLocale,
  filter: (file): file is string => file !== null,
  target: fetchLocaleFileFx,
});

sample({
  clock: refreshLocaleFile,
  source: $selectedLocale,
  filter: (file): file is string => file !== null,
  target: fetchLocaleFileFx,
});

