import { useEffect, Fragment, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper, IconButton } from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ColumnSelectDialog from '../../components/ColumnSelectDialog/ColumnSelectDialog';
import { formatDate, average, formatConfidence } from '../../assets/helperFunctions';
import Notes from '../Notes/Notes';

const TABLE_ATTRIBUTES = {
  displayNames: ["Record Name", "Date Uploaded", "API Number", "Mean Confidence", "Lowest Confidence", "Notes", "Digitization Status", "Review Status"],
  keyNames: ["name", "contributor", "dateCreated", "API_NUMBER", "confidence_median", "confidence_lowest", "status", "review_status"],
}

export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { projectData, records, setRecords } = props;
  const [ openColumnSelect, setOpenColumnSelect ] = useState(false)
  const [ attributes, setAttributes ] = useState([])
  const [ showNotes, setShowNotes ] = useState(false)
  const [ notesRecordId, setNotesRecordId ] = useState(null)
  const [ notes, setNotes ] = useState(null)

  useEffect(() => {
      if (projectData) {
        let tempColumns = []
      for (let each of projectData.attributes) {
        tempColumns.push(each.name)
      }
      setAttributes(tempColumns)
    }
    
  },[projectData])

  const styles = {
    projectRow: {
      cursor: "pointer",
      "&:hover": {
        background: "#efefef"
      },
    },
    topSection: {
      display: 'flex', 
      justifyContent: 'flex-end', 
      marginTop: 2, 
      marginRight: 2
    },
    headerCell: {
      fontWeight: "bold"
    },
  }

  const handleClickRecord = (record_id) => {
    navigate("/record/" + record_id)
  }

  const calculateAverageConfidence = (attributes) => {
    let confidences = []
    try {
      for (let attr of attributes) {
        if (attr.confidence) confidences.push(attr.confidence)
      }
      return formatConfidence(average(confidences))
    } catch (e) {
      return null
    }
    
  }

  const calculateLowestConfidence = (attributes) => {
    let lowestConfidence = 1
    for (let attr of attributes) {
      if (attr.confidence && attr.confidence < lowestConfidence) {
        lowestConfidence = attr.confidence
      }
    }
    return  formatConfidence(lowestConfidence)
    
  }

  const getAPINumber = (record) => {
    try {
      for (let attr of record.attributesList) {
        if (attr.key === "API_NUMBER")  {
          return attr.value
        }
      }
      return ""
    } catch (e) {
      return ""
    }
  }

  const handleClickNotes = (event, row) => {
    event.stopPropagation();
    setShowNotes(true)
    setNotesRecordId(row._id)
    setNotes(row.notes)
  }

  const handleCloseNotesModal = (record_id, newNotes) => {
    setShowNotes(false)
    setNotesRecordId(null)
    setNotes(null)
    if (record_id) {
      const rowIdx = records.findIndex(r => r._id == record_id);
      if (rowIdx > -1) {
        let tempRecords = [...records]
        let tempRecord = {...tempRecords[rowIdx]}
        tempRecord.notes=newNotes
        tempRecords[rowIdx] = tempRecord
        setRecords(tempRecords)
      }

    }
  }

  const tableRow = (row, idx) => {
      return (
        <TableRow
          sx={styles.projectRow}
          onClick={() => handleClickRecord(row._id)}
        >
            <TableCell align="right">{row.recordIndex}.</TableCell>
            <TableCell>{row.name}</TableCell>
            {/* <TableCell>{row.contributor.name}</TableCell> */}
            <TableCell>{formatDate(row.dateCreated)}</TableCell>
            <TableCell align="right">{row.status === "digitized" ? getAPINumber(row) : null}</TableCell>
            <TableCell align="right">{row.status === "digitized" ? calculateAverageConfidence(row.attributesList) : null}</TableCell>
            <TableCell align="right">{row.status === "digitized" ? calculateLowestConfidence(row.attributesList) : null}</TableCell>
            <TableCell align="right">
              <IconButton sx={(row.notes === "" || !row.notes) ? {} : {color: "#F2DB6F"}} onClick={(e) => handleClickNotes(e, row)}><StickyNote2Icon/></IconButton>
            </TableCell>
            <TableCell align="right">
              {
                row.status === "processing" ? 
                <IconButton>
                  <CachedIcon sx={{color: "#EF6C0B"}} /> 
                </IconButton> :
                row.status === "digitized" ? 
                <IconButton>
                  <CheckCircleOutlineIcon sx={{color: "green"}}/>
                </IconButton> :
                row.status === "error" ? 
                <IconButton>
                  <ErrorIcon color="error"/>
                </IconButton> :
                null
              }
              {row.status}
            </TableCell>
            <TableCell align="right">
            <IconButton >
              {
                row.review_status === "unreviewed" ? 
                  <ErrorIcon /> 
                :
                row.review_status === "incomplete" ? 
                  <ErrorIcon sx={{color: "#E3B62E"}} /> 
                :
                row.review_status === "defective" ? 
                  <WarningIcon sx={{color: "#9F0100"}} /> 
                :
                row.review_status === "reviewed" ? 
                  <CheckCircleIcon sx={{color: "green"}}/> 
                :
                null
              }
              </IconButton>
              {row.review_status}
            </TableCell>
        </TableRow>
      )
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={styles.topSection}>
        {/* <Button variant="contained" onClick={handleDownloadCSV} startIcon={<DownloadIcon/>}> */}
        {projectData && 
          <Button variant="contained" onClick={() => setOpenColumnSelect(true)} startIcon={<IosShareIcon/>}>
            Export Project
        </Button>
        }
        
      </Box>
      <Table sx={{ minWidth: 650, marginTop: 1 }} aria-label="records table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {
                TABLE_ATTRIBUTES.displayNames.map((attribute, idx) => (
                    <TableCell sx={styles.headerCell} key={idx} align={idx > 1 ? "right" : "left"}>{attribute}</TableCell>
                ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, idx) => (
            <Fragment key={idx}>
              {tableRow(row, idx)}
            </Fragment>
            
          ))}
        </TableBody>
      </Table>
          { projectData && 
            <ColumnSelectDialog
              open={openColumnSelect}
              onClose={() => setOpenColumnSelect(false)}
              columns={attributes}
              project_id={projectData.id_}
              project_name={projectData.name}
              project_settings={projectData.settings}
          />
          }
      <Notes
        record_id={notesRecordId}
        notes={notes}
        open={showNotes}
        onClose={handleCloseNotesModal}
      />
    </TableContainer>
  );
}