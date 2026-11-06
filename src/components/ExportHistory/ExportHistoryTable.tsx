import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { rerunExportJob } from "../../services/app.service";
import { ExportJob } from "../../types";
import { callAPI } from "../../util";
import {
  canDownloadExport,
  formatExportBytes,
  formatExportExpiration,
  formatExportFormats,
  formatRelativeExportTime,
  notifyExportJobsUpdated,
  triggerExportDownload,
} from "./exportPresentation";

interface Props {
  jobs: ExportJob[];
  count: number;
  loading: boolean;
  page: number;
  pageSize?: number;
  onPage: (page: number) => void;
  onOpen: (job: ExportJob) => void;
  onChanged?: () => void;
  emptyMessage: string;
  showRequester?: boolean;
}

const ExportHistoryTable = ({
  jobs,
  count,
  loading,
  page,
  pageSize = 25,
  onPage,
  onOpen,
  onChanged,
  emptyMessage,
  showRequester = false,
}: Props) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [rerunningId, setRerunningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleDownload = (jobId: string) => {
    setDownloadingId(jobId);
    setActionError("");
    triggerExportDownload(
      jobId,
      () => {
        setDownloadingId(null);
        onChanged?.();
      },
      (msg) => {
        setDownloadingId(null);
        setActionError(msg);
      }
    );
  };

  const handleRerun = (jobId: string) => {
    setRerunningId(jobId);
    setActionError("");
    callAPI(
      rerunExportJob,
      [jobId],
      () => {
        setRerunningId(null);
        notifyExportJobsUpdated();
        onChanged?.();
      },
      (failure) => {
        setRerunningId(null);
        const msg =
          typeof failure === "string"
            ? failure
            : failure?.detail || "Unable to rerun export.";
        setActionError(msg);
      }
    );
  };

  const startIndex = count === 0 ? 0 : page * pageSize + 1;
  const endIndex = Math.min(count, (page + 1) * pageSize);
  const canPrev = !loading && page > 0;
  const canNext = !loading && (page + 1) * pageSize < count;

  return (
    <Box component="section" sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        alignItems="baseline"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography
          variant="caption"
          component="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          History
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Newest first
        </Typography>
      </Stack>

      {actionError && (
        <Alert
          severity="error"
          onClose={() => setActionError("")}
          sx={{ mb: 1.5 }}
        >
          {actionError}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          minWidth: 0,
          borderRadius: 2,
          overflow: "hidden",
          borderColor: "divider",
        }}
      >
        <Box sx={{ height: 3 }}>
          {loading && <LinearProgress sx={{ height: 3 }} />}
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            aria-label="Export history"
            sx={{
              minWidth: 920,
              tableLayout: "fixed",
              "& th": {
                bgcolor: "background.paper",
                color: "text.secondary",
                fontWeight: 500,
                fontSize: "0.75rem",
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "divider",
                whiteSpace: "nowrap",
              },
              "& td": {
                py: 1.75,
                verticalAlign: "middle",
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& tbody tr:last-of-type td": {
                borderBottom: "none",
              },
            }}
          >
            <colgroup>
              {[34, 24, 12, 16, 14].map((width, index) => (
                <col key={index} style={{ width: `${width}%` }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Archive</TableCell>
                <TableCell>Project / record group</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!jobs.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      height: 96,
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    {loading ? "Loading exports…" : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
              {jobs.map((job) => {
                const downloadable = canDownloadExport(job);
                const isFailed = job.status === "error";
                const archiveTitle =
                  job.artifact?.filename ||
                  (job.output_name
                    ? isFailed
                      ? job.output_name
                      : `${job.output_name}.zip`
                    : "export.zip");

                const iconBg = downloadable
                  ? "rgba(46, 125, 50, 0.1)"
                  : isFailed
                  ? "rgba(211, 47, 47, 0.1)"
                  : "grey.100";
                const iconColor = downloadable
                  ? "success.main"
                  : isFailed
                  ? "error.main"
                  : "text.secondary";

                const timeLabel = formatRelativeExportTime(
                  job.completed_at || job.created_at
                );
                const archiveMetaParts = [timeLabel];
                if (isFailed) {
                  if (job.progress?.total) {
                    archiveMetaParts.push(
                      `Stopped at ${job.progress.current} of ${job.progress.total} records`
                    );
                  } else {
                    archiveMetaParts.push("Export failed");
                  }
                } else if (job.artifact) {
                  archiveMetaParts.push(
                    formatExportBytes(job.artifact.size_bytes),
                    `${job.artifact.record_count ?? 0} records`
                  );
                }
                if (showRequester && job.request_user?.email) {
                  archiveMetaParts.push(job.request_user.email);
                }

                const dotColor = downloadable
                  ? "success.main"
                  : isFailed
                  ? "error.main"
                  : "text.disabled";
                const availabilityTitle = downloadable
                  ? "Ready"
                  : isFailed
                  ? "Failed"
                  : "Expired";

                return (
                  <TableRow
                    key={job.job_id}
                    hover
                    data-cy={`export-job-row-${job.job_id}`}
                  >
                    {/* Archive */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: iconBg,
                            color: iconColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Inventory2OutlinedIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            onClick={() => onOpen(job)}
                            sx={{
                              cursor: "pointer",
                              overflowWrap: "anywhere",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {archiveTitle}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ overflowWrap: "anywhere" }}
                          >
                            {archiveMetaParts.join(" · ")}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Project / record group */}
                    <TableCell sx={{ overflowWrap: "anywhere" }}>
                      {job.record_group_id ? (
                        <Link
                          component={RouterLink}
                          to={`/record_group/${job.record_group_id}`}
                          variant="body2"
                          fontWeight={500}
                          color="text.primary"
                          underline="hover"
                          display="block"
                        >
                          {job.record_group_name || job.record_group_id}
                        </Link>
                      ) : (
                        <Typography variant="body2" fontWeight={500}>
                          {job.project_name || "All Records"}
                        </Typography>
                      )}
                      {job.project_id ? (
                        <Link
                          component={RouterLink}
                          to={`/project/${job.project_id}`}
                          variant="caption"
                          color="text.secondary"
                          underline="hover"
                          display="block"
                        >
                          {job.project_name || job.project_id}
                        </Link>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Team export
                        </Typography>
                      )}
                    </TableCell>

                    {/* Format */}
                    <TableCell>
                      <Chip
                        size="small"
                        label={formatExportFormats(job, " + ")}
                        sx={{
                          height: 24,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          bgcolor: "grey.100",
                          color: "text.primary",
                          borderRadius: 1.5,
                        }}
                      />
                      {job.options?.export_raw_values && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.25 }}
                        >
                          Raw values
                        </Typography>
                      )}
                    </TableCell>

                    {/* Availability */}
                    <TableCell>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: dotColor,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: dotColor }}
                        >
                          {availabilityTitle}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatExportExpiration(job)}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {downloadable ? (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<DownloadIcon fontSize="small" />}
                            disabled={downloadingId === job.job_id}
                            onClick={() => handleDownload(job.job_id)}
                            data-cy={`export-download-btn-${job.job_id}`}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              px: 1.5,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {downloadingId === job.job_id ? "…" : "Download"}
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            disabled={rerunningId === job.job_id}
                            onClick={() => handleRerun(job.job_id)}
                            data-cy={`export-rerun-btn-${job.job_id}`}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              px: 1.5,
                              fontWeight: 500,
                              borderColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {rerunningId === job.job_id ? "Starting…" : "Run again"}
                          </Button>
                        )}
                        <Tooltip title="Export details">
                          <IconButton
                            size="small"
                            aria-label={`View export ${job.job_id}`}
                            onClick={() => onOpen(job)}
                          >
                            <MoreHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer: Showing X–Y of Z and < > buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.5, px: 0.5 }}
      >
        <Typography variant="caption" color="text.secondary">
          Showing {startIndex}–{endIndex} of {count}
        </Typography>
        <Stack direction="row" spacing={0.75}>
          <IconButton
            size="small"
            aria-label="Previous page"
            disabled={!canPrev}
            onClick={() => onPage(page - 1)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 0.5,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Next page"
            disabled={!canNext}
            onClick={() => onPage(page + 1)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 0.5,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExportHistoryTable;
