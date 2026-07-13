import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ChangeTeamDialogProps {
  open: boolean;
  teams: string[];
  currentTeam?: string;
  allowCustomTeam?: boolean;
  loading: boolean;
  error: string;
  onClose: () => void;
  onChangeTeam: (team: string) => void;
}

const ChangeTeamDialog = ({
  open,
  teams,
  currentTeam,
  allowCustomTeam = true,
  loading,
  error,
  onClose,
  onChangeTeam,
}: ChangeTeamDialogProps) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [customTeam, setCustomTeam] = useState("");

  const sortedTeams = useMemo(() => {
    const teamSet = new Set(teams);
    if (currentTeam) teamSet.add(currentTeam);
    return Array.from(teamSet).sort((a, b) => a.localeCompare(b));
  }, [teams, currentTeam]);

  useEffect(() => {
    if (!open) return;
    setSelectedTeam(currentTeam || "");
    setCustomTeam("");
  }, [open, currentTeam]);

  const targetTeam = customTeam.trim() || selectedTeam;

  const handleSelectedTeamChange = (event: SelectChangeEvent<string>) => {
    setSelectedTeam(event.target.value);
    setCustomTeam("");
  };

  const handleCustomTeamChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!allowCustomTeam) return;
    setCustomTeam(event.target.value);
    if (event.target.value !== "") setSelectedTeam("");
  };

  const handleSubmit = () => {
    if (!targetTeam || loading) return;
    onChangeTeam(targetTeam);
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
          Change Team
        </Typography>
        {currentTeam && (
          <Typography component="div" sx={{ color: "#6B7280", fontSize: "13px", mt: 0.5 }}>
            Current team: {currentTeam}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="change-team-select-label">Existing Team</InputLabel>
            <Select
              labelId="change-team-select-label"
              value={selectedTeam}
              label="Existing Team"
              onChange={handleSelectedTeamChange}
            >
              <MenuItem value="">
                <em>Select a team</em>
              </MenuItem>
              {sortedTeams.map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {allowCustomTeam && (
            <Box>
              <Typography sx={{ color: "#6B7280", fontSize: "13px", mb: 1 }}>
                Or create a team
              </Typography>
              <TextField
                fullWidth
                label="New Team Name"
                value={customTeam}
                onChange={handleCustomTeamChange}
                disabled={loading}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!targetTeam || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Change Team
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeTeamDialog;
