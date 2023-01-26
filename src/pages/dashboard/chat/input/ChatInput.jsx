import { Button, IconButton, TextField } from '@mui/material';
import React from 'react';
import classes from './input.module.css';
import { ReactComponent as SendIcon } from './../../../../assets/svg/send-icon.svg';

const ChatInput = ({ text, onChange, msgSend }) => {
    return (
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
                        msgSend();
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
    );
};

export default ChatInput;
