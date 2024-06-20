import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getRecordData, updateRecord, deleteRecord, getNextRecord, getPreviousRecord } from '../../services/app.service';
import { callAPI, useKeyDown } from '../../assets/helperFunctions';
import Subheader from '../../components/Subheader/Subheader';
import Bottombar from '../../components/BottomBar/BottomBar';
import DocumentContainer from '../../components/DocumentContainer/DocumentContainer';
import PopupModal from '../../components/PopupModal/PopupModal';
import ErrorBar from '../../components/ErrorBar/ErrorBar';


export default function Record() {
    const [ recordData, setRecordData ] = useState({})
    const [ fullAttributesList, setFullAttributesList ] = useState([])
    const [ wasEdited, setWasEdited ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    const [ openUpdateNameModal, setOpenUpdateNameModal ] = useState(false)
    const [ recordName, setRecordName ] = useState("")
    const [ previousPages, setPreviousPages ] = useState({"Projects": () => navigate("/projects", {replace: true}),})
    const [ showErrorBar, setShowErrorBar ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState("")
    const [ showResetPrompt, setShowResetPrompt ] = useState(false)
    let params = useParams(); 
    let navigate = useNavigate();

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100%"
        },
        innerBox: {
            paddingTop:2,
            paddingBottom: 2,
            paddingX:5,
        },
        navigationBox: {
            paddingX: 5,
            paddingTop: 2,
            display: "flex",
            justifyContent: "space-between",
        },
        navigationBoxBottom: {
            paddingX: 5,
            paddingBottom: 5,
            display: "flex",
            justifyContent: "space-between",
        },
    }

    useEffect(() => {
        callAPI(
            getRecordData,
            [params.id],
            handleSuccessfulFetchRecord,
            handleFailedFetchRecord,
        )
    }, [params.id])

    const handleFailedFetchRecord = (data, response_status) => {
        if (response_status === 303) {
            if (data.direction === "previous") {
                handleClickPrevious(data.recordData, true)
            } else {
                handleClickNext(data.recordData, true)
            }
        }else {
            console.error('error getting record data: ',data)
        }
    }

    const handleSuccessfulFetchRecord = (data) => {
        setRecordData(data)
        setRecordName(data.name)
        let tempPreviousPages = {
            "Projects": () => navigate("/projects", {replace: true}),
        }
        tempPreviousPages[data.project_name] = () => navigate("/project/"+data.project_id, {replace: true})
        setPreviousPages(tempPreviousPages)

        let tempFullAttributesList = []
        let topLevelIndex = 0
        for (let attribute of data.attributesList) {
            attribute["idx"] = topLevelIndex
            tempFullAttributesList.push(attribute)
            if (attribute.subattributes) {
                let i = 0
                for (let sub_attribute of attribute.subattributes) {
                    sub_attribute["idx"] = topLevelIndex
                    sub_attribute["sub_idx"] = i
                    tempFullAttributesList.push(sub_attribute)
                    i+=1
                }
            }
            topLevelIndex+=1
        }
        setFullAttributesList(tempFullAttributesList)
    }

    const handleChangeRecordName = (event) => {
        setRecordName(event.target.value)
    }

    const handleUpdateRecordName = () => {
        setOpenUpdateNameModal(false)
        callAPI(
            updateRecord,
            [params.id, {data: {name: recordName}, type: "name"}],
            (data) => window.location.reload(),
            handleFailedUpdate
        )
    }

    const handleUpdateRecord = () => {
        callAPI(
            updateRecord,
            [params.id, {data: recordData, type: "attributesList"}],
            handleSuccessfulAttributeUpdate,
            handleFailedUpdate
        )
    }

    const handleSuccessfulAttributeUpdate = (data) => {
        setWasEdited(false)
        let tempRecordData = {...recordData}
        for (let key of Object.keys(data)) {
            tempRecordData[key] = data[key]
        }
        setRecordData(tempRecordData)
    }

    const handleFailedUpdate = (data, response_status) => {
        if (response_status === 403) {
            setShowErrorBar(true)
            setErrorMsg(`Unable to update record: ${data.detail}. Returning to records list in 5 seconds.`)
            setTimeout(() => {
                goToProject()
            }, 5000)

        }else {
            console.error('error updating record data: ',data)
        }
    }

    const handleChangeValue = (event, topLevelIndex, isSubattribute, subIndex) => {
        let tempRecordData = {...recordData}
        let tempAttributesList = {...tempRecordData.attributesList}
        let tempAttribute
        let attribute
        if (isSubattribute) {
            let value = event.target.value
            tempAttribute = tempAttributesList[topLevelIndex]
            let tempSubattributesList = [...tempAttribute["subattributes"]]
            let tempSubattribute = tempSubattributesList[subIndex]
            tempSubattribute.value = value
            tempAttribute.edited = true
            tempSubattribute.edited = true
            tempAttribute["subattributes"] = tempSubattributesList
        } else {
            tempAttribute = tempAttributesList[topLevelIndex]
            let value = event.target.value
            tempAttribute.value = value
            tempAttribute.edited = true
        }
        tempAttributesList[attribute] = tempAttribute
        tempRecordData.attributes = tempAttributesList
        setRecordData(tempRecordData)
        setWasEdited(true)
        
    }

    const handleDeleteRecord = () => {
        setOpenDeleteModal(false)
        callAPI(
            deleteRecord,
            [params.id],
            goToProject,
            (e) => console.error('error on deleting record: ',e)
        )
    }

    const goToProject = () => {
        navigate("/project/"+recordData.project_id, {replace: true})
    }

    const handleClickNext = (incomingData, useIncomingData) => {
        let body = {data: recordData, reviewed: false}
        if (useIncomingData) body.data = incomingData
        callAPI(
            getNextRecord,
            [body],
            handleSuccessNavigateRecord,
            handleFailedFetchRecord
        )
    }

    const handleClickPrevious = (incomingData, useIncomingData) => {
        let body
        if (useIncomingData) body = incomingData
        else body = recordData
        callAPI(
            getPreviousRecord,
            [body],
            handleSuccessNavigateRecord,
            handleFailedFetchRecord
        )
    }

    const handleClickMarkReviewed = () => {
        let body = {data: recordData, reviewed: true, review_status: "reviewed"}
        callAPI(
            getNextRecord,
            [body],
            handleSuccessNavigateRecord,
            (e) => console.error("unable to go to mark record reviewed: "+e)
        )
    }

    useKeyDown("ArrowLeft", null, null, handleClickPrevious, null);

    useKeyDown("ArrowRight", null, null, handleClickNext, handleClickMarkReviewed);

    const handleSuccessNavigateRecord = (data) => {
        navigate("/record/"+data._id, {replace: true})
    }

    const promptResetRecord = () => {
        setShowResetPrompt(true)
    }

    const handleUpdateReviewStatus = (new_status) => {
        // setShowResetPrompt(false)
        let data_update = { review_status: new_status }
        if (new_status === "unreviewed")  {
            let tempRecordData = {...recordData}
            tempRecordData["review_status"] = "unreviewed"
            data_update = tempRecordData
        }
        callAPI(
            updateRecord,
            [params.id, {data: data_update, type: "review_status"}],
            (data) => window.location.reload(),
            handleFailedUpdate
        )
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={`${recordData.recordIndex !== undefined ? recordData.recordIndex : ""}. ${recordData.name !== undefined ? recordData.name : ""}`}
                actions={(localStorage.getItem("role") && localStorage.getItem("role") === "10") ? 
                    {
                        "Change record name": () => setOpenUpdateNameModal(true),
                        "Delete record": () => setOpenDeleteModal(true)
                    }
                    :
                    {
                        "Change record name": () => setOpenUpdateNameModal(true),
                    }
                }
                previousPages={previousPages}
                status={recordData.review_status}
                // subtext={recordData.notes}
            />
            <Box sx={styles.innerBox}>
                <DocumentContainer
                    image={recordData.img_url}
                    attributesList={recordData.attributesList}
                    handleChangeValue={handleChangeValue}
                    // attributesList={attributesList}
                    fullAttributesList={fullAttributesList}
                    handleUpdateRecord={handleUpdateRecord}
                />
            </Box>
            <Bottombar
                onPreviousButtonClick={handleClickPrevious}
                onNextButtonClick={handleClickNext}
                onReviewButtonClick={handleClickMarkReviewed}
                recordData={recordData}
                handleUpdateReviewStatus={handleUpdateReviewStatus}
                promptResetRecord={promptResetRecord}
            />
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this record?"
                handleSave={handleDeleteRecord}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={recordName}
                textLabel='Record Name'
                handleEditText={handleChangeRecordName}
                handleSave={handleUpdateRecordName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                open={showResetPrompt}
                handleClose={() => setShowResetPrompt(false)}
                text="Setting status to unreviewed will reset any changes made. Are you sure you want to continue?"
                handleSave={() => handleUpdateReviewStatus("unreviewed")}
                buttonText='Reset'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            { showErrorBar && 
                <ErrorBar
                    errorMessage={errorMsg}
                    setOpen={setShowErrorBar}
                />
            }
            
        </Box>
    );
}