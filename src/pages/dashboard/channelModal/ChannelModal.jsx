import { Box, IconButton, Modal, Switch, Typography } from '@mui/material/';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KitChat } from '../../../kitchat/kitchat';
import ChannelTabPanel from './ChannelTabPanel';
import ParticipantsList from './participantsList/ParticipantsList';
import ParticipantsTab from './ParticipantsTab';
import TabPanel from './TabPanel';
import UserToAdd from './UserToAdd';
import classes from './modal.module.css';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'var(--sidebarColor)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ChannelModal({ open, onClose, edit }) {
    const [tabValue, setTabValue] = useState(0);

    const { userData: userInfo, userId } = useSelector(
        (state) => state.userReducer
    );
    const { email: wincyUserEmail } = userInfo.user;

    const channel = useSelector(
        (state) => state.channelReducer?.selectedChannel
    );

    let isMeAdmin = false;

    let isMuted = false;
    if (channel?.mutedMembers?.length) {
        isMuted = channel?.mutedMembers.includes(userId);
    }

    if (channel?.admins?.length) {
        channel.admins.forEach((el) => {
            if (String(userId) === String(el._id)) {
                isMeAdmin = true;
            }
        });
    }

    const onModalClose = () => {
        setTabValue(0);
        onClose();
    };

    const dispatch = useDispatch();

    const onMuteChange = async (event) => {
        const kc = KitChat.getInstance();
        await kc.channelMuteHandler(channel._id);
        dispatch({
            type: 'UPDATE_CHANNEL',
            payload: {
                ...channel,
                mutedMembers: isMuted
                    ? channel.mutedMembers.filter((el) => el !== userId)
                    : [...channel.mutedMembers, userId],
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={onModalClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box sx={style}>
                <div className={classes.modalHeader}>
                    <div>
                        <Typography
                            id='modal-modal-title'
                            variant='h6'
                            component='h2'
                        >
                            {edit ? 'Edit Channel' : `Create a Channel`}
                        </Typography>
                        <Typography id='modal-modal-description' sx={{ mt: 0 }}>
                            {edit
                                ? channel?.type === 'CHANNEL_PRIVATE'
                                    ? 'Private Channel'
                                    : channel?.type === 'CHANNEL_PUBLIC'
                                    ? 'Public Channel'
                                    : 'Direct Messaging'
                                : `You can create a channel for any topic or project.`}
                        </Typography>
                    </div>
                    {edit && (
                        <>
                            <div style={{ marginLeft: 20 }}>
                                {!isMuted ? (
                                    <NotificationsActiveIcon />
                                ) : (
                                    <NotificationsOffIcon />
                                )}
                            </div>
                            <Switch
                                checked={isMuted}
                                name='switch'
                                onChange={onMuteChange}
                            />
                        </>
                    )}
                </div>
                {edit && (
                    <ParticipantsTab
                        channelType={channel?.type}
                        length={channel?.participants.length}
                        onChange={(e, newValue) => {
                            setTabValue(newValue);
                        }}
                        tabValue={tabValue}
                    />
                )}
                <ChannelTabPanel
                    description={channel?.description}
                    edit={edit}
                    tabValue={tabValue}
                    title={channel?.title}
                    channelId={channel?._id}
                    onModalClose={onModalClose}
                    isMeAdmin={isMeAdmin}
                    onDeleteSuccess={onModalClose}
                />
                {channel && channel?.type == 'CHANNEL_PRIVATE' && (
                    <TabPanel value={tabValue} index={1}>
                        {isMeAdmin && <UserToAdd channel={channel} />}

                        <ParticipantsList
                            channel={channel}
                            isMeAdmin={isMeAdmin}
                            userId={userId}
                            wincyUserEmail={wincyUserEmail}
                        />
                    </TabPanel>
                )}
            </Box>
        </Modal>
    );
}
