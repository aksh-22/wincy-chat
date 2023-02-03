import { Box } from '@mui/material';
import React from 'react';

type Props = {
    children: any;
    value: any;
    index: any;
};

const TabPanel = ({ children, value, index, ...other }: Props) => {
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

export default TabPanel;
