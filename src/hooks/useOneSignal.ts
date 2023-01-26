import React, { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useDispatch, useSelector } from 'react-redux';
import uniqueIdGenerator from '../constants/uniqueIdGenerator';
import { KitChat } from '../kitchat/kitchat';

type Props = {};

const appId = 'd9c8b76a-dfd6-48be-b8c4-fcd023096a80';

const useOneSignal = (props: Props) => {
    const [isPermitted, setIsPermitted] = useState(false);
    const [pId, setPId] = useState<string | null | undefined>(null);

    const deviceId = useSelector((state: any) => state.userReducer.deviceId);

    const dispatch = useDispatch();

    const updateNotificationIds = async (pId: any, deviceId: any) => {
        let kc = KitChat.getInstance();
        const data = await kc.updateOneSignalIds(pId, deviceId);
        console.log('data', data.deviceId);
        dispatch({ type: 'DEVICE_ID', payload: data.deviceId });
    };

    const init = async () => {
        try {
            const newDeviceId = !deviceId ? uniqueIdGenerator() : deviceId;
            console.log('deviceId', deviceId);
            await OneSignal.init({
                appId,
                allowLocalhostAsSecureOrigin: true,
                autoResubscribe: true,
                persistNotification: false,
            });
            await OneSignal.showSlidedownPrompt();
            await OneSignal.registerForPushNotifications();
            await OneSignal.getNotificationPermission();
            const isEnabled = await OneSignal.isPushNotificationsEnabled();
            setIsPermitted(isEnabled);
            if (isEnabled) {
                const userId = await OneSignal.getUserId();
                setPId(userId);
                updateNotificationIds(userId, newDeviceId);
            }
        } catch (error) {}
    };

    useEffect(() => {
        // init();
    }, []);

    return { isPermitted, pId, init };
};

export default useOneSignal;
