import { useState } from 'react';   
import { Grid, Box, Modal, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FileUploader } from "react-drag-drop-files";
import { UploadDocumentsModalProps } from '../../types';

const UploadDocumentsModal = (props: UploadDocumentsModalProps) => {
    const { setShowModal, handleUploadDocument } = props;
    const [ showWarning, setShowWarning ] = useState(false);
    const [ warningMessage, setWarningMessage ] = useState("");
    const [ file, setFile ] = useState<File | null>(null);
    const maxFileSize = 10;
    const fileTypes: string[] = ["tiff", "tif", "pdf", "png", "jpg", "jpeg", "zip"];

    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 650,
            bgcolor: 'background.paper',
            border: '1px solid #AEAEAE',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
        },
        header: {
            marginTop: 5
        },
        button: {
            borderRadius: '8px', 
            width: 200,
        },
        sampleFile: {
            textDecoration: "none",
            fontWeight: "bold",
            cursor: 'pointer'
        },
        fileUploaderBox: {
            border: showWarning ? '2px dashed #E07174' : '2px dashed black',
            borderRadius: 2,
            p: 8,
            cursor: "pointer",
            backgroundColor: showWarning ? '#FDF7F7' : 'white',
        },
        uploadIcon: {
            color: showWarning ? "#D3242F" : "#2196F3",
            paddingBottom: 3
        },
        uploadContainerBox: {
            display: 'flex', 
            justifyContent: 'center'
        },
        uploadContainerItem: {
            display: 'flex', 
            justifyContent: 'center'
        },
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleClickUpload = () => {
        if (file === null) {
            setWarningMessage("Please upload a valid file");
            setShowWarning(true);
            setTimeout(() => {
                setShowWarning(false);
            }, 5000);
        } else {
            handleUploadDocument(file);
            setShowWarning(false);
            setShowModal(false);
        }
    };

    const fileTypeError = () => {
        setWarningMessage("Unsupported file type");
        setShowWarning(true);
    };

    const fileSizeError = () => {
        setWarningMessage("File too large");
        setShowWarning(true);
    };

    const fileUploaderContainer = () => {
        return (
            <Box sx={styles.fileUploaderBox}>
                <Box sx={styles.uploadContainerBox}>
                    <IconButton sx={styles.uploadIcon}>
                        <UploadFileIcon/>
                    </IconButton>
                </Box>
                <Box sx={styles.uploadContainerBox}>
                    <h3 style={{marginTop: 0, paddingTop: 0, color: "#2196F3", textDecoration: "underline"}}>Browse files</h3>
                </Box>
                <Box sx={styles.uploadContainerBox}>
                    <p style={{marginTop: 0, paddingTop: 0}}>or Drag and Drop File</p>
                </Box>
                {showWarning && 
                    <Box sx={styles.uploadContainerBox}>
                        <p style={{marginTop: 0, paddingTop: 0, color: "#AD3244", fontWeight: "bold"}}>{warningMessage}</p>
                    </Box>
                }
                <Box sx={styles.uploadContainerBox}>
                    <p style={{margin: 0, padding: 0, color: "#9B9B9B"}}>Choose from supported files:</p>
                </Box>
                <Box sx={styles.uploadContainerBox}>
                    <p style={{marginTop: 0, paddingTop: 0, color: "#9B9B9B"}}>
                        {fileTypes.map((v, i) => {
                            if (i === fileTypes.length - 1) return "or " + v.toUpperCase() + ` (max ${maxFileSize}MB)`;
                            else return v.toUpperCase() + ", ";
                        })}
                    </p>
                </Box>
                <Box sx={styles.uploadContainerBox}>
                    <p style={{margin: 0, padding: 0}}>{file === null ? "" : file.name}</p>
                </Box>
            </Box>
        );
    };

    const DragDrop = () => {
        const handleChange = (file: File) => {
            setWarningMessage("");
            setShowWarning(false);
            setFile(file);
        };
        return (
            <FileUploader 
                handleChange={handleChange} 
                name="file" 
                types={fileTypes}
                children={fileUploaderContainer()}
                onTypeError={fileTypeError}
                onSizeError={fileSizeError}
                maxSize={maxFileSize}
            />
        );
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Grid container sx={styles.modalStyle} spacing={1}>
                <Grid item xs={9}>
                    <h2 style={styles.header}>Upload document(s)</h2>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight: '10px'}}>
                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {DragDrop()}
                </Grid>
                <Grid item xs={12}>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <Button variant="contained" style={styles.button} onClick={handleClickUpload} disabled={file === null}>Upload File</Button>
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default UploadDocumentsModal;