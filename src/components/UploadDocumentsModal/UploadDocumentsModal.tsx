import { useState, useRef, ChangeEvent } from 'react';
import { Grid, Box, Modal, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FileUploader } from "react-drag-drop-files";
import { UploadDocumentsModalProps } from '../../types';
import UploadDirectory from './UploadDirectory';

const UploadDocumentsModal = (props: UploadDocumentsModalProps) => {
    const { setShowModal, handleUploadDocument } = props;
    const [ showWarning, setShowWarning ] = useState(false);
    const [ warningMessage, setWarningMessage ] = useState("");
    const [ file, setFile ] = useState<File | null>(null);
    const [uploadDirectory, setUploadDirectory] = useState<string>()
    const [uploadDirectoryFiles, setUploadDirectoryFiles ] = useState<any>([])
    const maxFileSize = 10;
    const fileTypes: string[] = ["tiff", "tif", "pdf", "png", "jpg", "jpeg", "zip"];
    const validFileTypes = ['image/png', 'application/pdf', 'image/tiff', 'image/jpeg']
    const inputRef = useRef<HTMLInputElement>(null);

    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 650,
            maxWidth: 650,
            // maxWidth: '80vw',
            bgcolor: 'background.paper',
            border: '1px solid #AEAEAE',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            maxHeight: '75vh',
            overflow: 'scroll',
            overflowX: 'hidden'
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

    const handleChooseDirectory = (e: ChangeEvent<HTMLInputElement>) => {
        // console.log(e.target.files)
        handleDirectoryInput(e.target.files)
        setShowWarning(false);
    }

    const handleBack = () => {
        setUploadDirectory(undefined)
        setUploadDirectoryFiles([])
        setFile(null)
    }

    const handleDirectoryInput = (f: FileList | null) => {
        let files = f || [] as any
        let validFiles = []
        let directoryName
        // console.log(`handling ${files.length} files`)
        for (let file of files) {
            if (validFileTypes.includes(file.type)) {
                validFiles.push(file)
            }
        }
        // console.log(`found ${validFiles.length} valid document files`)
        if (files && files.length && files.length > 0) {
            let filePath = files[0].webkitRelativePath
            let splitPath = filePath.split('/')
            directoryName = splitPath[0]
        }
        setUploadDirectory(directoryName)
        setUploadDirectoryFiles(validFiles)
    }

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
                {/** TODO: convert the below 3 items to a stack? */}
                <Grid item xs={3}>
                    {uploadDirectory && 
                        <Box sx={{display: 'flex', justifyContent: 'flex-start', marginLeft: '10px'}}>
                            <IconButton onClick={handleBack}><ArrowBackIcon/></IconButton>
                        </Box>
                    }
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <h2 style={styles.header}>Upload document(s)</h2>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight: '10px'}}>
                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                    </Box>
                </Grid>
                {uploadDirectory ? 
                    <UploadDirectory
                        setShowModal={setShowModal}
                        directoryName={uploadDirectory}
                        directoryFiles={uploadDirectoryFiles}
                    />  :
                    <>
                        <Grid item xs={12}>
                            {DragDrop()}
                        </Grid>
                        <Grid item xs={12}>
                        <input
                            ref={inputRef}
                            type="file"
                            onChange={handleChooseDirectory}
                            style={{ display: "none" }}
                            multiple
                            {...{ webkitdirectory: '', mozdirectory: '', directory: '' }}
                        />
                        <Box style={{display: "flex", justifyContent: "center"}}>
                        </Box>
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Box style={{display: "flex", justifyContent: "space-around"}}>
                                <Button variant="contained" style={styles.button} onClick={handleClickUpload} disabled={file === null}>
                                    Upload File
                                </Button>
                                <p style={{display: 'flex', margin:0, alignItems: 'center'}}>or</p>
                                <Button variant="outlined" style={styles.button} onClick={() => inputRef.current?.click()}>
                                    Choose Directory
                                </Button>
                            </Box>
                        </Grid>
                    </>
                }
                
            </Grid>
            
        </Modal>
    );
};

export default UploadDocumentsModal;

