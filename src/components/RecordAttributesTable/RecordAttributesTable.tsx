import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Box, TextField, Collapse, Typography, IconButton, Badge, Tooltip, Stack } from '@mui/material';
import { formatConfidence, useKeyDown, useOutsideClick, formatAttributeValue, formatDateTime } from '../../assets/util';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { Attribute, RecordAttributesTableProps } from '../../types';
import { styles } from '../../assets/styles';


const LOW_CONFIDENCE: number = 0.01;

interface AttributesTableProps extends RecordAttributesTableProps {
    attributesList: Attribute[];
    forceOpenSubtable: number | null;
}

const AttributesTable = (props: AttributesTableProps) => {
    const { 
        attributesList,
        handleClickField,
        handleChangeValue,
        fullscreen,
        forceOpenSubtable,
        displayKeyIndex,
        displayKeySubattributeIndex,
        handleUpdateRecord,
        locked,
        showRawValues=true
    } = props;

    const handleClickOutside = () => {
        handleClickField('', null, -1, false, null);
    }
    const ref = useOutsideClick(handleClickOutside);

    return (
        <TableContainer id="table-container" sx={styles.fieldsTable}>
            <Table stickyHeader size='small'>
                <TableHead sx={styles.tableHead}>
                    <TableRow>
                        <TableCell sx={styles.headerRow}>Field</TableCell>
                        <TableCell sx={styles.headerRow}>Value</TableCell>
                        {showRawValues &&
                            <TableCell sx={styles.headerRow}>Raw Value</TableCell>
                        }
                        <TableCell sx={styles.headerRow}>Confidence</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody ref={ref}>
                    {attributesList.map((v: Attribute, idx: number) => (
                        <AttributeRow 
                            key={`${v.key} ${idx}`}
                            k={v.key}
                            v={v}
                            idx={idx}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            fullscreen={fullscreen}
                            forceOpenSubtable={forceOpenSubtable}
                            displayKeyIndex={displayKeyIndex}
                            displayKeySubattributeIndex={displayKeySubattributeIndex}
                            handleUpdateRecord={handleUpdateRecord}
                            locked={locked}
                            showRawValues={showRawValues}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

interface AttributeRowProps extends RecordAttributesTableProps {
    k: string;
    v: Attribute;
    idx: number;
    forceOpenSubtable: number | null;
}


const AttributeRow = (props: AttributeRowProps) => { 
    const { 
        k, 
        v, 
        idx, 
        handleClickField, 
        handleChangeValue, 
        fullscreen, 
        forceOpenSubtable,
        displayKeyIndex, 
        displayKeySubattributeIndex, 
        handleUpdateRecord,
        locked,
        showRawValues
    } = props;
    
    const [ editMode, setEditMode ] = useState(false);
    const [ openSubtable, setOpenSubtable ] = useState(false);
    const [ isSelected, setIsSelected ] = useState(false);
    const [ lastSavedValue, setLastSavedValue ] = useState(v.value)

    useEffect(() => {
        if (idx === displayKeyIndex && (displayKeySubattributeIndex === null || displayKeySubattributeIndex === undefined)) setIsSelected(true);
        else  {
            setIsSelected(false);
            if (editMode) finishEditing();
        }
    }, [displayKeyIndex, displayKeySubattributeIndex]);

    const handleClickInside = (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.stopPropagation();
        handleClickField(k, v.normalized_vertices, idx, false, null);
    }

    useKeyDown("Enter", () => {
        if (isSelected) {
            if (editMode) finishEditing();
            else makeEditable();
        }
    }, undefined, undefined, undefined, true);

    useKeyDown("Escape", () => {
        if (isSelected) {
            if (editMode) {
                // reset to last saved value
                if (v.value !== lastSavedValue) {
                    let fakeEvent = {
                        target: {
                            value: lastSavedValue
                        }
                    } as React.ChangeEvent<HTMLInputElement>
                    handleChangeValue(fakeEvent, idx)
                }
                setEditMode(false);
            }
        }
    }, undefined, undefined, undefined);

    useEffect(() => {
        if (forceOpenSubtable === idx) setOpenSubtable(true);
    }, [forceOpenSubtable]);

    const handleDoubleClick = () => {
        makeEditable()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
        if (e.key === "ArrowLeft") {
            e.stopPropagation();
        }
        else if (e.key === "ArrowRight") {
            e.stopPropagation();
        }
    }

    const handleClickEditIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleDoubleClick();
    }

    const makeEditable = () => {
        if (locked) return
        setEditMode(true);
    }

    const finishEditing = () => {
        if (v.value !== lastSavedValue) {
            handleUpdateRecord();
            setLastSavedValue(v.value)
        }
        setEditMode(false);
    }

    return (
    <>
        <TableRow id={`${k}::${idx}`} sx={isSelected ? {backgroundColor: "#EDEDED"} : {}} onClick={handleClickInside}>
            <TableCell sx={styles.fieldKey}>
                <span>
                    {k}
                </span>
                {
                    v.subattributes &&
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenSubtable(!openSubtable)}
                        sx={styles.rowIconButton}
                    >
                        {openSubtable ? <KeyboardArrowUpIcon sx={styles.rowIcon}/> : <KeyboardArrowDownIcon sx={styles.rowIcon}/>}
                    </IconButton>
                }
            </TableCell>
            { // TODO: add styling to parent attribute if subattributes have errors
                v.subattributes ? 
                <TableCell></TableCell> 
                :
                <TableCell onKeyDown={handleKeyDown}>

                <Stack direction='column'>
                    <span style={v.cleaning_error ? styles.errorSpan : {}}>
                        {editMode ? 
                            <TextField 
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                name={k}
                                size="small"
                                defaultValue={v.value} 
                                onChange={(e) => handleChangeValue(e, idx)} 
                                onFocus={(event) => event.target.select()}
                                id='edit-field-text-box'
                                sx={v.cleaning_error ? styles.errorTextField: {}}
                                variant='outlined'
                            />
                            :
                            <Tooltip title={(v.edited && v.lastUpdated) ? `Last updated ${formatDateTime(v.lastUpdated)} by ${v.lastUpdatedBy || 'unknown'}` : ''}>
                                <p style={v.cleaning_error ? styles.errorParagraph : styles.noErrorParagraph}>
                                    {formatAttributeValue(v.value)}&nbsp;
                                    {isSelected && !locked &&
                                        <IconButton id='edit-field-icon' sx={styles.rowIconButton} onClick={handleClickEditIcon}>
                                            <EditIcon sx={styles.rowIcon}/>
                                        </IconButton>
                                    }
                                </p>
                            </Tooltip>
                        }
                    </span>
                    {
                        v.cleaning_error && (
                            <Typography noWrap component={'p'} sx={styles.errorText}>
                                Error during cleaning 
                                <Tooltip title={v.cleaning_error} onClick={(e) => e.stopPropagation()}>
                                    <IconButton sx={styles.errorInfoIcon}>
                                        <InfoIcon fontSize='inherit' color='inherit'/>
                                    </IconButton>
                                </Tooltip>
                                
                            </Typography>
                        )
                    }
                </Stack>
                </TableCell>
            }
            {showRawValues &&
                <TableCell>
                    <span >
                        {v.raw_text}&nbsp;
                    </span>
                </TableCell>
            }
            <TableCell align="right" id={v.key+'_confidence'}>
                {
                    v.edited ? 
                    <p style={{padding:0, margin:0}}>
                        <Badge
                            variant="dot"
                            sx={{
                            "& .MuiBadge-badge": {
                                color: "#2196F3",
                                backgroundColor: "#2196F3"
                            }
                            }}
                        /> 
                        &nbsp; Edited
                    </p> :
                     (v.confidence === null) ? 
                     <p style={{padding:0, margin:0}}>
                        <Badge
                            variant="dot"
                            sx={{
                            "& .MuiBadge-badge": {
                                color: "#9E0101",
                                backgroundColor: "#9E0101"
                            }
                            }}
                        /> 
                        &nbsp; Not found
                    </p>
                      :
                      <p 
                        style={
                            (v.value === "" || v.confidence < LOW_CONFIDENCE) ? 
                            styles.flaggedConfidence :
                            styles.unflaggedConfidence
                        }
                    >
                        {formatConfidence(v.confidence)}
                    </p>
                }
            </TableCell>
        </TableRow>
        {
            v.subattributes &&
            <SubattributesTable 
                attributesList={v.subattributes}
                handleClickField={handleClickField}
                handleChangeValue={handleChangeValue}
                open={openSubtable}
                fullscreen={fullscreen}
                displayKeyIndex={displayKeyIndex}
                handleUpdateRecord={handleUpdateRecord}
                displayKeySubattributeIndex={displayKeySubattributeIndex}
                topLevelIdx={idx}
                locked={locked}
                showRawValues={showRawValues}
            />
        }
    </>
    )
}

interface SubattributesTableProps extends RecordAttributesTableProps {
    attributesList: Attribute[];
    open: boolean;
    topLevelIdx: number;
}

const SubattributesTable = (props: SubattributesTableProps) => {
    const { 
        attributesList,
        handleClickField,
        handleChangeValue,
        open,
        topLevelIdx,
        fullscreen,
        displayKeyIndex,
        displayKeySubattributeIndex,
        handleUpdateRecord,
        locked,
        showRawValues
    } = props;

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    Properties
                </Typography>
                <Table size="small" aria-label="purchases" sx={styles.subattributesTable}>
                    <TableHead>
                    <TableRow>
                        <TableCell sx={styles.headerRow}>Field</TableCell>
                        <TableCell sx={styles.headerRow}>Value</TableCell>
                        {showRawValues &&
                            <TableCell sx={styles.headerRow}>Raw Value</TableCell>
                        }
                        <TableCell sx={styles.headerRow}>Confidence</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {attributesList.map((v: Attribute, idx: number) => (
                        <SubattributeRow 
                            key={`${v.key} ${idx}`}
                            k={v.key}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            fullscreen={fullscreen}
                            displayKeyIndex={displayKeyIndex}
                            handleUpdateRecord={handleUpdateRecord}
                            displayKeySubattributeIndex={displayKeySubattributeIndex}
                            idx={idx}
                            topLevelIdx={topLevelIdx}
                            locked={locked}
                            showRawValues={showRawValues}
                        />
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
    )
}

interface SubattributeRowProps extends RecordAttributesTableProps {
    k: string;
    v: Attribute;
    topLevelIdx: number;
    idx: number;
}

const SubattributeRow = (props: SubattributeRowProps) => { 
    const { 
        k, 
        v,
        handleClickField,
        handleChangeValue,
        topLevelIdx,
        fullscreen,
        displayKeyIndex,
        displayKeySubattributeIndex,
        handleUpdateRecord,
        idx,
        locked,
        showRawValues
    } = props;

    const [ editMode, setEditMode ] = useState(false);
    const [ isSelected, setIsSelected ] = useState(false);
    const [ lastSavedValue, setLastSavedValue ] = useState(v.value)

    useEffect(() => {
        if (displayKeyIndex === topLevelIdx && idx === displayKeySubattributeIndex) {
            setIsSelected(true);
        } else {
            setIsSelected(false);
            if (editMode) finishEditing();
        }
    }, [displayKeyIndex, topLevelIdx, displayKeySubattributeIndex]);

    useKeyDown("Enter", () => {
        if (isSelected) {
            if (editMode) finishEditing();
            else makeEditable();
        }
    }, undefined, undefined, undefined, true);

    useKeyDown("Escape", () => {
        if (isSelected) {
            if (editMode) {
                // reset to last saved value
                if (v.value !== lastSavedValue) {
                    let fakeEvent = {
                        target: {
                            value: lastSavedValue
                        }
                    } as React.ChangeEvent<HTMLInputElement>
                    handleUpdateValue(fakeEvent)
                }
                setEditMode(false);
            }
        }
    }, undefined, undefined, undefined);

    const handleClickInside = (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.stopPropagation();
        handleClickField(k, v.normalized_vertices, topLevelIdx, true, idx);
    }

    const handleDoubleClick = () => {
        makeEditable()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
        if (e.key === "ArrowLeft") {
            e.stopPropagation();
        }
        else if (e.key === "ArrowRight") {
            e.stopPropagation();
        }
    }

    const handleUpdateValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (locked) return
        handleChangeValue(event, topLevelIdx, true, idx);
    }

    const handleClickEditIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleDoubleClick();
    }

    const makeEditable = () => {
        if (locked) return
        setEditMode(true);
    }

    const finishEditing = () => {
        if (v.value !== lastSavedValue) {
            handleUpdateRecord();
            setLastSavedValue(v.value)
        }
        setEditMode(false);
    }

    

    return (
        <TableRow 
            key={k} 
            id={`${topLevelIdx}::${idx}`} 
            sx={isSelected ? {backgroundColor: "#EDEDED"} : {}}
            onClick={handleClickInside}
        >
            <TableCell sx={styles.fieldKey}>
                <span style={isSelected ? {fontWeight:"bold"} : {}}>
                    {k}
                </span>
            </TableCell>
            <TableCell onKeyDown={handleKeyDown} sx={v.cleaning_error ? {backgroundColor: '#FECDD3'} : {}}>
                <Stack direction='column'>
                    <span style={v.cleaning_error ? styles.errorSpan : {}}>
                    {editMode ? 
                        <TextField 
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            name={k}
                            size="small" 
                            defaultValue={v.value} 
                            onChange={handleUpdateValue} 
                            onFocus={(event) => event.target.select()}
                            sx={v.cleaning_error ? styles.errorTextField: {}}
                        />
                        :
                        <Tooltip title={(v.edited && v.lastUpdated) ? `Last updated ${formatDateTime(v.lastUpdated)} by ${v.lastUpdatedBy}` : ''}>
                            <p>
                                {formatAttributeValue(v.value)}&nbsp;
                                {isSelected && !locked &&
                                    <IconButton sx={styles.rowIconButton} onClick={handleClickEditIcon}>
                                        <EditIcon sx={styles.rowIcon}/>
                                    </IconButton>
                                }
                            </p>
                        </Tooltip>
                    }
                    </span>
                    {
                        v.cleaning_error && (
                            <Typography noWrap component={'p'} sx={styles.errorText}>
                                Error during cleaning 
                                <Tooltip title={v.cleaning_error} onClick={(e) => e.stopPropagation()}>
                                    <IconButton sx={styles.errorInfoIcon}>
                                        <InfoIcon fontSize='inherit' color='inherit'/>
                                    </IconButton>
                                </Tooltip>
                                
                            </Typography>
                        )
                    }
                </Stack>
            </TableCell>
            {showRawValues &&
                <TableCell>
                    <span>
                        {v.raw_text}&nbsp;
                    </span>
                </TableCell>
            }
            <TableCell>{formatConfidence(v.confidence)}</TableCell>
        </TableRow>
    )
}

export default AttributesTable;