import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KitChat } from './../../kitchat/kitchat';
import ChannelModal from './channelModal/ChannelModal';
import DirectChannelModal from './channelModal/DirectMsgCreateModal';
import Chat from './chat/Chat';
import classes from './dashboard.module.css';
import Sidebar from './sidebar/Sidebar';
import Box from '@mui/material/Box';
import SidebarHeader from './sidebar/header/SidebarHeader';
import UserDetails from './sidebar/userDetails/UserDetails';
import useOneSignal from '../../hooks/useOneSignal';

function Dashboard() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(true);
    const [showDirectModal, setShowDirectModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [editChannelMode, setEditChannelMode] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const { init } = useOneSignal();

    const dispatch = useDispatch();

    const userInfo = useSelector((state) => state.userReducer.userData);

    const channel = useSelector(
        (state) => state.channelReducer?.selectedChannel
    );

    const { email, name, profilePicture } = userInfo.user;
    const [firstName, lastName] = name.split(' ');

    const onChannelUpdate = (updatedChannel) => {
        dispatch({ type: 'UPDATE_CHANNEL', payload: updatedChannel });
    };

    const onChannelDelete = (deleteChannel) => {
        if (channel?._id === deleteChannel._id) {
            dispatch({ type: 'SET_CHANNEL', payload: null });
            setShowChannelModal(false);
        }
    };

    async function asyncFunc() {
        let kc = KitChat.getInstance();
        const data = await kc
            .init(email, firstName, lastName, profilePicture)
            .finally(() => {
                setLoading(false);
            });
        data.userToken && setIsLoaded(true);
        setLoading(false);
        kc.onChannelUpdate(onChannelUpdate);
        kc.onChannelDelete(onChannelDelete);
        init();
    }

    useEffect(() => {
        asyncFunc();
    }, []);

    return (
        <>
            {loading ? (
                <div>Please Wait</div>
            ) : (
                <div className={classes.dashboard}>
                    <div>
                        <div>
                            <SidebarHeader
                                onClick={() => setOpen((prev) => !prev)}
                                handleClick={() =>
                                    setShowUserDetails((prev) => !prev)
                                }
                                name={name}
                                open={open}
                                profilePicture={profilePicture}
                            />
                            {showUserDetails && open && (
                                <UserDetails
                                    email={email}
                                    name={name}
                                    profilePicture={profilePicture}
                                />
                            )}
                        </div>
                        <Sidebar
                            open={open}
                            onMenuPress={() => setOpen((prev) => !prev)}
                            selectedChannel={channel}
                            onCreateChannel={() => {
                                setShowChannelModal(true);
                                setEditChannelMode(false);
                            }}
                            onCreateDirectMsg={() => setShowDirectModal(true)}
                        />
                        {/* <Divider /> */}
                    </div>
                    <Box sx={{ flexGrow: 1 }}>
                        {!loading && (
                            <>
                                {channel?._id ? (
                                    <Chat
                                        onChannelNamePress={() => {
                                            if (channel.type != 'DIRECT') {
                                                setShowChannelModal(true);
                                                setEditChannelMode(true);
                                            }
                                        }}
                                        // channel={channel}
                                    />
                                ) : (
                                    <div className={classes.container}>
                                        <p>
                                            Kindly select a channel to start
                                            messaging
                                        </p>
                                    </div>
                                )}
                                <ChannelModal
                                    open={showChannelModal}
                                    onClose={() => setShowChannelModal(false)}
                                    edit={editChannelMode}
                                    channel={channel}
                                />
                                <DirectChannelModal
                                    open={showDirectModal}
                                    onClose={() => setShowDirectModal(false)}
                                />
                            </>
                        )}
                    </Box>
                </div>
            )}
        </>
    );
}

export default Dashboard;
