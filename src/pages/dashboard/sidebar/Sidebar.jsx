import { Box } from '@mui/material/';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KitChat } from '../../../kitchat/kitchat';
import ChannelList from './list/ChannelList';
import classes from './sidebar.module.css';

const init = false;

const Sidebar = ({
    onCreateDirectMsg,
    onChange,
    onCreateChannel,
    selectedChannel,
    open,
}) => {
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
            setGroupChannels(tempGroupsChannels);
            setDirectChannels(tempDirectChannels);
        }
    }, [channelList]);

    const dispatch = useDispatch();

    const onChannelUpdateList = (channelsData) => {
        dispatch({ type: 'CHANNEL_LIST', payload: channelsData });
    };

    const onChannelAdd = (channel) => {
        if (channel.type === 'DIRECT') {
            setDirectChannels((prev) => {
                const temp = prev;
                temp.unshift(channel);
                return [...temp];
            });
        } else {
            setGroupChannels((prev) => {
                const temp = prev;
                temp.unshift(channel);
                return [...temp];
            });
        }
    };

    const onChannelUpdate = (channel) => {
        if (channel.type === 'DIRECT') {
            setDirectChannels((prev) => {
                let temp = prev;
                const index = temp.findIndex((el) => el._id === channel._id);
                if (index === -1) {
                    temp = [channel, ...temp];
                } else {
                    temp[index] = channel;
                }

                return temp;
            });
        } else {
            setGroupChannels((prev) => {
                let temp = [];
                if (prev.length) {
                    temp = [...prev];
                }
                const index = temp.findIndex((el) => el._id === channel._id);
                if (index === -1) {
                    temp = [channel, ...temp];
                } else {
                    temp[index] = channel;
                }
                return temp;
            });
        }
    };

    const onChannelDelete = (channel) => {
        if (channel.type === 'DIRECT') {
            setDirectChannels((prev) => {
                let temp = prev;
                const index = temp.findIndex((el) => el._id === channel._id);
                temp.splice(index, 1);
                return [...temp];
            });
        } else {
            setGroupChannels((prev) => {
                let temp = prev;
                const index = temp.findIndex((el) => el._id === channel._id);
                temp.splice(index, 1);
                return [...temp];
            });
        }
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
                        onChange={onChange}
                        selectedChannel={selectedChannel}
                    />
                    <ChannelList
                        open={open}
                        onIconPress={onCreateDirectMsg}
                        data={directChannels}
                        heading='Direct'
                        onChange={onChange}
                        selectedChannel={selectedChannel}
                    />
                </div>
            </nav>
        </Box>
    );
};

export default memo(Sidebar);
