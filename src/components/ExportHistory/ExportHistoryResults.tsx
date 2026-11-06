import { useEffect, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getExportJobHistory } from "../../services/app.service";
import { ExportJob, ExportJobHistory, FilterOption } from "../../types";
import { convertFiltersToMongoFormat } from "../../util";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import ExportHistoryFilters from "./ExportHistoryFilters";
import ExportHistoryTable from "./ExportHistoryTable";
import { EXPORT_JOBS_UPDATED_EVENT } from "./exportPresentation";

interface Props {
  projectId: string;
  recordGroupId: string;
  revision: number;
  onOpen: (job: ExportJob) => void;
}

const ExportHistoryResults = ({
  projectId,
  recordGroupId,
  revision,
  onOpen,
}: Props) => {
  const [viewScope, setViewScope] = useState<"mine" | "team">("mine");
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [page, setPage] = useState(0);

  const { data, loading, error, refresh } = useJobQuery<ExportJobHistory>(
    getExportJobHistory,
    [
      {
        page,
        page_size: 25,
        view_scope: viewScope,
        ...(projectId ? { project_id: projectId } : {}),
        ...(recordGroupId ? { record_group_id: recordGroupId } : {}),
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

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="caption" color="text.secondary">
          {data?.active_count
            ? "Updates every 5 seconds while exports are running. Export files remain available for 1 hour after completion."
            : "Newest exports first. Completed export archives are available for 1 hour."}
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          disabled={loading}
          data-cy="refresh-exports-button"
          sx={{ textTransform: "none", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          Refresh exports
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={refresh}>Retry</Button>}>
          {error}
        </Alert>
      )}
      <ExportHistoryTable
        title="Exports"
        jobs={data?.jobs || []}
        count={data?.count || 0}
        loading={loading}
        page={page}
        onPage={setPage}
        onOpen={onOpen}
        onDownloaded={refresh}
        emptyMessage="No exports match this selection."
        filters={
          <ExportHistoryFilters
            viewScope={viewScope}
            onViewScopeChange={(nextScope) => {
              setViewScope(nextScope);
              setPage(0);
            }}
            onApply={(next) => {
              setFilters(next);
              setPage(0);
            }}
          />
        }
      />
    </Stack>
  );
};

export default ExportHistoryResults;

