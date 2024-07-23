import {useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Tooltip} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { processor_data } from '../../assets/processors';
import { addProject } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

export default function NewProjectDialog(props) {
    const { open, onClose } = props;
    const [ projectName, setProjectName ] = useState("")
    const [ projectDescription, setProjectDescription ] = useState("")
    const [ selectedProcessor, setSelectedProcessor ] = useState({processorId: null})
    const [ disableCreateButton, setDisableCreateButton ] = useState(true)
    const dialogHeight = '85vh'
    const dialogWidth = '60vw'
    const processors = processor_data[process.env.REACT_APP_STATE]

    const descriptionElementRef = useRef(null);
    useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);

    useEffect(() => {
        if (projectName !== "" && selectedProcessor.processorId !== null && disableCreateButton) {
            setDisableCreateButton(false)
        } else if ((projectName === "" || selectedProcessor.processorId === null) && !disableCreateButton){
            setDisableCreateButton(true)
        }
      }, [projectName, selectedProcessor]);


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
            paddingX: 1
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
    }

    const handleClose = () => {
        onClose()
    };

    const handleSelectProcessor = (processorId, idx) => {
        if (selectedProcessor.processorId === processorId) setSelectedProcessor({processorId: null})
        else {
            setSelectedProcessor({processorId: processorId, idx: idx})
        }
    }

    const getImageStyle = (processorId) => {
        let styling = {...styles.processorImage}
        if (selectedProcessor.processorId === processorId) {
            styling["border"] = "1px solid #2196F3"
        }
        return styling
    }

    const handleCreateProject = () => {
        // check that project has name

        // check that there is a processor selected
        let body = {
            name: projectName,
            description: projectDescription,
            state: processors[selectedProcessor.idx].state,
            history: [],
            attributes: processors[selectedProcessor.idx].attributes,
            documentType: processors[selectedProcessor.idx].documentType,
            processorId: processors[selectedProcessor.idx].id,
        }
        callAPI(
            addProject,
            [body],
            handleSuccessfulProjectCreation,
            (e) => console.error('error on project add ',e)
        )
    }

    const handleSuccessfulProjectCreation = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

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
                            // size="small"
                            value={projectName}
                            onChange={(event) => setProjectName(event.target.value)}
                            sx={styles.projectName}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined" 
                            // size="small"
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
                                        {idx+1}. {processorData.displayName}
                                    </p>
                                    <Box sx={styles.processorImageBox} onClick={() => handleSelectProcessor(processorData.id, idx)}>
                                        <Tooltip title={processorData.documentType}>
                                            <img src={processorData.img} style={getImageStyle(processorData.id)}/>
                                        </Tooltip>
                                    </Box>
                                    
                                </Grid>
                            ))
                            }
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
    )
}

