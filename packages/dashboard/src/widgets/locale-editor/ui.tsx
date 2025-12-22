import { useState } from 'react';
import { useUnit } from 'effector-react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  $selectedLocale,
  $localeFile,
  $loading,
  $error,
} from 'entities/locale';
import { sortKeys } from 'features/sort-keys';
import { editKey, editKeyAndName } from 'features/edit-key';
import { deleteKey, DeleteKeyDialog } from 'features/delete-key';
import { AddKeyForm } from 'features/add-key';
import { AddKeyToAllForm } from 'features/add-key-to-all';

export function LocaleEditor() {
  const [selectedLocale, localeFile, loading, error] = useUnit([
    $selectedLocale,
    $localeFile,
    $loading,
    $error,
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editKeyName, setEditKeyName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  if (!selectedLocale) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        Select a locale file to view and edit
      </Box>
    );
  }

  if (loading && !localeFile) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !localeFile) {
    return (
      <Box sx={{ flex: 1, p: 2 }}>
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

  const handleDeleteConfirm = () => {
    if (keyToDelete) {
      deleteKey(keyToDelete);
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">{selectedLocale}</Typography>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={() => sortKeys()}
            disabled={loading}
          >
            Sort Keys
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        <AddKeyToAllForm />
        <AddKeyForm />

        {keys.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            No keys in this file
          </Paper>
        ) : (
          <Stack spacing={2}>
            {keys.map((key) => (
              <Paper key={key} sx={{ p: 2 }}>
                {editingKey === key ? (
                  <Stack spacing={2}>
                    <TextField
                      label="Key"
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
                    <TextField
                      label="Value"
                      fullWidth
                      multiline
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        setEditError(null);
                      }}
                      size="small"
                    />
                    {editError && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {editError}
                      </Alert>
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={handleEditSave}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleEditCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontFamily: 'monospace', mb: 1 }}
                      >
                        {key}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                      >
                        {localeFile.data[key]}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
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
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <DeleteKeyDialog
        open={deleteDialogOpen}
        keyToDelete={keyToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </Box>
  );
}
