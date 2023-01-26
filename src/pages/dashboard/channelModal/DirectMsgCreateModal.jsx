import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Autocomplete,
} from '@mui/material/';
import { KitChat } from '../../../kitchat/kitchat';
import Button from './../../../components/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'var(--background)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DirectChannelModal({ open, onClose }) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);

    useEffect(() => {
        async function asyncFunc() {
            const kc = await KitChat.getInstance();
            const data = await kc.getUsers();
            setUsers(data);
        }
        asyncFunc();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const kc = await KitChat.getInstance();
        const channel = await kc.createDirectChannel(selectedUser.referenceId);
        kc.channelSelect(channel._id);
        setLoading(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box sx={style}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                    Begin a Conversation
                </Typography>
                <Typography fontSize={12} sx={{ mt: 1 }}>
                    Select a user to begin a conversation with the selected
                    user.
                </Typography>
                <Autocomplete
                    disablePortal
                    options={users}
                    sx={{ mt: 2, mb: 3 }}
                    getOptionLabel={(user) =>
                        `${user.firstName} ${user.lastName}`
                    }
                    isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                    }
                    onChange={(event, newValue) => {
                        setSelectedUser(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label='Select a user' />
                    )}
                />
                <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        loading={+loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Start
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
