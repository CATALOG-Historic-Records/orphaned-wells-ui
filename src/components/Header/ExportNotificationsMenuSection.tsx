import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { markExportNotificationsRead } from "../../services/app.service";
import { ExportJob, ExportNotificationsResponse } from "../../types";
import { callAPI } from "../../util";
import {
  canDownloadExport,
  exportStatusLabels,
  formatExportExpiration,
  isActiveExportJob,
  triggerExportDownload,
} from "../ExportHistory/exportPresentation";

interface Props {
  notificationsData?: ExportNotificationsResponse;
  onRefresh: () => void;
  onNavigateToExports: (jobId?: string) => void;
}

const ExportNotificationsMenuSection = ({
  notificationsData,
  onRefresh,
  onNavigateToExports,
}: Props) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const items = (notificationsData?.notifications || [])
    .filter(
      (job) =>
        isActiveExportJob(job) ||
        (["completed", "error", "expired"].includes(job.status) &&
          !job.notification_read_at)
    )
    .slice(0, 4);
  const unreadCount = notificationsData?.unread_count || 0;

  const handleMarkAllRead = (event: React.MouseEvent) => {
    event.stopPropagation();
    callAPI(
      markExportNotificationsRead,
      [{ mark_all: true }],
      () => onRefresh(),
      () => {}
    );
  };

  const handleDownload = (event: React.MouseEvent, job: ExportJob) => {
    event.stopPropagation();
    setDownloadingId(job.job_id);
    triggerExportDownload(
      job.job_id,
      () => {
        setDownloadingId(null);
        onRefresh();
      },
      () => {
        setDownloadingId(null);
      }
    );
  };

  return (
    <Box data-cy="profile-menu-exports-section" sx={{ minWidth: 280, maxWidth: 340 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, pt: 1, pb: 0.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            EXPORTS
          </Typography>
          {unreadCount > 0 && (
            <Chip
              size="small"
              color="primary"
              label={`${unreadCount} new`}
              sx={{ height: 18, fontSize: "0.7rem" }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={0.5}>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              data-cy="mark-all-exports-read-btn"
              sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: 0, px: 0.75 }}
            >
              Mark read
            </Button>
          )}
          <Button
            size="small"
            onClick={() => onNavigateToExports()}
            data-cy="profile-menu-view-all-exports"
            sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: 0, px: 0.75 }}
          >
            View all
          </Button>
        </Stack>
      </Stack>

      {items.length === 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ px: 2, pb: 1 }}
        >
          No new export notifications.
        </Typography>
      ) : (
        <Stack spacing={0.5} sx={{ px: 1.5, pb: 1 }}>
          {items.map((job) => {
            const active = isActiveExportJob(job);
            const downloadable = canDownloadExport(job);
            const unread =
              !active &&
              ["completed", "error", "expired"].includes(job.status) &&
              !job.notification_read_at;
            const percent = job.progress?.percent ?? 0;
            const scopeLabel =
              job.record_group_name ||
              job.project_name ||
              job.output_name ||
              "Export";

            return (
              <Box
                key={job.job_id}
                onClick={() => onNavigateToExports(job.job_id)}
                data-cy={`export-notification-item-${job.job_id}`}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: unread ? "action.selected" : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight={unread ? 600 : 500}
                    noWrap
                    sx={{ maxWidth: 180 }}
                  >
                    {scopeLabel}
                  </Typography>
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
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                </Stack>
                {active && (
                  <LinearProgress
                    variant={percent > 0 ? "determinate" : "indeterminate"}
                    value={percent}
                    sx={{ height: 4, borderRadius: 1, mt: 0.75 }}
                  />
                )}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {active
                      ? job.status_text || "Running…"
                      : formatExportExpiration(job)}
                  </Typography>
                  {downloadable && (
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<DownloadIcon fontSize="inherit" />}
                      disabled={downloadingId === job.job_id}
                      onClick={(event) => handleDownload(event, job)}
                      data-cy={`notification-download-btn-${job.job_id}`}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                        py: 0,
                        px: 0.75,
                        minWidth: 0,
                      }}
                    >
                      Download
                    </Button>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
      <Divider />
    </Box>
  );
};

export default ExportNotificationsMenuSection;

