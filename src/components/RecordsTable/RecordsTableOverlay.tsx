import { Box, CircularProgress, Paper, Typography } from "@mui/material";

interface RecordsTableOverlayProps {
  message: string;
}

const RecordsTableOverlay = ({ message }: RecordsTableOverlayProps) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.78)",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          alignItems: "center",
          display: "flex",
          gap: 2,
          px: 3,
          py: 2,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body1">{message}</Typography>
      </Paper>
    </Box>
  );
};

export default RecordsTableOverlay;
