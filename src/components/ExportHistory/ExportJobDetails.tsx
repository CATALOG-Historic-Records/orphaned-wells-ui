import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { getExportJob } from "../../services/app.service";
import { ExportJob } from "../../types";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import {
  canDownloadExport,
  exportStageLabels,
  exportStatusLabels,
  exportTime,
  formatExportBytes,
  formatExportExpiration,
  formatExportFormats,
  isActiveExportJob,
  triggerExportDownload,
} from "./exportPresentation";

interface Props {
  jobId: string;
  onClose: () => void;
  onUpdated?: () => void;
}

const ExportJobDetails = ({ jobId, onClose, onUpdated }: Props) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  const {
    data: job,
    error,
    loading,
    refresh,
  } = useJobQuery<ExportJob>(
    getExportJob,
    [jobId],
    (result) => isActiveExportJob(result),
    "Unable to load export status. Please retry."
  );

  const handleDownload = () => {
    setDownloading(true);
    setDownloadError("");
    triggerExportDownload(
      jobId,
      () => {
        setDownloading(false);
        refresh();
        onUpdated?.();
      },
      (msg) => {
        setDownloading(false);
        setDownloadError(msg);
      }
    );
  };

  const active = isActiveExportJob(job);
  const downloadable = canDownloadExport(job);
  const percent = job?.progress?.percent ?? 0;

  return (
    <Dialog
      open
      onClose={downloading ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="export-details-title"
    >
      <DialogTitle id="export-details-title">Export details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
          Job ID: {jobId}
        </Typography>
        <Box sx={{ height: 4, my: 1 }}>{loading && <LinearProgress />}</Box>
        {(error || downloadError) && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {downloadError || error}
          </Alert>
        )}
        {job && (
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Chip
                size="small"
                label={exportStatusLabels[job.status] || job.status}
                color={
                  job.status === "error"
                    ? "error"
                    : job.status === "completed"
                    ? "success"
                    : job.status === "running"
                    ? "primary"
                    : "default"
                }
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                {job.status_text ||
                  (job.stage ? exportStageLabels[job.stage] || job.stage : "")}
              </Typography>
            </Stack>

            {active && (
              <Stack spacing={0.5}>
                <LinearProgress
                  variant={percent > 0 ? "determinate" : "indeterminate"}
                  value={percent}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {job.progress?.total
                    ? `${job.progress.current} / ${job.progress.total} (${percent}%)`
                    : "Export is running in the background…"}
                </Typography>
              </Stack>
            )}

            {job.error && (
              <Alert severity="error" sx={{ overflowWrap: "anywhere" }}>
                {job.error}
              </Alert>
            )}

            {job.status === "expired" && (
              <Alert severity="info">
                This export archive has expired. Exports are retained for 1 hour after
                completion. Start a new export from the project or record group to
                download again.
              </Alert>
            )}

            <Divider />

            <Stack spacing={0.75}>
              <Typography variant="subtitle2">Scope &amp; Options</Typography>
              <Typography variant="body2">
                <strong>Project:</strong>{" "}
                {job.project_id ? (
                  <Link to={`/project/${job.project_id}`}>
                    {job.project_name || job.project_id}
                  </Link>
                ) : (
                  job.project_name || "All Records"
                )}
              </Typography>
              {job.record_group_id && (
                <Typography variant="body2">
                  <strong>Record group:</strong>{" "}
                  <Link to={`/record_group/${job.record_group_id}`}>
                    {job.record_group_name || job.record_group_id}
                  </Link>
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Formats:</strong> {formatExportFormats(job)}
              </Typography>
              <Typography variant="body2">
                <strong>Values:</strong>{" "}
                {job.options?.export_raw_values
                  ? "Raw (uncleaned) values"
                  : "Cleaned values"}
              </Typography>
              {job.options?.document_types && job.options.document_types.length > 0 && (
                <Typography variant="body2">
                  <strong>Document types:</strong>{" "}
                  {job.options.document_types.join(", ")}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Requested by:</strong> {job.request_user?.email || "—"}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.75}>
              <Typography variant="subtitle2">Artifact &amp; Timing</Typography>
              <Typography variant="body2">
                <strong>Archive:</strong>{" "}
                {job.artifact?.filename || `${job.output_name || "records"}.zip`}
              </Typography>
              {job.artifact && (
                <Typography variant="body2">
                  <strong>Size / records:</strong>{" "}
                  {formatExportBytes(job.artifact.size_bytes)} ·{" "}
                  {job.artifact.record_count ?? 0} records
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Submitted:</strong> {exportTime(job.created_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Completed:</strong> {exportTime(job.completed_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Expiration:</strong> {exportTime(job.expires_at)} (
                {formatExportExpiration(job)})
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={refresh} disabled={loading || downloading}>
          Refresh
        </Button>
        {downloadable && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading}
            data-cy="export-details-download-btn"
          >
            {downloading ? "Starting download…" : "Download ZIP"}
          </Button>
        )}
        <Button onClick={onClose} disabled={downloading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportJobDetails;

