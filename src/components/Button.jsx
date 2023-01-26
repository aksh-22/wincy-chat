import React from 'react';
import { Button, CircularProgress } from '@mui/material/';
import PropTypes from 'prop-types';

export default function AppButton(props) {
    const { loading } = props;
    return (
        <Button {...props} disabled={loading == 1}>
            {loading != 1 && props.children}
            {loading == 1 && (
                <CircularProgress
                    color='secondary'
                    size={24}
                    sx={{ mt: 0.5, mb: 0.5 }}
                />
            )}
        </Button>
    );
}
