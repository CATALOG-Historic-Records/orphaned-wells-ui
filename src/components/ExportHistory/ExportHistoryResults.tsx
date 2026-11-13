import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import {
  cancelExportJob,
  getExportJobHistory,
} from "../../services/app.service";
import {
  ExportJob,
  ExportJobHistory,
  FilterOption,
  JobScopeProject,
} from "../../types";
import { callAPI, convertFiltersToMongoFormat } from "../../util";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import JobHistoryFilters, {
  JobHistoryChoiceFilterConfig,
} from "../JobHistoryScope/JobHistoryFilters";
import ExportHistoryTable from "./ExportHistoryTable";
import {
  EXPORT_JOBS_UPDATED_EVENT,
  exportStageLabels,
  formatClockTime,
  formatExportFormats,
  notifyExportJobsUpdated,
} from "./exportPresentation";

const EXPORT_CHOICE_FILTERS: JobHistoryChoiceFilterConfig[] = [
  {
    key: "status",
    label: "Status",
    allLabel: "All statuses",
    options: [
      { value: "completed", label: "Ready" },
      { value: "error", label: "Failed" },
      { value: "expired", label: "Expired" },
    ],
  },
];

interface Props {
  projects: JobScopeProject[];
  projectsLoading: boolean;
  projectId: string;
  recordGroupId: string;
  onScopeChange: (projectId: string, recordGroupId: string) => void;
  revision: number;
  onOpen: (job: ExportJob) => void;
}

const ExportHistoryResults = ({
  projects,
  projectsLoading,
  projectId,
  recordGroupId,
  onScopeChange,
  revision,
  onOpen,
}: Props) => {
  const [viewScope, setViewScope] = useState<"mine" | "team">("mine");
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, loading, error, refresh } = useJobQuery<ExportJobHistory>(
    getExportJobHistory,
    [
      {
        page,
        active_page: 0,
        page_size: 25,
        view_scope: viewScope,
        ...(projectId ? { project_id: projectId } : {}),
        ...(recordGroupId ? { record_group_id: recordGroupId } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        filter: convertFiltersToMongoFormat(filters),
      },
    ],
    (result) => result.active_count > 0,
    "Unable to load export status. Please retry."
  );

  useEffect(() => {
    if (revision) refresh();
  }, [revision, refresh]);

  useEffect(() => {
    const handleUpdated = () => refresh();
    window.addEventListener(EXPORT_JOBS_UPDATED_EVENT, handleUpdated);
    return () =>
      window.removeEventListener(EXPORT_JOBS_UPDATED_EVENT, handleUpdated);
  }, [refresh]);

  useEffect(() => {
    if (!data) return;
    if (page > 0 && page * 25 >= data.count) {
      setPage(Math.max(0, Math.ceil(data.count / 25) - 1));
    }
  }, [data, page]);

  const handleCancelJob = (jobId: string) => {
    setCancelingId(jobId);
    setCancelError("");
    callAPI(
      cancelExportJob,
      [jobId],
      () => {
        setCancelingId(null);
        notifyExportJobsUpdated();
        refresh();
      },
      (failure) => {
        setCancelingId(null);
        const msg =
          typeof failure === "string"
            ? failure
            : failure?.detail || "Unable to cancel export.";
        setCancelError(msg);
      }
    );
  };

  const activeJobs = data?.active_jobs || [];
  const activeCount = data?.active_count || 0;

  return (
    <Stack spacing={3}>
      {/* Top description + Refresh button */}
      {/* <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
      >
        <Typography variant="body2" color="text.secondary">
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<RefreshIcon fontSize="small" />}
          onClick={refresh}
          disabled={loading}
          data-cy="refresh-exports-button"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            borderColor: "divider",
            bgcolor: "background.paper",
            px: 1.5,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Refresh
        </Button>
      </Stack> */}

      {/* Filter Bar */}
      <JobHistoryFilters
        projects={projects}
        projectsLoading={projectsLoading}
        projectId={projectId}
        recordGroupId={recordGroupId}
        onScopeChange={(nextProj, nextGroup) => {
          setPage(0);
          onScopeChange(nextProj, nextGroup);
        }}
        viewScope={viewScope}
        onViewScopeChange={(nextScope) => {
          setViewScope(nextScope);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search file, record group, requester…"
        searchAriaLabel="Search exports"
        searchDataCy="export-search-input"
        filters={filters}
        onApplyFilters={(nextFilters) => {
          setFilters(nextFilters);
          setPage(0);
        }}
        choiceFilters={EXPORT_CHOICE_FILTERS}
      />

      {(error || cancelError) && (
        <Alert
          severity="error"
          onClose={cancelError ? () => setCancelError("") : undefined}
          action={
            error ? <Button onClick={refresh}>Retry</Button> : undefined
          }
        >
          {cancelError || error}
        </Alert>
      )}

      {/* IN PROGRESS section */}
      {activeCount > 0 && (
        <Box component="section">
          <Stack
            direction="row"
            alignItems="baseline"
            spacing={0.75}
            sx={{ mb: 1.25 }}
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
              In progress
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {activeCount}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {activeJobs.map((job) => {
              const isRunning = job.status === "running";
              const percent = job.progress?.percent ?? 0;
              const title =
                job.output_name ||
                job.record_group_name ||
                job.project_name ||
                "Export";
              const subtitleParts = [
                job.project_name || "All Records",
                formatExportFormats(job, " + "),
                `started ${formatClockTime(job.started_at || job.created_at)}`,
              ];
              if (viewScope === "team" && job.request_user?.email) {
                subtitleParts.push(job.request_user.email);
              }
              const rightProgressText = job.progress?.total
                ? `${job.progress.current} of ${job.progress.total} records`
                : isRunning
                ? job.status_text ||
                  (job.stage ? exportStageLabels[job.stage] || job.stage : "Preparing export…")
                : "Waiting for a worker";

              return (
                <Paper
                  key={job.job_id}
                  variant="outlined"
                  data-cy={`export-active-card-${job.job_id}`}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "grey.50",
                    borderColor: "divider",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
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
                        {title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {subtitleParts.join(" · ")}
                      </Typography>
                    </Box>
                    <Tooltip title="Cancel export">
                      <IconButton
                        size="small"
                        aria-label={`Cancel export ${job.job_id}`}
                        disabled={cancelingId === job.job_id}
                        onClick={() => handleCancelJob(job.job_id)}
                        sx={{ mt: -0.5, mr: -0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <LinearProgress
                    variant={
                      isRunning
                        ? percent > 0
                          ? "determinate"
                          : "indeterminate"
                        : "determinate"
                    }
                    value={isRunning ? percent : 0}
                    sx={{
                      height: 5,
                      borderRadius: 99,
                      my: 1.5,
                      bgcolor: "grey.200",
                    }}
                  />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: isRunning ? "primary.main" : "text.disabled",
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={isRunning ? "primary.main" : "text.secondary"}
                      >
                        {isRunning ? "Exporting" : "Queued"}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {rightProgressText}
                    </Typography>
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}

      {/* HISTORY section */}
      <ExportHistoryTable
        jobs={data?.jobs || []}
        count={data?.count || 0}
        loading={loading}
        page={page}
        onPage={setPage}
        onOpen={onOpen}
        onChanged={refresh}
        showRequester={viewScope === "team"}
        emptyMessage={
          filters.length || debouncedSearch || projectId || recordGroupId
            ? "No finished exports match these filters."
            : viewScope === "mine"
            ? "You don't have any finished exports yet."
            : "No finished exports yet."
        }
      />
    </Stack>
  );
};

export default ExportHistoryResults;
