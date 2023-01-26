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
    switch (action.type) {
        case 'SET_CHANNEL':
            return {
                ...state,
                selectedChannel: action.payload,
            };

        case 'UPDATE_CHANNEL':
            const channelListUpdated = state.channelList.map((el) => {
                if (el._id === action.payload._id) {
                    return action.payload;
                } else {
                    return el;
                }
            });

            let tempSelectedChannel = state.selectedChannel;

            if (tempSelectedChannel._id === action.payload._id) {
                tempSelectedChannel = action.payload;
            }

            return {
                ...state,
                channelList: channelListUpdated,
                selectedChannel: tempSelectedChannel,
            };

        case 'CHANNEL_LIST':
            return {
                ...state,
                channelList: action.payload,
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

            return {
                ...state,
                channelList: channelListWithUpdateCount,
            };

        default:
            return state;
    }
};
export default channelReducer;
