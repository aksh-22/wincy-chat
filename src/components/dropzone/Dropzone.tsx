import { Typography } from '@mui/material';
import { ReactNode, useRef, useState } from 'react';
import DropImage from './DropImage';
import classes from './dropzone.module.css';

type Props = {
    children: ReactNode;
    onUpload: (files: any) => void;
};

const CustomDropzone = ({ children, onUpload }: Props) => {
    const [showDropzone, setShowDropzone] = useState(false);
    const [acceptedFiles, setAcceptedFiles] = useState<any>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onDragOver = () => {
        !showDropzone && setShowDropzone(true);
    };

    const onDragLeave = () => {
        setShowDropzone(false);
    };

    const onDropzoneDragOver = () => {
        setShowDropzone(true);
    };
    const onDropzoneDragLeave = () => {
        setShowDropzone(false);
    };

    return (
        <div onDragOver={onDragOver} onDragLeave={onDragLeave}>
            <>
                {showDropzone && (
                    <div
                        draggable={false}
                        onDragLeave={onDropzoneDragLeave}
                        onDragOver={onDropzoneDragOver}
                        className={classes.dropContainer}
                    >
                        <div
                            onClick={() => {
                                if (inputRef) {
                                    inputRef.current?.click();
                                }
                            }}
                            className={classes.inputContainer}
                        >
                            <Typography>
                                Drag and drop or select your file
                            </Typography>
                            <input
                                ref={inputRef}
                                className={classes.input}
                                type='file'
                                multiple={true}
                                maxLength={5}
                                onChange={(e: any) => {
                                    onUpload && onUpload([...e.target.files]);
                                    setShowDropzone(false);
                                }}
                            />
                        </div>
                    </div>
                )}
                {children}
            </>
        </div>
    );
};

export default CustomDropzone;
