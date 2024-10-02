import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDate } from '../../assets/helperFunctions';
import { ProjectData } from "../../types";

interface ProjectsListTableProps {
  projects: ProjectData[];
}

const ProjectsListTable = ({ projects }: ProjectsListTableProps) => {
  const navigate = useNavigate();
  const styles = {
    headerRow: {
      fontWeight: "bold"
    },
    projectRow: {
      cursor: "pointer",
      "&:hover": {
        background: "#efefef"
      },
    }
  }

  const handleClickProject = (project_id: string) => {
    navigate("/project/" + project_id);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow>
            {["Project Name", "Description", "Document Type", "Locations", "Creator", "Date"].map((value: string) => (
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row: ProjectData, idx: number) => (
            <TableRow
              key={row.name + " " + idx}
              sx={styles.projectRow}
              onClick={() => handleClickProject(row._id)}
              id={row.name.replaceAll(" ", "")+"_project_row"}
              className="project_row"
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

export default ProjectsListTable;