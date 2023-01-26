import { combineReducers } from 'redux';
import userReducer from './user';
import organizationModal from './organizationModal';
import filterReducer from './filterReducer';
import channelReducer from './channelReducer';

const appReducer = combineReducers({
    userReducer,
    organizationModal,
    filterReducer,
    channelReducer,
});
const rootReducer = (state, action) => {
    if (action.type === 'Logout') {
        state = undefined;
    }
    return appReducer(state, action);
};
export default rootReducer;
