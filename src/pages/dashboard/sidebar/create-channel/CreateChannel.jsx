import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItemButton,
    Typography,
} from '@mui/material';
import React from 'react';
import classes from './../sidebar.module.css';

const CreateChannel = ({ onCreateChannel, onCreateDirectMsg }) => {
    return (
        <div style={{ marginTop: 20 }}>
            <Accordion elevation={0}>
                <AccordionSummary
                    expandIcon={
                        <ExpandMoreIcon style={{ color: 'var(--yellow)' }} />
                    }
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    className={classes.list}
                >
                    <Typography
                        fontSize={15}
                        style={{ color: 'var(--activeText)' }}
                    >
                        Create Channels
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.list}>
                    <List>
                        <ListItemButton
                            component='a'
                            href='#simple-list'
                            onClick={onCreateChannel}
                            className={classes.addListItem}
                        >
                            <Typography sx={{ m: 0 }} fontSize={14}>
                                Create Channel
                            </Typography>
                            <ControlPointIcon sx={{ color: 'var(--yellow)' }} />
                        </ListItemButton>
                        <ListItemButton
                            component='a'
                            href='#simple-list'
                            onClick={onCreateDirectMsg}
                            className={classes.addListItem}
                        >
                            <Typography sx={{ m: 0 }} fontSize={14}>
                                Direct Msg
                            </Typography>
                            <ControlPointIcon sx={{ color: 'var(--yellow)' }} />
                        </ListItemButton>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default CreateChannel;
