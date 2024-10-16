import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Grid, Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { ImageCropper } from '../ImageCropper/ImageCropper';
import { useKeyDown } from '../../assets/util';
import AttributesTable from '../RecordAttributesTable/RecordAttributesTable';
import { DocumentContainerProps } from '../../types';

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
        marginRight: '10px',
    },
    outerBox: {
        paddingBottom: "45px"
    },
}

const DocumentContainer = ({ imageFiles, attributesList, handleChangeValue, handleUpdateRecord, locked }: DocumentContainerProps) => {
    const [imgIndex, setImgIndex] = useState(0);
    const [displayPoints, setDisplayPoints] = useState<number[][] | null>(null);
    const [displayKeyIndex, setDisplayKeyIndex] = useState(-1);
    const [displayKeySubattributeIndex, setDisplayKeySubattributeIndex] = useState<number | null>(null);
    const [fullscreen, setFullscreen] = useState<string | null>(null);
    const [gridWidths, setGridWidths] = useState<number[]>([5.9, 0.2, 5.9]);
    const [width, setWidth] = useState("100%");
    const [height, setHeight] = useState("auto");
    const [forceOpenSubtable, setForceOpenSubtable] = useState<number | null>(null);
    const [imageHeight, setImageHeight] = useState(0);
    const imageDivStyle = {
        width: width,
        height: height,
    }
    const params = useParams(); 

    useEffect(() => {
        if (displayKeyIndex !== -1 && displayKeySubattributeIndex !== null) {
            const newImgIdx = attributesList[displayKeyIndex].subattributes[displayKeySubattributeIndex].page;
            if (newImgIdx !== undefined && newImgIdx !== null) setImgIndex(newImgIdx);
        } 
        else if (displayKeyIndex !== -1) {
            const newImgIdx = attributesList[displayKeyIndex].page;
            if (newImgIdx !== undefined && newImgIdx !== null) setImgIndex(newImgIdx);
        }
        else {
            setImgIndex(0);
        }
        
    }, [displayKeyIndex, displayKeySubattributeIndex]);

    useEffect(() => {
        if (imageFiles && imageFiles.length > 0) {
            const img = new Image();

            img.onload = function() {
                const height = img.height;
                setImageHeight(height);
            }

            img.src = imageFiles[0];
        }
    }, [imageFiles]);

    useEffect(() => {
        setDisplayPoints(null);
        setDisplayKeyIndex(-1);
    }, [params.id]);

    const tabCallback = () => {
        let tempIndex: number;
        let tempSubIndex: number | null;
        let isSubattribute: boolean;
        let tempKey: string;
        let tempVertices: any;

        if (displayKeyIndex === -1) {
            console.log("display index was null")
            tempIndex = 0;
            tempSubIndex = null;
        } 
        else if (attributesList[displayKeyIndex].subattributes) {
            if (displayKeySubattributeIndex === null || displayKeySubattributeIndex === undefined) {
                tempSubIndex = 0;
                tempIndex = displayKeyIndex;
            } else if (displayKeySubattributeIndex === attributesList[displayKeyIndex].subattributes.length - 1) {
                tempSubIndex = null;
                tempIndex = displayKeyIndex === attributesList.length - 1 ? 0 : displayKeyIndex + 1;
            } else { 
                tempSubIndex = displayKeySubattributeIndex + 1;
                tempIndex = displayKeyIndex;
            }
        }
        else if (displayKeyIndex === attributesList.length - 1)  {
            tempIndex = 0;
            tempSubIndex = null;
        }
        else {
            tempIndex = displayKeyIndex + 1;
            tempSubIndex = null;
        }

        if (tempSubIndex !== null && tempSubIndex !== undefined) {
            isSubattribute = true;
            tempKey = attributesList[tempIndex].subattributes[tempSubIndex].key;
            tempVertices = attributesList[tempIndex].subattributes[tempSubIndex].normalized_vertices;
        } else {
            isSubattribute = false;
            tempKey = attributesList[tempIndex].key;
            tempVertices = attributesList[tempIndex].normalized_vertices;
        }
        handleClickField(tempKey, tempVertices, tempIndex, isSubattribute, tempSubIndex);
        let elementId: string;

        if (isSubattribute) {
            setForceOpenSubtable(tempIndex);
            elementId = `${tempIndex}::${tempSubIndex}`;
        } 
        else elementId = `${tempKey}::${tempIndex}`;
        let element = document.getElementById(elementId);
        let waitTime = 0;
        let containerElement = document.getElementById("table-container");
        if (element) {
            if (isSubattribute) {
                setTimeout(function() {
                    if (element)
                    element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }, waitTime);
            }
            else scrollIntoView(element, containerElement);
        } else {
            waitTime = 250;
            setTimeout(function() {
                element = document.getElementById(elementId);
                if (element) element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, waitTime);
        }
    }

    const shiftTabCallback = () => {
        let tempIndex: number;
        let tempSubIndex: number | null;
        let isSubattribute: boolean;
        let tempKey: string;
        let tempVertices: any;

        if (displayKeyIndex === -1) {
            tempIndex = attributesList.length - 1;
            tempSubIndex = null;
        } 
        else if (attributesList[displayKeyIndex].subattributes) {
            if (displayKeySubattributeIndex === null || displayKeySubattributeIndex === undefined) {
                tempSubIndex = attributesList[displayKeyIndex].subattributes.length - 1;
                tempIndex = displayKeyIndex;
            } else if (displayKeySubattributeIndex === 0) {
                tempSubIndex = null;
                tempIndex = displayKeyIndex === 0 ? attributesList.length - 1 : displayKeyIndex - 1;
            } else { 
                tempSubIndex = displayKeySubattributeIndex - 1;
                tempIndex = displayKeyIndex;
            }
        }
        else if (displayKeyIndex === 0)  {
            tempIndex = attributesList.length - 1;
            tempSubIndex = null;
        }
        else {
            tempIndex = displayKeyIndex - 1;
            tempSubIndex = null;
        }

        if (tempSubIndex !== null && tempSubIndex !== undefined) {
            isSubattribute = true;
            tempKey = attributesList[tempIndex].subattributes[tempSubIndex].key;
            tempVertices = attributesList[tempIndex].subattributes[tempSubIndex].normalized_vertices;
        } else {
            isSubattribute = false;
            tempKey = attributesList[tempIndex].key;
            tempVertices = attributesList[tempIndex].normalized_vertices;
        }
        handleClickField(tempKey, tempVertices, tempIndex, isSubattribute, tempSubIndex);
        let elementId: string;

        if (isSubattribute) {
            setForceOpenSubtable(tempIndex);
            elementId = `${tempIndex}::${tempSubIndex}`;
        } 
        else elementId = `${tempKey}::${tempIndex}`;
        let element = document.getElementById(elementId);
        let waitTime = 0;
        let containerElement = document.getElementById("table-container");
        if (element) {
            if (isSubattribute) {
                setTimeout(function() {
                    if (element)
                    element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }, waitTime);
            }
            else scrollIntoView(element, containerElement);
        } else {
            waitTime = 250;
            setTimeout(function() {
                element = document.getElementById(elementId);
                if (element) element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, waitTime);
        }
    }

    useKeyDown("Tab", tabCallback, shiftTabCallback);
    useKeyDown("ArrowUp", shiftTabCallback);
    useKeyDown("ArrowDown", tabCallback);

    const handleClickField = (key: string, normalized_vertices: number[][] | null, primaryIndex: number, isSubattribute: boolean, subattributeIdx: number | null) => {
        if (!key || (!isSubattribute && primaryIndex === displayKeyIndex) || (isSubattribute && primaryIndex === displayKeyIndex && subattributeIdx === displayKeySubattributeIndex)) {
            setDisplayPoints(null);
            setDisplayKeyIndex(-1);
        }
        else {
            setDisplayKeyIndex(primaryIndex);
            setDisplayKeySubattributeIndex(subattributeIdx);
            if (normalized_vertices !== null && normalized_vertices !== undefined) {
                const percentage_vertices: number[][] = [];
                for (let each of normalized_vertices) {
                    percentage_vertices.push([each[0] * 100, each[1] * 100]);
                }
                let page = 0;
                try {
                    let attr = attributesList[primaryIndex];
                    if (isSubattribute) attr = attr.subattributes[subattributeIdx as number];
                    if (attr.page !== undefined) page = attr.page;
                } catch (e) {
                    console.log("error getting page");
                    console.log(e);
                }
                const scrollTop = (normalized_vertices[2][1] / imageFiles.length) + (page / imageFiles.length);
                setDisplayPoints(percentage_vertices);
                scrollToAttribute("image-box", "image-div", scrollTop);
            } else {
                setDisplayPoints(null);
            }
        }
    }

    const scrollToAttribute = (boxId: string, heightId: string, top: number) => {
        const imageContainerId = boxId;
        const imageContainerElement = document.getElementById(imageContainerId);
        const imageElement = document.getElementById(heightId);
        const scrollAmount = top * imageElement!.clientHeight * imageFiles.length - 100;
        if (imageContainerElement) {
            imageContainerElement.scrollTo({
                top: scrollAmount,
                behavior: "smooth",
            });
        }
    }

    function scrollIntoView(element: HTMLElement | null, container: HTMLElement | null) {
        if (element && container) {
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight; 
            const elemTop = element.offsetTop;
            const elemBottom = elemTop + element.clientHeight;
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

    const handleSetFullscreen = (item: string) => {
        if (fullscreen === item)  {
            setGridWidths([5.9, 0.2, 5.9]);
            setFullscreen(null);
        }
        else { 
            setFullscreen(item);
            if (item === "image") setGridWidths([12, 0, 0]);
            else if (item === "table") setGridWidths([0, 0, 12]);
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
                                <IconButton id='fullscreen-table-button' onClick={() => handleSetFullscreen("table")}>
                                    { 
                                        fullscreen === "table" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            {attributesList !== undefined && 
                                <AttributesTable 
                                    attributesList={attributesList}
                                    handleClickField={handleClickField}
                                    handleChangeValue={handleChangeValue}
                                    fullscreen={fullscreen}
                                    forceOpenSubtable={forceOpenSubtable}
                                    displayKeyIndex={displayKeyIndex}
                                    displayKeySubattributeIndex={displayKeySubattributeIndex}
                                    handleUpdateRecord={handleUpdateRecord}
                                    locked={locked}
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
                                <IconButton id='fullscreen-image-button' onClick={() => handleSetFullscreen("image")}>
                                    { 
                                        fullscreen === "image" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            <Box id="image-box" sx={styles.imageBox}>
                                
                                {imageFiles &&
                                imageFiles.map((imageFile, idx) => (
                                    <div key={imageFile} style={imageDivStyle} id="image-div">
                                        <ImageCropper 
                                            image={imageFile}
                                            imageIdx={idx}
                                            highlightedImageIdxIndex={imgIndex}
                                            displayPoints={displayPoints}
                                            disabled
                                            fullscreen={fullscreen}
                                        />
                                    </div>
                                ))
                                
                                }
                            </Box>
                        </Box>
                    </Grid>
                }
                
            </Grid>
        </Box>
    );
}

export default DocumentContainer;