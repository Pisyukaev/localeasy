import { useState } from 'react';
import { useUnit } from 'effector-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import { $locales, $loading } from 'entities/locale';
import { addKeyToAll } from './model';

interface AddKeyToAllDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddKeyToAllDialog({ open, onClose }: AddKeyToAllDialogProps) {
  const [locales, loading] = useUnit([$locales, $loading]);

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [force, setForce] = useState(false);

  const handleSubmit = () => {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (!trimmedKey || !trimmedValue) {
      return;
    }

    addKeyToAll({ key: trimmedKey, value: trimmedValue, force });
    handleClose();
  };

  const handleClose = () => {
    setKey('');
    setValue('');
    setForce(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Key to All Files</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            This will add the key to all {locales.length} locale files
          </Typography>
          <TextField
            label="Key (e.g., common.hello)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            autoFocus
          />
          <TextField
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            multiline
            rows={3}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
                disabled={loading}
              />
            }
            label="Force overwrite if key exists"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={loading || !key.trim() || !value.trim()}
        >
          Add to All
        </Button>
      </DialogActions>
    </Dialog>
  );
}

