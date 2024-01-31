import React, { useState, useEffect } from 'react';
import { Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TextField } from '@mui/material';
import LassoSelector from '../../components/LassoSelector/LassoSelector';

export default function DocumentContainer(props) {
    const { image, attributes, handleChangeValue } = props;
    const [ points, setPoints ] = useState(null)
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ displayKey, setDisplayKey ] = useState(null)
    const [ showCompletedPoints, setShowCompletedPoints ] = useState(true)
    const [ imageDimensions, setImageDimensions ] = useState([])
    const [ checkAgain, setCheckAgain ] = useState(0)
    const [ editingFields, setEditingFields ] = useState([])

    useEffect(() => {
        // console.log(props)
        if (image !== undefined) {
            let img = new Image();
            img.src = image
            
            // for some reason image dimensions arent accessible for a half a second or so
            if (img.width === 0) {
                setTimeout(function() {
                    setCheckAgain(checkAgain+1)
                }, 500)
                
            } else {
                let tempImageDimensions = [img.width, img.height]
                setImageDimensions(tempImageDimensions)
            }
        }
    }, [image, checkAgain])

    const styles = {
        imageBox: {
            // maxHeight: '500px'
        },
        image: {
            height: "75vh"
        },
        fieldsTable: {
            // marginLeft: 10,
            // marginTop: 10,
            width: "80%",
            maxHeight: "80vh",
        },
        tableHead: {
            backgroundColor: "#EDF2FA",
            fontWeight: "bold",
        }, 
        fieldKey: {
            cursor: "pointer",
        }
    }

    const handleUpdatePoints = (newPoints) => {
        // if (newPoints.length === 4 && showCompletedPoints) {
        //     setPoints(newPoints)
        // }
    }

    const handleClickField = (key, normalized_vertices) => {
        if(key === displayKey) {
            setDisplayPoints([])
            setDisplayKey(null)
        }
        else {
            let actual_vertices = []
            for (let each of normalized_vertices) {
                actual_vertices.push([each[0]*imageDimensions[0], each[1]*imageDimensions[1]])
            }
            setDisplayPoints(actual_vertices)
            setDisplayKey(key)
        }
    }

    const handleDoubleClick = (key) => {
        console.log("double clicked "+key)
        let tempEditingFields = [...editingFields]
        if (!tempEditingFields.includes(key)) {
            tempEditingFields.push(key)
            setEditingFields(tempEditingFields)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("hit enter")
            e.preventDefault();
            const index = editingFields.indexOf(e.target.name);
            if (index > -1) {
                let tempEditingFields = [...editingFields]
                tempEditingFields.splice(index, 1);
                setEditingFields(tempEditingFields)
            }
        } 
        
      }

    return (
        <Box>
            <Grid container>
                <Grid item xs={6}>
                    {image !== undefined && 
                    <LassoSelector 
                        image={image} 
                        handleUpdatePoints={handleUpdatePoints} 
                        displayPoints={displayPoints} 
                        setShowCompletedPoints={setShowCompletedPoints}
                        disabled
                    />
                    // <img style={styles.image} src={image}></img>
                    }
                </Grid>
                <Grid item xs={6}>
                    {attributes !== undefined && 
                    <TableContainer sx={styles.fieldsTable}>
                        <Table>
                            <TableHead sx={styles.tableHead}>
                                <TableRow>
                                    <TableCell>Field</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(attributes).map(([k, v]) => (
                                    <TableRow key={k}>
                                        <TableCell sx={styles.fieldKey} onClick={() => handleClickField(k, v.normalized_vertices)}>{k}</TableCell>
                                        <TableCell onDoubleClick={() => handleDoubleClick(k)} onKeyDown={handleKeyDown}>
                                            {editingFields.includes(k) ? 
                                                <TextField 
                                                    autoFocus
                                                    name={k}
                                                    size="small" 
                                                    // label={""} 
                                                    defaultValue={v.value} 
                                                    onChange={handleChangeValue} 
                                                    onFocus={(event) => event.target.select()}
                                                />
                                                :
                                                v.value
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }
                </Grid>
            </Grid>
        </Box>

    );

}