import React from 'react';
import classes from './dropzone.module.css';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { IconButton } from '@mui/material';

type Props = {
    onClick: () => void;
    src: string;
};

const DropImage = ({ onClick, src }: Props) => {
    return (
        <div className={classes.fileImageWrapper}>
            <IconButton onClick={onClick} className={classes.removeIconWrapper}>
                <RemoveCircleIcon
                    sx={{ height: 20, width: 20 }}
                    color='error'
                />
            </IconButton>
            <img className={classes.fileImage} alt='ss' src={src} />
        </div>
    );
};

export default DropImage;
