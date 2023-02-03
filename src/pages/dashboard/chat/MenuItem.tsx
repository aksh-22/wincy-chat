import React from 'react';
import classes from './chat.module.css';

type Props = {
    option: any;
};

const MenuItem = ({ option }: Props) => {
    return (
        <div className={classes.menuItem} style={{ color: option.color }}>
            {option.name}
        </div>
    );
};

export default MenuItem;
