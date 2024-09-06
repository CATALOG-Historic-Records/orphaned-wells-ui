import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getProjectData, uploadDocument, deleteProject, updateProject } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { callAPI } from '../../assets/helperFunctions';
import { convertFiltersToMongoFormat } from '../../assets/helperFunctions';

export default function Project() {
    let params = useParams(); 
    let navigate = useNavigate();
    const [ records, setRecords ] = useState([])
    const [ projectData, setProjectData ] = useState({attributes: [], id_: params.id})
    const [ showDocumentModal, setShowDocumentModal ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    const [ openUpdateNameModal, setOpenUpdateNameModal ] = useState(false)
    const [ projectName, setProjectName ] = useState("")
    const [ recordCount, setRecordCount ] = useState(0)
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ pageSize, setPageSize ] = useState(100)
    const [ sortBy, setSortBy ] = useState('dateCreated')
    const [ sortAscending, setSortAscending ] = useState(1)
    const [ filterBy, setFilterBy ] = useState(
        localStorage.getItem("appliedFilters") ? 
        (
            JSON.parse(localStorage.getItem("appliedFilters"))[params.id] || []
        ) : 
        []
    )

    useEffect(() => {
        loadData()
    }, [params.id, pageSize, currentPage, sortBy, sortAscending, filterBy])

    useEffect(() => {
        setCurrentPage(0)
    }, [sortBy, sortAscending, filterBy])

    const loadData = () => {
        let sort = [sortBy, sortAscending]
        let args = [params.id, currentPage, pageSize, sort, convertFiltersToMongoFormat(filterBy)]
        callAPI(
            getProjectData,
            args,
            handleSuccess,
            (e) => {console.error('error getting project data: ',e)}
        )
    }

    const handleSuccess = (data) => {
        setRecords(data.records)
        setProjectData(data.project_data)
        setProjectName(data.project_data.name)
        setRecordCount(data.record_count)
    }

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
    }

    const handleUploadDocument = (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        callAPI(
            uploadDocument,
            [formData, projectData.id_],
            handleSuccessfulDocumentUpload,
            (e) => {console.error('error on file upload: ',e)}
        )
    }

    const handleSuccessfulDocumentUpload = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

    const handleUpdateProject = () => {
        setOpenUpdateNameModal(true)
    }

    const handleDeleteProject = () => {
        setOpenDeleteModal(false)
        callAPI(
            deleteProject,
            [projectData.id_],
            (data) => navigate("/projects", {replace: true}),
            (e) => {console.error('error on deleting project: ',e)}
        )
    }

    const handleChangeProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleUpdateProjectName = () => {
        setOpenUpdateNameModal(false)
        callAPI(
            updateProject,
            [params.id, {name: projectName}],
            (data) => window.location.reload(),
            (e) => console.error('error on updating project name: ',e)
        )
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                handleClickButton={() => setShowDocumentModal(true)}
                actions={(localStorage.getItem("role") && localStorage.getItem("role") === "10") ?
                    {
                        "Change project name": handleUpdateProject, 
                        "Delete project": () => setOpenDeleteModal(true),
                    }
                    :
                    {
                        "Change project name": handleUpdateProject, 
                    }
                }
                previousPages={{"Projects": () => navigate("/projects", {replace: true})}}
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    projectData={projectData}
                    records={records}
                    setRecords={setRecords}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    sortBy={sortBy}
                    sortAscending={sortAscending}
                    recordCount={recordCount}
                    setPageSize={setPageSize}
                    setCurrentPage={setCurrentPage}
                    appliedFilters={filterBy}
                    setAppliedFilters={setFilterBy}
                    setSortBy={setSortBy}
                    setSortAscending={setSortAscending}
                />
            </Box>
            { showDocumentModal && 
                <UploadDocumentsModal 
                    setShowModal={setShowDocumentModal}
                    handleUploadDocument={handleUploadDocument}
                />
            }
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this project?"
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
                textLabel='Project Name'
                handleEditText={handleChangeProjectName}
                handleSave={handleUpdateProjectName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            
        </Box>
    );
}