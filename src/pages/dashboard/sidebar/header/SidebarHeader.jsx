import { Avatar, IconButton, Typography } from '@mui/material';
import { ReactComponent as Logo } from './../../../../assets/svg/logo.svg';
import classes from './../sidebar.module.css';

const SidebarHeader = ({ handleClick, profilePicture, name, onClick }) => {
    return (
        <div className={classes.sidebarHeader}>
            <IconButton onClick={onClick}>
                <Logo height={40} width={40} />
                <Typography color={'#fff'}>Wincy</Typography>
            </IconButton>
            <div>
                <IconButton
                    style={{ position: 'relative' }}
                    aria-describedby='popover'
                    onClick={handleClick}
                >
                    <Avatar alt={name} src={profilePicture} />
                    <div className={classes.badge} />
                </IconButton>
            </div>
        </div>
    );
};

export default SidebarHeader;
