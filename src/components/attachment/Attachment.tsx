import React from 'react';
import { IconButton } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import classes from './attachment.module.css';
import getFileType from '../../utils/getFileType';

type Props = {
    onClick: (index: number) => void;
    onImageClick: (index: number) => void;
    data: any;
    index: number;
};

const Attachment = ({ onClick, data, index, onImageClick }: Props) => {
    console.log('data', data);
    let fileType: 'image' | 'video' | 'audio' | 'other' | undefined = 'image';
    // getFileType(data);

    let src: any;

    if (typeof data === 'string') {
        src = data;
    } else {
        src = URL.createObjectURL(data);
    }

    const renderItem = () => {
        switch (fileType) {
            case 'image':
                return (
                    <img
                        onClick={() => onImageClick(index)}
                        className={classes.fileImage}
                        alt='ss'
                        src={src}
                    />
                );

            case 'video':
                return <video className={classes.fileImage} src={src} />;

            case 'other':
                return (
                    <div className={classes.iconWrapper}>
                        <FileOpenIcon className={classes.icon} />
                    </div>
                );

            default:
                break;
        }
    };

    return (
        <div className={classes.fileImageWrapper}>
            {!!onClick && (
                <IconButton
                    onClick={() => onClick(index)}
                    className={classes.removeIconWrapper}
                >
                    <RemoveCircleIcon
                        sx={{ height: 20, width: 20 }}
                        color='error'
                    />
                </IconButton>
            )}
            {renderItem()}
        </div>
    );
};

export default Attachment;
