import { useState } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { getExportHistoryProjects } from "../../services/app.service";
import { ExportJob, JobScopeProject } from "../../types";
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
    "Unable to load export scopes. Please retry."
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
      {error && (
        <Alert severity="error" action={<Button onClick={refresh}>Retry</Button>}>
          {error}
        </Alert>
      )}
      <ExportHistoryResults
        projects={projects || []}
        projectsLoading={loading && !projects}
        projectId={projectId}
        recordGroupId={recordGroupId}
        onScopeChange={changeScope}
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
