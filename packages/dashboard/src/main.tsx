// Entry point for library build
export { App as Dashboard } from 'app/App';
export { apiClient } from 'shared/api/client';
export { MainPage } from 'pages/main';
export { LocaleList } from 'widgets/locale-list';
export { LocaleEditor } from 'widgets/locale-editor';
export { AddKeyForm } from 'features/add-key';
export {
  loadLocales,
  selectLocale,
  loadLocaleFile,
  refreshLocaleFile,
  $locales,
  $selectedLocale,
  $localeFile,
  $loading,
  $error,
} from 'entities/locale';
export type {
  LocaleFile,
  LocaleFileContent,
  DirectoryInfo,
} from 'shared/api/client';
