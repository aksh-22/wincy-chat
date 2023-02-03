import { io } from 'socket.io-client';
import store from '../redux/store';
import axios from 'axios';

// const url = 'https://kitchat-backend.cyclic.app/';
// const url = 'http://13.232.191.64:3002';
const url = 'http://192.168.1.48:3002';
// const url = 'https://kind-cod-shift.cyclic.app/';

// 6384adb2cd1f0cb2acf9a0fe

const SERVER_URL = url;
const SERVER_URL_SOCKET = url;

export class KitChat {
    apiKey;
    userToken;
    socket;
    channels = [];
    users = [];
    channelHandler;
    channelSelectionHandler;
    channelMessageHandler;
    channelAdded;
    channelMessageDeleteHandler = [];
    channelMessageUpdateHandler = [];
    channelUpdate = [];
    channelDelete = [];
    messageCount = [];
    userId;
    teamId = 'PAIRROXZ';
    isSetupCompleted = false;

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    static getInstance(apiKey) {
        if (this.instance == null) {
            this.instance = new KitChat(apiKey);
        }

        return this.instance;
    }

    async __standardRest(endpoint, method, body, isFormData = false) {
        const exemptedEndpoints = 'user/connect';
        if (!exemptedEndpoints.includes(endpoint)) {
            if (this.userToken == null) {
                console.error(
                    "Invalid user token. Make sure you have called 'init' function before making any further KitChat function calls."
                );
                return;
            }
        }

        const response = await fetch(`${SERVER_URL}/${endpoint}`, {
            method,
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': isFormData
                    ? `application/x-www-form-urlencoded`
                    : 'application/json',
                Authorization: `Bearer ${this.userToken}`,
                'x-api-key': this.apiKey,
            },
            body: isFormData ? new URLSearchParams(body) : JSON.stringify(body),
        });

        if (![200, 201, 202].includes(response.status)) {
            console.error(
                `Error at Kitchat endpoint: ${endpoint}`,
                `Status: ${response.status} and Error: ${response.statusText} | ${response.message}`
            );
        }

        let data = await response.json();
        try {
            if (data.statusCode != null && data.message != null) {
                console.error('Error:', data.message);
            }
        } catch (error) {}
        return data;
    }

    async init(referenceId, firstName, lastName, avatar) {
        try {
            const data = await this.__standardRest('user/connect', 'POST', {
                firstName,
                lastName,
                referenceId,
                avatar,
                teamId: this.teamId,
            });
            if (data && data.userToken) {
                this.userToken = data.userToken;
                this.userId = data.user.userId;
                store.dispatch({
                    type: 'UPDATE_USER_ID',
                    payload: data.user.userId,
                });
                // store.dispatch({
                //     type: 'LOGGED_IN',
                //     payload: true,
                // });
                this.__setupSocket();
            }
            this.isSetupCompleted = true;
            return data;
        } catch (error) {
            console.error('Error at Kitchat Init:', error.message);
        }
    }

    removeAllListeners() {
        this.socket.removeAllListeners();
        this.socket = null;
    }

    __setupSocket() {
        if (this.socket == null) {
            this.socket = io(SERVER_URL_SOCKET);

            this.socket.on('MESSAGE_RECEIVED', (message) => {
                if (this.channelMessageHandler != null) {
                    this.channelMessageHandler(message);
                }
            });
            this.socket.on('MESSAGE_DELETE', (message) => {
                if (this.channelMessageDeleteHandler.length) {
                    this.channelMessageDeleteHandler.forEach((el) => {
                        el(message);
                    });
                }
            });
            this.socket.on('MESSAGE_UPDATE', (message) => {
                if (this.channelMessageUpdateHandler.length) {
                    this.channelMessageUpdateHandler.forEach((el) => {
                        el(message);
                    });
                }
            });
            this.socket.on('CHANNEL_DELETE', (channel) => {
                if (this.channelDelete.length) {
                    this.channelDelete.forEach((el) => el(channel));
                    this.socket.emit('LEAVE_ROOM', channel._id);
                    // this.socket.off('MESSAGE_RECEIVED');
                }
            });
            this.socket.on('CHANNEL_CHANGE', (channel, type) => {
                if (type === 'ADDED') {
                    if (this.channelAdded != null) {
                        this.channelAdded(channel);
                    }
                } else if (type === 'UPDATE') {
                    if (this.channelUpdate != null) {
                        this.channelUpdate.forEach((el) => el(channel));
                    }
                } else if (type === 'COUNT') {
                    if (this.messageCount != null) {
                        this.messageCount.forEach((el) => el(channel));
                    }
                }
                this.socket.emit('JOIN_ROOMS', [`CHANNEL-${channel._id}`]);
            });
        }
    }

    onChannelUpdateList(func) {
        this.channelHandler = func;
    }

    onChannelSelect(func) {
        this.channelSelectionHandler = func;
    }

    onMessageReceived(func) {
        this.channelMessageHandler = func;
    }

    onChannelAdd(func) {
        this.channelAdded = func;
    }

    onChannelMessageDelete(func) {
        this.channelMessageDeleteHandler.push(func);
    }

    onChannelMessageUpdate(func) {
        this.channelMessageUpdateHandler.push(func);
    }

    onChannelUpdate(func) {
        this.channelUpdate.push(func);
    }

    onChannelDelete(func) {
        this.channelDelete.push(func);
    }

    onChannelMessageCountCHange(func) {
        this.messageCount.push(func);
    }

    async updateOneSignalIds(playerId, deviceId) {
        try {
            const data = await this.__standardRest(`notification`, 'POST', {
                playerId,
                deviceId,
            });
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat updateOneSignalIds:',
                error.message
            );
        }
    }

    async removeOneSignalIds(deviceId) {
        try {
            const data = await this.__standardRest(
                `notification/${deviceId}`,
                'DELETE'
            );
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat removeOneSignalIds:',
                error.message
            );
        }
    }

    async deleteChannel(channelId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/delete/${channelId}`,
                'DELETE'
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat deleteChannel:', error.message);
        }
    }

    async deleteMessage(channelId, messageId) {
        try {
            const data = await this.__standardRest(
                `chat/message/delete/${channelId}/${messageId}`,
                'DELETE'
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat deleteChannel:', error.message);
        }
    }

    async getChannels() {
        try {
            const data = await this.__standardRest(
                `chat/channel${this.teamId ? '?teamId=' + this.teamId : ''}`,
                'GET'
            );
            let combinedChannels = [];
            if (data) {
                this.channels = data;
                combinedChannels = [
                    ...data.publicChannels,
                    ...data.otherChannels,
                ];
                const socketRoomsToJoin = [];
                const socketUserToJoin = [`USER-${this.userId}`];
                const socketTeamToJoin = [`TEAM-${this.teamId}`];
                combinedChannels.forEach((item) => {
                    socketRoomsToJoin.push(`CHANNEL-${item._id}`);
                });
                if (this.socket != null) {
                    this.socket.emit('JOIN_ROOMS', socketRoomsToJoin);
                    this.socket.emit('JOIN_USER', socketUserToJoin);
                    this.socket.emit('JOIN_TEAM', socketTeamToJoin);
                }
                this.channelHandler(combinedChannels);
            }
            return combinedChannels;
        } catch (error) {
            console.error('Error at Kitchat Init:', error.message);
        }
    }

    async __createPublicChannel(title, description, duplicateTitleAllowed) {
        try {
            const data = await this.__standardRest(
                `chat/channel/create/public`,
                'POST',
                {
                    title,
                    description,
                    duplicateTitleAllowed: duplicateTitleAllowed.toString(),
                    teamId: this.teamId,
                }
            );
            // await this.getChannels();
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat __createPublicChannel:',
                error.message
            );
        }
    }

    async __createPrivateChannel(title, description, duplicateTitleAllowed) {
        try {
            const data = await this.__standardRest(
                `chat/channel/create/private`,
                'POST',
                {
                    title,
                    description,
                    duplicateTitleAllowed: duplicateTitleAllowed.toString(),
                    teamId: this.teamId,
                }
            );
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat __createPrivateChannel:',
                error.message
            );
        }
    }

    async createDirectChannel(partnerReferenceId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/create/direct`,
                'POST',
                {
                    partnerReferenceId,
                    teamId: this.teamId,
                }
            );
            // await this.getChannels();
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat __createPrivateChannel:',
                error.message
            );
        }
    }

    async createChannel(title, description, duplicateTitleAllowed, isPrivate) {
        if (isPrivate) {
            return await this.__createPrivateChannel(
                title,
                description,
                duplicateTitleAllowed
            );
        } else {
            return await this.__createPublicChannel(
                title,
                description,
                duplicateTitleAllowed
            );
        }
    }

    async updateChannel(channelId, title, description, duplicateTitleAllowed) {
        try {
            const data = await this.__standardRest(
                `chat/channel/${channelId}`,
                'PATCH',
                {
                    title,
                    description,
                    duplicateTitleAllowed: duplicateTitleAllowed.toString(),
                }
            );
            // await this.getChannels();
            return data;
        } catch (error) {
            console.error('Error at Kitchat updateChannel:', error.message);
        }
    }

    async channelMuteHandler(channelId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/mute/${channelId}`,
                'PATCH'
            );
            // await this.getChannels();
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat channelMuteHandler:',
                error.message
            );
        }
    }

    async channelSelect(channelId) {
        try {
            const channel = [
                ...this.channels.publicChannels,
                ...this.channels.otherChannels,
            ].find((channel) => channel._id == channelId);
            if (channel && this.channelSelectionHandler) {
                this.channelSelectionHandler(channel);
            }
        } catch (error) {
            console.error('Error at KitChat channelSelect', error.message);
        }
    }

    async getUsers() {
        try {
            const data = await this.__standardRest(
                `user/all/${this.teamId}`,
                'GET'
            );
            if (data) {
                this.users = data;
            }
            return data;
        } catch (error) {
            console.error('Error at Kitchat getUsers:', error.message);
        }
    }

    async channelParticipantAdd(channelId, participantId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/participant/add`,
                'POST',
                {
                    channelId,
                    participantId,
                }
            );
            // await this.getChannels();
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat channelParticipantAdd:',
                error.message
            );
        }
    }

    async channelParticipantRemove(channelId, participantId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/participant/remove`,
                'POST',
                {
                    channelId,
                    participantId,
                }
            );
            if (this.channelUpdate != null) {
                this.channelUpdate.forEach((el) => el(data));
            }
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat channelParticipantRemove:',
                error.message
            );
        }
    }

    async channelAdminAdd(channelId, adminId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/admin/add`,
                'POST',
                {
                    channelId,
                    adminId,
                }
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat channelAdminAdd:', error.message);
        }
    }

    async setCurrentChannel(channelId) {
        try {
            const data = await this.__standardRest(
                `user/currentChannel/${channelId}`,
                'GET'
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat setCurrentChannel', error.message);
        }
    }

    async readMessage(channelId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/message/read`,
                'POST',
                {
                    channelId,
                }
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat readMessage:', error.message);
        }
    }

    async channelAdminRemove(channelId, adminId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/admin/remove`,
                'POST',
                {
                    channelId,
                    adminId,
                }
            );
            return data;
        } catch (error) {
            console.error(
                'Error at Kitchat channelAdminRemove:',
                error.message
            );
        }
    }

    async channelMessages(channelId) {
        try {
            const data = await this.__standardRest(
                `chat/channel/${channelId}/messages`,
                'GET'
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat channelMessages:', error.message);
        }
    }

    async messageAdd(body) {
        const config = {
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.userToken}`,
                'x-api-key': this.apiKey,
            },
        };
        try {
            const data = await axios.post(
                `${SERVER_URL}/chat/channel/message/add`,
                body,
                config
            );
            // const data = await this.__standardRest(
            //     `chat/channel/message/add`,
            //     'POST',
            //     body,
            //     true
            // );
            return data;
        } catch (error) {
            console.error('Error at Kitchat messageAdd:', error.message);
        }
    }

    async addAttachments(body) {
        const config = {
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.userToken}`,
                'x-api-key': this.apiKey,
            },
        };
        try {
            const data = await axios.post(
                `${SERVER_URL}/chat/channel/message/upload/attachment`,
                body,
                config
            );
            // const data = await this.__standardRest(
            //     `chat/channel/message/add`,
            //     'POST',
            //     body,
            //     true
            // );
            return data;
        } catch (error) {
            console.error('Error at Kitchat messageAdd:', error.message);
        }
    }

    async messageUpdate(channelId, messageId, content) {
        try {
            const data = await this.__standardRest(
                `chat/channel/message/update`,
                'POST',
                {
                    channelId,
                    content,
                    messageId,
                }
            );
            return data;
        } catch (error) {
            console.error('Error at Kitchat messageUpdate:', error.message);
        }
    }
}
