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

export interface JobHistoryChoiceFilterConfig {
  key: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
}

interface Props {
  projects: JobScopeProject[];
  projectsLoading: boolean;
  projectId: string;
  recordGroupId: string;
  onScopeChange: (projectId: string, recordGroupId: string) => void;
  viewScope?: "mine" | "team";
  onViewScopeChange?: (scope: "mine" | "team") => void;
  viewScopeLabels?: { mine: string; team: string };
  searchQuery: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchDataCy?: string;
  filters: FilterOption[];
  onApplyFilters: (filters: FilterOption[]) => void;
  choiceFilters: JobHistoryChoiceFilterConfig[];
}

const DEFAULT_VIEW_SCOPE_LABELS = {
  mine: "My exports",
  team: "Everyone's",
};

const JobHistoryFilters = ({
  projects,
  projectsLoading,
  projectId,
  recordGroupId,
  onScopeChange,
  viewScope,
  onViewScopeChange,
  viewScopeLabels = DEFAULT_VIEW_SCOPE_LABELS,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search…",
  searchAriaLabel = "Search",
  searchDataCy = "job-history-search-input",
  filters,
  onApplyFilters,
  choiceFilters,
}: Props) => {
  const [projectAnchor, setProjectAnchor] = useState<HTMLElement | null>(null);
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null);
  const [choiceAnchors, setChoiceAnchors] = useState<
    Record<string, HTMLElement | null>
  >({});
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

  const afterDate = getFilterValue("created_at", "after");
  const beforeDate = getFilterValue("created_at", "before");

  const setChoiceFilter = (
    choiceConfig: JobHistoryChoiceFilterConfig,
    nextValue: string
  ) => {
    const rest = filters.filter((f) => f.key !== choiceConfig.key);
    const nextFilters = nextValue
      ? [
          ...rest,
          {
            key: choiceConfig.key,
            displayName: choiceConfig.label,
            type: "checkbox",
            operator: "equals",
            value: nextValue,
            options: [{ name: nextValue, value: nextValue, checked: true }],
            selectedOptions: [nextValue],
          },
        ]
      : rest;
    onApplyFilters(nextFilters);
    setChoiceAnchors((prev) => ({ ...prev, [choiceConfig.key]: null }));
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
        {/* Optional segmented toggle */}
        {viewScope && onViewScopeChange && (
          <>
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
                  { value: "mine", label: viewScopeLabels.mine },
                  { value: "team", label: viewScopeLabels.team },
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
                      boxShadow: selected
                        ? "0 1px 2px rgba(0,0,0,0.08)"
                        : "none",
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
          </>
        )}

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

        {/* Configurable choice pills (Status, Source, etc.) */}
        {choiceFilters.map((choiceConfig) => {
          const currentValue = getFilterValue(choiceConfig.key);
          const currentLabel = choiceConfig.options.find(
            (opt) => opt.value === currentValue
          )?.label;
          const anchorEl = choiceAnchors[choiceConfig.key] || null;

          return (
            <Box key={choiceConfig.key} sx={{ display: "inline-flex" }}>
              <Chip
                size="small"
                icon={!currentLabel ? <AddIcon fontSize="small" /> : undefined}
                label={
                  currentLabel
                    ? `${choiceConfig.label}: ${currentLabel}`
                    : choiceConfig.label
                }
                variant="outlined"
                onClick={(e) =>
                  setChoiceAnchors((prev) => ({
                    ...prev,
                    [choiceConfig.key]: e.currentTarget,
                  }))
                }
                onDelete={
                  currentLabel
                    ? () => setChoiceFilter(choiceConfig, "")
                    : undefined
                }
                sx={{
                  borderRadius: 99,
                  fontWeight: currentLabel ? 600 : 500,
                  bgcolor: currentLabel
                    ? "action.selected"
                    : "background.paper",
                }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() =>
                  setChoiceAnchors((prev) => ({
                    ...prev,
                    [choiceConfig.key]: null,
                  }))
                }
                PaperProps={{ sx: { minWidth: 180 } }}
              >
                <MenuItem
                  selected={!currentValue}
                  onClick={() => setChoiceFilter(choiceConfig, "")}
                >
                  {choiceConfig.allLabel}
                </MenuItem>
                {choiceConfig.options.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    selected={currentValue === opt.value}
                    onClick={() => setChoiceFilter(choiceConfig, opt.value)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          );
        })}

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
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{
          "aria-label": searchAriaLabel,
          "data-cy": searchDataCy,
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

export default JobHistoryFilters;
