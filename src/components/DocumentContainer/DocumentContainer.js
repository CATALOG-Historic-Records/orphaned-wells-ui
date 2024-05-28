import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Grid, Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { ImageCropper } from '../ImageCropper/ImageCropper';
import { useKeyDown } from '../../assets/helperFunctions';
import AttributesTable from '../RecordAttributesTable/RecordAttributesTable';

const styles = {
    imageBox: {
        height: "70vh",
        overflowX: "scroll",
    },
    image: {
        height: "50vh"
    },
    gridContainer: {
        backgroundColor: "white",
    },
    containerActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight:'10px',
    },
    outerBox: {
        paddingBottom: "45px"
    },
}


export default function DocumentContainer(props) {
    const { image, attributes, handleChangeValue, attributesList, handleUpdateRecord } = props;
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ displayKey, setDisplayKey ] = useState(null)
    const [ displayKeyIndex, setDisplayKeyIndex ] = useState(null)
    const [ fullscreen, setFullscreen ] = useState(null)
    const [ gridWidths, setGridWidths ] = useState([5.9,0.2,5.9])
    const [ width, setWidth ] = useState("100%")
    const [ height, setHeight ] = useState("auto")
    const [ forceOpenSubtable, setForceOpenSubtable ] = useState(null)
    const imageDivStyle={
        width: width,
        height: height,
    }
    let params = useParams(); 

    useEffect(() => {
        setDisplayPoints(null)
        setDisplayKey(null)
        setDisplayKeyIndex(null)
    },[params.id])

    const tabCallback = () => {
        let tempIndex
        if (displayKeyIndex === null || displayKeyIndex === attributesList.length - 1) {
            tempIndex = 0
        } else {
            tempIndex = displayKeyIndex + 1
        }
        let keepGoing = true
        let i = 0;
        while (keepGoing && i < 200) {
            i+=1
            let tempKey = attributesList[tempIndex].key
            let tempVertices = attributesList[tempIndex].normalized_vertices
            if(tempVertices !== null && tempVertices !== undefined) {
                let isSubattribute = attributesList[tempIndex].isSubattribute
                let topLevelAttribute = attributesList[tempIndex].topLevelAttribute
                handleClickField(tempKey, tempVertices, isSubattribute, topLevelAttribute)
                keepGoing = false 
                let elementId
                if (isSubattribute) {
                    setForceOpenSubtable(topLevelAttribute)
                    elementId = `${topLevelAttribute}::${tempKey}`
                } 
                else elementId = tempKey
                let element = document.getElementById(elementId)
                let waitTime = 0
                let containerElement = document.getElementById("table-container")
                if (element) {
                    if (isSubattribute) {
                        setTimeout(function() {
                            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                        }, waitTime)
                    }
                    else scrollIntoView(element, containerElement)
                } else // element likely has not rendered yet. wait 250 milliseconds then try again
                {
                    waitTime = 250
                    setTimeout(function() {
                        element = document.getElementById(elementId)
                        if (element) element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                    }, waitTime)
                }
            }
            else {
                tempIndex+=1
                if (tempIndex === attributesList.length) tempIndex = 0
            }
        }
        
    }

    const shiftTabCallback = () => {
        let tempIndex
        if (displayKeyIndex === null || displayKeyIndex === 0) {
            tempIndex = attributesList.length - 1
        } else {
            tempIndex = displayKeyIndex -1
        }
        let keepGoing = true
        let i = 0;
        while (keepGoing && i < 200) {
            i+=1
            let tempKey = attributesList[tempIndex].key
            let tempVertices = attributesList[tempIndex].normalized_vertices
            if(tempVertices !== null && tempVertices !== undefined) {
                let isSubattribute = attributesList[tempIndex].isSubattribute
                let topLevelAttribute = attributesList[tempIndex].topLevelAttribute
                handleClickField(tempKey, tempVertices, isSubattribute, topLevelAttribute)
                keepGoing = false 
                let elementId
                if (isSubattribute) {
                    setForceOpenSubtable(topLevelAttribute)
                    elementId = `${topLevelAttribute}::${tempKey}`
                } 
                else elementId = tempKey
                let element = document.getElementById(elementId)
                let waitTime = 0
                let containerElement = document.getElementById("table-container")
                if (element) {
                    if (isSubattribute) {
                        setTimeout(function() {
                            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                        }, waitTime)
                    }
                    else scrollIntoView(element, containerElement)
                } else // element likely has not rendered yet. wait 250 milliseconds then try again
                {
                    waitTime = 250
                    setTimeout(function() {
                        element = document.getElementById(elementId)
                        if (element) element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                    }, waitTime)
                }
            }
            else {
                tempIndex-=1
                if (tempIndex === 0) tempIndex = attributesList.length -1
            }
        }
        
    }

    useKeyDown("Tab", tabCallback, shiftTabCallback, null, null);
    useKeyDown("ArrowUp", shiftTabCallback, null, null, null);
    useKeyDown("ArrowDown", tabCallback, null, null, null);

    const handleClickField = (key, normalized_vertices, isSubattribute, topLevelAttribute) => {
        if(key === displayKey || !key) {
            setDisplayPoints(null)
            setDisplayKey(null)
            setDisplayKeyIndex(null)
        }
        else if(normalized_vertices !== null && normalized_vertices !== undefined) {
            let percentage_vertices = []
            for (let each of normalized_vertices) {
                percentage_vertices.push([each[0]*100, each[1]*100])
            }
            setDisplayPoints(percentage_vertices)
            setDisplayKey(key)

            // set display key index
            let keepGoing = true
            let i = -1
            while (keepGoing && i < attributesList.length) {
                i++
                let tempAttr = attributesList[i]
                if (key === tempAttr.key) {
                    if (!isSubattribute) {
                        setDisplayKeyIndex(i)
                        keepGoing = false
                    } else if(isSubattribute && topLevelAttribute === tempAttr.topLevelAttribute) {
                        setDisplayKeyIndex(i)
                        keepGoing = false
                    }
                }
                
            }
            scrollToAttribute("image-box", normalized_vertices[2][1])
        }
    }

    const scrollToAttribute = (id, top) => {
        let imageContainerId = id
        let imageContainerElement = document.getElementById(imageContainerId)
        let scrollAmount = top * imageContainerElement.clientHeight
        if (imageContainerElement) {
            imageContainerElement.scrollTo({
                top: scrollAmount,
                behavior: "smooth",
                });
        }
    }

    function scrollIntoView(element, container) {
        if (element && container) {
            var containerTop = container.scrollTop;
            var containerBottom = containerTop + container.clientHeight; 
            var elemTop = element.offsetTop;
            var elemBottom = elemTop + element.clientHeight;
            if (elemTop < containerTop) {
                container.scrollTo({
                    top: elemTop,
                    behavior: "smooth",
                });
            } else if (elemBottom > containerBottom) {
                container.scrollTo({
                    top: elemBottom - container.clientHeight,
                    behavior: "smooth",
                });
            }
        }
        
      }


    const handleSetFullscreen = (item) => {
        if (fullscreen === item)  {
            setGridWidths([5.9,0.2,5.9])
            setFullscreen(null)
        }
        else { 
            setFullscreen(item)
            if (item === "image") setGridWidths([12, 0, 0])
            else if (item === "table") setGridWidths([0, 0, 12])
        }
    }

    return (
        <Box style={styles.outerBox}>
            <Grid container>
                {
                    fullscreen !== "image" && 
                    <Grid item xs={gridWidths[2]}>
                        <Box sx={styles.gridContainer}>
                            <Box sx={styles.containerActions}>
                                <IconButton onClick={() => handleSetFullscreen("table")}>
                                    { 
                                        fullscreen === "table" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            {attributes !== undefined && 
                                <AttributesTable 
                                    attributes={attributes}
                                    handleClickField={handleClickField}
                                    handleChangeValue={handleChangeValue}
                                    fullscreen={fullscreen}
                                    displayKey={displayKey}
                                    forceOpenSubtable={forceOpenSubtable}
                                    attributesList={attributesList}
                                    displayKeyIndex={displayKeyIndex}
                                    handleUpdateRecord={handleUpdateRecord}
                                />
                            }
                        </Box>
                    </Grid>
                }
                <Grid item xs={gridWidths[1]}></Grid>
                {fullscreen !== "table" && 
                    <Grid item xs={gridWidths[0]}>
                        <Box sx={styles.gridContainer}>
                            <Box sx={styles.containerActions}>
                                <IconButton onClick={() => handleSetFullscreen("image")}>
                                    { 
                                        fullscreen === "image" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            <Box id="image-box" sx={styles.imageBox}>
                                
                                {image !== undefined &&
                                <div style={imageDivStyle}>
                                    <ImageCropper 
                                        image={image}
                                        displayPoints={displayPoints}
                                        disabled
                                        fullscreen={fullscreen}
                                    />
                                </div>
                                }
                            </Box>
                        </Box>
                    </Grid>
                }
                
            </Grid>
        </Box>

    );

}