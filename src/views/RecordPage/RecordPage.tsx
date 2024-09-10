import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getRecordData, updateRecord, deleteRecord, getNextRecord, getPreviousRecord } from '../../services/app.service';
import { callAPI, useKeyDown } from '../../assets/helperFunctions';
import Subheader from '../../components/Subheader/Subheader';
import Bottombar from '../../components/BottomBar/BottomBar';
import DocumentContainer from '../../components/DocumentContainer/DocumentContainer';
import PopupModal from '../../components/PopupModal/PopupModal';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { RecordData, handleChangeValueSignature } from '../../types';

interface PreviousPages {
    [key: string]: () => void;
}

const Record = () => {
    const [recordData, setRecordData] = useState<RecordData>({} as RecordData);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateNameModal, setOpenUpdateNameModal] = useState(false);
    const [recordName, setRecordName] = useState("");
    const [previousPages, setPreviousPages] = useState<PreviousPages>({ "Projects": () => navigate("/projects", { replace: true }) });
    const [showErrorBar, setShowErrorBar] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showResetPrompt, setShowResetPrompt] = useState(false);
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100%"
        },
        innerBox: {
            paddingTop: 2,
            paddingBottom: 2,
            paddingX: 5,
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
    }, [params.id]);

    const handleFailedFetchRecord = (data: any, response_status?: number) => {
        if (response_status === 303) {
            if (data.direction === "previous") {
                handleClickPrevious(data.recordData, true);
            } else {
                handleClickNext(data.recordData, true);
            }
        } else {
            console.error('error getting record data: ', data);
        }
    }

    const handleSuccessfulFetchRecord = (data: RecordData) => {
        setRecordData(data);
        setRecordName(data.name);
        let tempPreviousPages: PreviousPages = {
            "Projects": () => navigate("/projects", { replace: true }),
        };
        tempPreviousPages[data.project_name] = () => navigate("/project/" + data.project_id, { replace: true });
        setPreviousPages(tempPreviousPages);
    }

    const handleChangeRecordName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecordName(event.target.value);
    }

    const handleUpdateRecordName = () => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateRecord,
            [params.id, { data: { name: recordName }, type: "name" }],
            (data) => window.location.reload(),
            handleFailedUpdate
        );
    }

    const handleUpdateRecord = () => {
        callAPI(
            updateRecord,
            [params.id, { data: recordData, type: "attributesList" }],
            handleSuccessfulAttributeUpdate,
            handleFailedUpdate
        );
    }

    const handleSuccessfulAttributeUpdate = (data: RecordData) => {
        let tempRecordData = { ...recordData } as RecordData;
        tempRecordData["attributesList"] = data["attributesList"]
        setRecordData(tempRecordData);
    }

    const handleFailedUpdate = (data: any, response_status?: number) => {
        if (response_status === 403) {
            setShowErrorBar(true);
            setErrorMsg(`Unable to update record: ${data.detail}. Returning to records list in 5 seconds.`);
            setTimeout(() => {
                goToProject();
            }, 5000);
        } else {
            console.error('error updating record data: ', data);
        }
    }

    const handleChangeValue: handleChangeValueSignature = (event, topLevelIndex, isSubattribute, subIndex) => {
        let tempRecordData = { ...recordData };
        let tempAttributesList = [...tempRecordData.attributesList];
        let tempAttribute: any;
        if (isSubattribute) {
            let value = event.target.value;
            tempAttribute = tempAttributesList[topLevelIndex];
            let tempSubattributesList = [...tempAttribute["subattributes"]];
            let tempSubattribute = tempSubattributesList[subIndex!];
            tempSubattribute.value = value;
            tempAttribute.edited = true;
            tempSubattribute.edited = true;
            tempAttribute["subattributes"] = tempSubattributesList;
        } else {
            tempAttribute = tempAttributesList[topLevelIndex];
            let value = event.target.value;
            tempAttribute.value = value;
            tempAttribute.edited = true;
        }
        tempAttributesList[topLevelIndex] = tempAttribute;
        tempRecordData.attributesList = tempAttributesList;
        setRecordData(tempRecordData);
    }

    const handleDeleteRecord = () => {
        setOpenDeleteModal(false);
        callAPI(
            deleteRecord,
            [params.id],
            goToProject,
            (e) => console.error('error on deleting record: ', e)
        );
    }

    const goToProject = () => {
        navigate("/project/" + recordData.project_id, { replace: true });
    }

    const handleClickNext = (incomingData?: any, useIncomingData?: boolean) => {
        let body = { data: recordData, reviewed: false };
        if (useIncomingData) body.data = incomingData;
        callAPI(
            getNextRecord,
            [body],
            handleSuccessNavigateRecord,
            handleFailedFetchRecord
        );
    }

    const handleClickPrevious = (incomingData?: any, useIncomingData?: boolean) => {
        let body = useIncomingData ? incomingData : recordData;
        callAPI(
            getPreviousRecord,
            [body],
            handleSuccessNavigateRecord,
            handleFailedFetchRecord
        );
    }

    const handleClickMarkReviewed = () => {
        let body = { data: recordData, reviewed: true, review_status: "reviewed" };
        callAPI(
            getNextRecord,
            [body],
            handleSuccessNavigateRecord,
            (e) => console.error("unable to go to mark record reviewed: " + e)
        );
    }

    useKeyDown("ArrowLeft", undefined, undefined, handleClickPrevious, undefined);
    useKeyDown("ArrowRight", undefined, undefined, handleClickNext, handleClickMarkReviewed);

    const handleSuccessNavigateRecord = (data: any) => {
        navigate("/record/" + data._id, { replace: true });
    }

    const promptResetRecord = () => {
        setShowResetPrompt(true);
    }

    const handleUpdateReviewStatus = (new_status: string) => {
        let data_update;
        if (new_status === "unreviewed") {
            let tempRecordData = { ...recordData };
            tempRecordData["review_status"] = "unreviewed";
            data_update = tempRecordData;
        } else data_update = { review_status: new_status };
        callAPI(
            updateRecord,
            [params.id, { data: data_update, type: "review_status" }],
            (data) => window.location.reload(),
            handleFailedUpdate
        );
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
            />
            <Box sx={styles.innerBox}>
                <DocumentContainer
                    imageFiles={recordData.img_urls}
                    attributesList={recordData.attributesList}
                    handleChangeValue={handleChangeValue}
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
            {showErrorBar &&
                <ErrorBar
                    errorMessage={errorMsg}
                    setOpen={setShowErrorBar}
                />
            }
        </Box>
    );
}

export default Record;