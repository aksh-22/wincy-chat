import React, { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useDispatch, useSelector } from 'react-redux';
import uniqueIdGenerator from '../constants/uniqueIdGenerator';
import { KitChat } from '../kitchat/kitchat';

type Props = {};

const appId = '98807e7e-8794-4bd6-b548-21f428d81522';

const useOneSignal = (props: Props) => {
    const [isPermitted, setIsPermitted] = useState(false);
    const [pId, setPId] = useState<string | null | undefined>(null);

    const { deviceId, userId } = useSelector((state: any) => state.userReducer);

    const dispatch = useDispatch();

    const updateNotificationIds = async (pId: any, deviceId: any) => {
        let kc = KitChat.getInstance();
        const data = await kc.updateOneSignalIds(pId, deviceId);
        dispatch({ type: 'DEVICE_ID', payload: data.deviceId });
    };

    // const removeNotificationIds = async (pId: any, deviceId: any) => {
    //     let kc = KitChat.getInstance();
    //     const data = await kc.updateOneSignalIds(pId, deviceId);
    //     dispatch({ type: 'DEVICE_ID', payload: data.deviceId });
    // };

    const init = async () => {
        try {
            const newDeviceId = !deviceId ? uniqueIdGenerator() : deviceId;
            await OneSignal.init({
                appId,
                allowLocalhostAsSecureOrigin: true,
                autoResubscribe: true,
                persistNotification: false,
            });
            await OneSignal.sendTag('CHANNEL_ID', 'PAIRROXZ');
            await OneSignal.showSlidedownPrompt();
            await OneSignal.registerForPushNotifications({
                httpPermissionRequest: true,
            });
            await OneSignal.getNotificationPermission();
            await OneSignal.setExternalUserId(userId);
            const isEnabled = await OneSignal.isPushNotificationsEnabled();
            setIsPermitted(isEnabled);
            if (isEnabled) {
                const userId = await OneSignal.getUserId();
                console.log('playerId', userId);
                setPId(userId);
                updateNotificationIds(userId, newDeviceId);
                await OneSignal.addListenerForNotificationOpened((item) => {
                    console.log('item', item);
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        // init();
    }, []);

    return { isPermitted, pId, init };
};

export default useOneSignal;
