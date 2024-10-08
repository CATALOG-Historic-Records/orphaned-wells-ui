import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDate } from '../../assets/util';
import { RecordGroup } from "../../types";
import { styles } from "../../assets/styles";

interface RecordGroupsTableProps {
  record_groups: RecordGroup[];
}

const RecordGroupsTable = ({ record_groups }: RecordGroupsTableProps) => {
  const navigate = useNavigate();

  const handleClickRecordGroup = (rg_id: string) => {
    navigate("/record_group/" + rg_id);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Record Groups table">
        <TableHead>
          <TableRow>
            {["Record Group Name", "Description", "Document Type", "Locations", "Creator", "Date Created"].map((value: string) => (
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {record_groups.map((row: RecordGroup, idx: number) => (
            <TableRow
              key={row.name + " " + idx}
              sx={styles.tableRow}
              onClick={() => handleClickRecordGroup(row._id)}
              id={row.name.replaceAll(" ", "")+"_record_group_row"}
              className="record_group_row"
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.documentType}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.creator?.name || ""}</TableCell>
              <TableCell>{formatDate(row.dateCreated || null)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecordGroupsTable;