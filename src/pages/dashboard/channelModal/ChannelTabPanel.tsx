import { Box, Grid, Switch, TextField, Typography } from '@mui/material/';
import { useState } from 'react';
import { KitChat } from '../../../kitchat/kitchat';
import Button from './../../../components/Button';
import ModalButtons from './ModalButtons';
import TabPanel from './TabPanel';

type Props = {
    edit: boolean;
    tabValue: any;
    title: string;
    description: string;
    onModalClose: () => void;
    channelId: any;
    isMeAdmin: boolean;
    onDeleteSuccess: () => void;
};

const ChannelTabPanel = ({
    edit,
    tabValue,
    description,
    title,
    onModalClose,
    channelId,
    isMeAdmin,
    onDeleteSuccess,
}: Props) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // setLoading(true);
        const data = new FormData(event.currentTarget);
        const payload = {
            title: data.get('title'),
            description: data.get('description'),
            private: data.get('private'),
        };
        const kc = KitChat.getInstance();

        if (edit) {
            const result = await kc.updateChannel(
                channelId,
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

    return (
        <TabPanel value={tabValue} index={0}>
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='title'
                    label='Channel name'
                    defaultValue={edit ? title : ''}
                    autoFocus
                    disabled={!isMeAdmin && edit}
                />
                <TextField
                    margin='normal'
                    fullWidth
                    name='description'
                    label='Description'
                    defaultValue={edit ? description : ''}
                    multiline={true}
                    maxRows={4}
                    disabled={!isMeAdmin && edit}
                />
                {!edit && (
                    <Grid container alignItems={'center'}>
                        <Grid item>
                            <Typography>Make the channel Private?</Typography>
                        </Grid>
                        <Grid item sm>
                            <Switch name='private' defaultChecked={true} />
                        </Grid>
                    </Grid>
                )}
                {(isMeAdmin || !edit) && (
                    <ModalButtons
                        channelId={channelId}
                        edit={edit}
                        loading={loading}
                        onDeleteSuccess={onDeleteSuccess}
                    />
                )}
            </Box>
        </TabPanel>
    );
};

export default ChannelTabPanel;
