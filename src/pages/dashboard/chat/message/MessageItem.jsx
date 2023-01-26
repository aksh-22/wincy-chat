import { Avatar, ListItemAvatar, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import classes from './../chat.module.css';

const MessageItem = ({ message, prevMessage }) => {
    // if (!message?.sender_data) return <></>;

    let isSameUser;
    let sameDay;
    if (prevMessage) {
        isSameUser = message.sender === prevMessage?.sender;
        sameDay = moment(message.createdAt).isSame(prevMessage.createdAt, 'D');
    } else {
        isSameUser = false;
        sameDay = false;
    }

    const { firstName, avatar } = message?.sender_data;

    return (
        <div className={classes.messageItem}>
            {!sameDay && (
                <div className={classes.dayDiv}>
                    <span>
                        <Moment
                            calendar={{
                                lastDay: '[Yesterday]',
                                sameDay: '[Today]',
                                nextDay: '[Tomorrow]',
                                sameElse: 'dddd MMMM do',
                            }}
                        >
                            {message.createdAt}
                        </Moment>
                    </span>
                </div>
            )}
            {(!isSameUser || !sameDay) && (
                <div className={classes.row}>
                    <div className={classes.left}>
                        <ListItemAvatar>
                            <Avatar src={avatar}></Avatar>
                        </ListItemAvatar>
                        <Typography fontSize={16}>{firstName} </Typography>
                    </div>
                    <Typography fontSize={12}>
                        <Moment format='h:mm A'>{message.createdAt}</Moment>
                    </Typography>
                </div>
            )}
            <div className={classes.contentWrapper}>
                <Typography
                    sx={{
                        whiteSpace: 'pre-wrap',
                    }}
                    fontSize={16}
                    className={classes.content}
                >
                    {message.content}
                </Typography>
                <div className={classes.time}>
                    <Typography fontSize={12}>
                        <Moment format='h:mm A'>{message.createdAt}</Moment>
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
