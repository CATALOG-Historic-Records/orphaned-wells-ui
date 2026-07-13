import "./Header.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderStyles as styles } from "../../styles";
import { useUserContext } from "../../usercontext";
import { changeTeam, fetchTeams, getOgrreVersion } from "../../services/app.service";
import { ChangeTeamResponse } from "../../types";
import ChangeTeamDialog from "./ChangeTeamDialog";
import OgrreVersionDialog, { OgrreVersionInfo } from "./OgrreVersionDialog";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { logout, callAPI } from "../../util";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Logout from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const getApiErrorMessage = (error: any, fallback: string) => {
  if (typeof error === "string") return error;
  return error?.message || error?.detail || fallback;
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
      <OgrreVersionDialog
        open={versionDialogOpen}
        versionInfo={versionInfo}
        loading={versionLoading}
        error={versionError}
        onClose={() => setVersionDialogOpen(false)}
      />
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
