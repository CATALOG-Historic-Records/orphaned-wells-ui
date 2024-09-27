import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addProject, getProcessors } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';
import { Processor } from '../../types';

interface NewProjectDialogProps {
    open: boolean;
    onClose: () => void;
}

const NewProjectDialog = ({ open, onClose }: NewProjectDialogProps) => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [processors, setProcessors] = useState<Processor[]>([])
    const [selectedProcessor, setSelectedProcessor] = useState<Processor>({} as Processor);
    const [disableCreateButton, setDisableCreateButton] = useState(true);
    const dialogHeight = '85vh';
    const dialogWidth = '60vw';
    const state = process.env.REACT_APP_STATE || "illinois";

    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        if (projectName !== "" && selectedProcessor.id && disableCreateButton) {
            setDisableCreateButton(false);
        } else if ((projectName === "" || !selectedProcessor.id) && !disableCreateButton) {
            setDisableCreateButton(true);
        }
    }, [projectName, selectedProcessor]);

    useEffect(() => {
        if (open) {
            let state_code;
            if (state === "illinois") state_code = "IL"
            else if (state === "colorado") state_code = "CO"
            else state_code = "IL"
            callAPI(
                getProcessors,
                [state_code],
                handleSuccessGetProcessors,
                (e: Error) => console.error('error on getting processors ', e)
            );
        }
    }, [open]);

    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },
        projectName: {
            marginBottom: 2
        },
        processorGridItem: {
            paddingX: 1,
            paddingBottom: 5
        },
        processorTextBox: {
            display: "flex",
            justifyContent: "center",
        },
        processorImageBox: {
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
        },
        processorImage: {
            maxHeight: "20vh"
        }
    };

    const handleSuccessGetProcessors = (processor_data: Processor[]) => {
        setProcessors(processor_data)
    }

    const handleClose = () => {
        onClose();
    };

    const handleSelectProcessor = (processorData: Processor) => {
        if (selectedProcessor.id === processorData.id) setSelectedProcessor({ } as Processor);
        else {
            setSelectedProcessor(processorData);
        }
    };

    const getImageStyle = (processorId: string): React.CSSProperties => {
        let styling: React.CSSProperties = { ...styles.processorImage };
        if (selectedProcessor.id === processorId) {
            styling["border"] = "1px solid #2196F3";
        }
        return styling;
    };

    const handleCreateProject = () => {
        let body = {
            name: projectName,
            description: projectDescription,
            state: selectedProcessor.state,
            history: [],
            documentType: selectedProcessor.documentType,
            processorId: selectedProcessor.id,
        };
        callAPI(
            addProject,
            [body],
            handleSuccessfulProjectCreation,
            (e: Error) => console.error('error on project add ', e)
        );
    };

    const handleSuccessfulProjectCreation = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="new-project-dialog"
            aria-describedby="new-project-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle id="new-project-dialog-title">New Project</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    aria-labelledby="new-project-dialog-content-text"
                    component={'span'}
                >
                    <Grid container>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                variant="outlined"
                                value={projectName}
                                onChange={(event) => setProjectName(event.target.value)}
                                sx={styles.projectName}
                                id="project-name-textbox"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={projectDescription}
                                onChange={(event) => setProjectDescription(event.target.value)}
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={2}></Grid>
                        <Grid item xs={5}></Grid>

                        <Grid item xs={12}>
                            <h4>
                                Select document type
                            </h4>
                            <p>
                                Select from following document types of well completion records.
                                Data extraction will work best with one of the following document types.
                            </p>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                {processors.map((processorData, idx) => (
                                    <Grid key={idx} item xs={4} sx={styles.processorGridItem}>
                                        <p style={styles.processorTextBox}>
                                            {idx + 1}. {processorData.displayName}
                                        </p>
                                        <Box sx={styles.processorImageBox} onClick={() => handleSelectProcessor(processorData)}>
                                            <Tooltip title={processorData.documentType}>
                                                <img id={`processor_${idx}`} src={processorData.img} style={getImageStyle(processorData.id)} />
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContentText>
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                    }}
                    disabled={disableCreateButton}
                    onClick={handleCreateProject}
                >
                    Create Project
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default NewProjectDialog;