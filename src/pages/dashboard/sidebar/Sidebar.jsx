import { Box } from '@mui/material/';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KitChat } from '../../../kitchat/kitchat';
import ChannelList from './list/ChannelList';
import classes from './sidebar.module.css';

const Sidebar = ({ onCreateDirectMsg, onCreateChannel, open }) => {
    const [groupChannels, setGroupChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);

    const channelList = useSelector(
        (state) => state.channelReducer.channelList
    );

    useEffect(() => {
        if (channelList?.length) {
            const tempGroupsChannels = [];
            const tempDirectChannels = [];

            channelList.forEach((el) => {
                if (el.type === 'DIRECT') {
                    tempDirectChannels.push(el);
                } else {
                    tempGroupsChannels.push(el);
                }
            });
            setGroupChannels([...tempGroupsChannels]);
            setDirectChannels([...tempDirectChannels]);
        } else {
            setGroupChannels([]);
            setDirectChannels([]);
        }
    }, [channelList]);

    const dispatch = useDispatch();

    const onChannelUpdateList = (channelsData) => {
        dispatch({ type: 'CHANNEL_LIST', payload: channelsData });
    };

    const onChannelAdd = (channel) => {
        dispatch({ type: 'ADD_CHANNEL', payload: channel });
    };

    const onChannelUpdate = (channel) => {
        dispatch({ type: 'UPDATE_CHANNEL', payload: channel });
    };

    const onChannelDelete = (channel) => {
        dispatch({ type: 'REMOVE_CHANNEL_FROM_LIST', payload: channel._id });
    };

    const onChannelMessageCountCHange = (channel) => {
        dispatch({ type: 'UPDATE_COUNT', payload: channel });
    };

    async function asyncFunc(kc) {
        kc.onChannelUpdateList(onChannelUpdateList);
        kc.getChannels();
        kc.onChannelAdd(onChannelAdd);
        kc.onChannelUpdate(onChannelUpdate);
        kc.onChannelDelete(onChannelDelete);
        kc.onChannelMessageCountCHange(onChannelMessageCountCHange);
    }

    useEffect(() => {
        let kc = KitChat.getInstance();
        asyncFunc(kc);
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                bgcolor: 'background.paper',
                // padding: 2,
            }}
            className={classes.sidebar}
        >
            <nav aria-label='secondary mailbox folders'>
                <div style={{ marginTop: 20 }}>
                    <ChannelList
                        open={open}
                        onIconPress={onCreateChannel}
                        data={groupChannels}
                        heading='Groups'
                    />
                    <ChannelList
                        open={open}
                        onIconPress={onCreateDirectMsg}
                        data={directChannels}
                        heading='Direct'
                    />
                </div>
            </nav>
        </Box>
    );
};

export default memo(Sidebar);
