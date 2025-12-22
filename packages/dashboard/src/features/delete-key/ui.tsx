import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface DeleteKeyDialogProps {
  open: boolean;
  keyToDelete: string | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteKeyDialog({
  open,
  keyToDelete,
  onClose,
  onConfirm,
  loading = false,
}: DeleteKeyDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Key</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete key &quot;{keyToDelete}&quot;?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
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
