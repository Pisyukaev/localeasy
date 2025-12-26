import { useState, type ChangeEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface DeleteKeyDialogProps {
  open: boolean;
  keyToDelete: string | null;
  onClose: () => void;
  onConfirm: ({ key, force }: { key: string; force: boolean }) => void;
  loading?: boolean;
}

export function DeleteKeyDialog({
  open,
  keyToDelete,
  onClose,
  onConfirm,
  loading = false,
}: DeleteKeyDialogProps) {
  const [force, setForce] = useState(false);

  const handleChangeForce = (e: ChangeEvent<HTMLInputElement>) => {
    setForce(e.target.checked);
  };

  const handleConfirm = () => {
    onConfirm({ key: keyToDelete!, force });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Key</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete key &quot;{keyToDelete}&quot;?
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={force} onChange={handleChangeForce} />}
            label="Force delete"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
