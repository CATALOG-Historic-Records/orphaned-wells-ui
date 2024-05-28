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
    const [ attributesList, setAttributesList ] = useState([])
    const [ wasEdited, setWasEdited ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    const [ openUpdateNameModal, setOpenUpdateNameModal ] = useState(false)
    const [ recordName, setRecordName ] = useState("")
    const [ previousPages, setPreviousPages ] = useState({"Projects": () => navigate("/projects", {replace: true}),})
    const [ showErrorBar, setShowErrorBar ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState("")
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

        // convert attributes to list
        let tempAttributesList = []
        for (let attributeKey of Object.keys(data.attributes)) {
            let attribute = data.attributes[attributeKey]
            let attributeEntry = attribute
            attributeEntry["key"] = attributeKey
            tempAttributesList.push(attributeEntry)
            if (attribute.subattributes) {
                for (let sub_attributeKey of Object.keys(attribute.subattributes)) {
                    let sub_attribute = attribute.subattributes[sub_attributeKey]
                    let sub_attributeEntry = sub_attribute
                    sub_attributeEntry["key"] = sub_attributeKey
                    sub_attributeEntry["isSubattribute"] = true
                    sub_attributeEntry["topLevelAttribute"] = attributeKey
                    tempAttributesList.push(sub_attributeEntry)
                }
            }
        }
        setAttributesList(tempAttributesList)
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
            [params.id, {data: recordData, type: "attributes"}],
            (data) => setWasEdited(false),
            handleFailedUpdate
        )
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

    const handleChangeValue = (event, isSubattribute, topLevelAttribute) => {
        let tempRecordData = {...recordData}
        let tempAttributes = {...tempRecordData.attributes}
        let tempAttribute
        let attribute
        if (isSubattribute) {
            attribute = topLevelAttribute
            let subattribute = event.target.name
            let value = event.target.value
            tempAttribute = {...tempAttributes[attribute]}
            let tempSubattributes = {...tempAttribute["subattributes"]}
            let tempSubattribute = {...tempSubattributes[subattribute]}
            tempSubattribute.value = value
            tempAttribute.edited = true
            tempSubattribute.edited = true
            tempSubattributes[subattribute] = tempSubattribute
            tempAttribute["subattributes"] = tempSubattributes
        } else {
            attribute = event.target.name
            let value = event.target.value
            tempAttribute = {...tempAttributes[attribute]}
            tempAttribute.value = value
            tempAttribute.edited = true
        }
        tempAttributes[attribute] = tempAttribute
        tempRecordData.attributes = tempAttributes
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

    const handleUpdateReviewStatus = (new_status) => {
        callAPI(
            updateRecord,
            [params.id, {data: {review_status: new_status}, type: "review_status"}],
            (data) => window.location.reload(),
            handleFailedUpdate
        )
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={`${recordData.recordIndex !== undefined ? recordData.recordIndex : ""}. ${recordData.name !== undefined ? recordData.name : ""}`}
                actions={{
                    "Change name": () => setOpenUpdateNameModal(true),
                    "Delete record": () => setOpenDeleteModal(true)
                }}
                previousPages={previousPages}
                status={recordData.review_status}
                // subtext={recordData.notes}
            />
            <Box sx={styles.innerBox}>
                <DocumentContainer
                    image={recordData.img_url}
                    attributes={recordData.attributes}
                    handleChangeValue={handleChangeValue}
                    attributesList={attributesList}
                    handleUpdateRecord={handleUpdateRecord}
                />
            </Box>
            <Bottombar
                onPreviousButtonClick={handleClickPrevious}
                onNextButtonClick={handleClickNext}
                onReviewButtonClick={handleClickMarkReviewed}
                recordData={recordData}
                handleUpdateReviewStatus={handleUpdateReviewStatus}
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
            { showErrorBar && 
                <ErrorBar
                    errorMessage={errorMsg}
                    setOpen={setShowErrorBar}
                />
            }
            
        </Box>
    );
}