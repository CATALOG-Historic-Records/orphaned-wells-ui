import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Box, TextField, Collapse, Typography, IconButton } from '@mui/material';
import { formatConfidence, useKeyDown, useOutsideClick } from '../../assets/helperFunctions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';

const styles = {
    fieldsTable: {
        width: "100%",
        maxHeight: "70vh",
        backgroundColor: "white"
    },
    tableHead: {
        backgroundColor: "#EDF2FA",
        fontWeight: "bold",
    }, 
    fieldKey: {
        cursor: "pointer",
    },
    headerRow: {
        fontWeight: "bold"
    },
    subattributesTable: {
        backgroundColor: "#FAFAFA",
    },
    rowIconButton: {
        padding: 0.5,
        marginTop: -0.5
    },
    rowIcon: {
        fontSize: "16px"
    }
}

export default function AttributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, fullscreen, displayKey, forceOpenSubtable, attributesList, displayKeyIndex, handleUpdateRecord } = props
    const handleClickOutside = () => {
        handleClickField()
    }
    let ref = useOutsideClick(handleClickOutside);

    return (
        <TableContainer id="table-container" sx={styles.fieldsTable}>
            <Table stickyHeader size='small'>
                <TableHead sx={styles.tableHead}>
                    <TableRow >
                        <TableCell sx={styles.headerRow}>Field</TableCell>
                        <TableCell sx={styles.headerRow}>Value</TableCell>
                        <TableCell sx={styles.headerRow}>Confidence</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody ref={ref}>
                    {Object.entries(attributes).map(([k, v]) => (
                        <AttributeRow 
                            key={k}
                            k={k}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            fullscreen={fullscreen}
                            displayKey={displayKey}
                            forceOpenSubtable={forceOpenSubtable}
                            attributesList={attributesList}
                            displayKeyIndex={displayKeyIndex}
                            handleUpdateRecord={handleUpdateRecord}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function AttributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue, fullscreen, displayKey, forceOpenSubtable, attributesList, displayKeyIndex, handleUpdateRecord } = props
    const [ editMode, setEditMode ] = useState(false)
    const [ openSubtable, setOpenSubtable ] = useState(false)

    useEffect(() => {
        if (k !== displayKey) {
            if (editMode) finishEditing()
        }
    },[displayKey])

    const handleClickInside = (e) => {
        e.stopPropagation()
        handleClickField(k, v.normalized_vertices)
    }

    useKeyDown(() => {
        if (k === displayKey) {
            if (editMode) finishEditing()
            else setEditMode(true)
        }
    }, ["Enter"])

    useEffect(() => {
        if (forceOpenSubtable === k) setOpenSubtable(true)
    }, [forceOpenSubtable])

    const handleDoubleClick = () => {
        setEditMode(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            e.stopPropagation();
        }
        else if (e.key === "ArrowRight") {
            e.stopPropagation();
        }
    }

    const handleClickEditIcon = (e) => {
        e.stopPropagation()
        handleDoubleClick()
    }

    const finishEditing = () => {
        handleUpdateRecord()
        setEditMode(false)
    }

    return (
    <>
        <TableRow id={k} sx={k === displayKey ? {backgroundColor: "#EDEDED"} : {}} onClick={handleClickInside}>
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
            {
                v.subattributes ? 
                <TableCell></TableCell> 
                
                :
                <TableCell onKeyDown={handleKeyDown}>
                    {editMode ? 
                        <TextField 
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            name={k}
                            size="small"
                            defaultValue={v.value} 
                            onChange={handleChangeValue} 
                            onFocus={(event) => event.target.select()}
                        />
                        :
                        <span>
                            {v.value}&nbsp;
                            {k === displayKey && 
                                <IconButton sx={styles.rowIconButton} onClick={handleClickEditIcon}>
                                    <EditIcon sx={styles.rowIcon}/>
                                </IconButton>
                            }
                        </span>

                    }
                </TableCell>
            }
            
            <TableCell>{formatConfidence(v.confidence)}</TableCell>
        </TableRow>
        {
            v.subattributes &&
            <SubattributesTable 
                attributes={v.subattributes}
                handleClickField={handleClickField}
                handleChangeValue={handleChangeValue}
                open={openSubtable}
                topLevelAttribute={k}
                fullscreen={fullscreen}
                displayKey={displayKey}
                attributesList={attributesList}
                displayKeyIndex={displayKeyIndex}
                handleUpdateRecord={handleUpdateRecord}
            />
        }
    </>
    )
}

function SubattributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, open, topLevelAttribute, fullscreen, displayKey, attributesList, displayKeyIndex, handleUpdateRecord } = props

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
                        <TableCell sx={styles.headerRow}>Confidence</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {Object.entries(attributes).map(([k, v]) => (
                        <SubattributeRow 
                            key={k}
                            k={k}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            topLevelAttribute={topLevelAttribute}
                            fullscreen={fullscreen}
                            displayKey={displayKey}
                            attributesList={attributesList}
                            displayKeyIndex={displayKeyIndex}
                            handleUpdateRecord={handleUpdateRecord}
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

function SubattributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue, topLevelAttribute, fullscreen, displayKey, attributesList, displayKeyIndex, handleUpdateRecord } = props
    const [ editMode, setEditMode ] = useState(false)

    useEffect(() => {
        if (!(k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute)) {
            if (editMode) finishEditing()
        }
    },[displayKey, topLevelAttribute])

    useKeyDown(() => {
        if (k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute) {
            if (editMode) finishEditing()
            else setEditMode(true)
        }
    }, ["Enter"])

    const handleClickInside = (e) => {
        e.stopPropagation()
        handleClickField(k, v.normalized_vertices, true, topLevelAttribute)
    }

    const handleDoubleClick = () => {
        setEditMode(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            e.stopPropagation();
        }
        else if (e.key === "ArrowRight") {
            e.stopPropagation();
        }
    }

    const handleUpdateValue = (event) => {
        handleChangeValue(event, true, topLevelAttribute)
    }

    const handleClickEditIcon = (e) => {
        e.stopPropagation()
        handleDoubleClick()
    }

    const finishEditing = () => {
        handleUpdateRecord()
        setEditMode(false)
    }

    return (
        <TableRow 
            key={k} 
            id={`${topLevelAttribute}::${k}`} 
            sx={(k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute) ? {backgroundColor: "#EDEDED"} : {}}
            onClick={handleClickInside}
        >
            <TableCell sx={styles.fieldKey} >
            <span 
                style={ (k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute) ? {fontWeight:"bold"} : {}}
            >
                {k}
            </span>
            </TableCell>
            <TableCell onKeyDown={handleKeyDown} >
                {editMode ? 
                    <TextField 
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        name={k}
                        size="small" 
                        defaultValue={v.value} 
                        onChange={handleUpdateValue} 
                        onFocus={(event) => event.target.select()}
                    />
                    :
                    <span>
                    {v.value}&nbsp;
                        {(k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute) && 
                            <IconButton sx={styles.rowIconButton} onClick={handleClickEditIcon}>
                                <EditIcon sx={styles.rowIcon}/>
                            </IconButton>
                        }
                    </span>
                }
            </TableCell>
            <TableCell>{formatConfidence(v.confidence)}</TableCell>
        </TableRow>
    )
}