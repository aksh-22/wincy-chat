import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { List, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CustomAccordion from '../../../../components/accordion/Accordion';
import CustomListItem from './ListItem';

const ChannelList = ({ data, onChange, heading, onIconPress, open }) => {
    const userId = useSelector((state) => state.userReducer.userId);

    return (
        <>
            <CustomAccordion
                onIconPress={onIconPress}
                icon={<ControlPointIcon style={{ color: 'var(--yellow)' }} />}
                header={
                    <Typography
                        fontSize={15}
                        style={{ color: 'var(--activeText)' }}
                    >
                        {heading}
                    </Typography>
                }
            >
                <List>
                    {data &&
                        data.map((channel, index) => (
                            <CustomListItem
                                key={index}
                                channel={channel}
                                onChange={onChange}
                                open={open}
                                userId={userId}
                            />
                        ))}
                </List>
            </CustomAccordion>
        </>
    );
};

export default ChannelList;
