import { MainPage } from 'pages/main';
import { ThemeProviderWrapper } from './providers';

export function App() {
  return (
    <ThemeProviderWrapper>
      <MainPage />
    </ThemeProviderWrapper>
  );
}
