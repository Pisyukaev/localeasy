import { useState } from 'react';
import { useUnit } from 'effector-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

import { $selectedLocale, $localeFile } from 'entities/locale';
import { addKey } from './model';

export function AddKeyForm() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [force, setForce] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLocale = useUnit($selectedLocale);
  const localeFile = useUnit($localeFile);
  const addKeyFn = useUnit(addKey);

  const existingKeys = localeFile?.data ? Object.keys(localeFile.data) : [];
  const keyExists = key && existingKeys.includes(key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;

    if (keyExists && !force) {
      setError('Key already exists. Check "Force overwrite" to replace it.');
      return;
    }

    try {
      addKeyFn({ key: key.trim(), value: value.trim(), force });
      setKey('');
      setValue('');
      setForce(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add key');
    }
  };

  if (!selectedLocale) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Key (e.g., common.hello)"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError(null);
              }}
              fullWidth
              size="small"
              error={Boolean(keyExists && !force)}
            />
            <TextField
              label="Value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              fullWidth
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!key.trim() || !value.trim()}
              sx={{ minWidth: 100 }}
            >
              Add
            </Button>
          </Stack>
          {keyExists && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={force}
                  onChange={(e) => {
                    setForce(e.target.checked);
                    setError(null);
                  }}
                />
              }
              label="Force overwrite"
            />
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Box>
    </Paper>
  );
}
