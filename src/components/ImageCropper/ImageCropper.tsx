import { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

const DRAG_HANDLES: string[] = [
    "ReactCrop__drag-handle ord-nw",
    "ReactCrop__drag-handle ord-n",
    "ReactCrop__drag-handle ord-ne",
    "ReactCrop__drag-handle ord-e",
    "ReactCrop__drag-handle ord-se",
    "ReactCrop__drag-handle ord-s",
    "ReactCrop__drag-handle ord-sw",
    "ReactCrop__drag-handle ord-w",
];

interface ImageCropperProps {
    image: string;
    displayPoints: number[][] | null;
    disabled: boolean;
    fullscreen: string | null;
    imageIdx: number;
    highlightedImageIdxIndex: number;
}

export const ImageCropper = (props: ImageCropperProps) => {
    const { image, displayPoints, disabled, fullscreen, imageIdx, highlightedImageIdxIndex } = props;
    const [crop, setCrop] = useState<Crop | undefined>(undefined);
    const [zoom, setZoom] = useState(1);
    const [imageDimensions, setImageDimensions] = useState<number[]>([]);
    const [width, setWidth] = useState("100%");
    const [height, setHeight] = useState("100%");

    const styles = {
        imageDiv: {
            width: width,
            height: height,
        }
    };

    useEffect(() => {
        if (crop) {
            let tempCrop = Object.assign({}, crop);
            setCrop(undefined);
            setTimeout(() => {
                setCrop(tempCrop);
            }, 0);
        }
    }, [fullscreen]);

    useEffect(() => {
        if (displayPoints && highlightedImageIdxIndex === imageIdx) {
            let crop_x = displayPoints[0][0] - 0.5;
            let crop_y = displayPoints[0][1] - 0.5;
            let crop_width = displayPoints[1][0] - displayPoints[0][0] + 1;
            let crop_height = displayPoints[2][1] - displayPoints[1][1] + 1;
            let newCrop: Crop = {
                unit: "%",
                x: crop_x,
                y: crop_y,
                width: crop_width,
                height: crop_height
            };
            setCrop(newCrop);
            setTimeout(() => {
                removeDragHandles();
            }, 10);
        } else {
            setCrop(undefined);
        }
    }, [displayPoints, highlightedImageIdxIndex]);

    useEffect(() => {
        const img = new Image();

        img.onload = () => {
            const height = img.height;
            const width = img.width;
            setImageDimensions([width, height]);
        };

        img.src = image;
    }, [image]);

    const handleSetCrop = (c: Crop) => {
        setCrop(c);
    };

    const removeDragHandles = () => {
        for (let dragHandleClass of DRAG_HANDLES) {
            let dragHandle = Array.from(document.getElementsByClassName(dragHandleClass) as HTMLCollectionOf<HTMLElement>);
            if (dragHandle.length > 0) {
                dragHandle[0].style.display = "none";
            }
        }
    };

    return (
        <ReactCrop crop={crop} onChange={c => handleSetCrop(c)} locked={disabled}>
            <img src={image} alt="Crop" />
        </ReactCrop>
    );
};