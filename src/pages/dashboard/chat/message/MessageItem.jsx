import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, IconButton, ListItemAvatar, Typography } from '@mui/material';
import moment from 'moment';
import Moment from 'react-moment';
import AttachmentList from '../../../../components/attachment/AttachmentList';
import classes from './../chat.module.css';
import EditTextBox from './EditTextBox';

const MessageItem = ({
    message,
    prevMessage,
    onMenuClick,
    open,
    updateMessageId,
    onUpdateCancel,
    onImageClick,
}) => {
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
            {updateMessageId !== message._id ? (
                <div className={classes.contentWrapper}>
                    <div style={{ flex: 1 }}>
                        <>
                            {message?.content ? (
                                <Typography
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                    }}
                                    fontSize={16}
                                    className={classes.content}
                                >
                                    {message.content}
                                </Typography>
                            ) : null}
                            {message?.attachments?.length ? (
                                <AttachmentList
                                    files={message?.attachments}
                                    onImageClick={onImageClick}
                                />
                            ) : null}
                        </>
                        {message.isEdited && (
                            <Typography
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '10px !important',
                                    color: 'var(--yellow)',
                                    position: 'absolute',
                                }}
                                fontSize={10}
                                className={classes.content}
                            >
                                Edited
                            </Typography>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={classes.time}>
                            <Typography fontSize={12}>
                                <Moment format='h:mm A'>
                                    {message.createdAt}
                                </Moment>
                            </Typography>
                        </div>
                        <IconButton
                            aria-label='more'
                            id='long-button'
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup='true'
                            onClick={onMenuClick}
                            style={{ padding: 0, margin: 0 }}
                        >
                            <MoreVertIcon sx={{ color: '#fff', height: 25 }} />
                        </IconButton>
                    </div>
                </div>
            ) : (
                <EditTextBox
                    content={message.content}
                    onUpdateCancel={onUpdateCancel}
                    channelId={message.channelId}
                    messageId={message._id}
                />
            )}
        </div>
    );
};

export default MessageItem;
