import {
    Avatar,
    IconButton,
    ListItem,
    ListItemButton,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './../sidebar.module.css';

type Props = {
    channel: any;
    open: boolean;
    onChange: (data: any) => void;
    userId: string;
    selectedChannel: any;
};

const CustomListItem = ({
    channel,
    open,
    // onChange,
    userId,
}: // selectedChannel,
Props) => {
    const [count, setCount] = useState(0);

    const selectedChannel = useSelector(
        (state: any) => state.channelReducer?.selectedChannel
    );

    const dispatch = useDispatch();

    const onChange = (payload: any) => {
        dispatch({ type: 'SET_CHANNEL', payload });
    };

    useEffect(() => {
        if (channel?.participantsDetails) {
            channel.participantsDetails.forEach((el: any) => {
                if (String(el.id) === String(userId)) {
                    setCount(el.unread);
                }
            });
        }
    }, [channel.participantsDetails, userId, channel._id]);

    let title;

    const isSelected = selectedChannel?._id === channel?._id;

    if (channel.type === 'DIRECT') {
        channel.participants.forEach((el: any) => {
            if (el._id !== userId) {
                title = el.firstName + ' ' + el.lastName;
            }
        });
    } else {
        title = channel.title;
    }

    return (
        <div
            key={channel._id}
            style={{
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {!open ? (
                <IconButton
                    onClick={() => {
                        setCount(0);
                        onChange(channel);
                    }}
                    className={`${classes.iconWrapper} ${
                        isSelected && classes.iconWrapperActive
                    }`}
                >
                    <Avatar sx={{ width: 24, height: 24 }}>
                        {title.charAt(0)}
                    </Avatar>
                </IconButton>
            ) : (
                <ListItem
                    className={`${classes.listItem} ${
                        isSelected
                            ? classes.selectedListItem
                            : classes.notSelectedListItem
                    }`}
                    disablePadding
                    key={`sidebar-channel${channel._id}`}
                >
                    <ListItemButton
                        component='a'
                        href='#simple-list'
                        onClick={() => onChange(channel)}
                        sx={{
                            paddingTop: 0.3,
                            paddingBottom: 0.3,
                        }}
                    >
                        {!open ? (
                            <Avatar sx={{ width: 24, height: 24 }}>
                                {title.charAt(0)}
                            </Avatar>
                        ) : (
                            <>
                                <Typography sx={{ m: 0, mr: 1 }} fontSize={18}>
                                    #
                                </Typography>
                                <div className={classes.channelNameRow}>
                                    <Typography sx={{ m: 0 }} fontSize={14}>
                                        {title}
                                    </Typography>
                                    {count ? (
                                        <div className={classes.purpleBadges}>
                                            <Typography
                                                sx={{ m: 0 }}
                                                fontSize={14}
                                            >
                                                {count >= 10 ? '+9' : count}
                                            </Typography>
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </ListItemButton>
                </ListItem>
            )}
        </div>
    );
};

export default CustomListItem;
