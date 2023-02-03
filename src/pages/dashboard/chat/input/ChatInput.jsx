import { Button, IconButton, TextField } from '@mui/material';
import React from 'react';
import classes from './input.module.css';
import { ReactComponent as SendIcon } from './../../../../assets/svg/send-icon.svg';
import DropImage from '../../../../components/dropzone/DropImage';
import Attachment from '../../../../components/attachment/Attachment';
import AttachmentList from '../../../../components/attachment/AttachmentList';

const ChatInput = ({ text, onChange, msgSend, files, removeImage }) => {
    return (
        <div>
            <div className={classes.inputContainer}>
                <TextField
                    className={classes.inputBox}
                    multiline={true}
                    maxRows={10}
                    value={text}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            e.preventDefault();
                            if (text.length || files.length) msgSend();
                        }
                    }}
                />
                <IconButton
                    color='var(--green)'
                    className={classes.sendIconWrapper}
                    onClick={msgSend}
                >
                    <SendIcon />
                </IconButton>
            </div>
            <AttachmentList
                files={files}
                onRemoveClick={(i) => removeImage(i)}
            />
        </div>
    );
};

export default ChatInput;
