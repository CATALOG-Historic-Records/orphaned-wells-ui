import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteRecordGroupRecordsDialogProps {
  open: boolean;
  onClose: () => void;
  onDeleteAll: () => void;
  onDeleteFiltered: () => void;
}

const DeleteRecordGroupRecordsDialog = (props: DeleteRecordGroupRecordsDialogProps) => {
  const { open, onClose, onDeleteAll, onDeleteFiltered } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Delete Records</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Choose whether to delete every record in this record group or only records matching the current table filters.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: "wrap" }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onDeleteFiltered} color="error" variant="outlined">
          Delete Currently Filtered
        </Button>
        <Button onClick={onDeleteAll} color="error" variant="contained">
          Delete All
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecordGroupRecordsDialog;
