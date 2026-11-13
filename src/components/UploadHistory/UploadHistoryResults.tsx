import { useEffect, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getProcessingJobHistory } from "../../services/app.service";
import { FilterOption, ProcessingJob, ProcessingJobHistory } from "../../types";
import { convertFiltersToMongoFormat } from "../../util";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import UploadHistoryFilters from "./UploadHistoryFilters";
import UploadHistoryTable from "./UploadHistoryTable";

interface Props {
  projectId: string;
  recordGroupId: string;
  revision: number;
  onOpen: (job: ProcessingJob) => void;
}

const UploadHistoryResults = ({projectId, recordGroupId, revision, onOpen}: Props) => {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [page, setPage] = useState(0);
  const {data, loading, error, refresh} = useJobQuery<ProcessingJobHistory>(getProcessingJobHistory, [{
    page, active_page: 0, page_size: 25,
    ...(projectId ? {project_id: projectId} : {}),
    ...(recordGroupId ? {record_group_id: recordGroupId} : {}),
    filter: convertFiltersToMongoFormat(filters),
  }], (result) => result.active_count > 0);
  useEffect(() => {if (revision) refresh();}, [revision, refresh]);
  useEffect(() => {
    if (!data) return;
    if (page > 0 && page * 25 >= data.count) setPage(Math.max(0, Math.ceil(data.count / 25) - 1));
  }, [data, page]);

  const combinedJobs = [...(data?.active_jobs || []), ...(data?.jobs || [])];
  const finishedCount = data?.count || 0;
  const totalCount = (data?.active_count || 0) + finishedCount;

  return <Stack spacing={2.5}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
      <Typography variant="caption" color="text.secondary">{data?.active_count ? "Updates every 5 seconds while uploads are active." : "Newest uploads first."}</Typography>
      <Button size="small" startIcon={<RefreshIcon />} onClick={refresh} disabled={loading} sx={{textTransform: "none", flexShrink: 0, whiteSpace: "nowrap"}}>Refresh uploads</Button>
    </Stack>
    {error && <Alert severity="error" action={<Button onClick={refresh}>Retry</Button>}>{error}</Alert>}
    <UploadHistoryTable title="Uploads" jobs={combinedJobs} count={finishedCount} totalCount={totalCount} loading={loading} page={page} onPage={setPage} onOpen={onOpen} emptyMessage="No uploads match this selection."
      filters={<UploadHistoryFilters onApply={(next) => {setFilters(next); setPage(0);}} />} />
  </Stack>;
};

export default UploadHistoryResults;
