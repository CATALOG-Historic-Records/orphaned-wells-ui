import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectsListPage from './views/ProjectsListPage/ProjectsListPage';
import Project from './views/ProjectPage/ProjectPage';
import RecordGroup from './views/RecordGroupPage/RecordGroupPage';
import Record from './views/RecordPage/RecordPage';
import TeamRecordsPage from './views/TeamRecordsPage/TeamRecordsPage';
import AdminPage from './views/AdminPage/AdminPage';
import Header from './components/Header/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
      contrastText: "#fff" //button text white instead of black
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
          {!window.location.hash.includes("login") && 
            <Header/>
          }
          
          <Routes> 
          <Route 
              path="record/:id" 
              element={<Record />}
          />
          <Route 
              path="project/:id" 
              element={<Project />}
          />
          <Route 
              path="record_group/:id" 
              element={<RecordGroup />}
          />
          <Route 
              path="records" 
              element={<TeamRecordsPage />}
          />
          <Route 
              path="projects" 
              element={<ProjectsListPage/>} 
          />
          <Route
              path="users" 
              element={<AdminPage/>}
          />
          <Route
              path="*" 
              element={<Navigate replace to="projects" />}
          />
          </Routes>
    </div>
    </ThemeProvider>
  );
}

export default App;
