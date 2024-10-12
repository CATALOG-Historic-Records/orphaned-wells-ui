import { useEffect, useState } from 'react';
import { Box, FormLabel, FormControl, IconButton, FormGroup, FormControlLabel, RadioGroup, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Checkbox, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { callAPIWithBlobResponse, callAPI } from '../../assets/util';
import { downloadRecords, getColumnData } from '../../services/app.service';
import { ColumnSelectDialogProps, CheckboxesGroupProps, Processor, RecordGroup } from '../../types';

const ColumnSelectDialog = (props: ColumnSelectDialogProps) => {
    const { open, onClose, location, handleUpdate, _id } = props;

    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [exportType, setExportType] = useState("csv");
    const [objSettings, setObjSettings] = useState<any>()
    const [name, setName] = useState("")
    const dialogHeight = '85vh';
    const dialogWidth = '60vw';

    useEffect(() => {
        if (open) {
            callAPI(
                getColumnData,
                [location, _id],
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

    const setDefaultColumns = (data: {columns: string[], obj: any}) => {
        let temp_columns = data.columns;
        setColumns(temp_columns)
        if (data.obj.settings && data.obj.settings.exportColumns) {
            setSelectedColumns([...data.obj.settings.exportColumns]);
        } else {
            setSelectedColumns([...temp_columns]);
        }
        setObjSettings(data.obj.settings)
        setName(data.obj.name)
    }

    const handleClose = () => {
        onClose();
    };

    const handleExport = () => {
        const body = {
            columns: selectedColumns
        };
        callAPIWithBlobResponse(
            downloadRecords,
            [location, _id, exportType, body],
            handleSuccessfulExport,
            (e: Error) => console.error("unable to download csv: " + e)
        );
    };

    const handleSuccessfulExport = (data: Blob) => {
        onClose();
        const href = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${name}_records.${exportType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // update project settings to include selected columns
        let settings;
        if (objSettings)  {
            settings = objSettings
            settings["exportColumns"] = selectedColumns
        } else {
            settings = {exportColumns: selectedColumns}
        }
        handleUpdate({"settings": settings})
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
            <DialogTitle id="export-dialog-title">Export {location}</DialogTitle>
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