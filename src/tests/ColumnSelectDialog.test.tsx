import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ColumnSelectDialog from "../components/ColumnSelectDialog/ColumnSelectDialog";
import {
  createExportJob,
  getColumnData,
  getExportDownloadUrl,
  getExportJob,
} from "../services/app.service";

jest.mock("../services/app.service", () => ({
  createExportJob: jest.fn(),
  getColumnData: jest.fn(),
  getExportJob: jest.fn(),
  getExportDownloadUrl: jest.fn(),
}));

jest.mock("../usercontext", () => ({
  useUserContext: () => ({
    user: { collaborator: "rrc" },
    hasPermission: () => true,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("shows an export failure, permits retry, and displays status and download after job creation", async () => {
  const onClose = jest.fn();
  (getColumnData as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({ columns: ["record_notes"], obj: { name: "Test group" } }),
  });
  (createExportJob as jest.Mock).mockResolvedValueOnce({
    status: 500,
    json: async () => ({ detail: "Export worker unavailable" }),
  });

  render(
    <MemoryRouter>
      <ColumnSelectDialog
        open
        onClose={onClose}
        location="record_group"
        handleUpdate={jest.fn()}
        _id="group"
        appliedFilters={[]}
        sortBy="dateCreated"
        sortAscending={1}
      />
    </MemoryRouter>
  );

  const exportButton = screen.getByRole("button", { name: "Export Data" });
  await waitFor(() => expect(exportButton).toBeEnabled());
  fireEvent.click(exportButton);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "unable to export: Export worker unavailable"
  );
  expect(onClose).not.toHaveBeenCalled();
  expect(exportButton).toBeEnabled();

  const completedJob = {
    job_id: "job-123",
    status: "completed",
    stage: "completed",
    status_text: "Export ready for download",
    location: "record_group",
    target_id: "group",
    output_name: "Test group",
    request_user: { email: "user@example.com" },
    options: { export_json: true },
    artifact: {
      filename: "Test group.zip",
      size_bytes: 1024,
      record_count: 2,
    },
    created_at: 1000,
    completed_at: 1005,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };
  (createExportJob as jest.Mock).mockResolvedValueOnce({
    status: 200,
    json: async () => completedJob,
  });
  (getExportJob as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => completedJob,
  });
  (getExportDownloadUrl as jest.Mock).mockResolvedValueOnce({
    status: 200,
    json: async () => ({
      job_id: "job-123",
      download_url: "https://storage.example/Test%20group.zip",
      filename: "Test group.zip",
    }),
  });

  const click = jest
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  try {
    fireEvent.click(exportButton);
    const downloadZipBtn = await screen.findByRole("button", {
      name: "Download ZIP",
    });
    expect(downloadZipBtn).toBeEnabled();
    expect(createExportJob).toHaveBeenCalledTimes(2);

    fireEvent.click(downloadZipBtn);
    await waitFor(() => expect(getExportDownloadUrl).toHaveBeenCalledWith("job-123"));
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
  } finally {
    click.mockRestore();
  }
});

test("shows reconstruct original document checkbox only when location is project and collaborator is rrc", async () => {
  const originalCollaborator = process.env.REACT_APP_COLLABORATOR;
  process.env.REACT_APP_COLLABORATOR = "rrc";
  const onClose = jest.fn();
  (getColumnData as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({ columns: ["record_notes"], obj: { name: "Test Project" } }),
  });

  try {
    const { rerender } = render(
      <MemoryRouter>
        <ColumnSelectDialog
          open
          onClose={onClose}
          location="record_group"
          handleUpdate={jest.fn()}
          _id="group"
          appliedFilters={[]}
          sortBy="dateCreated"
          sortAscending={1}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText("Reconstruct original document page order")
    ).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ColumnSelectDialog
          open
          onClose={onClose}
          location="project"
          handleUpdate={jest.fn()}
          _id="project123"
          appliedFilters={[]}
          sortBy="dateCreated"
          sortAscending={1}
        />
      </MemoryRouter>
    );

    const checkbox = await screen.findByLabelText(
      "Reconstruct original document page order"
    );
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const queuedJob = {
      job_id: "job-proj",
      status: "queued",
      location: "project",
      target_id: "project123",
      request_user: { email: "user@example.com" },
      options: { export_json: true, reconstruct_original_doc: true },
      created_at: 1000,
    };
    (createExportJob as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: async () => queuedJob,
    });
    (getExportJob as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => queuedJob,
    });

    const exportButton = screen.getByRole("button", { name: "Export Data" });
    await waitFor(() => expect(exportButton).toBeEnabled());
    fireEvent.click(exportButton);

    await waitFor(() => expect(createExportJob).toHaveBeenCalled());
    const callArgs = (createExportJob as jest.Mock).mock.calls[
      (createExportJob as jest.Mock).mock.calls.length - 1
    ];
    expect(callArgs[0]).toBe("project");
    expect(callArgs[4].reconstruct_original_doc).toBe(true);
  } finally {
    process.env.REACT_APP_COLLABORATOR = originalCollaborator;
  }
});

test("shows export raw OCR read values checkbox and passes export_raw_values flag when checked", async () => {
  const onClose = jest.fn();
  (getColumnData as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({ columns: ["record_notes"], obj: { name: "Test Group" } }),
  });

  render(
    <MemoryRouter>
      <ColumnSelectDialog
        open
        onClose={onClose}
        location="record_group"
        handleUpdate={jest.fn()}
        _id="rg123"
        appliedFilters={[]}
        sortBy="dateCreated"
        sortAscending={1}
      />
    </MemoryRouter>
  );

  const rawCheckbox = await screen.findByLabelText(
    "Export raw OCR read values for all fields"
  );
  expect(rawCheckbox).toBeInTheDocument();
  expect(rawCheckbox).not.toBeChecked();

  fireEvent.click(rawCheckbox);
  expect(rawCheckbox).toBeChecked();

  const queuedJob = {
    job_id: "job-raw",
    status: "queued",
    location: "record_group",
    target_id: "rg123",
    request_user: { email: "user@example.com" },
    options: { export_json: true, export_raw_values: true },
    created_at: 1000,
  };
  (createExportJob as jest.Mock).mockResolvedValueOnce({
    status: 200,
    json: async () => queuedJob,
  });
  (getExportJob as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => queuedJob,
  });

  const exportButton = screen.getByRole("button", { name: "Export Data" });
  await waitFor(() => expect(exportButton).toBeEnabled());
  fireEvent.click(exportButton);

  await waitFor(() => expect(createExportJob).toHaveBeenCalled());
  const callArgs = (createExportJob as jest.Mock).mock.calls[
    (createExportJob as jest.Mock).mock.calls.length - 1
  ];
  expect(callArgs[4].export_raw_values).toBe(true);
});
