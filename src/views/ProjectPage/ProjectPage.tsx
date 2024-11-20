import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import RecordGroupsTable from '../../components/RecordGroupsTable/RecordGroupsTable';
import NewRecordGroupDialog from '../../components/NewRecordGroupDialog/NewRecordGroupDialog';
import PopupModal from '../../components/PopupModal/PopupModal';
import ProjectTabs from '../../components/ProjectTabs/ProjectTabs';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { useUserContext } from '../../usercontext';
import { getRecordGroups, updateProject, deleteProject } from '../../services/app.service';
import { callAPI, DEFAULT_FILTER_OPTIONS } from '../../assets/util';
import { ProjectData } from '../../types';

const Project = () => {
    let params = useParams();
    const navigate = useNavigate();
    const { userPermissions} = useUserContext();
    const [projectData, setProjectData] = useState({} as ProjectData)
    const [projectName, setProjectName] = useState("")
    const [record_groups, setRecordGroups] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewRecordGroupDialog, setShowNewRecordGroupDialog] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateNameModal, setOpenUpdateNameModal] = useState(false);
    const [currentTab, setCurrentTab] = useState(0)
    const [errorMsg, setErrorMsg] = useState<string | null>("")
    const [filters, setFilters] = useState({...DEFAULT_FILTER_OPTIONS})
    const tabs = ["Record Groups", "All Records"]

    useEffect(() => {
        if (tabs[currentTab] === "Record Groups") callAPI(getRecordGroups, [params.id], handleFetchedRecordGroups, handleError);
        else if (tabs[currentTab] === "All Records") {
            if (projectData.record_groups) {
                
            } else {
                console.error("missing project data")
            }
            
        }
    }, [currentTab]);

    useEffect(() => {
        let filterOptions = []
        let selectedFilterOptions = []
        for (let rg of record_groups) {
            filterOptions.push({
                name: rg.name,
                checked: true,
                value: rg._id,
            })
            selectedFilterOptions.push(rg.name)
        }
        let tempFilters = {...filters}
        tempFilters["record_group_id"] = {
            key: 'record_group_id',
            displayName: "Record Group",   
            type: "checkbox",
            operator: 'equals',
            options: filterOptions,
            selectedOptions: selectedFilterOptions
        }
        setFilters(tempFilters)
    },[record_groups])

    const handleFetchedRecordGroups = (data: any) => {
        setRecordGroups(data.record_groups);
        setProjectData(data.project)
        setProjectName(data.project.name)
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

    const handleClickNewRecordGroup = () => {
        setShowNewRecordGroupDialog(true);
    };

    const handleDeleteProject = () => {
        setOpenDeleteModal(false);
        callAPI(
            deleteProject,
            [projectData._id],
            (data: any) => navigate("/projects", { replace: true }),
            handleAPIErrorResponse
        );
    }

    const handleChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    }

    const handleUpdateProjectName = () => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateProject,
            [params.id, { name: projectName }],
            (data: any) => window.location.reload(),
            handleAPIErrorResponse
        );
    }

    const handleUpdateProject = (update: any) => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateProject,
            [params.id, update],
            (data: ProjectData) => setProjectData(data),
            handleAPIErrorResponse
        );
    }

    const handleAPIErrorResponse = (e: any) => {
        setErrorMsg(e.detail)
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName={(userPermissions && userPermissions.includes('create_record_group')) ? "New Record Group" : undefined}
                handleClickButton={handleClickNewRecordGroup}
                previousPages={
                    { 
                        "Projects": () => navigate("/projects", { replace: true }),
                    }
                }
                actions={(userPermissions && userPermissions.includes('manage_project')) ?
                    {
                        "Change project name": () => setOpenUpdateNameModal(true), 
                        "Delete project": () => setOpenDeleteModal(true),
                    }
                    :
                    null
                }
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <div>
                        <ProjectTabs options={tabs} value={currentTab} setValue={setCurrentTab}/>
                        {
                            tabs[currentTab] === "Record Groups" ? 
                                <RecordGroupsTable record_groups={record_groups} />
                            :
                            tabs[currentTab] === "All Records" &&
                                <RecordsTable
                                    location="project"
                                    params={params}
                                    filter_options={filters}
                                    handleUpdate={handleUpdateProject}
                                    recordGroups={record_groups}
                                />
                        }
                        
                    </div>
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewRecordGroupDialog 
                    open={showNewRecordGroupDialog} 
                    onClose={() => setShowNewRecordGroupDialog(false)} 
                    project_id={params.id || ''}
                />
            </Box>
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this record group?"
                handleSave={handleDeleteProject}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={projectName}
                textLabel='Document group Name'
                handleEditText={handleChangeProjectName}
                handleSave={handleUpdateProjectName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            <ErrorBar
                errorMessage={errorMsg}
                setErrorMessage={setErrorMsg}
            />
        </Box>
    );
};

export default Project;