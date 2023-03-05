import FileOpenIcon from '@mui/icons-material/FileOpen';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { generateVideoThumbnails } from '../../hooks/video-thumbnail/generateVideoThumbnails';
import getFileType from '../../utils/getFileType';
import classes from './attachment.module.css';

type Props = {
    onClick: (index: number) => void;
    onImageClick: (index: number) => void;
    data: { original: string; thumbnail: string } | any;
    index: number;
};

const Attachment = ({ onClick, data, index, onImageClick }: Props) => {
    let fileType: 'image' | 'video' | 'audio' | 'other' | undefined =
        getFileType(data);
    const [src, setSrc] = useState(data);
    const getData = async () => {
        const thumb: any = await generateVideoThumbnails(src, 1);
        console.log('thumb', thumb);
        //  src = URL.createObjectURL(data);
        setSrc(URL.createObjectURL(thumb));
    };

    // getFileType(data);

    // let src: any;

    useEffect(() => {
        fileType === 'video' && getData();
    }, [data]);

    if (typeof data?.thumbnail === 'string') {
        // src = data.thumbnail;
        setSrc(data.thumbnail);
    }

    const renderItem = () => {
        switch (fileType) {
            case 'image':
            case 'video':
                return (
                    <img
                        onClick={() => onImageClick(index)}
                        className={classes.fileImage}
                        alt='ss'
                        src={src}
                    />
                );

            // case 'video':
            //     getData();
            //     return <video className={classes.fileImage} src={src} />;

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
