import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Theme } from '@mui/material/styles';

import {
  loadLocales,
  selectLocale,
  $locales,
  $selectedLocale,
  $loading,
  $error,
  type LocaleFile,
} from 'entities/locale';

const styles = {
  paper: {
    width: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    p: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawer: {
    width: (theme: Theme) => theme.spacing(30),
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: (theme: Theme) => theme.spacing(30),
      boxSizing: 'border-box',
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    p: 3,
  },
  noLocales: {
    p: 2,
    textAlign: 'center',
    color: 'text.secondary',
  },
  localeList: {
    flex: 1,
    overflow: 'auto',
  },
};

export function LocaleList() {
  const [locales, selectedLocale, loading, error] = useUnit([
    $locales,
    $selectedLocale,
    $loading,
    $error,
  ]);

  const handleSelectLocale = (locale: LocaleFile) => () =>
    selectLocale(selectedLocale === locale.code ? null : locale.code);

  const handleLoadLocales = () => loadLocales();

  useEffect(() => {
    handleLoadLocales();
  }, []);

  return (
    <Drawer variant="permanent" sx={styles.drawer}>
      <Toolbar />
      <Box sx={styles.header}>
        <Typography variant="h6">Locale Files</Typography>
        <IconButton size="small" onClick={handleLoadLocales} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <Divider />

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {loading && locales.length === 0 ? (
        <Box sx={styles.loading}>
          <LinearProgress />
        </Box>
      ) : locales.length === 0 ? (
        <Box sx={styles.noLocales}>No locale files found</Box>
      ) : (
        <List sx={styles.localeList}>
          {locales.map((locale) => (
            <ListItem key={locale.code} disablePadding>
              <ListItemButton
                selected={selectedLocale === locale.code}
                onClick={handleSelectLocale(locale)}
              >
                <ListItemText primary={locale.code} secondary={locale.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
}
