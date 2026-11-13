import { useEffect, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getProcessingJobHistory } from "../../services/app.service";
import {
  FilterOption,
  JobScopeProject,
  ProcessingJob,
  ProcessingJobHistory,
} from "../../types";
import { convertFiltersToMongoFormat } from "../../util";
import JobHistoryFilters, {
  JobHistoryChoiceFilterConfig,
} from "../JobHistoryScope/JobHistoryFilters";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import UploadHistoryTable from "./UploadHistoryTable";

const UPLOAD_CHOICE_FILTERS: JobHistoryChoiceFilterConfig[] = [
  {
    key: "status",
    label: "Status",
    allLabel: "All finished jobs",
    options: [
      { value: "completed", label: "Complete" },
      { value: "completed_with_errors", label: "Completed with errors" },
      { value: "error", label: "Failed" },
    ],
  },
  {
    key: "source_type",
    label: "Source",
    allLabel: "All sources",
    options: [
      { value: "directory", label: "Local directory" },
      { value: "gcs", label: "GCS batch" },
    ],
  },
];

interface Props {
  projects?: JobScopeProject[];
  projectsLoading?: boolean;
  projectId: string;
  recordGroupId: string;
  onScopeChange?: (projectId: string, recordGroupId: string) => void;
  revision: number;
  onOpen: (job: ProcessingJob) => void;
}

const UploadHistoryResults = ({
  projects = [],
  projectsLoading = false,
  projectId,
  recordGroupId,
  onScopeChange = () => {},
  revision,
  onOpen,
}: Props) => {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const effectiveFilters: FilterOption[] = debouncedSearch
    ? [
        ...filters,
        {
          key: "request_user.email",
          displayName: "Uploader",
          type: "string",
          operator: "contains",
          value: debouncedSearch,
        },
      ]
    : filters;

  const { data, loading, error, refresh } = useJobQuery<ProcessingJobHistory>(
    getProcessingJobHistory,
    [
      {
        page,
        active_page: 0,
        page_size: 25,
        ...(projectId ? { project_id: projectId } : {}),
        ...(recordGroupId ? { record_group_id: recordGroupId } : {}),
        filter: convertFiltersToMongoFormat(effectiveFilters),
      },
    ],
    (result) => result.active_count > 0
  );

  useEffect(() => {
    if (revision) refresh();
  }, [revision, refresh]);

  useEffect(() => {
    if (!data) return;
    if (page > 0 && page * 25 >= data.count) {
      setPage(Math.max(0, Math.ceil(data.count / 25) - 1));
    }
  }, [data, page]);

  const combinedJobs = [...(data?.active_jobs || []), ...(data?.jobs || [])];
  const finishedCount = data?.count || 0;
  const totalCount = (data?.active_count || 0) + finishedCount;

  return (
    <Stack spacing={2.5}>
      <JobHistoryFilters
        projects={projects}
        projectsLoading={projectsLoading}
        projectId={projectId}
        recordGroupId={recordGroupId}
        onScopeChange={(nextProj, nextGroup) => {
          setPage(0);
          onScopeChange(nextProj, nextGroup);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter by uploader email…"
        searchAriaLabel="Uploader"
        searchDataCy="upload-search-input"
        filters={filters}
        onApplyFilters={(nextFilters) => {
          setFilters(nextFilters);
          setPage(0);
        }}
        choiceFilters={UPLOAD_CHOICE_FILTERS}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="caption" color="text.secondary">
          {data?.active_count
            ? "Updates every 5 seconds while uploads are active."
            : "Newest uploads first."}
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          disabled={loading}
          sx={{ textTransform: "none", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          Refresh uploads
        </Button>
      </Stack>
      {error && (
        <Alert
          severity="error"
          action={<Button onClick={refresh}>Retry</Button>}
        >
          {error}
        </Alert>
      )}
      <UploadHistoryTable
        title="Uploads"
        jobs={combinedJobs}
        count={finishedCount}
        totalCount={totalCount}
        loading={loading}
        page={page}
        onPage={setPage}
        onOpen={onOpen}
        emptyMessage="No uploads match this selection."
      />
    </Stack>
  );
};

export default UploadHistoryResults;
