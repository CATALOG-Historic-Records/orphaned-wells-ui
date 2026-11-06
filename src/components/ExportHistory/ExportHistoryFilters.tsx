import { useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { FilterOption, JobScopeProject } from "../../types";

interface Props {
  projects: JobScopeProject[];
  projectsLoading: boolean;
  projectId: string;
  recordGroupId: string;
  onScopeChange: (projectId: string, recordGroupId: string) => void;
  viewScope: "mine" | "team";
  onViewScopeChange: (scope: "mine" | "team") => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  filters: FilterOption[];
  onApplyFilters: (filters: FilterOption[]) => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "completed", label: "Ready" },
  { value: "error", label: "Failed" },
  { value: "expired", label: "Expired" },
];

const ExportHistoryFilters = ({
  projects,
  projectsLoading,
  projectId,
  recordGroupId,
  onScopeChange,
  viewScope,
  onViewScopeChange,
  searchQuery,
  onSearchChange,
  filters,
  onApplyFilters,
}: Props) => {
  const [projectAnchor, setProjectAnchor] = useState<HTMLElement | null>(null);
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null);
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);

  const getFilterValue = (key: string, operator?: string) => {
    const match = filters.find(
      (item) => item.key === key && (!operator || item.operator === operator)
    );
    return match?.value || match?.selectedOptions?.[0] || "";
  };

  const [draftAfter, setDraftAfter] = useState(() =>
    getFilterValue("created_at", "after")
  );
  const [draftBefore, setDraftBefore] = useState(() =>
    getFilterValue("created_at", "before")
  );

  const selectedProject = projects.find((p) => p.id === projectId);
  const availableGroups = projects
    .filter((p) => !projectId || p.id === projectId)
    .flatMap((p) =>
      p.record_groups.map((g) => ({ ...g, projectName: p.name, projectId: p.id }))
    );
  const selectedGroup = availableGroups.find((g) => g.id === recordGroupId);

  const statusValue = getFilterValue("status");
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === statusValue)?.label;
  const afterDate = getFilterValue("created_at", "after");
  const beforeDate = getFilterValue("created_at", "before");

  const setStatusFilter = (nextStatus: string) => {
    const rest = filters.filter((f) => f.key !== "status");
    const nextFilters = nextStatus
      ? [
          ...rest,
          {
            key: "status",
            displayName: "Status",
            type: "checkbox",
            operator: "equals",
            value: nextStatus,
            options: [{ name: nextStatus, value: nextStatus, checked: true }],
            selectedOptions: [nextStatus],
          },
        ]
      : rest;
    onApplyFilters(nextFilters);
    setStatusAnchor(null);
  };

  const applyDateFilter = (nextAfter: string, nextBefore: string) => {
    const rest = filters.filter((f) => f.key !== "created_at");
    const nextFilters = [...rest];
    if (nextAfter) {
      nextFilters.push({
        key: "created_at",
        displayName: "Submitted",
        type: "date",
        operator: "after",
        value: nextAfter,
      });
    }
    if (nextBefore) {
      nextFilters.push({
        key: "created_at",
        displayName: "Submitted",
        type: "date",
        operator: "before",
        value: nextBefore,
      });
    }
    onApplyFilters(nextFilters);
    setDateAnchor(null);
  };

  const hasAnyFilter = Boolean(
    projectId || recordGroupId || filters.length > 0 || searchQuery.trim()
  );

  const dateChipLabel =
    afterDate && beforeDate
      ? `Date: ${afterDate} – ${beforeDate}`
      : afterDate
      ? `After ${afterDate}`
      : beforeDate
      ? `Before ${beforeDate}`
      : "";

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      spacing={1.5}
    >
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ minWidth: 0 }}
      >
        {/* Segmented toggle: My exports | Everyone's */}
        <Box
          role="group"
          aria-label="Export visibility"
          sx={{
            display: "inline-flex",
            bgcolor: "grey.100",
            p: 0.4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {(
            [
              { value: "mine", label: "My exports" },
              { value: "team", label: "Everyone's" },
            ] as const
          ).map((option) => {
            const selected = viewScope === option.value;
            return (
              <ButtonBase
                key={option.value}
                onClick={() => onViewScopeChange(option.value)}
                data-cy={`export-visibility-${option.value}`}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontSize: "0.8125rem",
                  fontWeight: selected ? 600 : 500,
                  color: selected ? "text.primary" : "text.secondary",
                  bgcolor: selected ? "background.paper" : "transparent",
                  boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {option.label}
              </ButtonBase>
            );
          })}
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, display: { xs: "none", sm: "block" } }}
        />

        {/* + Project pill */}
        <Chip
          size="small"
          icon={!selectedProject ? <AddIcon fontSize="small" /> : undefined}
          label={
            selectedProject ? `Project: ${selectedProject.name}` : "Project"
          }
          variant="outlined"
          disabled={projectsLoading}
          onClick={(e) => setProjectAnchor(e.currentTarget)}
          onDelete={
            selectedProject ? () => onScopeChange("", "") : undefined
          }
          sx={{
            borderRadius: 99,
            fontWeight: selectedProject ? 600 : 500,
            bgcolor: selectedProject ? "action.selected" : "background.paper",
          }}
        />
        <Menu
          anchorEl={projectAnchor}
          open={Boolean(projectAnchor)}
          onClose={() => setProjectAnchor(null)}
          PaperProps={{ sx: { maxHeight: 320, minWidth: 220 } }}
        >
          <MenuItem
            selected={!projectId}
            onClick={() => {
              onScopeChange("", "");
              setProjectAnchor(null);
            }}
          >
            All projects
          </MenuItem>
          {projects.map((project) => (
            <MenuItem
              key={project.id}
              selected={project.id === projectId}
              onClick={() => {
                onScopeChange(project.id, "");
                setProjectAnchor(null);
              }}
            >
              {project.name}
            </MenuItem>
          ))}
        </Menu>

        {/* + Record group pill */}
        <Chip
          size="small"
          icon={!selectedGroup ? <AddIcon fontSize="small" /> : undefined}
          label={
            selectedGroup
              ? `Record group: ${selectedGroup.name}`
              : "Record group"
          }
          variant="outlined"
          disabled={projectsLoading || availableGroups.length === 0}
          onClick={(e) => setGroupAnchor(e.currentTarget)}
          onDelete={
            selectedGroup ? () => onScopeChange(projectId, "") : undefined
          }
          sx={{
            borderRadius: 99,
            fontWeight: selectedGroup ? 600 : 500,
            bgcolor: selectedGroup ? "action.selected" : "background.paper",
          }}
        />
        <Menu
          anchorEl={groupAnchor}
          open={Boolean(groupAnchor)}
          onClose={() => setGroupAnchor(null)}
          PaperProps={{ sx: { maxHeight: 320, minWidth: 240 } }}
        >
          <MenuItem
            selected={!recordGroupId}
            onClick={() => {
              onScopeChange(projectId, "");
              setGroupAnchor(null);
            }}
          >
            All record groups
          </MenuItem>
          {availableGroups.map((group) => (
            <MenuItem
              key={group.id}
              selected={group.id === recordGroupId}
              onClick={() => {
                onScopeChange(projectId, group.id);
                setGroupAnchor(null);
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {group.name}
                </Typography>
                {!projectId && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    noWrap
                  >
                    {group.projectName}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* + Status pill */}
        <Chip
          size="small"
          icon={!statusLabel ? <AddIcon fontSize="small" /> : undefined}
          label={statusLabel ? `Status: ${statusLabel}` : "Status"}
          variant="outlined"
          onClick={(e) => setStatusAnchor(e.currentTarget)}
          onDelete={statusLabel ? () => setStatusFilter("") : undefined}
          sx={{
            borderRadius: 99,
            fontWeight: statusLabel ? 600 : 500,
            bgcolor: statusLabel ? "action.selected" : "background.paper",
          }}
        />
        <Menu
          anchorEl={statusAnchor}
          open={Boolean(statusAnchor)}
          onClose={() => setStatusAnchor(null)}
          PaperProps={{ sx: { minWidth: 180 } }}
        >
          <MenuItem
            selected={!statusValue}
            onClick={() => setStatusFilter("")}
          >
            All statuses
          </MenuItem>
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              selected={statusValue === opt.value}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Menu>

        {/* + Date pill */}
        <Chip
          size="small"
          icon={!dateChipLabel ? <AddIcon fontSize="small" /> : undefined}
          label={dateChipLabel || "Date"}
          variant="outlined"
          onClick={(e) => {
            setDraftAfter(afterDate);
            setDraftBefore(beforeDate);
            setDateAnchor(e.currentTarget);
          }}
          onDelete={
            dateChipLabel ? () => applyDateFilter("", "") : undefined
          }
          sx={{
            borderRadius: 99,
            fontWeight: dateChipLabel ? 600 : 500,
            bgcolor: dateChipLabel ? "action.selected" : "background.paper",
          }}
        />
        <Popover
          open={Boolean(dateAnchor)}
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{ sx: { p: 2, width: 260, borderRadius: 2 } }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              Submitted date
            </Typography>
            <TextField
              label="After"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={draftAfter}
              onChange={(e) => setDraftAfter(e.target.value)}
            />
            <TextField
              label="Before"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={draftBefore}
              onChange={(e) => setDraftBefore(e.target.value)}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                size="small"
                onClick={() => {
                  setDraftAfter("");
                  setDraftBefore("");
                  applyDateFilter("", "");
                }}
                sx={{ textTransform: "none" }}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => applyDateFilter(draftAfter, draftBefore)}
                sx={{ textTransform: "none" }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Popover>

        {hasAnyFilter && (
          <Button
            size="small"
            onClick={() => {
              onScopeChange("", "");
              onSearchChange("");
              onApplyFilters([]);
            }}
            sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: 0 }}
          >
            Reset
          </Button>
        )}
      </Stack>

      {/* Search input */}
      <TextField
        size="small"
        placeholder="Search file, record group, requester…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{
          "aria-label": "Search exports",
          "data-cy": "export-search-input",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <ButtonBase
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
                sx={{ p: 0.25, borderRadius: 1 }}
              >
                <ClearIcon fontSize="small" color="action" />
              </ButtonBase>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          width: { xs: "100%", md: 280 },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
            fontSize: "0.875rem",
          },
        }}
      />
    </Stack>
  );
};

export default ExportHistoryFilters;
