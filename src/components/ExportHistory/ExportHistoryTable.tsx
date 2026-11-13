import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { rerunExportJob } from "../../services/app.service";
import { styles as sharedStyles } from "../../styles";
import { ExportJob } from "../../types";
import { callAPI } from "../../util";
import EmptyTable from "../EmptyTable/EmptyTable";
import TableLoading from "../TableLoading/TableLoading";
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

  return (
    <Box component="section" sx={{ minWidth: 0 }}>
      {actionError && (
        <Alert
          severity="error"
          onClose={() => setActionError("")}
          sx={{ mb: 1.5 }}
        >
          {actionError}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table
          size="small"
          aria-label="Export history"
          sx={{
            minWidth: 650,
            tableLayout: "fixed",
            "& td": {
              py: 1.5,
              verticalAlign: "middle",
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
              <TableCell sx={sharedStyles.headerRow}>Archive</TableCell>
              <TableCell sx={sharedStyles.headerRow}>Project / record group</TableCell>
              <TableCell sx={sharedStyles.headerRow}>Format</TableCell>
              <TableCell sx={sharedStyles.headerRow}>Availability</TableCell>
              <TableCell sx={sharedStyles.headerRow} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  data-cy={`export-job-row-${job.job_id}`}
                  sx={{
                    "&:hover": {
                      background: "#efefef",
                    },
                  }}
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
        {jobs.length > 0 && (
          <TablePagination
            component="div"
            count={loading ? -1 : count}
            page={
              loading
                ? page
                : Math.min(page, Math.max(0, Math.ceil(count / pageSize) - 1))
            }
            onPageChange={(_, next) => onPage(next)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
            nextIconButtonProps={{
              disabled: loading || (page + 1) * pageSize >= count,
            }}
            sx={{ "& .MuiTablePagination-toolbar": { minHeight: 48 } }}
          />
        )}
      </TableContainer>
      {loading && !jobs.length ? (
        <TableLoading />
      ) : !jobs.length ? (
        <EmptyTable title="No exports found." message={emptyMessage} />
      ) : null}
    </Box>
  );
};

export default ExportHistoryTable;
