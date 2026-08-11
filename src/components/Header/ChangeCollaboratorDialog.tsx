import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ChangeCollaboratorDialogProps {
  open: boolean;
  currentCollaborator?: string;
  loading: boolean;
  error: string;
  onClose: () => void;
  onChangeCollaborator: (collaborator: string) => void;
}

const ChangeCollaboratorDialog = ({
  open,
  currentCollaborator,
  loading,
  error,
  onClose,
  onChangeCollaborator,
}: ChangeCollaboratorDialogProps) => {
  const [collaborator, setCollaborator] = useState("");

  useEffect(() => {
    if (!open) return;
    setCollaborator(currentCollaborator || "");
  }, [open, currentCollaborator]);

  const targetCollaborator = collaborator.trim();

  const handleCollaboratorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCollaborator(event.target.value);
  };

  const handleSubmit = () => {
    if (!targetCollaborator || loading) return;
    onChangeCollaborator(targetCollaborator);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #EEF2F7",
        }}
      >
        <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
          Change Collaborator
        </Typography>
        {currentCollaborator && (
          <Typography component="div" sx={{ color: "#6B7280", fontSize: "13px", mt: 0.5 }}>
            Current collaborator: {currentCollaborator}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            autoFocus
            label="Collaborator"
            value={collaborator}
            onChange={handleCollaboratorChange}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!targetCollaborator || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Change Collaborator
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeCollaboratorDialog;
