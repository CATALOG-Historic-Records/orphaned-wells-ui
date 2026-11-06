import { ReactNode, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
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
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ExportJob } from "../../types";
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
  title: string;
  jobs: ExportJob[];
  count: number;
  loading: boolean;
  page: number;
  onPage: (page: number) => void;
  onOpen: (job: ExportJob) => void;
  onDownloaded?: () => void;
  emptyMessage: string;
  filters?: ReactNode;
}

const ExportHistoryTable = ({
  title,
  jobs,
  count,
  loading,
  page,
  onPage,
  onOpen,
  onDownloaded,
  emptyMessage,
  filters,
}: Props) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = (jobId: string) => {
    setDownloadingId(jobId);
    setDownloadError("");
    triggerExportDownload(
      jobId,
      () => {
        setDownloadingId(null);
        onDownloaded?.();
      },
      (msg) => {
        setDownloadingId(null);
        setDownloadError(msg);
      }
    );
  };

  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{ minWidth: 0, borderRadius: 2, overflow: "hidden" }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" component="h3" fontWeight={600}>
          {title}
        </Typography>
        <Chip
          size="small"
          label={loading ? "…" : count}
          sx={{ height: 24, fontVariantNumeric: "tabular-nums" }}
        />
      </Stack>
      {filters}
      {downloadError && (
        <Alert
          severity="error"
          onClose={() => setDownloadError("")}
          sx={{ mx: 2, mb: 1 }}
        >
          {downloadError}
        </Alert>
      )}
      <Box sx={{ height: 3 }}>{loading && <LinearProgress sx={{ height: 3 }} />}</Box>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table
          size="small"
          aria-label={title}
          sx={{
            minWidth: 1100,
            tableLayout: "fixed",
            "& th": {
              bgcolor: "grey.50",
              color: "text.secondary",
              fontWeight: 600,
              whiteSpace: "nowrap",
            },
            "& td": { py: 1.5, verticalAlign: "middle" },
          }}
        >
          <colgroup>
            {[16, 19, 10, 13, 18, 8, 16].map((width, index) => (
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              {[
                "Submitted / requester",
                "Project / record group",
                "Formats",
                "Status",
                "Archive / progress",
                "Expires",
                "",
              ].map((heading) => (
                <TableCell key={heading}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!jobs.length && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ height: 88, textAlign: "center", color: "text.secondary" }}
                >
                  {loading ? "Loading exports…" : emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {jobs.map((job) => {
              const active = isActiveExportJob(job);
              const downloadable = canDownloadExport(job);
              const percent = job.progress?.percent ?? 0;
              return (
                <TableRow
                  key={job.job_id}
                  hover
                  data-cy={`export-job-row-${job.job_id}`}
                >
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2">
                      {exportTime(job.created_at)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {job.request_user?.email || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 240, overflowWrap: "anywhere" }}>
                    <Typography variant="body2" fontWeight={500}>
                      {job.project_id ? (
                        <Link
                          component={RouterLink}
                          to={`/project/${job.project_id}`}
                          color="inherit"
                          underline="hover"
                        >
                          {job.project_name || job.project_id}
                        </Link>
                      ) : (
                        job.project_name || "All Records"
                      )}
                    </Typography>
                    {job.record_group_id ? (
                      <Link
                        component={RouterLink}
                        to={`/record_group/${job.record_group_id}`}
                        variant="caption"
                        color="text.secondary"
                        underline="hover"
                      >
                        {job.record_group_name || job.record_group_id}
                      </Link>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {job.output_name ? `${job.output_name}.zip` : "Project export"}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatExportFormats(job)}
                    </Typography>
                    {job.options?.export_raw_values && (
                      <Typography variant="caption" color="text.secondary">
                        Raw values
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
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
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {job.status_text ||
                        (job.stage ? exportStageLabels[job.stage] || job.stage : "")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {active ? (
                      <Stack spacing={0.5}>
                        <LinearProgress
                          variant={percent > 0 ? "determinate" : "indeterminate"}
                          value={percent}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {job.progress?.total
                            ? `${job.progress.current} / ${job.progress.total} (${percent}%)`
                            : "Preparing export…"}
                        </Typography>
                      </Stack>
                    ) : job.artifact ? (
                      <>
                        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                          {job.artifact.filename}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatExportBytes(job.artifact.size_bytes)} ·{" "}
                          {job.artifact.record_count ?? 0} records
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="caption"
                        color={job.error ? "error.main" : "text.secondary"}
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {job.error || "—"}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography
                      variant="caption"
                      color={
                        job.status === "expired" ? "text.disabled" : "text.secondary"
                      }
                    >
                      {formatExportExpiration(job)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {downloadable && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<DownloadIcon fontSize="small" />}
                          disabled={downloadingId === job.job_id}
                          onClick={() => handleDownload(job.job_id)}
                          data-cy={`export-download-btn-${job.job_id}`}
                          sx={{
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            px: 1.5,
                          }}
                        >
                          {downloadingId === job.job_id ? "…" : "Download"}
                        </Button>
                      )}
                      <Button
                        size="small"
                        aria-label={`View export ${job.job_id}`}
                        onClick={() => onOpen(job)}
                        sx={{
                          textTransform: "none",
                          minWidth: 0,
                          whiteSpace: "nowrap",
                          px: 1,
                        }}
                      >
                        Details
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={loading ? -1 : count}
        page={
          loading ? page : Math.min(page, Math.max(0, Math.ceil(count / 25) - 1))
        }
        onPageChange={(_, next) => onPage(next)}
        rowsPerPage={25}
        rowsPerPageOptions={[25]}
        nextIconButtonProps={{ disabled: loading || (page + 1) * 25 >= count }}
        sx={{ "& .MuiTablePagination-toolbar": { minHeight: 48 } }}
      />
    </Paper>
  );
};

export default ExportHistoryTable;

