import "./Header.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderStyles as styles } from "../../styles";
import { useUserContext } from "../../usercontext";
import { changeTeam, fetchTeams, getOgrreVersion } from "../../services/app.service";
import { ChangeTeamResponse } from "../../types";
import ChangeTeamDialog from "./ChangeTeamDialog";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { logout, callAPI } from "../../util";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Logout from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

interface PackageVersionInfo {
  name: string;
  version?: string;
  commit?: string;
  source_url?: string;
  requested_revision?: string;
}

interface OgrreVersionInfo {
  packages: PackageVersionInfo[];
}

const formatPackageName = (packageName: string) => {
  if (packageName === "ogrre_data_cleaning") return "ogrre_data_cleaning";
  if (packageName === "orphaned-wells-ui-server") return "orphaned-wells-ui-server";
  return packageName;
};

const getApiErrorMessage = (error: any, fallback: string) => {
  if (typeof error === "string") return error;
  return error?.message || error?.detail || fallback;
};

const VersionMetadataLine = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
      <Typography sx={{ color: "#6B7280", fontSize: "13px", minWidth: "92px" }}>
        {label}
      </Typography>
      <Box
        component="span"
        sx={{
          color: "#111827",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
          fontSize: "12px",
          lineHeight: 1.6,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Box>
    </Stack>
  );
};

const Header = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userName, userPhoto, hasPermission, handleSuccessfulAuthentication } = useUserContext();
  const [anchorAr, setAnchorAr] = useState<null | HTMLElement>(null);
  const [profileActions, setProfileActions] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [teams, setTeams] = useState<string[]>([]);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [teamChangeLoading, setTeamChangeLoading] = useState(false);
  const [teamChangeError, setTeamChangeError] = useState("");
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionInfo, setVersionInfo] = useState<OgrreVersionInfo | null>(null);
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState("");

  useEffect(() => {
    if (window.location.href.includes("project")) {
      setTabValue(0);
    } else if (window.location.href.includes("records")) {
      setTabValue(1);
    } else if (window.location.href.includes("users")) {
      setTabValue(2);
    } else if (window.location.href.includes("schema")) {
      setTabValue(3);
    } else {
      setTabValue(0);
    }
    if (hasPermission("manage_system")) callAPI(fetchTeams, [], fetchedTeams, failedFetchTeams);
  }, [props, hasPermission, location]);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleShowProfileActions = (event: React.MouseEvent<HTMLElement>) => {
    setProfileActions(!profileActions);
    setAnchorAr(event.currentTarget);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue !== tabValue) {
      let newLocation: string;
      if (newValue === 0) newLocation = "projects";
      else if (newValue === 1) newLocation = "records";
      else if (newValue === 2) newLocation = "users";
      else if (newValue === 3) newLocation = "schema";
      else newLocation = "/";
      navigate(newLocation, { replace: true });
    }
  };

  const handleOpenTeamDialog = () => {
    setProfileActions(false);
    setTeamChangeError("");
    setTeamDialogOpen(true);
    callAPI(fetchTeams, [], fetchedTeams, failedFetchTeams);
  };

  const handleCloseTeamDialog = () => {
    if (teamChangeLoading) return;
    setTeamDialogOpen(false);
    setTeamChangeError("");
  };

  const handleChangeTeam = (team: string) => {
    setTeamChangeLoading(true);
    setTeamChangeError("");
    callAPI(
      changeTeam,
      [{ new_team: team }],
      handleChangedTeam,
      handleFailedChangeTeam
    );
  };

  const handleChangedTeam = (data: ChangeTeamResponse) => {
    setTeamChangeLoading(false);
    setTeamDialogOpen(false);
    if (data?.team) {
      setTeams((prevTeams) => {
        if (prevTeams.includes(data.team)) return prevTeams;
        return [...prevTeams, data.team].sort((a, b) => a.localeCompare(b));
      });
    }
    handleSuccessfulAuthentication();
    navigate("/", { replace: true });
  };

  const handleFailedChangeTeam = (error: any) => {
    setTeamChangeLoading(false);
    setTeamChangeError(getApiErrorMessage(error, "Unable to change team."));
  };

  const fetchedTeams = (data: string[]) => {
    setTeams(data);
  };

  const failedFetchTeams = (error: any) => {
    setTeamChangeError(getApiErrorMessage(error, "Unable to load teams."));
  };

  const handleViewOgrreVersion = () => {
    setProfileActions(false);
    setVersionDialogOpen(true);
    setVersionInfo(null);
    setVersionError("");
    setVersionLoading(true);
    callAPI(getOgrreVersion, [], handleFetchedVersion, handleFailedFetchVersion);
  };

  const handleFetchedVersion = (data: OgrreVersionInfo) => {
    setVersionInfo(data);
    setVersionLoading(false);
  };

  const handleFailedFetchVersion = (error: any) => {
    setVersionLoading(false);
    setVersionError(getApiErrorMessage(error, "Unable to load OGRRE version."));
  };

  return (
    <div id="Header">
      <div className="titlebar">
        <img onClick={handleNavigateHome} style={styles.logo} src={`${process.env.PUBLIC_URL}/img/OGRRE_logo.svg`} alt="Logo"></img>
        <div id="titlebar-name" style={{ cursor: "pointer" }} onClick={handleNavigateHome}>
          OGRRE
        </div>
        <div style={styles.tabPanel}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="process tabs" centered
            textColor='inherit'
            TabIndicatorProps={{ style: { background: "#727272" } }}
          >
            <Tab label="Projects" {...a11yProps(0)} />
            <Tab label="Records" {...a11yProps(1)} />
            {hasPermission("manage_team") &&
              <Tab label="Users" {...a11yProps(2)} />
            }
            {hasPermission("manage_schema") &&
              <Tab label="Schema" {...a11yProps(3)} />
            }
          </Tabs>
        </div>

        <div className="right">
          <Button 
            style={styles.issueButton}
            href='https://catalog-historic-records.github.io/orphaned-wells-ui/'
            target='_blank'
            endIcon={<OpenInNewIcon/>}
          >
            View Documentation
          </Button>
          <Button 
            style={styles.issueButton}
            href='https://github.com/orgs/CATALOG-Historic-Records/discussions/171'
            target='_blank'
            endIcon={<OpenInNewIcon/>}
          >
            Report an issue
          </Button>
            
          <IconButton sx={styles.icon} onClick={handleShowProfileActions}>
            <Avatar sx={styles.avatar} alt={userName} src={userPhoto}/>
            
          </IconButton>
          <Menu
            id="actions-list"
            anchorEl={anchorAr}
            open={profileActions}
            onClose={() => setProfileActions(false)}
            slotProps={
              styles.menuSlotProps
            }
          >
            {hasPermission("manage_system") && (
              <span>
                <MenuItem onClick={handleOpenTeamDialog}>
                  <ListItemIcon>
                    <GroupsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Change team
                </MenuItem>
                <Divider />
              </span>
            )
            }
            {hasPermission("manage_schema") && (
              <MenuItem onClick={handleViewOgrreVersion}>
                <ListItemIcon>
                  <InfoOutlinedIcon fontSize="small" />
                </ListItemIcon>
                OGRRE Version
              </MenuItem>
            )}
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <ChangeTeamDialog
        open={teamDialogOpen}
        teams={teams}
        currentTeam={user?.default_team}
        allowCustomTeam={!user?.anonymous}
        loading={teamChangeLoading}
        error={teamChangeError}
        onClose={handleCloseTeamDialog}
        onChangeTeam={handleChangeTeam}
      />
      <Dialog
        open={versionDialogOpen}
        onClose={() => setVersionDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #EEF2F7",
            pr: 6,
          }}
        >
          <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
            OGRRE Version
          </Typography>
          <Typography component="div" sx={{ color: "#6B7280", fontSize: "13px", mt: 0.5 }}>
            Backend package metadata currently reported by the server.
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setVersionDialogOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ p: 2.5 }}>
          {versionLoading ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={22} />
              <Typography sx={{ color: "#4B5563", fontSize: "14px" }}>
                Loading version information...
              </Typography>
            </Stack>
          ) : versionError ? (
            <Alert severity="error">{versionError}</Alert>
          ) : versionInfo?.packages?.length ? (
            <Stack spacing={1.5}>
              {versionInfo.packages.map((packageInfo) => (
                <Box
                  key={packageInfo.name}
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    p: 1.5,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
                    {formatPackageName(packageInfo.name)}
                  </Typography>
                  <Stack spacing={0.75}>
                    <VersionMetadataLine label="Version" value={packageInfo.version || "Unknown"} />
                    <VersionMetadataLine label="Commit" value={packageInfo.commit} />
                    <VersionMetadataLine
                      label="Requested"
                      value={packageInfo.requested_revision !== packageInfo.commit ? packageInfo.requested_revision : undefined}
                    />
                    <VersionMetadataLine label="Source" value={packageInfo.source_url} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ color: "#4B5563", fontSize: "14px" }}>
              No version information was returned.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setVersionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function a11yProps(index: number): { id: string; "aria-controls": string } {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default Header;
