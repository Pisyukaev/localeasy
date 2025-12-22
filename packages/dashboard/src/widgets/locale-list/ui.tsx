import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';

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
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    <Paper sx={styles.paper}>
      <Box sx={styles.header}>
        <Typography variant="h6">Locale Files</Typography>
        <IconButton size="small" onClick={handleLoadLocales} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {loading && locales.length === 0 ? (
        <Box sx={styles.loading}>
          <CircularProgress size={24} />
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
    </Paper>
  );
}
