import { useState, useEffect } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'

const DRAG_HANDLES = [
    "ReactCrop__drag-handle ord-nw",
    "ReactCrop__drag-handle ord-n",
    "ReactCrop__drag-handle ord-ne",
    "ReactCrop__drag-handle ord-e",
    "ReactCrop__drag-handle ord-se",
    "ReactCrop__drag-handle ord-s",
    "ReactCrop__drag-handle ord-sw",
    "ReactCrop__drag-handle ord-w",
]

export const ImageCropper = (props) => {
    const { image, displayPoints, disabled, fullscreen, imageIdx, highlightedImageIdxIndex } = props
    const [crop, setCrop] = useState()
    const [zoom, setZoom] = useState(1)
    const [ imageDimensions, setImageDimensions ] = useState([])
    const [ width, setWidth ] = useState("100%")
    const [ height, setHeight ] = useState("100%")

    const styles = {
        imageDiv: {
            width: width,
            height: height,
        }
    }

    useEffect(() => {
        if (crop) {
            let tempCrop = Object.assign(crop)
            setCrop(null)
            setTimeout(function() {
                setCrop(tempCrop)
            }, 0)
            
        }
    }, [fullscreen])

    useEffect(() => {
        if (displayPoints && highlightedImageIdxIndex === imageIdx) {
            let crop_x = displayPoints[0][0] - 0.5
            let crop_y = displayPoints[0][1] - 0.5
            let crop_width = displayPoints[1][0] - displayPoints[0][0] + 1
            let crop_height = displayPoints[2][1] - displayPoints[1][1] + 1
            let newCrop = {
                unit: "%",
                x: crop_x,
                y: crop_y,
                width: crop_width,
                height: crop_height
            }
            setCrop(newCrop)
            setTimeout(function() {
                removeDragHandles()
              }, 10)
            
        } else{
            setCrop(null)
        }
        
    }, [displayPoints, highlightedImageIdxIndex])

    useEffect(() => {
        var img = new Image();

        img.onload = function(){
            var height = img.height;
            var width = img.width;
            setImageDimensions([width,height])
        }

        img.src = image;
    },[])

    const handleSetCrop = (c) => {
        setCrop(c)
    }

    const removeDragHandles = () => {
        for (let dragHandleClass of DRAG_HANDLES) {
            let dragHandle = document.getElementsByClassName(dragHandleClass)
            if (dragHandle.length > 0) {
                dragHandle[0].style.display="none"
            }
        }
    }

    return (
            <ReactCrop crop={crop} onChange={c => handleSetCrop(c)} locked={disabled}>
                <img src={image}/>
            </ReactCrop>
    )
}