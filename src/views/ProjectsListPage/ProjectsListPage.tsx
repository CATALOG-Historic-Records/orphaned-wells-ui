import { useState, useEffect } from 'react';
import { getProjects } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import { useUserContext } from '../../usercontext';
import Subheader from '../../components/Subheader/Subheader';
import ProjectsListTable from '../../components/ProjectsListTable/ProjectsListTable';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { Box } from '@mui/material';

const ProjectsListPage = () => {
    const { userPermissions} = useUserContext();
    const [projects, setProjects] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>("")

    useEffect(() => {
        callAPI(getProjects, [], handleSuccess, handleError);
    }, []);

    const handleSuccess = (data: any) => {
        setProjects(data);
    };

    const handleError = (e: Error) => {
        console.error(e);
        setUnableToConnect(true);
    };

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
        },
    };

    const handleClickNewProject = () => {
        setShowNewProjectDialog(true);
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Projects"
                buttonName={(userPermissions && userPermissions.includes('create_project')) ? "New Project" : undefined}
                handleClickButton={handleClickNewProject}
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <ProjectsListTable projects={projects} />
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewProjectDialog 
                    open={showNewProjectDialog} 
                    onClose={() => setShowNewProjectDialog(false)}
                    setErrorMsg={setErrorMsg}
                />
        </Box>
            <ErrorBar
                setErrorMessage={setErrorMsg}
                errorMessage={errorMsg}
            />
            
        </Box>
    );
};

export default ProjectsListPage;