import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExportHistoryPanel from "../components/ExportHistory/ExportHistoryPanel";
import {
  cancelExportJob,
  getExportDownloadUrl,
  getExportHistoryProjects,
  getExportJob,
  getExportJobHistory,
  rerunExportJob,
} from "../services/app.service";

vi.mock("../services/app.service", () => ({
  getExportHistoryProjects: vi.fn(),
  getExportJobHistory: vi.fn(),
  getExportJob: vi.fn(),
  getExportDownloadUrl: vi.fn(),
  rerunExportJob: vi.fn(),
  cancelExportJob: vi.fn(),
}));

const response = (body: unknown) => ({ status: 200, json: async () => body });

const activeJob = {
  job_id: "export-active-1",
  status: "running",
  stage: "generating_csv",
  status_text: "Generating CSV...",
  location: "record_group",
  target_id: "rg-1",
  project_id: "proj-1",
  project_name: "Project Alpha",
  record_group_id: "rg-1",
  record_group_name: "Alpha Logs",
  output_name: "Alpha_Logs_Running",
  request_user: { email: "researcher@example.com" },
  options: { export_csv: true, export_json: true },
  progress: { current: 10, total: 20, percent: 50 },
  created_at: 1700000100,
  started_at: 1700000105,
};

const finishedJob = {
  job_id: "export-1",
  status: "completed",
  stage: "completed",
  status_text: "Export ready for download",
  location: "record_group",
  target_id: "rg-1",
  project_id: "proj-1",
  project_name: "Project Alpha",
  record_group_id: "rg-1",
  record_group_name: "Alpha Logs",
  output_name: "Alpha_Logs",
  request_user: { email: "researcher@example.com" },
  options: { export_csv: true, export_json: true, export_raw_values: true },
  artifact: {
    filename: "Alpha_Logs.zip",
    size_bytes: 2048,
    record_count: 15,
  },
  created_at: 1700000000,
  completed_at: 1700000010,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

const expiredJob = {
  job_id: "export-expired-1",
  status: "expired",
  stage: "expired",
  status_text: "Export file expired after 1 hour",
  location: "record_group",
  target_id: "rg-1",
  project_id: "proj-1",
  project_name: "Project Alpha",
  record_group_id: "rg-1",
  record_group_name: "Alpha Logs",
  output_name: "Alpha_Logs_Old",
  request_user: { email: "researcher@example.com" },
  options: { export_csv: true },
  artifact: {
    filename: "Alpha_Logs_Old.zip",
    size_bytes: 1024,
    record_count: 8,
  },
  created_at: 1699990000,
  completed_at: 1699990010,
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("renders in-progress cards and history table, downloads completed archive, reruns expired job, and opens details", async () => {
  (getExportHistoryProjects as jest.Mock).mockResolvedValue(
    response([
      {
        id: "proj-1",
        name: "Project Alpha",
        record_groups: [{ id: "rg-1", name: "Alpha Logs" }],
      },
    ])
  );
  (getExportJobHistory as jest.Mock).mockResolvedValue(
    response({
      active_jobs: [activeJob],
      active_count: 1,
      jobs: [finishedJob, expiredJob],
      count: 2,
    })
  );
  (getExportJob as jest.Mock).mockResolvedValue(response(finishedJob));
  (getExportDownloadUrl as jest.Mock).mockResolvedValue(
    response({
      job_id: "export-1",
      download_url: "https://storage.example/Alpha_Logs.zip",
      filename: "Alpha_Logs.zip",
    })
  );
  (rerunExportJob as jest.Mock).mockResolvedValue(response(activeJob));
  (cancelExportJob as jest.Mock).mockResolvedValue(
    response({ ...activeJob, status: "error", error: "Canceled by user" })
  );

  render(
    <MemoryRouter initialEntries={["/exports"]}>
      <ExportHistoryPanel />
    </MemoryRouter>
  );

  expect(await screen.findByText("Alpha_Logs_Running")).toBeInTheDocument();
  expect(screen.getByText("10 of 20 records")).toBeInTheDocument();
  expect(screen.getByText("Alpha_Logs.zip")).toBeInTheDocument();
  expect(screen.getByText("CSV + JSON")).toBeInTheDocument();
  expect(screen.getByText(/2\.0 KB · 15 records/)).toBeInTheDocument();

  const click = jest
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  try {
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    await waitFor(() =>
      expect(getExportDownloadUrl).toHaveBeenCalledWith("export-1")
    );
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
  } finally {
    click.mockRestore();
  }

  fireEvent.click(screen.getByRole("button", { name: "Run again" }));
  await waitFor(() =>
    expect(rerunExportJob).toHaveBeenCalledWith("export-expired-1")
  );

  fireEvent.click(screen.getByRole("button", { name: "View export export-1" }));
  expect(await screen.findByText("Export details")).toBeInTheDocument();
  expect(await screen.findByText(/Raw \(uncleaned\) values/)).toBeInTheDocument();
});
