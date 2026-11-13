import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import {
  createApiKey,
  getApiKeys,
  revokeApiKey,
} from "../../services/app.service";
import { ApiKeyInfo, CreatedApiKeyResponse } from "../../types";
import { callAPI, formatDate } from "../../util";

interface ApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
}

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
];

const getApiErrorMessage = (error: any, fallback: string) => {
  if (typeof error === "string") return error;
  return error?.message || error?.detail || fallback;
};

const ApiKeyDialog = ({ open, onClose }: ApiKeyDialogProps) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [newlyCreatedKey, setNewlyCreatedKey] =
    useState<CreatedApiKeyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(90);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setExpiresInDays(90);
      setCopied(false);
      setNewlyCreatedKey(null);
      setError("");
      return;
    }
    setNewlyCreatedKey(null);
    setError("");
    setLoading(true);
    callAPI(
      getApiKeys,
      [],
      (data: { api_keys?: ApiKeyInfo[] }) => {
        setApiKeys(data?.api_keys || []);
        setLoading(false);
      },
      (err: any) => {
        setLoading(false);
        setError(getApiErrorMessage(err, "Unable to load API keys."));
      }
    );
  }, [open]);

  const trimmedName = name.trim();
  const canCreate = Boolean(trimmedName) && !creating;

  const handleClose = () => {
    if (creating) return;
    onClose();
  };

  const handleSubmit = () => {
    if (!canCreate) return;
    setCreating(true);
    setError("");
    callAPI(
      createApiKey,
      [{ name: trimmedName, expires_in_days: expiresInDays }],
      (created: CreatedApiKeyResponse) => {
        setCreating(false);
        setNewlyCreatedKey(created);
        setName("");
        setCopied(false);
        setApiKeys((prev) => [
          {
            key_id: created.key_id,
            name: created.name,
            key_prefix: created.key_prefix,
            created_at: created.created_at,
            expires_at: created.expires_at,
            last_used_at: created.last_used_at,
            expired: false,
          },
          ...prev,
        ]);
      },
      (err: any) => {
        setCreating(false);
        setError(getApiErrorMessage(err, "Unable to create API key."));
      }
    );
  };

  const handleRevokeKey = (keyId: string) => {
    setRevokingKeyId(keyId);
    setError("");
    callAPI(
      revokeApiKey,
      [keyId],
      () => {
        setRevokingKeyId(null);
        setApiKeys((prev) => prev.filter((item) => item.key_id !== keyId));
        setNewlyCreatedKey((prev) => (prev?.key_id === keyId ? null : prev));
      },
      (err: any) => {
        setRevokingKeyId(null);
        setError(getApiErrorMessage(err, "Unable to revoke API key."));
      }
    );
  };

  const handleCopyKey = async () => {
    if (!newlyCreatedKey?.api_key) return;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(newlyCreatedKey.api_key);
      setCopied(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={creating ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5, borderBottom: "1px solid #EEF2F7" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "18px" }}>
          API Keys
        </Typography>
        <Typography sx={{ color: "#6B7280", fontSize: "13px", mt: 0.5 }}>
          Create personal API keys to authenticate scheduled scripts and{" "}
          <code>/reviewed_records</code> exports with{" "}
          <code>Authorization: Bearer &lt;key&gt;</code>.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {newlyCreatedKey && (
          <Box
            data-cy="created-api-key-banner"
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: "8px",
              border: "1px solid #BBF7D0",
              backgroundColor: "#F0FDF4",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#166534",
                mb: 0.5,
              }}
            >
              API key created — copy it now
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#15803D", mb: 1.5 }}>
              This key will only be shown once. Store it securely for your scheduled job.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: "6px",
                border: "1px solid #DCFCE7",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Typography
                data-cy="created-api-key-value"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#111827",
                  wordBreak: "break-all",
                }}
              >
                {newlyCreatedKey.api_key}
              </Typography>
              <Tooltip title={copied ? "Copied" : "Copy API key"}>
                <IconButton
                  data-cy="copy-api-key-button"
                  size="small"
                  onClick={handleCopyKey}
                  aria-label="Copy API key"
                >
                  {copied ? (
                    <CheckIcon fontSize="small" color="success" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              mb: 1.5,
            }}
          >
            Create New Key
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <TextField
              size="small"
              fullWidth
              label="Key name"
              placeholder="e.g., RRC nightly export"
              value={name}
              disabled={creating}
              inputProps={{ "data-cy": "api-key-name-input" }}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canCreate) {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              sx={{ backgroundColor: "#FFFFFF" }}
            />
            <TextField
              select
              size="small"
              label="Expiration"
              value={expiresInDays}
              disabled={creating}
              onChange={(event) => setExpiresInDays(Number(event.target.value))}
              sx={{ minWidth: 130, backgroundColor: "#FFFFFF" }}
            >
              {EXPIRATION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              data-cy="create-api-key-button"
              variant="contained"
              onClick={handleSubmit}
              disabled={!canCreate}
              sx={{ whiteSpace: "nowrap", height: "40px", minWidth: "100px" }}
            >
              {creating ? "Creating..." : "Create key"}
            </Button>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            mb: 1,
          }}
        >
          Active Keys
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2 }}>
            <CircularProgress size={20} />
            <Typography sx={{ color: "#4B5563", fontSize: "14px" }}>
              Loading API keys...
            </Typography>
          </Box>
        ) : apiKeys.length === 0 ? (
          <Box
            sx={{
              p: 2,
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              fontSize: "13px",
            }}
          >
            No active API keys.
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {apiKeys.map((keyItem) => {
              const isRevoking = revokingKeyId === keyItem.key_id;
              return (
                <Box
                  key={keyItem.key_id}
                  data-cy={`api-key-row-${keyItem.key_id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 2,
                    py: 1.25,
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {keyItem.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "12px",
                          color: "#6B7280",
                        }}
                      >
                        {keyItem.key_prefix}...
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "12px", color: "#6B7280", mt: 0.25 }}>
                      Created {formatDate(keyItem.created_at)} ·{" "}
                      {keyItem.expired
                        ? `Expired ${formatDate(keyItem.expires_at)}`
                        : `Expires ${formatDate(keyItem.expires_at)}`}
                      {keyItem.last_used_at
                        ? ` · Last used ${formatDate(keyItem.last_used_at)}`
                        : " · Never used"}
                    </Typography>
                  </Box>
                  <Button
                    data-cy={`revoke-api-key-${keyItem.key_id}`}
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={isRevoking}
                    onClick={() => handleRevokeKey(keyItem.key_id)}
                  >
                    {isRevoking ? "Revoking..." : "Revoke"}
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #EEF2F7" }}>
        <Button onClick={handleClose} disabled={creating} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog;
