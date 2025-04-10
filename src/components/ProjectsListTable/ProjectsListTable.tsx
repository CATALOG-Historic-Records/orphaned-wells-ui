import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDate } from '../../util';
import { ProjectData } from "../../types";
import { styles } from "../../styles";

interface ProjectsListTableProps {
  projects: ProjectData[];
}

const ProjectsListTable = ({ projects }: ProjectsListTableProps) => {
  const navigate = useNavigate();

  const handleClickProject = (project_id: string) => {
    navigate("/project/" + project_id);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow>
            {["Project Name", "Record Group Count", "Creator", "Date Created"].map((value: string) => (
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row: ProjectData, idx: number) => (
            <TableRow
              key={row.name + " " + idx}
              sx={styles.tableRow}
              onClick={() => handleClickProject(row._id)}
              id={row.name.replaceAll(" ", "")+"_project_row"}
              className="project_row"
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.record_groups.length}</TableCell>
              <TableCell>{row.creator?.name || ""}</TableCell>
              <TableCell>{formatDate(row.dateCreated || null)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProjectsListTable;