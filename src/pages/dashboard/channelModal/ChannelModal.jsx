import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Autocomplete,
    Avatar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    List,
    ListItem,
    Modal,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material/';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { KitChat } from '../../../kitchat/kitchat';
import Button from './../../../components/Button';

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mv: 3 }}>{children}</Box>}
        </div>
    );
};

export default function ChannelModal({ open, onClose, edit }) {
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [userToAdd, setUserToAdd] = useState();
    const [userToRemove, setUserToRemove] = useState();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { userData: userInfo, userId } = useSelector(
        (state) => state.userReducer
    );
    const { email: wincyUserEmail } = userInfo.user;

    const channel = useSelector(
        (state) => state.channelReducer?.selectedChannel
    );

    useEffect(() => {
        async function asyncFunc() {
            const kc = await KitChat.getInstance();
            const data = await kc.getUsers();
            setUsers(data);
        }
        asyncFunc();
    }, []);

    const onModalClose = () => {
        setTabValue(0);
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const payload = {
            title: data.get('title'),
            description: data.get('description'),
            private: data.get('private'),
        };
        const kc = await KitChat.getInstance();

        if (edit) {
            const result = await kc.updateChannel(
                channel._id,
                payload.title,
                payload.description,
                false
            );
            if (result) {
                setLoading(false);
            }
        } else {
            const result = await kc.createChannel(
                payload.title,
                payload.description,
                false,
                payload.private == 'on'
            );
            // kc.channelSelect(result._id);
            setLoading(false);
            onModalClose();
        }
    };

    const channelParticipantAdd = async () => {
        const kc = await KitChat.getInstance();
        const result = await kc.channelParticipantAdd(
            channel._id,
            userToAdd._id
        );
        setUserToAdd(null);
        // kc.channelAdminAdd(channel._id, userToAdd._id);
        // kc.channelSelect(result._id);
    };

    const makeAdmin = async (id) => {
        const kc = await KitChat.getInstance();
        kc.channelAdminAdd(channel._id, id);
    };

    const removeAdmin = async (id) => {
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

    const filterUsersToAdd = () => {
        if (channel && channel.participants && users) {
            const membersIds = channel.participants.map((p) => p._id);
            return users.filter((user) => !membersIds.includes(user._id));
        } else {
            return users;
        }
    };

    return (
        <Modal
            open={open}
            onClose={onModalClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box sx={style}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                    {edit ? 'Edit Channel' : `Create a Channel`}
                </Typography>
                <Typography id='modal-modal-description' sx={{ mt: 0 }}>
                    {edit
                        ? channel.type === 'CHANNEL_PRIVATE'
                            ? 'Private Channel'
                            : channel.type === 'CHANNEL_PUBLIC'
                            ? 'Public Channel'
                            : 'Direct Messaging'
                        : `You can create a channel for any topic or project.`}
                </Typography>
                {edit && (
                    <Box
                        sx={{ borderBottom: 1, mt: 2, borderColor: 'divider' }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => {
                                setTabValue(newValue);
                            }}
                            aria-label='basic tabs example'
                        >
                            <Tab label='About' {...a11yProps(0)} />
                            {channel.type === 'CHANNEL_PRIVATE' && (
                                <Tab
                                    label={`Members (${channel.participants.length})`}
                                    {...a11yProps(1)}
                                />
                            )}
                        </Tabs>
                    </Box>
                )}
                <TabPanel value={tabValue} index={0}>
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            name='title'
                            label='Channel name'
                            defaultValue={edit ? channel.title : ''}
                            autoFocus
                        />
                        <TextField
                            margin='normal'
                            fullWidth
                            name='description'
                            label='Description'
                            defaultValue={edit ? channel.description : ''}
                            multiline={true}
                            maxRows={4}
                        />
                        {!edit && (
                            <Grid container alignItems={'center'}>
                                <Grid item>
                                    <Typography>
                                        Make the channel Private?
                                    </Typography>
                                </Grid>
                                <Grid item sm>
                                    <Switch
                                        name='private'
                                        defaultChecked={true}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                            loading={+loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {edit ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </TabPanel>
                {channel && channel.type == 'CHANNEL_PRIVATE' && (
                    <TabPanel value={tabValue} index={1}>
                        <Autocomplete
                            disablePortal
                            options={filterUsersToAdd()}
                            sx={{ mt: 2, mb: 3 }}
                            getOptionLabel={(user) =>
                                `${user.firstName} ${user.lastName}`
                            }
                            isOptionEqualToValue={(option, value) =>
                                option._id === value._id
                            }
                            onChange={(event, newValue) => {
                                setUserToAdd(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label='Add a Member' />
                            )}
                            // value={null}
                        />
                        <Button onClick={() => channelParticipantAdd()}>
                            Add
                        </Button>
                        <List>
                            {channel.participants.map((member) => {
                                let isNotMe =
                                    member.referenceId !== wincyUserEmail;
                                let isMeAdmin = false;
                                let isOtherUserAdmin = false;
                                channel.admins.forEach((el) => {
                                    if (String(userId) === String(el._id)) {
                                        isMeAdmin = true;
                                    }
                                    if (String(member._id) === String(el._id)) {
                                        isOtherUserAdmin = true;
                                    }
                                });
                                return (
                                    <ListItem key={`member-${member._id}`}>
                                        <Avatar
                                            alt={member.firstName}
                                            src={member.avatar}
                                        />
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
                                                <DeleteIcon
                                                    style={{ color: 'red' }}
                                                />
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
                                    <Button
                                        onClick={() => setConfirmDelete(false)}
                                        autoFocus
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            channelParticipantRemove()
                                        }
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </List>
                    </TabPanel>
                )}
            </Box>
        </Modal>
    );
}
