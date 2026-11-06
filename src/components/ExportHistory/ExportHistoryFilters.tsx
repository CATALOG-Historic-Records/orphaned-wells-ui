import { useState } from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { FilterOption } from "../../types";

interface Props {
  viewScope: "mine" | "team";
  onViewScopeChange: (scope: "mine" | "team") => void;
  onApply: (filters: FilterOption[]) => void;
}

const ExportHistoryFilters = ({ viewScope, onViewScopeChange, onApply }: Props) => {
  const [filters, setFilters] = useState<FilterOption[]>([]);

  const value = (key: string, operator?: string) => {
    const filter = filters.find(
      (item) => item.key === key && (!operator || item.operator === operator)
    );
    return filter?.value || filter?.selectedOptions?.[0] || "";
  };

  const update = (
    key: string,
    label: string,
    next: string,
    type: string,
    operator = "equals"
  ) => {
    const filtered = filters.filter(
      (item) => item.key !== key || item.operator !== operator
    );
    const selectedValues =
      next === "active" ? ["queued", "dispatched", "running"] : [next];
    setFilters(
      next
        ? [
            ...filtered,
            {
              key,
              displayName: label,
              type,
              operator,
              value: next,
              ...(type === "checkbox"
                ? {
                    options: selectedValues.map((val) => ({
                      name: val,
                      value: val,
                      checked: true,
                    })),
                    selectedOptions: selectedValues,
                  }
                : {}),
            },
          ]
        : filtered
    );
  };

  return (
    <Box
      component="form"
      aria-label="Filter exports"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(filters);
      }}
      sx={{ px: 2, pb: 1.5 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "1fr 1fr 1.3fr 1fr 1fr",
          },
          gap: 1.5,
        }}
      >
        <TextField
          select
          label="Visibility"
          size="small"
          value={viewScope}
          onChange={(event) =>
            onViewScopeChange(event.target.value as "mine" | "team")
          }
          inputProps={{ "data-cy": "export-filter-visibility" }}
        >
          <MenuItem value="mine">My exports</MenuItem>
          <MenuItem value="team">All team exports</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          size="small"
          value={value("status")}
          onChange={(event) =>
            update("status", "Status", event.target.value, "checkbox")
          }
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="active">Active (queued / running)</MenuItem>
          <MenuItem value="completed">Complete</MenuItem>
          <MenuItem value="error">Failed</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </TextField>
        <TextField
          label="Requester"
          placeholder="Email contains…"
          size="small"
          value={value("request_user.email")}
          disabled={viewScope === "mine"}
          onChange={(event) =>
            update(
              "request_user.email",
              "Requester",
              event.target.value,
              "string",
              "contains"
            )
          }
        />
        <TextField
          label="After"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={value("created_at", "after")}
          onChange={(event) =>
            update("created_at", "Submitted", event.target.value, "date", "after")
          }
        />
        <TextField
          label="Before"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={value("created_at", "before")}
          onChange={(event) =>
            update("created_at", "Submitted", event.target.value, "date", "before")
          }
        />
      </Box>
      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={1}
        sx={{ mt: 1, "& .MuiButton-root": { textTransform: "none" } }}
      >
        <Button
          size="small"
          onClick={() => {
            setFilters([]);
            onApply([]);
          }}
        >
          Reset
        </Button>
        <Button size="small" variant="outlined" type="submit">
          Apply filters
        </Button>
      </Stack>
    </Box>
  );
};

export default ExportHistoryFilters;

