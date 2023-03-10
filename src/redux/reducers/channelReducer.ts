type Props = {
    selectedChannel: any;
    channelList: Array<any>;
    groupChannels: Array<any>;
    directChannels: Array<any>;
};

const initialState: Props = {
    selectedChannel: {},
    channelList: [],
    directChannels: [],
    groupChannels: [],
};
const channelReducer = (state = initialState, action: any) => {
    let index;
    let tempChannelList = [];
    let tempSelectedChannel: any = {};
    switch (action.type) {
        case 'SET_CHANNEL':
            return {
                ...state,
                selectedChannel: action.payload,
            };

        case 'ADD_CHANNEL':
            return {
                ...state,
                channelList: [action.payload, ...state.channelList],
            };

        case 'UPDATE_CHANNEL':
            tempChannelList = state.channelList;
            index = tempChannelList.findIndex(
                (el) => el._id === action.payload._id
            );
            if (index === -1) {
                tempChannelList.unshift(action.payload);
            } else {
                tempChannelList[index] = action.payload;
            }
            if (state?.selectedChannel?._id === action.payload._id) {
                state.selectedChannel = action.payload;
            }

            return {
                ...state,
                channelList: [...tempChannelList],
                selectedChannel: state.selectedChannel,
            };

        case 'CHANNEL_LIST':
            return {
                ...state,
                channelList: action.payload,
            };

        case 'REMOVE_CHANNEL_FROM_LIST':
            tempChannelList = state.channelList;
            index = tempChannelList.findIndex(
                (el) => el._id === action.payload
            );
            tempChannelList.splice(index, 1);
            return {
                ...state,
                channelList: [...tempChannelList],
                selectedChannel:
                    state?.selectedChannel?._id === action.payload
                        ? null
                        : state.selectedChannel,
            };

        case 'ADD_ATTACHMENTS':
            tempChannelList = state.channelList;
            tempSelectedChannel = { ...state?.selectedChannel };
            index = tempChannelList.findIndex(
                (el) => el._id === action.payload.channelId
            );
            tempChannelList[index].attachments.push(
                ...action.payload.attachments
            );

            if (state?.selectedChannel?._id === action.payload.channelId) {
                tempSelectedChannel.attachments.push(
                    ...action.payload.attachments
                );
            }

            return {
                ...state,
                channelList: [...tempChannelList],
                selectedChannel: tempSelectedChannel,
            };

        case 'REMOVE_ATTACHMENTS':
            tempChannelList = state.channelList;

            // tempSelectedChannel = { ...state?.selectedChannel };
            index = tempChannelList.findIndex(
                (el) => el._id === action.payload.channelId
            );
            const attachIndex = tempChannelList[index].attachments.findIndex(
                (el: any) => el.original === action.payload.attachments
            );
            tempChannelList[index].attachments.splice(attachIndex, 1);

            return {
                ...state,
                channelList: [...tempChannelList],
            };

        case 'UPDATE_COUNT':
            let channelListWithUpdateCount = state.channelList.map((el) => {
                if (el._id === action.payload._id) {
                    return {
                        ...el,
                        participantsDetails: action.payload.participantsDetails,
                    };
                } else {
                    return el;
                }
            });

            tempSelectedChannel = { ...state?.selectedChannel };

            if (state?.selectedChannel?._id === action.payload._id) {
                tempSelectedChannel = {
                    ...tempSelectedChannel,
                    participantsDetails: action.payload.participantsDetails,
                };
            }

            return {
                ...state,
                channelList: channelListWithUpdateCount,
                selectedChannel: tempSelectedChannel,
            };

        default:
            return state;
    }
};
export default channelReducer;
