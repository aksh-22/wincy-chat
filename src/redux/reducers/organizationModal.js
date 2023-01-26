const initialState = {
  orgModal: {
    type: null,
    visible: false,
  },
};
const organizationModal = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ORG_MODAL":
      return {
        ...state,
        orgModal: {
          ...state.orgModal,
          type: action.payload.type,
          visible: action.payload.visible,
        },
      };

    default:
      return state;
  }
};

export default organizationModal;
