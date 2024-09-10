import { useEffect, useState } from 'react';
import { Box, FormLabel, FormControl, IconButton, FormGroup, FormControlLabel, RadioGroup, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Checkbox, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { callAPIWithBlobResponse } from '../../assets/helperFunctions';
import { downloadRecords } from '../../services/app.service';
import { ColumnSelectDialogProps, CheckboxesGroupProps } from '../../types';

const ColumnSelectDialog = (props: ColumnSelectDialogProps) => {
    const { open, onClose, columns, project_id, project_name, project_settings } = props;

    const [selectedColumns, setSelectedColumns] = useState<string[]>([...columns]);
    const [exportType, setExportType] = useState("csv");
    const dialogHeight = '85vh';
    const dialogWidth = '60vw';

    useEffect(() => {
        if (project_settings && project_settings.exportColumns) {
            setSelectedColumns([...project_settings.exportColumns]);
        } else {
            setSelectedColumns([...columns]);
        }
    }, [columns]);

    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },
        projectName: {
            marginBottom: 2
        },
        processorGridItem: {
            paddingX: 1
        },
        processorImageBox: {
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
        },
        processorImage: {
            maxHeight: "20vh"
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleExport = () => {
        const body = {
            exportType: exportType,
            columns: selectedColumns
        };
        callAPIWithBlobResponse(
            downloadRecords,
            [project_id, body],
            handleSuccessfulExport,
            (e: Error) => console.error("unable to download csv: " + e)
        );
    };

    const handleSuccessfulExport = (data: Blob) => {
        onClose();
        const href = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${project_name}_records.${exportType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="export-dialog"
            aria-describedby="export-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle id="export-dialog-title">Export Project</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}
                    aria-labelledby="export-dialog-content-text"
                    component={'span'}
                >
                    <CheckboxesGroup
                        columns={columns}
                        selected={selectedColumns}
                        setSelected={setSelectedColumns}
                        exportType={exportType}
                        setExportType={setExportType}
                    />
                </DialogContentText>
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                    }}
                    onClick={handleExport}
                >
                    Export
                </Button>
            </DialogContent>
        </Dialog>
    );
};

const CheckboxesGroup = (props: CheckboxesGroupProps) => {
    const { columns, selected, setSelected, exportType, setExportType } = props;

    useEffect(() => {
    }, [columns]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isSelected = event.target.checked;
        const attr = event.target.name;
        const tempSelected = [...selected];
        if (isSelected) {
            tempSelected.push(attr);
        } else {
            const index = tempSelected.indexOf(attr);
            if (index > -1) {
                tempSelected.splice(index, 1);
            }
        }
        setSelected(tempSelected);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" required>
                <FormLabel component="legend" id="export-type-label">Export Type</FormLabel>
                <RadioGroup
                    row
                    name="export-type"
                    sx={{ paddingBottom: 5 }}
                    value={exportType}
                    onChange={(event) => setExportType(event.target.value)}
                >
                    <FormControlLabel value="csv" control={<Radio />} label="CSV" />
                    <FormControlLabel value="json" control={<Radio />} label="JSON" />
                </RadioGroup>

                <FormLabel component="legend">Select attributes to export</FormLabel>
                <FormGroup row>
                    <Grid container>
                        {columns.map((column: string, colIdx: number) => (
                            <Grid key={`${colIdx}_${column}`} item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={selected.includes(column)} onChange={handleChange} name={column} />
                                    }
                                    label={column}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>
            </FormControl>
        </Box>
    );
};

export default ColumnSelectDialog;