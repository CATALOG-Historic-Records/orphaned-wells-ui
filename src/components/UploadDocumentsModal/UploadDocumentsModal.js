import { useState } from 'react';   
import { Grid, Box, Modal, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileUploader } from "react-drag-drop-files";



export default function UploadDocumentsModal(props) {
    const { setShowModal, handleUploadDocument } = props;
    const [ showWarning, setShowWarning ] = useState(false)
    const [ warningMessage, setWarningMessage ] = useState("")
    const [ file, setFile ] = useState(null)
    const fileTypes = ["tiff", "tif", "png", "jpg", "jpeg"];

   const styles = {
    modalStyle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      border: '1px solid #AEAEAE',
      borderRadius:2,
      boxShadow: 24,
      p: 2,
    },
    header:{
        marginTop:5
    },
    button: {
        borderRadius: '8px', 
        width: 200,
    },
    sampleFile:{
        textDecoration: "none",
        fontWeight: "bold",
        cursor: 'pointer'
    },
    fileUploaderBox: {
        border: '2px dashed black',
        borderRadius:2,
        p:10,
        cursor: "pointer"
    }
   }

   const handleClose = () => {
        setShowModal(false)
   }

   const handleClickUpload = () => {
    if (file === null) {
        setWarningMessage("Please upload a valid file")
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)
    } else {
        console.log('valid file entry')
        handleUploadDocument(file)
        setShowWarning(false)
        setShowModal(false)
    }
   }

   const fileTypeError = () => {
        setWarningMessage("Please choose a valid image (or zip coming soon hehe) file")
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)
   }

   const fileUploaderContainer = () => {
    return (
        <Box sx={styles.fileUploaderBox}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <h2 style={{marginTop:0, paddingTop:0, color:"#9B9B9B"}}>Drag and Drop File</h2>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <h2 style={{marginTop:0, paddingTop:0, color:"#9B9B9B"}}>or</h2>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Button style={{color: '#0884b4',}} variant="outlined">Browse...</Button>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <p style={{marginBottom:0, paddingTop:0}}>{file === null ? "" : file.name}</p>
            </Box>
        </Box>
    )
   }

   function DragDrop() {
    const handleChange = (file) => {
        console.log('setting file: '+file.name)
      setFile(file);
    };
    return (
      <FileUploader 
        handleChange={handleChange} 
        name="file" 
        types={fileTypes}
        children={fileUploaderContainer()}
        onTypeError={fileTypeError}
      />
    );
  }


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
            <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight:'10px'}}>
                <IconButton onClick={handleClose}><CloseIcon/></IconButton>
            </Box>
        </Grid>

        <Grid item xs={12}>
            <p style={{color:"#666666"}}>Document file</p>
        </Grid>
        <Grid item xs={12}>
            {DragDrop()}
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
            {showWarning && <p style={{color:'red', }}>{warningMessage}</p>}
        </Grid>
        <Grid item xs={12}>
            <Button variant="contained" style={styles.button} onClick={handleClickUpload}>Upload File</Button>
        </Grid>
        </Grid>
    </Modal>
  );

}


