import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../components/Header/Header";
import ExportNotificationsMenuSection from "../components/Header/ExportNotificationsMenuSection";
import { HashRouter } from "react-router-dom";

test("header displays user name and email in profile dropdown menu", (): void => {
  const { container } = render(
    <HashRouter>
      <Header />
    </HashRouter>
  );

  const profileButton = container.querySelector('[data-cy="profile-menu-button"]');
  expect(profileButton).not.toBeNull();
  fireEvent.click(profileButton!);

  expect(screen.getByText("Test User")).toBeInTheDocument();
  expect(screen.getByText("test@example.com")).toBeInTheDocument();
});

test("avatar export notifications menu shows only active or unread exports", (): void => {
  render(
    <ExportNotificationsMenuSection
      notificationsData={{
        unread_count: 1,
        active_count: 1,
        notifications: [
          {
            job_id: "active-1",
            status: "running",
            location: "project",
            target_id: "proj-1",
            project_name: "Active Export Project",
            options: { export_csv: true },
          },
          {
            job_id: "unread-1",
            status: "completed",
            location: "project",
            target_id: "proj-2",
            project_name: "Unread Export Project",
            options: { export_csv: true },
            notification_read_at: null,
          },
          {
            job_id: "read-1",
            status: "completed",
            location: "project",
            target_id: "proj-3",
            project_name: "Already Read Export Project",
            options: { export_csv: true },
            notification_read_at: 1700000050,
          },
        ],
      }}
      onRefresh={jest.fn()}
      onNavigateToExports={jest.fn()}
    />
  );

  expect(screen.getByText("Active Export Project")).toBeInTheDocument();
  expect(screen.getByText("Unread Export Project")).toBeInTheDocument();
  expect(
    screen.queryByText("Already Read Export Project")
  ).not.toBeInTheDocument();
});
