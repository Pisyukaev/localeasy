import { useState, type ChangeEvent } from 'react';
import { useUnit } from 'effector-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';

import { $locales, $loading } from 'entities/locale';
import { addKeyToAll } from './model';

const styles = {
  paper: {
    p: 2,
    mb: 2,
    border: 1,
    borderColor: 'primary.main',
    borderStyle: 'dashed',
  },
};

export function AddKeyToAllForm() {
  const [locales, loading] = useUnit([$locales, $loading]);

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [force, setForce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ key: string; count: number } | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (!trimmedKey || !trimmedValue) {
      return;
    }

    setError(null);
    setSuccess(null);
    addKeyToAll({ key: trimmedKey, value: trimmedValue, force });
    setSuccess({ key: trimmedKey, count: locales.length });
    setKey('');
    setValue('');
    setForce(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'key': {
        setKey(e.target.value);
        break;
      }
      case 'value': {
        setValue(e.target.value);
        break;
      }
      default:
        break;
    }

    setError(null);
    setSuccess(null);
  };

  const handleChangeForce = (e: ChangeEvent<HTMLInputElement>) => {
    setForce(e.target.checked);
    setError(null);
  };

  if (locales.length === 0) {
    return null;
  }

  return (
    <Paper sx={styles.paper}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Add Key to All Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will add the key to all {locales.length} locale files
          </Typography>
        </Box>
        <Divider />
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                type="text"
                label="Key (e.g., common.hello)"
                value={key}
                name="key"
                onChange={handleChangeInput}
                fullWidth
                size="small"
                disabled={loading}
              />
              <TextField
                type="text"
                label="Value"
                value={value}
                name="value"
                onChange={handleChangeInput}
                fullWidth
                size="small"
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={loading || !key.trim() || !value.trim()}
                sx={{ minWidth: 120 }}
              >
                Add to All
              </Button>
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={force}
                  onChange={handleChangeForce}
                  disabled={loading}
                />
              }
              label="Force overwrite if key exists"
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">
                Key &quot;{success.key}&quot; successfully added to all
                {success.count} files
              </Alert>
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
