import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';

import { LocaleList } from 'widgets/locale-list';
import { LocaleEditor } from 'widgets/locale-editor';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  appBar: {
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  editor: {
    flex: 1,
    overflow: 'hidden',
  },
};

export function MainPage() {
  return (
    <Box sx={styles.container}>
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div">
            LocalEasy Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={styles.content}>
        <LocaleList />
        <Box sx={styles.editor}>
          <LocaleEditor />
        </Box>
      </Box>
    </Box>
  );
}
