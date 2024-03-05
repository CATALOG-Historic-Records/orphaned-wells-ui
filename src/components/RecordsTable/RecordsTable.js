import { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper } from '@mui/material'
import { DNA } from 'react-loader-spinner'
import DownloadIcon from '@mui/icons-material/Download';
import { downloadRecordsCSV } from '../../services/app.service';
import { formatDate, callAPIWithBlobResponse } from '../../assets/helperFunctions';


export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { projectData, records } = props;

  useEffect(() => {

  },[props])

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
    }
  }

  const handleClickRecord = (record_id) => {
    navigate("/record/" + record_id)
  }

  const handleDownloadCSV = () => {
    callAPIWithBlobResponse(
      downloadRecordsCSV,
      [projectData.id_],
      handleSuccess,
      (e) => console.error("unable to download csv: "+e)
    )
  }

  const handleSuccess = (data) => {
    const href = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `${projectData.name}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const tableRow = (row, idx) => {
    if (row.attributes === undefined) {
      return (
        <TableRow sx={styles.projectRow}>
          <TableCell align="center" colSpan={projectData.attributes.length+2} sx={{padding:0, position: "relative"}}>
            {/* <span style={{position: "absolute", top:"25%", right: "54%"}}>processing</span> */}
            <DNA
              style={{margin: 0, padding: 0}}
              visible={true}
              height="50"
              width="80"
              ariaLabel="dna-loading"
            />
          </TableCell>
        </TableRow>
      )
    } else {
      return (
        <TableRow
          sx={styles.projectRow}
          onClick={() => handleClickRecord(row._id)}
        >
            {projectData.attributes.map((attribute, attribute_idx) => {
              try {
                if (Object.keys(row.attributes).includes(attribute)) {
                  return <TableCell key={attribute_idx}>{row.attributes[attribute].value}</TableCell>
                } else return <TableCell key={attribute_idx}>N/A</TableCell>
              } catch (e) {
                return <TableCell key={attribute_idx}>error</TableCell>
              }                  
            })}
            <TableCell>{row.contributor.name}</TableCell>
            <TableCell>{formatDate(row.dateCreated)}</TableCell>
        </TableRow>
      )
    }
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={styles.topSection}>
        <Button variant="contained" onClick={handleDownloadCSV} startIcon={<DownloadIcon/>}>
          Download csv
        </Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="records table">
        <TableHead>
          <TableRow>
            {
                projectData.attributes.map((attribute, idx) => (
                    <TableCell key={idx}>{attribute}</TableCell>
                ))
            }
            <TableCell>Contributor</TableCell>
            <TableCell>Date Uploaded</TableCell>
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
    </TableContainer>
  );
}