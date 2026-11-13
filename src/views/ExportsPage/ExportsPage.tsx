import { Box } from "@mui/material";
import Subheader from "../../components/Subheader/Subheader";
import ExportHistoryPanel from "../../components/ExportHistory/ExportHistoryPanel";

const ExportsPage = () => {
  const styles = {
    outerBox: {
      backgroundColor: "#F5F5F6",
      minHeight: "90vh",
    },
    innerBox: {
      paddingY: 3,
      paddingX: { xs: 2, md: 4 },
    },
  };

  return (
    <Box sx={styles.outerBox}>
      <Subheader currentPage="Exports" />
      <Box sx={styles.innerBox}>
        <ExportHistoryPanel />
      </Box>
    </Box>
  );
};

export default ExportsPage;

