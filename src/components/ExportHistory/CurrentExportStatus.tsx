import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getExportJob } from "../../services/app.service";
import { ExportJob } from "../../types";
import { useProcessingQuery } from "../UploadHistory/useProcessingQuery";
import {
  canDownloadExport,
  exportStageLabels,
  exportStatusLabels,
  formatExportBytes,
  formatExportExpiration,
  formatExportFormats,
  isActiveExportJob,
  notifyExportJobsUpdated,
  triggerExportDownload,
} from "./exportPresentation";

interface Props {
  initialJob: ExportJob;
  onCloseDialog: () => void;
}

const CurrentExportStatus = ({ initialJob, onCloseDialog }: Props) => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const { data: liveJob, error } = useProcessingQuery<ExportJob>(
    getExportJob,
    [initialJob.job_id],
    (result) => isActiveExportJob(result),
    "Unable to load export status. Please retry."
  );

  const job = liveJob || initialJob;
  const active = isActiveExportJob(job);
  const downloadable = canDownloadExport(job);
  const percent = job.progress?.percent ?? 0;

  useEffect(() => {
    if (liveJob && !isActiveExportJob(liveJob)) {
      notifyExportJobsUpdated();
    }
  }, [liveJob]);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadError("");
    triggerExportDownload(
      job.job_id,
      () => setDownloading(false),
      (msg) => {
        setDownloading(false);
        setDownloadError(msg);
      }
    );
  };

  const handleViewInExports = () => {
    onCloseDialog();
    navigate(`/exports?job=${encodeURIComponent(job.job_id)}`);
  };

  return (
    <Paper
      variant="outlined"
      data-cy="export-job-status-panel"
      sx={{ p: 2.5, borderRadius: 2, bgcolor: "grey.50" }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {active
                ? "Export running in background"
                : job.status === "completed"
                ? "Export ready for download"
                : "Export status"}
            </Typography>
            <Chip
              size="small"
              data-cy="export-job-status-chip"
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
          </Stack>
          <Button
            size="small"
            endIcon={<OpenInNewIcon fontSize="small" />}
            onClick={handleViewInExports}
            data-cy="view-in-exports-button"
            sx={{ textTransform: "none" }}
          >
            View in Exports
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {active
            ? "You can close this dialog and continue using OGRRE while your export is prepared. You will be notified in the top-right profile menu when it is ready."
            : job.status === "completed"
            ? `Your export archive (${
                job.artifact?.filename || `${job.output_name || "records"}.zip`
              }) is ready. Download links remain valid for 1 hour (${formatExportExpiration(
                job
              )}).`
            : "Review the export status below."}
        </Typography>

        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
            {job.status_text ||
              (job.stage ? exportStageLabels[job.stage] || job.stage : "")}
          </Typography>
          {active && (
            <Stack spacing={0.5}>
              <LinearProgress
                variant={percent > 0 ? "determinate" : "indeterminate"}
                value={percent}
                sx={{ height: 8, borderRadius: 1 }}
              />
              {job.progress?.total ? (
                <Typography variant="caption" color="text.secondary">
                  {job.progress.current} / {job.progress.total} ({percent}%)
                </Typography>
              ) : null}
            </Stack>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          sx={{ color: "text.secondary" }}
        >
          <Typography variant="caption">
            <strong>Formats:</strong> {formatExportFormats(job)}
          </Typography>
          {job.artifact && (
            <Typography variant="caption">
              <strong>Size:</strong> {formatExportBytes(job.artifact.size_bytes)} (
              {job.artifact.record_count ?? 0} records)
            </Typography>
          )}
        </Stack>

        {(error || downloadError || job.error) && (
          <Alert severity="error">{downloadError || job.error || error}</Alert>
        )}

        {downloadable && (
          <Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={downloading}
              data-cy="export-ready-download-button"
            >
              {downloading ? "Starting download…" : "Download ZIP"}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default CurrentExportStatus;

