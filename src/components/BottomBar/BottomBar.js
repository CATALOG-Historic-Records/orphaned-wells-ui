import React from 'react';
import {useState} from 'react';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Notes from '../Notes/Notes';
import SplitButton from '../SplitButton/SplitButton';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';


export default function Bottombar(props) {
    let params = useParams(); 
    const { onPreviousButtonClick,  onNextButtonClick, onReviewButtonClick, recordData, handleUpdateReviewStatus, promptResetRecord } = props;
    const [ openNotesModal, setOpenNotesModal ] = useState(false)
    const splitButtonOptions = {
        unreviewed: [
            {
                text: "Mark as incomplete",
                onClick: () => handleUpdateReviewStatus("incomplete"),
                icon: <ErrorIcon sx={{color: "#E3B62E"}}/>,
                selected: true
            },
            {
                text: "Mark as defective",
                onClick: () => handleUpdateReviewStatus("defective"),
                icon: <CancelIcon sx={{color: "#9F0100"}}/>,
            },
        ],
        incomplete: [
            {
                text: "Mark as unreviewed",
                onClick: promptResetRecord,
                icon: <WarningIcon sx={{color: "#828282"}}/>,
                selected: true
            },
            {
                text: "Mark as defective",
                onClick: () => handleUpdateReviewStatus("defective"),
                icon: <CancelIcon sx={{color: "#9F0100"}}/>,
            },
        ],
        defective: [
            {
                text: "Mark as unreviewed",
                onClick: promptResetRecord,
                icon: <WarningIcon sx={{color: "#828282"}}/>,
                selected: true
            },
            {
                text: "Mark as incomplete",
                onClick: () => handleUpdateReviewStatus("incomplete"),
                icon: <ErrorIcon sx={{color: "#9F0100"}}/>,
            },
        ],
        reviewed: [
            {
                text: "Mark as unreviewed",
                onClick: promptResetRecord,
                icon: <WarningIcon sx={{color: "#828282"}}/>,
            },
            {
                text: "Mark as incomplete",
                onClick: () => handleUpdateReviewStatus("incomplete"),
                icon: <ErrorIcon sx={{color: "#E3B62E"}}/>,
                selected: true
            },
        ],
    }
    const styles = {
        button: {
            marginX: 1,
        },
        paper: {
            position: 'fixed',
            bottom: 0, 
            left: '0px',
            right: 0,
            height: '60px',
            zIndex: 2,
        }
    }

  return ( 
    <Box sx={{ width: 500 }}>
      <CssBaseline />
      <Paper sx={styles.paper} elevation={3}>
            <Grid container sx={{marginTop: '10px'}}>
                <Grid item xs={3}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-start', marginLeft:'10px'}}>
                        <Button 
                            variant="outlined" 
                            startIcon={<KeyboardArrowLeftIcon/>}
                            onClick={onPreviousButtonClick}
                        > 
                            Previous
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight:'10px'}}>
                        <Button 
                            sx={styles.button} 
                            variant="outlined" 
                            startIcon={<BorderColorOutlinedIcon/>}
                            onClick={() => setOpenNotesModal(true)}
                        >
                            notes
                        </Button>

                        {recordData.review_status && 
                            <SplitButton
                                options={splitButtonOptions[recordData.review_status]}
                            />
                        }
                        
                        {
                        (recordData.review_status === "unreviewed" || recordData.review_status === "incomplete") ? 
                            <Button 
                                sx={styles.button} 
                                variant="contained" 
                                endIcon={<CheckCircleOutlineIcon/>}
                                onClick={onReviewButtonClick}
                            > 
                                Mark as reviewed & next 
                            </Button>
                            :
                        (recordData.review_status === "reviewed" || recordData.review_status === "defective") &&
                            <Button 
                                sx={styles.button} 
                                variant="contained" 
                                endIcon={<KeyboardArrowRightIcon/>}
                                onClick={onNextButtonClick}
                            >
                                next
                            </Button>
                        }
                        
                    </Box>
                </Grid>
            </Grid>
            <Notes
                record_id={params.id}
                notes={recordData.notes}
                open={openNotesModal}
                onClose={() => setOpenNotesModal(false)}
            />
      </Paper>
    </Box>
  );

}


