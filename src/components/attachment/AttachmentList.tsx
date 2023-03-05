import React from 'react';
import Attachment from './Attachment';
import classes from './attachment.module.css';
import AttachmentViewer from './AttachmentViewer';

type Props = {
    onRemoveClick: (index: any) => void;
    onImageClick: (index: number) => void;
    files: any[];
};

const AttachmentList = ({ onRemoveClick, files, onImageClick }: Props) => {
    return files.length ? (
        <>
            <div className={classes.filesArea}>
                {files.map((el, i) => {
                    // if (!el || el === null || !el?.original) return <></>;
                    return (
                        <Attachment
                            key={i}
                            onClick={onRemoveClick}
                            data={el}
                            index={i}
                            onImageClick={onImageClick}
                        />
                    );
                })}
            </div>
        </>
    ) : null;
};

export default AttachmentList;
