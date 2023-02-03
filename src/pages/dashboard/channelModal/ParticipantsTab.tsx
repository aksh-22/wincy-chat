import { Box, Tab, Tabs } from '@mui/material/';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

type Props = {
    onChange: (e: any, newValue: any) => void;
    tabValue: any;
    channelType: any;
    length: number;
};

const ParticipantsTab = ({
    onChange,
    tabValue,
    channelType,

    length,
}: Props) => {
    return (
        <Box sx={{ borderBottom: 1, mt: 2, borderColor: 'divider' }}>
            <Tabs
                value={tabValue}
                onChange={onChange}
                aria-label='basic tabs example'
            >
                <Tab label='About' {...a11yProps(0)} />
                {channelType === 'CHANNEL_PRIVATE' && (
                    <Tab label={`Members (${length})`} {...a11yProps(1)} />
                )}
            </Tabs>
        </Box>
    );
};

export default ParticipantsTab;
