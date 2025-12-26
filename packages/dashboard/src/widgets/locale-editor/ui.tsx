import { useState } from 'react';
import { useUnit } from 'effector-react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Tooltip from '@mui/material/Tooltip';

import {
  $selectedLocale,
  $localeFile,
  $loading,
  $error,
  $locales,
} from 'entities/locale';
import { sortKeys } from 'features/sort-keys';
import { editKey, editKeyAndName } from 'features/edit-key';
import { deleteKey, DeleteKeyDialog } from 'features/delete-key';
import { AddKeyForm } from 'features/add-key';
import { AddKeyToAllDialog } from 'features/add-key-to-all';

const styles = {
  fallback: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  error: {
    flex: 1,
    p: 2,
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  toolbar: {
    p: 2,
    justifyContent: 'space-between',
  },
  chip: {
    fontFamily: 'monospace',
    fontWeight: 600,
  },
  paper: {
    p: 3,
    textAlign: 'center',
    color: 'text.secondary',
  },
  tableContainer: {
    flex: 1,
    overflow: 'auto',
  },
  keyCell: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  valueCell: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  actionsCell: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    width: 120,
  },
};

export function LocaleEditor() {
  const [selectedLocale, localeFile, loading, error, locales] = useUnit([
    $selectedLocale,
    $localeFile,
    $loading,
    $error,
    $locales,
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editKeyName, setEditKeyName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [addToAllDialogOpen, setAddToAllDialogOpen] = useState(false);

  if (!selectedLocale) {
    return (
      <Box sx={styles.fallback}>Select a locale file to view and edit</Box>
    );
  }

  if (loading && !localeFile) {
    return (
      <Box sx={styles.fallback}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !localeFile) {
    return (
      <Box sx={styles.error}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!localeFile) {
    return null;
  }

  const keys = Object.keys(localeFile.data);

  const handleEditStart = (key: string) => {
    setEditingKey(key);
    setEditKeyName(key);
    setEditValue(localeFile.data[key] || '');
    setEditError(null);
  };

  const handleEditCancel = () => {
    setEditingKey(null);
    setEditKeyName('');
    setEditValue('');
    setEditError(null);
  };

  const handleEditSave = async () => {
    if (!editingKey) return;

    setEditError(null);

    const keyChanged = editKeyName !== editingKey;

    if (keyChanged) {
      // Check if new key already exists
      const existingKeys = Object.keys(localeFile.data);
      if (existingKeys.includes(editKeyName) && editKeyName !== editingKey) {
        setEditError(`Key "${editKeyName}" already exists`);
        return;
      }

      if (!editKeyName.trim()) {
        setEditError('Key cannot be empty');
        return;
      }

      editKeyAndName({
        oldKey: editingKey,
        newKey: editKeyName.trim(),
        value: editValue,
      });
    } else {
      editKey({ key: editingKey, value: editValue });
    }

    setEditingKey(null);
    setEditKeyName('');
    setEditValue('');
    setEditError(null);
  };

  const handleDeleteClick = (key: string) => {
    setKeyToDelete(key);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = ({
    key,
    force,
  }: {
    key: string;
    force: boolean;
  }) => {
    if (keyToDelete) {
      deleteKey({ key, force });
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Toolbar />
      <Toolbar sx={styles.toolbar}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LanguageIcon color="action" />
          <Chip label={selectedLocale} size="small" sx={styles.chip} />
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Add key to all files">
            <IconButton
              size="small"
              onClick={() => setAddToAllDialogOpen(true)}
              disabled={loading || locales.length === 0}
              color="primary"
            >
              <PostAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sort keys alphabetically">
            <IconButton
              size="small"
              onClick={() => sortKeys()}
              disabled={loading}
              color="primary"
            >
              <SortIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Divider />

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <AddKeyForm />

      <Box
        sx={{
          p: 2,
          overflow: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {keys.length === 0 ? (
          <Paper sx={styles.paper}>No keys in this file</Paper>
        ) : (
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table stickyHeader aria-label="locale keys table">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.keyCell}>Key</TableCell>
                  <TableCell sx={styles.valueCell}>Value</TableCell>
                  <TableCell align="right" sx={styles.actionsCell}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key} hover>
                    {editingKey === key ? (
                      <>
                        <TableCell>
                          <TextField
                            value={editKeyName}
                            onChange={(e) => {
                              setEditKeyName(e.target.value);
                              setEditError(null);
                            }}
                            size="small"
                            fullWidth
                            error={!!editError}
                            sx={{ fontFamily: 'monospace' }}
                            autoFocus
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value);
                              setEditError(null);
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleEditSave}
                              disabled={loading}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={handleEditCancel}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                          </Stack>
                          {editError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {editError}
                            </Alert>
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {key}
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            maxWidth: 400,
                          }}
                        >
                          {localeFile.data[key]}
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEditStart(key)}
                              disabled={loading}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(key)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <DeleteKeyDialog
        open={deleteDialogOpen}
        keyToDelete={keyToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />

      <AddKeyToAllDialog
        open={addToAllDialogOpen}
        onClose={() => setAddToAllDialogOpen(false)}
      />
    </Box>
  );
}
