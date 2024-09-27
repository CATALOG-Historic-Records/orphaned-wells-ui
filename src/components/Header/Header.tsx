import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Avatar, Tabs, Tab } from '@mui/material';
import { logout } from '../../assets/helperFunctions';
import { useUserContext } from '../../usercontext';


const Header = (props: any) => {
  const navigate = useNavigate();
  const { user, username, userPhoto, userRole} = useUserContext();
  const [anchorAr, setAnchorAr] = useState<null | HTMLElement>(null);
  const [profileActions, setProfileActions] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const styles = {
    iconLeft: {
      top: 5,
      color: "black",
    },
    icon: {
      top: 5,
      color: "black",
      right: 5
    },
    avatar: {
      width: 24,
      height: 24
    },
    tabPanel: {
      marginLeft: 10,
    },
    logo: {
      marginTop: 2.5,
      marginLeft: "1em",
      width: "2.5em",
      height: "2.5em",
      borderRadius: "50%",
      display: "inline-block",
      verticalAlign: "middle",
      cursor: "pointer"
    },
  }

  useEffect(() => {
    if (window.location.hash.includes("project")) {
      setTabValue(0);
    } else if (window.location.hash.includes("record")) {
      setTabValue(1);
    } else if (window.location.hash.includes("users")) {
      setTabValue(2);
    } else {
      setTabValue(0);
    }
  }, [props]);

  const handleNavigateHome = () => {
    navigate("/", { replace: true });
  }

  const handleShowProfileActions = (event: React.MouseEvent<HTMLElement>) => {
    setProfileActions(!profileActions);
    setAnchorAr(event.currentTarget);
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue !== tabValue) {
      let newLocation: string;
      if (newValue === 0) newLocation = "projects";
      else if (newValue === 1) newLocation = "records";
      else if (newValue === 2) newLocation = "users";
      else newLocation = "/"
      navigate(newLocation, { replace: true });
    }
  };

  return (
    <div id="Header">
      <div className="titlebar">
        <img onClick={handleNavigateHome} style={styles.logo} src="./img/OGRRE_logo.svg" alt="Logo"></img>
        <div id="titlebar-name" style={{ cursor: 'pointer' }} onClick={handleNavigateHome}>
          OGRRE
        </div>
        <div style={styles.tabPanel}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="process tabs" centered
            textColor='inherit'
            TabIndicatorProps={{ style: { background: '#727272' } }}
          >
            <Tab label="Projects" {...a11yProps(0)} />
            <Tab label="Records" {...a11yProps(1)} disabled />
            {userRole && userRole === "10" &&
              <Tab label="Users" {...a11yProps(2)} />
            }
          </Tabs>
        </div>

        <div className="right">
          <IconButton sx={styles.icon} onClick={handleShowProfileActions}>
            <Avatar sx={styles.avatar} alt={username} src={userPhoto}/>
            
          </IconButton>
          <Menu
            id="actions-list"
            anchorEl={anchorAr}
            open={profileActions}
            onClose={() => setProfileActions(false)}
          >
            <MenuItem onClick={logout}>Sign out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default Header;