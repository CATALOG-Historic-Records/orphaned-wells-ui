import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Header from "../components/Header/Header";
import { HashRouter } from "react-router-dom";
import * as appService from "../services/app.service";

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

test("header opens API Keys dialog and supports creating and revoking a key", async (): Promise<void> => {
  const mockJsonResponse = (payload: any) =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve(payload),
    } as Response);

  jest.spyOn(appService, "fetchTeams").mockImplementation(() => mockJsonResponse([]));
  const getApiKeysSpy = jest.spyOn(appService, "getApiKeys").mockImplementation(() =>
    mockJsonResponse({
      api_keys: [
        {
          key_id: "key-1",
          name: "Existing Key",
          key_prefix: "ogrre_abc123",
          created_at: 1700000000,
          expires_at: 1707776000,
          last_used_at: null,
          expired: false,
        },
      ],
    })
  );
  const createApiKeySpy = jest.spyOn(appService, "createApiKey").mockImplementation(() =>
    mockJsonResponse({
      key_id: "key-2",
      name: "RRC Cron Job",
      key_prefix: "ogrre_xyz789",
      created_at: 1700000100,
      expires_at: 1707776100,
      last_used_at: null,
      api_key: "ogrre_xyz789_secret_token",
    })
  );
  const revokeApiKeySpy = jest.spyOn(appService, "revokeApiKey").mockImplementation(() =>
    mockJsonResponse({ key_id: "key-1", revoked: true, revoked_at: 1700000200 })
  );

  const { container } = render(
    <HashRouter>
      <Header />
    </HashRouter>
  );

  const profileButton = container.querySelector('[data-cy="profile-menu-button"]');
  fireEvent.click(profileButton!);

  const apiKeysMenuItem = screen.getByText("API Keys");
  fireEvent.click(apiKeysMenuItem);

  await waitFor(() => {
    expect(getApiKeysSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Existing Key")).toBeInTheDocument();
  });

  const nameInput = screen.getByPlaceholderText("e.g., RRC nightly export");
  fireEvent.change(nameInput, { target: { value: "RRC Cron Job" } });
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));

  await waitFor(() => {
    expect(createApiKeySpy).toHaveBeenCalledWith({
      name: "RRC Cron Job",
      expires_in_days: 90,
    });
    expect(screen.getByText("ogrre_xyz789_secret_token")).toBeInTheDocument();
  });

  const revokeButton = container.ownerDocument.querySelector(
    '[data-cy="revoke-api-key-key-1"]'
  ) as HTMLElement;
  fireEvent.click(revokeButton);

  await waitFor(() => {
    expect(revokeApiKeySpy).toHaveBeenCalledWith("key-1");
    expect(screen.queryByText("Existing Key")).not.toBeInTheDocument();
  });

  jest.restoreAllMocks();
});
