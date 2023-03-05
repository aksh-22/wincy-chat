/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import classes from './attachment.module.css';
import ImageGallery from 'react-image-gallery';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// const images = [
//     {
//         original: 'https://picsum.photos/id/1018/1000/600/',
//         thumbnail: 'https://picsum.photos/id/1018/250/150/',
//     },
//     {
//         original: 'https://picsum.photos/id/1015/1000/600/',
//         thumbnail: 'https://picsum.photos/id/1015/250/150/',
//     },
//     {
//         original: 'https://picsum.photos/id/1019/1000/600/',
//         thumbnail: 'https://picsum.photos/id/1019/250/150/',
//     },
// ];

type Props = {
    files: any[];
    onClose: () => void;
};

const AttachmentViewer = ({ files, onClose }: Props) => {
    let images: any = [];
    if (files?.length) {
        images = files?.map((el) => ({
            original: el,
            thumbnail: el,
            // sizes: [window.innerWidth - 150, window.innerHeight - 150],
            // originalHeight: window.innerHeight - 100,
            // originalWidth: window.innerWidth - 100,
            // thumbnailHeight: 50,
            // thumbnailWidth: 50,
            thumbnailClass: classes.thumbnailClass,
        }));
    }

    return ReactDOM.createPortal(
        <div className={classes.attachmentViewer}>
            <IconButton onClick={onClose} className={classes.closeIcon}>
                <CloseIcon color='info' />
            </IconButton>
            {images.length && <ImageGallery infinite={false} items={files} />}
        </div>,
        document.body
    );
};

export default AttachmentViewer;
