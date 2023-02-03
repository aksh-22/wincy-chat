import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useOneSignal from '../../hooks/useOneSignal';
import { KitChat } from './../../kitchat/kitchat';
import ChannelModal from './channelModal/ChannelModal';
import DirectChannelModal from './channelModal/DirectMsgCreateModal';
import Chat from './chat/Chat';
import classes from './dashboard.module.css';
import SidebarHeader from './sidebar/header/SidebarHeader';
import Sidebar from './sidebar/Sidebar';
import UserDetails from './sidebar/userDetails/UserDetails';

function Dashboard() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(true);
    const [showDirectModal, setShowDirectModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [editChannelMode, setEditChannelMode] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const { init } = useOneSignal();

    const userInfo = useSelector((state) => state.userReducer.userData);

    const selectedChannel = useSelector(
        (state) => state.channelReducer.selectedChannel
    );

    const { email, name, profilePicture } = userInfo.user;
    const [firstName, lastName] = name.split(' ');

    async function asyncFunc() {
        let kc = KitChat.getInstance();
        await kc
            .init(email, firstName, lastName, profilePicture)
            .finally(() => {
                setLoading(false);
            });
        setIsLoaded(kc.isSetupCompleted);
        setLoading(false);
        init();
    }

    useEffect(() => {
        asyncFunc();
    }, []);

    return (
        <>
            {loading && !isLoaded ? (
                <div className={classes.container}>
                    <div>Please Wait</div>
                </div>
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
                                <UserDetails email={email} name={name} />
                            )}
                        </div>
                        <Sidebar
                            open={open}
                            onMenuPress={() => setOpen((prev) => !prev)}
                            onCreateChannel={() => {
                                setShowChannelModal(true);
                                setEditChannelMode(false);
                            }}
                            onCreateDirectMsg={() => setShowDirectModal(true)}
                        />
                        {/* <Divider /> */}
                    </div>
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        {!loading && (
                            <>
                                {selectedChannel?._id ? (
                                    <Chat
                                        onChannelNamePress={() => {
                                            setShowChannelModal(true);
                                            setEditChannelMode(true);
                                        }}
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
