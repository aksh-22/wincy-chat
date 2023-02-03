import React, { useEffect } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Container,
    Box,
    Avatar,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import Button from '../../components/Button';
import { useLogin } from '../../react-query/auth/useLogin';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const { error: err, mutate, isLoading } = useLogin();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userReducer.userData);
    const dispatch = useDispatch();
    useEffect(() => {
        if (userInfo?.token) {
            dispatch({ type: 'LOGGED_IN', payload: true });
            // navigate('/dashboard');
        }
    }, [userInfo?.token]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const payload = {
            email: data.get('email'),
            password: data.get('password'),
        };

        mutate(payload);
    };

    return (
        <Container component='main' maxWidth='s'>
            <Box
                sx={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3, mb: 2 }}
                        loading={+isLoading}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
