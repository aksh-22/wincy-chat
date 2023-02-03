import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { KitChat } from '../../../kitchat/kitchat';
import Button from './../../../components/Button';

type Props = {
    channel: any;
};

const UserToAdd = ({ channel }: Props) => {
    const [userToAdd, setUserToAdd] = useState<any>();
    const [users, setUsers] = useState([]);

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

    const filterUsersToAdd = () => {
        if (channel && channel.participants && users) {
            const membersIds = channel.participants.map((p: any) => p._id);
            return users.filter((user: any) => !membersIds.includes(user._id));
        } else {
            return users;
        }
    };

    useEffect(() => {
        async function asyncFunc() {
            const kc = await KitChat.getInstance();
            const data = await kc.getUsers();
            setUsers(data);
        }
        asyncFunc();
    }, []);

    return (
        <>
            <Autocomplete
                disablePortal
                options={filterUsersToAdd()}
                sx={{ mt: 2, mb: 3 }}
                getOptionLabel={(user: any) =>
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
            <Button onClick={() => channelParticipantAdd()}>Add</Button>
        </>
    );
};

export default UserToAdd;
