import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExportHistoryPanel from "../components/ExportHistory/ExportHistoryPanel";
import {
  getExportDownloadUrl,
  getExportHistoryProjects,
  getExportJob,
  getExportJobHistory,
} from "../services/app.service";

jest.mock("../services/app.service", () => ({
  getExportHistoryProjects: jest.fn(),
  getExportJobHistory: jest.fn(),
  getExportJob: jest.fn(),
  getExportDownloadUrl: jest.fn(),
}));

const response = (body: unknown) => ({ status: 200, json: async () => body });

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

beforeEach(() => {
  jest.clearAllMocks();
});

test("renders export history, downloads completed archive, and opens job details", async () => {
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
      active_jobs: [],
      active_count: 0,
      jobs: [finishedJob],
      count: 1,
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

  render(
    <MemoryRouter initialEntries={["/exports"]}>
      <ExportHistoryPanel />
    </MemoryRouter>
  );

  expect(await screen.findByText("Alpha_Logs.zip")).toBeInTheDocument();
  expect(screen.getByText("CSV, JSON")).toBeInTheDocument();
  expect(screen.getByText("2.0 KB · 15 records")).toBeInTheDocument();

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

  fireEvent.click(screen.getByRole("button", { name: "View export export-1" }));
  expect(await screen.findByText("Export details")).toBeInTheDocument();
  expect(await screen.findByText(/Raw \(uncleaned\) values/)).toBeInTheDocument();
});
