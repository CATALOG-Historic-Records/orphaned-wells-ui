import { useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { getExportHistoryProjects } from "../../services/app.service";
import { ExportJob, JobScopeProject } from "../../types";
import JobHistoryScope from "../JobHistoryScope/JobHistoryScope";
import { useJobQuery } from "../JobHistoryScope/useJobQuery";
import ExportHistoryResults from "./ExportHistoryResults";
import ExportJobDetails from "./ExportJobDetails";

const ExportHistoryPanel = () => {
  const [search, setSearch] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const projectId = search.get("project") || "";
  const recordGroupId = search.get("record_group") || "";
  const jobId = search.get("job");

  const {
    data: projects,
    loading,
    error,
    refresh,
  } = useJobQuery<JobScopeProject[]>(
    getExportHistoryProjects,
    [],
    () => false,
    "Unable to load export status. Please retry."
  );

  const changeScope = (project: string, group: string) => {
    const next = new URLSearchParams(search);
    next.delete("project");
    next.delete("record_group");
    next.delete("job");
    if (project) next.set("project", project);
    if (group) next.set("record_group", group);
    setSearch(next);
  };

  const openJob = (job: ExportJob) => {
    const next = new URLSearchParams(search);
    next.set("job", job.job_id);
    setSearch(next);
  };

  const closeJob = () => {
    const next = new URLSearchParams(search);
    next.delete("job");
    setSearch(next);
  };

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0, textAlign: "left" }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" component="h2">
          Export history
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track active and completed exports across your projects and record groups,
          and download completed archives.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Completed export archives remain available to download for 1 hour after
          completion.
        </Typography>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={refresh}>Retry</Button>}>
          {error}
        </Alert>
      )}
      <JobHistoryScope
        projects={projects || []}
        projectId={projectId}
        recordGroupId={recordGroupId}
        loading={loading && !projects}
        onChange={changeScope}
        noun="exports"
      />
      <ExportHistoryResults
        key={`${projectId}/${recordGroupId}`}
        projectId={projectId}
        recordGroupId={recordGroupId}
        revision={revision}
        onOpen={openJob}
      />
      {jobId && (
        <ExportJobDetails
          key={jobId}
          jobId={jobId}
          onClose={closeJob}
          onUpdated={() => setRevision((value) => value + 1)}
        />
      )}
    </Stack>
  );
};

export default ExportHistoryPanel;

