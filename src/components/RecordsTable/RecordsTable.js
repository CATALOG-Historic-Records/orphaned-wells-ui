import { useEffect, Fragment, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper, IconButton } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import IosShareIcon from '@mui/icons-material/IosShare';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { downloadRecordsCSV } from '../../services/app.service';
import ColumnSelectDialog from '../../components/ColumnSelectDialog/ColumnSelectDialog';
import { formatDate, callAPIWithBlobResponse, median, average, formatConfidence } from '../../assets/helperFunctions';

const TABLE_ATTRIBUTES = {
  displayNames: ["Record Name", "Date Uploaded", "API Number", "Mean Confidence", "Lowest Confidence", "Digitization Status", "Review Status"],
  keyNames: ["name", "contributor", "dateCreated", "API_NUMBER", "confidence_median", "confidence_lowest", "status", "review_status"],
}

export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { projectData, records } = props;
  const [ openColumnSelect, setOpenColumnSelect ] = useState(false)
  const [ attributes, setAttributes ] = useState([])

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
      for (let key of Object.keys(attributes)) {
        let attr = attributes[key]
        if (attr.confidence) confidences.push(attr.confidence)
      }
      return formatConfidence(average(confidences))
    } catch (e) {
      return null
    }
    
  }

  const calculateLowestConfidence = (attributes) => {
    let lowestConfidence = 1
    for (let key of Object.keys(attributes)) {
      let attr = attributes[key]
      if (attr.confidence && attr.confidence < lowestConfidence) {
        lowestConfidence = attr.confidence
      }
    }
    return  formatConfidence(lowestConfidence)
    
  }

  const getAPINumber = (record) => {
    try {
      if (record.attributes.API_NUMBER) return record.attributes.API_NUMBER.value
      else return ""
    } catch (e) {
      return ""
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
            <TableCell align="right">{row.status === "digitized" ? calculateAverageConfidence(row.attributes) : null}</TableCell>
            <TableCell align="right">{row.status === "digitized" ? calculateLowestConfidence(row.attributes) : null}</TableCell>
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
                null
              }
              {row.status}
            </TableCell>
            <TableCell align="right">
              {
                row.review_status === "unreviewed" ? 
                <IconButton >
                  <ErrorIcon /> 
                </IconButton> :
                row.review_status === "reviewed" ? 
                <IconButton>
                  <CheckCircleIcon sx={{color: "green"}}/> 
                </IconButton> :
                null
              }
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
      
    </TableContainer>
  );
}