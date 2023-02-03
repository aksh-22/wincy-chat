import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Typography,
} from '@mui/material/';
import { useState } from 'react';
import { KitChat } from '../../../../kitchat/kitchat';
import Button from './../../../../components/Button';

type Props = {
    channel: any;
    userId: any;
    wincyUserEmail: any;
    isMeAdmin: boolean;
};

const ParticipantsList = ({
    channel,
    userId,
    wincyUserEmail,
    isMeAdmin,
}: Props) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userToRemove, setUserToRemove] = useState<any>();

    const makeAdmin = async (id: any) => {
        const kc = await KitChat.getInstance();
        kc.channelAdminAdd(channel._id, id);
    };

    const removeAdmin = async (id: any) => {
        const kc = await KitChat.getInstance();
        kc.channelAdminRemove(channel._id, id);
    };

    const channelParticipantRemove = async () => {
        const kc = await KitChat.getInstance();
        const result = await kc.channelParticipantRemove(
            channel._id,
            userToRemove._id
        );
        // kc.channelAdminRemove(channel._id, userToRemove._id);
        // kc.channelSelect(result._id);
        setConfirmDelete(false);
    };

    return (
        <List>
            {channel.participants.map((member: any) => {
                let isNotMe = member.referenceId !== wincyUserEmail;

                let isOtherUserAdmin = false;
                channel.admins.forEach((el: any) => {
                    if (String(userId) === String(el._id)) {
                        isMeAdmin = true;
                    }
                    if (String(member._id) === String(el._id)) {
                        isOtherUserAdmin = true;
                    }
                });
                return (
                    <ListItem key={`member-${member._id}`}>
                        <Avatar alt={member.firstName} src={member.avatar} />
                        <Typography sx={{ ml: 2, mr: 1 }}>
                            {member.firstName} {member.lastName}
                        </Typography>
                        {isNotMe && isMeAdmin && (
                            <Button
                                onClick={() => {
                                    setUserToRemove(member);
                                    setConfirmDelete(true);
                                }}
                            >
                                <DeleteIcon style={{ color: 'red' }} />
                            </Button>
                        )}
                        {isNotMe &&
                            isMeAdmin &&
                            (!isOtherUserAdmin ? (
                                <Button
                                    onClick={() => {
                                        makeAdmin(member._id);
                                        // setUserToRemove(member);
                                        // setConfirmDelete(true);
                                    }}
                                >
                                    <AdminPanelSettingsIcon
                                        style={{
                                            color: 'green',
                                        }}
                                    />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        removeAdmin(member._id);
                                        // setUserToRemove(member);
                                        // setConfirmDelete(true);
                                    }}
                                >
                                    <AdminPanelSettingsIcon
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                </Button>
                            ))}
                    </ListItem>
                );
            })}
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle>{'Confirm'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {`Are you sure you want to remove ${userToRemove?.firstName} ${userToRemove?.lastName}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => channelParticipantRemove()}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </List>
    );
};

export default ParticipantsList;
