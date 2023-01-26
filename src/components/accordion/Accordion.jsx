import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import classes from './accordion.module.css';

const CustomAccordion = ({ children, header, icon, onIconPress }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={classes.accordionBox}>
            <div className={classes.accordionHeader}>
                <ExpandMoreIcon
                    className={isOpen ? classes.iconRotate : null}
                    style={{ color: 'var(--yellow)' }}
                />
                <div
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={classes.controller}
                >
                    {header}
                </div>
                <IconButton onClick={onIconPress} className={classes.icon}>
                    {icon}
                </IconButton>
            </div>
            <div
                className={`${classes.accordionContent} ${
                    isOpen && classes.accordionContentOpen
                }`}
            >
                {children}
            </div>
        </div>
    );
};

export default CustomAccordion;
