import { getExportDownloadUrl } from "../../services/app.service";
import { ExportDownloadResponse, ExportJob } from "../../types";
import { callAPI } from "../../util";

export const EXPORT_JOBS_UPDATED_EVENT = "ogrre:export-jobs-updated";

export const notifyExportJobsUpdated = () => {
  window.dispatchEvent(new CustomEvent(EXPORT_JOBS_UPDATED_EVENT));
};

export const isActiveExportJob = (job?: ExportJob | null): boolean =>
  Boolean(job && ["queued", "dispatched", "running"].includes(job.status));

export const exportStatusLabels: Record<ExportJob["status"], string> = {
  queued: "Queued",
  dispatched: "Starting worker",
  running: "In progress",
  completed: "Complete",
  error: "Failed",
  expired: "Expired",
};

export const exportStageLabels: Record<string, string> = {
  queued: "Queued for export",
  dispatched: "Starting export worker",
  fetching_records: "Fetching records",
  collecting_records: "Collecting records",
  generating_csv: "Generating CSV",
  generating_json: "Generating JSON",
  generating_pdfs: "Generating searchable PDFs",
  calculating_size: "Preparing document images",
  packaging_archive: "Packaging export archive",
  uploading_export: "Uploading export archive",
  completed: "Ready for download",
  error: "Export failed",
  expired: "Export expired",
};

export const exportTime = (value?: number | null) =>
  value ? new Date(value * 1000).toLocaleString() : "—";

export const formatClockTime = (value?: number | null): string => {
  if (!value) return "—";
  return new Date(value * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatRelativeExportTime = (value?: number | null): string => {
  if (!value) return "—";
  const date = new Date(value * 1000);
  const now = new Date();
  const timeStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return `Today ${timeStr}`;
  if (diffDays === 1) return `Yesterday ${timeStr}`;
  const dateStr = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
  return `${dateStr}, ${timeStr}`;
};

export const formatExportBytes = (bytes?: number | null): string => {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

export const formatExportFormats = (
  job: ExportJob,
  separator = ", "
): string => {
  const opts = job.options || {};
  const labels: string[] = [];
  if (opts.export_csv) labels.push("CSV");
  if (opts.export_json) labels.push("JSON");
  if (opts.export_images) labels.push("Images");
  if (opts.export_embedded_pdfs) labels.push("Searchable PDFs");
  return labels.length ? labels.join(separator) : "—";
};

export const canDownloadExport = (job?: ExportJob | null): boolean => {
  if (!job || job.status !== "completed") return false;
  if (job.expires_at && job.expires_at * 1000 <= Date.now()) return false;
  return true;
};

export const isDirectApiExport = (job?: ExportJob | null): boolean =>
  Boolean(
    job &&
      job.export_source === "reviewed_records_api" &&
      job.status === "expired"
  );

export const isIncrementalReviewedExport = (job?: ExportJob | null): boolean =>
  Boolean(
    job &&
      (job.export_source === "reviewed_records_api" ||
        job.options?.until != null)
  );

export const formatExportExpiration = (job: ExportJob): string => {
  if (isDirectApiExport(job)) {
    return "Direct download";
  }
  if (job.status === "expired") return "Archive removed";
  if (job.status === "error") return job.error || "Export failed";
  if (isActiveExportJob(job)) return "1h after completion";
  if (!job.expires_at) return "—";
  const remainingSec = Math.floor(job.expires_at - Date.now() / 1000);
  if (remainingSec <= 0) return "Archive removed";
  if (remainingSec < 60) return `Expires in ${remainingSec} sec`;
  const minutes = Math.ceil(remainingSec / 60);
  return `Expires in ${minutes} min`;
};

export const triggerExportDownload = (
  jobId: string,
  onDone?: () => void,
  onError?: (message: string) => void
) => {
  callAPI(
    getExportDownloadUrl,
    [jobId],
    (result: ExportDownloadResponse) => {
      const link = document.createElement("a");
      link.href = result.download_url;
      if (result.filename) {
        link.download = result.filename;
      }
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      notifyExportJobsUpdated();
      onDone?.();
    },
    (failure) => {
      const message =
        typeof failure === "string"
          ? failure
          : failure?.detail || "Unable to download export file.";
      onError?.(message);
    }
  );
};

