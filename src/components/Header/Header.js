import './Header.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Avatar, Tabs, Tab } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../assets/helperFunctions';

export default function Header(props) {
  let navigate = useNavigate();
  const [ actionsList, setActionsList ] = useState(false)
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ anchorAr, setAnchorAr ] = useState(null);
  const [ profileActions, setProfileActions ] = useState(false)
  const [ tabValue, setTabValue ] = useState(0);

  const styles = {
    iconLeft: {
      top: 5,
      color: "black",
      // right: 5
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
      // backgroundColor: '#F1F3F3',
      // color: '#727272'
    },
  }

  useEffect(() => {
    if (window.location.hash.includes("project")) {
      setTabValue(0)
    } else if (window.location.hash.includes("record")) {
      setTabValue(1)
    }
    else if (window.location.hash.includes("users")) {
      setTabValue(2)
    } 
    else setTabValue(0)
  }, [props])

  const handleNavigateHome = () => {
      // setActionsList(!actionsList)
      navigate("/", {replace: true})
  }

  const handleShowActions = (event) => {
    setActionsList(!actionsList)
    setAnchorEl(event.currentTarget);
  }

  const handleShowProfileActions = (event) => {
    setProfileActions(!actionsList)
    setAnchorAr(event.currentTarget);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== tabValue) {
      let newLocation
      if (newValue === 0) newLocation = "projects"
      else if (newValue === 1) newLocation = "records"
      else if (newValue === 2) newLocation = "users"
      navigate(newLocation, {replace: true})
    }
    
  };
  
    return (
      <div id="Header">
         <div  className="titlebar" > 
          {/* <div id="nawi_logo" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
            <img src={logo} alt="UOW logo"/>
          </div> */}
        <IconButton sx={styles.iconLeft} onClick={handleShowActions}><ListIcon/></IconButton>
        <Menu
          id="actions-list"
          anchorEl={anchorEl}
          open={actionsList}
          onClose={() => setActionsList(false)}
        >
            <MenuItem onClick={handleNavigateHome}>Return to list page</MenuItem>
        </Menu>
        <div id="titlebar-name" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
          OGRRE
        </div>
        <div style={styles.tabPanel}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="process tabs" centered 
            textColor='inherit'
            TabIndicatorProps={{style: {background:'#727272'}}}
          >
            <Tab label="Projects" {...a11yProps(0)} />
            <Tab label="Records" {...a11yProps(1)} disabled/> 
            {localStorage.getItem("role") && localStorage.getItem("role") === "10" && 
              <Tab label="Users" {...a11yProps(2)} />
            }
            
          </Tabs>
        </div>
                      
        <div  className="right" >
        <IconButton sx={styles.icon} onClick={handleShowProfileActions}>
          <Avatar sx={styles.avatar} alt={localStorage.getItem("user_name")} src={localStorage.getItem("user_picture")}/>
        </IconButton>
          
          {/* <IconButton sx={styles.icon} onClick={handleShowProfileActions}><AccountCircleIcon/></IconButton> */}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}