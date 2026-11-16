import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
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
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styles as sharedStyles } from "../../styles";
import { ProcessingJob } from "../../types";
import EmptyTable from "../EmptyTable/EmptyTable";
import TableLoading from "../TableLoading/TableLoading";
import { jobDuration, jobStatusLabels, jobTime } from "./jobPresentation";

type SortColumnKey =
  | "created_at"
  | "project_record_group"
  | "source"
  | "status"
  | "results"
  | "elapsed";

const COLUMNS: { key: SortColumnKey | "actions"; label: string; sortable: boolean }[] = [
  { key: "created_at", label: "Submitted / uploader", sortable: true },
  { key: "project_record_group", label: "Project / record group", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "results", label: "Results", sortable: true },
  { key: "elapsed", label: "Elapsed", sortable: true },
  { key: "actions", label: "", sortable: false },
];

interface Props {
  title: string;
  jobs: ProcessingJob[];
  count: number;
  totalCount?: number;
  loading: boolean;
  page: number;
  onPage: (page: number) => void;
  onOpen: (job: ProcessingJob) => void;
  emptyMessage: string;
}

const UploadHistoryTable = ({
  title,
  jobs,
  count,
  totalCount,
  loading,
  page,
  onPage,
  onOpen,
  emptyMessage,
}: Props) => {
  const [sortBy, setSortBy] = useState<SortColumnKey>("created_at");
  const [sortAscending, setSortAscending] = useState<1 | -1>(1);

  const handleSort = (key: SortColumnKey) => {
    if (sortBy === key) {
      setSortAscending((prev) => (prev === 1 ? -1 : 1));
    } else {
      setSortBy(key);
      setSortAscending(1);
    }
  };

  const sortedJobs = useMemo(() => {
    const copy = [...jobs];
    copy.sort((a, b) => {
      if (sortBy === "created_at") {
        const aVal = a.created_at || 0;
        const bVal = b.created_at || 0;
        return sortAscending === 1 ? bVal - aVal : aVal - bVal;
      }
      if (sortBy === "results") {
        const aVal = a.summary?.total_succeeded ?? 0;
        const bVal = b.summary?.total_succeeded ?? 0;
        return sortAscending === 1 ? bVal - aVal : aVal - bVal;
      }
      if (sortBy === "elapsed") {
        const aElapsed =
          a.started_at && a.completed_at ? a.completed_at - a.started_at : -1;
        const bElapsed =
          b.started_at && b.completed_at ? b.completed_at - b.started_at : -1;
        return sortAscending === 1 ? bElapsed - aElapsed : aElapsed - bElapsed;
      }
      let aStr = "";
      let bStr = "";
      if (sortBy === "project_record_group") {
        aStr = `${a.project_name || ""} ${a.record_group_name || ""}`.toLowerCase();
        bStr = `${b.project_name || ""} ${b.record_group_name || ""}`.toLowerCase();
      } else if (sortBy === "source") {
        aStr = a.input.upload_session_id ? "Local directory" : "GCS batch";
        bStr = b.input.upload_session_id ? "Local directory" : "GCS batch";
      } else if (sortBy === "status") {
        aStr = jobStatusLabels[a.status] || a.status;
        bStr = jobStatusLabels[b.status] || b.status;
      }
      if (aStr <= bStr) return sortAscending;
      if (aStr > bStr) return -1 * sortAscending;
      return 0;
    });
    return copy;
  }, [jobs, sortBy, sortAscending]);

  return (
    <Box component="section" sx={{ minWidth: 0 }}>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #F5F5F6" }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Chip
              size="small"
              label={loading && !jobs.length ? "…" : totalCount ?? count}
              sx={{ height: 24, fontVariantNumeric: "tabular-nums" }}
            />
          </Stack>
        </Box>
        <Table
          size="small"
          aria-label={title}
          sx={{
            minWidth: 1100,
            tableLayout: "fixed",
            "& td": { py: 1.5, verticalAlign: "middle" },
          }}
        >
          <colgroup>
            {[19, 20, 12, 19, 14, 8, 8].map((width, index) => (
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{ ...sharedStyles.headerRow, whiteSpace: "nowrap" }}
                >
                  {column.sortable ? (
                    <p
                      data-cy={`uploads-sort-${column.key}`}
                      style={{
                        margin: 0,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort(column.key as SortColumnKey)}
                    >
                      {column.key === sortBy && (
                        <IconButton size="small">
                          {sortAscending === 1 ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      )}
                      {column.label}
                    </p>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedJobs.map((job) => (
              <TableRow
                key={job.job_id}
                sx={{
                  "&:hover": {
                    background: "#efefef",
                  },
                }}
              >
                <TableCell sx={{ maxWidth: 220 }}>
                  <Typography variant="body2">{jobTime(job.created_at)}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {job.request_user.email}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 240, overflowWrap: "anywhere" }}>
                  <Typography variant="body2" fontWeight={500}>
                    {job.project_name || job.project_id || "Project unavailable"}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`/record_group/${job.record_group_id}`}
                    variant="caption"
                    color="text.secondary"
                    underline="hover"
                  >
                    {job.record_group_name || job.record_group_id}
                  </Link>
                </TableCell>
                <TableCell>
                  {job.input.upload_session_id ? "Local directory" : "GCS batch"}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={jobStatusLabels[job.status]}
                    color={
                      job.status === "error"
                        ? "error"
                        : job.status === "completed_with_errors"
                        ? "warning"
                        : job.status === "completed"
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell
                  sx={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}
                >
                  <Typography variant="body2">
                    {job.summary.total_succeeded} / {job.file_count ?? "?"} processed
                  </Typography>
                  <Typography
                    variant="caption"
                    color={
                      job.summary.total_failed ? "error.main" : "text.secondary"
                    }
                  >
                    {job.summary.total_failed} failed ·{" "}
                    {job.summary.total_skipped_duplicates} skipped
                  </Typography>
                  {job.file_count == null && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Pending discovery
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {jobDuration(job)}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    aria-label={`View upload ${job.job_id}`}
                    onClick={() => onOpen(job)}
                    sx={{ textTransform: "none", minWidth: 0 }}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {jobs.length > 0 && (
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
        )}
      </TableContainer>
      {loading && !jobs.length ? (
        <TableLoading />
      ) : !jobs.length ? (
        <EmptyTable title="No uploads found." message={emptyMessage} />
      ) : null}
    </Box>
  );
};

export default UploadHistoryTable;
