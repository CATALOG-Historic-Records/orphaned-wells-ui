import { strFromU8, unzipSync } from "fflate";

const path = require("path");
const exportUrl = () => `${Cypress.env("backendURL")}/export_jobs/**`;
const records = [
  { filename: "export-alpha.pdf", depth: 120, operator: "Alpha Oil" },
  { filename: "export-bravo.pdf", depth: 240, operator: "Bravo Oil" },
];

const importGroup = (projectId, name, sourceRecords) => {
  return cy.api("POST", `/import_json_record_group/${projectId}`, {
    record_group: { name, documentType: "Cypress Export" },
    import_package: {
      format: "ogrre-json-records-v1",
      records: sourceRecords.map((record) => ({
        filename: record.filename,
        attributesList: [
          { key: "Depth", value: record.depth, subattributes: [] },
          { key: "Operator", value: record.operator, subattributes: [] },
        ],
      })),
    },
  }).then(({ body }) => {
    expect(body.created_count).to.eq(sourceRecords.length);
    return body;
  });
};

const openExport = (recordGroupId, name) => {
  cy.visitApp(`/record_group/${recordGroupId}`);
  cy.getByCy("subheader-title").should("contain.text", name);
  cy.getByCy("records-export-button").should("be.enabled").click();
  cy.getByCy("export-dialog").should("be.visible");
  cy.getByCy("download-button").should("be.enabled");
};

const openProjectExport = (projectId, groupName) => {
  cy.visitApp(`/project/${projectId}`);
  cy.contains('[data-cy="record-group-row"]', groupName)
    .find('[data-cy="record-group-select"] input').check();
  cy.getByCy("record-groups-export-button").click();
  cy.getByCy("download-button").should("be.enabled");
};

const waitForExport = (format) => {
  cy.wait("@exportRecords", { timeout: 30000 }).then(({ request, response }) => {
    expect(request.url).to.include(`export_${format}=true`);
    expect(request.url).to.include("export_images=false");
    expect(request.url).to.include("export_embedded_pdfs=false");
    expect(response.statusCode).to.eq(200);
    expect(response.body).to.have.property("job_id");
  });
  cy.getByCy("export-ready-download-button", { timeout: 30000 })
    .should("be.visible")
    .and("be.enabled")
    .click();
};

const readExport = (name, extension) => {
  const filename = path.join(Cypress.config("downloadsFolder"), `${name}.zip`);
  return cy.readFile(filename, null, { timeout: 30000 }).then((bytes) => {
    const entries = unzipSync(new Uint8Array(bytes));
    const filenames = Object.keys(entries);
    expect(filenames, "archive contains only the selected export format").to.have.length(1);
    expect(filenames[0]).to.match(new RegExp(`\\.${extension}$`));
    return strFromU8(entries[filenames[0]]);
  });
};

const expectJsonRecords = (contents) => {
  const exported = JSON.parse(contents);
  expect(exported.map((record) => ({
    filename: record.file,
    depth: record.Depth.value,
    operator: record.Operator.value,
  }))).to.have.deep.members(records);
};

describe("real record exports", () => {
  let projectId;
  let projectName;
  let groupName;
  let group;

  beforeEach(() => {
    cy.clearLocalStorage();
    projectId = null;
    // New names prevent a previous download from satisfying a later test.
    projectName = `Cypress-export-${Date.now()}-${Cypress._.random(100000)}`;
    groupName = `${projectName}-selected`;
    cy.api("POST", "/add_project", { name: projectName, description: "Export E2E test" })
      .then(({ body }) => {
        projectId = body;
        return importGroup(projectId, groupName, records);
      })
      .then((createdGroup) => { group = createdGroup; });
    // Observe the request without replacing the backend response.
    cy.intercept("POST", exportUrl()).as("exportRecords");
  });

  afterEach(() => {
    if (projectId) cy.api("POST", `/delete_project/${projectId}`);
  });

  it("downloads a valid JSON ZIP containing the expected records and values", () => {
    openExport(group.record_group_id, groupName);
    cy.getByCy("download-button").click();
    waitForExport("json");
    readExport(groupName, "json").then(expectJsonRecords);
  });

  it("downloads CSV containing only the selected field and expected records", () => {
    openExport(group.record_group_id, groupName);
    cy.get('[data-export-type="json"] input').uncheck();
    cy.get('[data-export-type="csv"] input').check();
    cy.getByCy("export-select-all-columns").click();
    cy.findByRole("checkbox", { name: "User Notes" }).uncheck();
    cy.get('[data-cy="export-column-label"][data-column="Depth"]').click();
    cy.getByCy("download-button").click();
    waitForExport("csv");
    readExport(groupName, "csv").then((contents) => {
      const [header, ...rows] = contents.trim().split(/\r?\n/);
      expect(header).to.eq("file,Depth,URL");
      expect(rows).to.have.members(records.map((record, index) => (
        `${record.filename},${record.depth},${Cypress.config("baseUrl")}/record/${group.created_record_ids[index]}`
      )));
    });
  });

  it("exports only selected project record groups, excluding another group of the same document type", () => {
    importGroup(projectId, `${projectName}-excluded`, [
      { filename: "excluded.pdf", depth: 999, operator: "Excluded Oil" },
    ]);
    openProjectExport(projectId, groupName);
    cy.getByCy("download-button").click();
    waitForExport("json");
    readExport(projectName, "json").then(expectJsonRecords);
  });

  ["record group", "project"].forEach((location) => {
    it(`shows a ${location} export failure and allows a successful real export on retry`, () => {
      cy.intercept({ method: "POST", url: exportUrl(), times: 1 }, {
        statusCode: 500,
        body: { detail: "Export failed for this test" },
      }).as("failedExport");
      if (location === "project") openProjectExport(projectId, groupName);
      else openExport(group.record_group_id, groupName);
      cy.getByCy("download-button").click();
      cy.wait("@failedExport").its("response.statusCode").should("eq", 500);
      cy.getByCy("export-dialog").should("be.visible");
      cy.findByRole("alert").should("contain.text", "Export failed for this test");
      cy.getByCy("download-button").should("be.enabled").click();
      waitForExport("json");
      cy.findByRole("alert").should("not.exist");
      readExport(location === "project" ? projectName : groupName, "json").then(expectJsonRecords);
    });
  });

  it("creates an API key, fetches incremental reviewed records, and logs runs in Exports", () => {
    const keyName = `Cypress-key-${Date.now()}`;
    const [firstRecordId, secondRecordId] = group.created_record_ids;

    cy.api("POST", `/update_record/${firstRecordId}`, {
      data: { review_status: "reviewed" },
      type: "review_status",
    });

    cy.visitApp("/projects");
    cy.getByCy("profile-menu-button").click();
    cy.getByCy("api-keys-menu-item").click();
    cy.getByCy("api-key-name-input").type(keyName);
    cy.getByCy("create-api-key-button").click();

    cy.getByCy("created-api-key-value")
      .should("be.visible")
      .invoke("text")
      .then((rawKey) => {
        const apiKey = rawKey.trim();
        expect(apiKey).to.match(/^ogrre_/);

        cy.findByRole("button", { name: "Close" }).click();

        const authHeaders = { Authorization: `Bearer ${apiKey}` };
        const endpoint = `/reviewed_records?record_group_id=${group.record_group_id}`;

        return cy
          .api("GET", endpoint, undefined, { headers: authHeaders })
          .then(({ status, body: firstRun }) => {
            expect(status).to.eq(200);
            expect(firstRun.total_count).to.eq(1);
            expect(firstRun.records).to.have.length(1);
            expect(firstRun.records[0].file).to.eq("export-alpha.pdf");
            expect(firstRun.records[0].Depth.value).to.eq(120);
            expect(firstRun.job_id).to.be.a("string").and.not.be.empty;

            return cy
              .api("GET", endpoint, undefined, { headers: authHeaders })
              .then(({ body: secondRun }) => {
                expect(secondRun.total_count).to.eq(0);
                expect(secondRun.records).to.deep.eq([]);

                return cy.api("POST", `/update_record/${secondRecordId}`, {
                  data: { review_status: "reviewed" },
                  type: "review_status",
                });
              })
              .then(() => cy.api("GET", endpoint, undefined, { headers: authHeaders }))
              .then(({ body: thirdRun }) => {
                expect(thirdRun.total_count).to.eq(1);
                expect(thirdRun.records).to.have.length(1);
                expect(thirdRun.records[0].file).to.eq("export-bravo.pdf");
                expect(thirdRun.records[0].Operator.value).to.eq("Bravo Oil");

                cy.getByCy("header-tab-exports").click();
                cy.getByCy(`export-job-row-${firstRun.job_id}`, { timeout: 30000 })
                  .should("be.visible")
                  .and("contain.text", "Incremental (Reviewed)")
                  .and("contain.text", "Completed")
                  .and("contain.text", "Direct download")
                  .and("contain.text", "Run again");
              })
              .then(() => {
                cy.getByCy("profile-menu-button").click();
                cy.getByCy("api-keys-menu-item").click();
                cy.contains('[data-cy^="api-key-row-"]', keyName)
                  .find('[data-cy^="revoke-api-key-"]')
                  .click();
                cy.contains('[data-cy^="api-key-row-"]', keyName).should("not.exist");
                cy.findByRole("button", { name: "Close" }).click();

                return cy.api("GET", endpoint, undefined, {
                  headers: authHeaders,
                  failOnStatusCode: false,
                });
              })
              .then(({ status: revokedStatus }) => {
                expect(revokedStatus).to.eq(401);
              });
          });
      });
  });
});
