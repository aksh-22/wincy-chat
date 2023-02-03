import { useState } from 'react';
import { KitChat } from '../../../kitchat/kitchat';
import Button from './../../../components/Button';

type Props = {
    edit: boolean;
    loading: boolean;
    channelId: string;
    onDeleteSuccess: () => void;
};

const ModalButtons = ({ loading, edit, channelId, onDeleteSuccess }: Props) => {
    const [deleteLoading, setDeleteLoading] = useState(false);

    const onDeleteClick = async () => {
        try {
            setDeleteLoading(true);
            const kc = await KitChat.getInstance();
            await kc.deleteChannel(channelId);
            onDeleteSuccess();
        } catch (error) {}
        setDeleteLoading(false);
    };
    return (
        <>
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
            <Button
                fullWidth
                variant='contained'
                color='error'
                loading={+deleteLoading}
                onClick={onDeleteClick}
                sx={{ mt: 3, mb: 2 }}
            >
                Delete
            </Button>
        </>
    );
};

export default ModalButtons;
