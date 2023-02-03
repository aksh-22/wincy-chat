import { Logout as LogoutIcon } from '@mui/icons-material/';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { KitChat } from '../../../../kitchat/kitchat';
import { useLogout } from '../../../../react-query/auth/useLogout';
import classes from './../sidebar.module.css';

const UserDetails = ({ name, email }: any) => {
    const { isLoading, mutate } = useLogout();
    const deviceId = useSelector((state: any) => state.userReducer.deviceId);

    const onLogout = async () => {
        const kc = KitChat.getInstance();
        kc.removeOneSignalIds(deviceId).then(() => {
            kc.removeAllListeners();
            mutate();
        });
    };

    return (
        <Grid className={classes.popper} container sx={{ pb: 5, pt: 2 }}>
            <Grid item sx={{ ml: 1, mr: 2 }}>
                <Typography fontSize={14}>{name}</Typography>
                <Typography fontSize={10}>{email}</Typography>
            </Grid>
            <Grid>
                <IconButton
                    onClick={onLogout}
                    disabled={isLoading}
                    aria-label='delete'
                    color='primary'
                    size='small'
                >
                    {isLoading ? (
                        <CircularProgress
                            color='secondary'
                            size={24}
                            sx={{
                                mt: 0.5,
                                mb: 0.5,
                            }}
                        />
                    ) : (
                        <LogoutIcon />
                    )}
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default UserDetails;
