import { Box, Modal } from '@mui/material';
import React, { ReactNode } from 'react';

type Props = {
    open: boolean;
    onModalClose: () => void;
    children: ReactNode;
    boxStyle?: any;
};

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

const CustomModal = ({ open, onModalClose, children, boxStyle }: Props) => {
    return (
        <Modal
            open={open}
            onClose={onModalClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box sx={[style, boxStyle]}>{children}</Box>
        </Modal>
    );
};

export default CustomModal;
