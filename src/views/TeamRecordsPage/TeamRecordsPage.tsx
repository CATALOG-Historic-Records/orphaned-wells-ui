import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getTeamRecords } from '../../services/app.service';
import Subheader from '../../components/Subheader/Subheader';
import { callAPI } from '../../assets/helperFunctions';
import { RecordData } from '../../types';

const TeamRecordsPage = () => {
    const [records, setRecords] = useState<RecordData[]>([]);

    useEffect(() => {
        callAPI(
            getTeamRecords,
            [],
            handleSuccess,
            (e: Error) => { console.error('error getting team records: ', e) }
        );
    }, []);

    const handleSuccess = (data: { records: RecordData[] }) => {
        setRecords(data.records);
    };

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
        },
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="All Records"
            />
            <Box sx={styles.innerBox}>
            </Box>
        </Box>
    );
}

export default TeamRecordsPage;