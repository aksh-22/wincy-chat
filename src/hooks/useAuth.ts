import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useAuth = () => {
    const userInfo = useSelector((state: any) => state.userReducer.userData);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        setIsLoggedIn(userInfo.user ? true : false);
    }, [userInfo]);
    return { isLoggedIn, userInfo };
};

export default useAuth;
