import { useState } from 'react';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Notes from '../Notes/Notes';
import SplitButton from '../SplitButton/SplitButton';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import { BottombarProps } from '../../types';

const Bottombar = (props: BottombarProps) => {
  let params = useParams(); 
  const { 
    recordData, 
    onPreviousButtonClick, 
    onNextButtonClick, 
    onReviewButtonClick, 
    handleUpdateReviewStatus, 
    promptResetRecord,
    locked
  } = props;
  const [openNotesModal, setOpenNotesModal] = useState(false);
  
  const splitButtonOptions: Record<string, Array<{ text: string; onClick: () => void; icon: JSX.Element; selected?: boolean }>> = {
    unreviewed: [
      {
        text: "Mark as incomplete",
        onClick: () => handleUpdateReviewStatus("incomplete"),
        icon: <ErrorIcon sx={{ color: "#E3B62E" }} />,
        selected: true
      },
      {
        text: "Mark as defective",
        onClick: () => handleUpdateReviewStatus("defective"),
        icon: <CancelIcon sx={{ color: "#9F0100" }} />,
      },
    ],
    incomplete: [
      {
        text: "Mark as unreviewed",
        onClick: promptResetRecord,
        icon: <WarningIcon sx={{ color: "#828282" }} />,
        selected: true
      },
      {
        text: "Mark as defective",
        onClick: () => handleUpdateReviewStatus("defective"),
        icon: <CancelIcon sx={{ color: "#9F0100" }} />,
      },
    ],
    defective: [
      {
        text: "Mark as unreviewed",
        onClick: promptResetRecord,
        icon: <WarningIcon sx={{ color: "#828282" }} />,
        selected: true
      },
      {
        text: "Mark as incomplete",
        onClick: () => handleUpdateReviewStatus("incomplete"),
        icon: <ErrorIcon sx={{ color: "#E3B62E" }} />,
      },
    ],
    reviewed: [
      {
        text: "Mark as unreviewed",
        onClick: promptResetRecord,
        icon: <WarningIcon sx={{ color: "#828282" }} />,
      },
      {
        text: "Mark as incomplete",
        onClick: () => handleUpdateReviewStatus("incomplete"),
        icon: <ErrorIcon sx={{ color: "#E3B62E" }} />,
        selected: true
      },
    ],
  };

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
  };

  return ( 
    <Box sx={{ width: 500 }}>
      <CssBaseline />
      <Paper sx={styles.paper} elevation={3}>
        <Grid container sx={{ marginTop: '10px' }}>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px' }}>
              <Button 
                variant="outlined" 
                startIcon={<KeyboardArrowLeftIcon />}
                onClick={onPreviousButtonClick}
              > 
                Previous
              </Button>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>
              <Button 
                sx={styles.button} 
                variant="outlined" 
                startIcon={<BorderColorIcon />}
                onClick={() => setOpenNotesModal(true)}
              >
                notes
              </Button>

              {recordData.review_status && 
                <SplitButton
                  options={splitButtonOptions[recordData.review_status]}
                  disabled={locked}
                />
              }
              
              {
                (recordData.review_status === "reviewed" || recordData.review_status === "defective" || locked) ?
                <Button 
                  sx={styles.button} 
                  variant="contained" 
                  endIcon={<KeyboardArrowRightIcon />}
                  onClick={onNextButtonClick}
                >
                  next
                </Button>
                :
                (recordData.review_status === "unreviewed" || recordData.review_status === "incomplete") && 
                  <Button 
                    sx={styles.button} 
                    variant="contained" 
                    startIcon={<CheckCircleIcon sx={{ color: "#43A047" }} />}
                    endIcon={<KeyboardArrowRightIcon />}
                    onClick={onReviewButtonClick}
                  > 
                    Mark as reviewed & next 
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

export default Bottombar;