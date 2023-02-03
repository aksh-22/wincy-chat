import { Button, CircularProgress, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import { KitChat } from '../../../../kitchat/kitchat';
import classes from './edit.module.css';

type Props = {
    content: string;
    // callUpdate: (text: string) => void;
    onUpdateCancel: () => void;
    channelId: string;
    messageId: string;
};

const EditTextBox = ({
    content,
    onUpdateCancel,
    channelId,
    messageId,
}: Props) => {
    const [text, setText] = useState(content);
    const [isLoading, setIsLoading] = useState(false);

    const callUpdate = async () => {
        setIsLoading(true);
        try {
            const kc = KitChat.getInstance();
            await kc.messageUpdate(channelId, messageId, text);
            onUpdateCancel();
        } catch (error) {
            console.error('error', error);
        }
        setIsLoading(false);
    };

    return (
        <div className={classes.inputContainer}>
            <TextField
                className={classes.inputBox}
                multiline={true}
                maxRows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                        e.preventDefault();
                        callUpdate();
                    }
                }}
                autoFocus
            />
            <div className={classes.buttonArea}>
                <Button
                    sx={{ marginRight: 2 }}
                    size='small'
                    color='primary'
                    variant='outlined'
                    onClick={onUpdateCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={callUpdate}
                    size='small'
                    color='success'
                    variant='contained'
                >
                    {isLoading ? (
                        <CircularProgress
                            color='secondary'
                            size={24}
                            sx={{ mt: 0.5, mb: 0.5 }}
                        />
                    ) : (
                        'Update'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default EditTextBox;
