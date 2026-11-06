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

export const formatExportFormats = (job: ExportJob): string => {
  const opts = job.options || {};
  const types = opts.export_types || {};
  const labels: string[] = [];
  if (opts.export_csv ?? types.csv) labels.push("CSV");
  if (opts.export_json ?? types.json) labels.push("JSON");
  if (opts.export_images ?? types.images) labels.push("Images");
  if (opts.export_embedded_pdfs ?? types.embedded_pdfs) labels.push("Searchable PDFs");
  return labels.length ? labels.join(", ") : "—";
};

export const canDownloadExport = (job?: ExportJob | null): boolean => {
  if (!job || job.status !== "completed") return false;
  if (job.expires_at && job.expires_at * 1000 <= Date.now()) return false;
  return true;
};

export const formatExportExpiration = (job: ExportJob): string => {
  if (job.status === "expired") return "Expired";
  if (job.status === "error") return "—";
  if (isActiveExportJob(job)) return "1h after completion";
  if (!job.expires_at) return "—";
  const remainingSec = Math.floor(job.expires_at - Date.now() / 1000);
  if (remainingSec <= 0) return "Expired";
  if (remainingSec < 60) return `${remainingSec}s left`;
  const minutes = Math.ceil(remainingSec / 60);
  return `${minutes}m left`;
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

