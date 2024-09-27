import { useEffect, useState } from 'react';
import { Box, FormLabel, FormControl, IconButton, FormGroup, FormControlLabel, RadioGroup, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Checkbox, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { callAPIWithBlobResponse, callAPI } from '../../assets/helperFunctions';
import { downloadRecords, getProcessorData } from '../../services/app.service';
import { ColumnSelectDialogProps, CheckboxesGroupProps, Processor } from '../../types';

const ColumnSelectDialog = (props: ColumnSelectDialogProps) => {
    const { open, onClose, projectData, handleUpdateProject } = props;

    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [exportType, setExportType] = useState("csv");
    const dialogHeight = '85vh';
    const dialogWidth = '60vw';

    useEffect(() => {
        if (open) {
            callAPI(
                getProcessorData,
                [projectData.processorId],
                setDefaultColumns,
                (e: Error) => console.error("unable to get processor data: " + e)
            );
        }
        
    }, [open]);

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

    const setDefaultColumns = (data: Processor) => {
        let temp_columns: string[] = []
        let attributes = data.attributes;
        for (let attr of attributes) {
            temp_columns.push(attr.name)
        }
        setColumns(temp_columns)
        if (projectData.settings && projectData.settings.exportColumns) {
            setSelectedColumns([...projectData.settings.exportColumns]);
        } else {
            setSelectedColumns([...temp_columns]);
        }
    }

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
            [projectData._id, body],
            handleSuccessfulExport,
            (e: Error) => console.error("unable to download csv: " + e)
        );
    };

    const handleSuccessfulExport = (data: Blob) => {
        onClose();
        const href = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${projectData.name}_records.${exportType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // update project settings to include selected columns
        let settings;
        if (projectData.settings)  {
            settings = projectData.settings
            settings["exportColumns"] = selectedColumns
        } else {
            settings = {exportColumns: selectedColumns}
        }
        handleUpdateProject({"settings": settings})
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
                    id='download-button'
                >
                    Download
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