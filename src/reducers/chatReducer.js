const INITIAL_STATE = {
  chats: [],
  count: 0,
  chat: null,
};

export default (chatReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'loadChat':
      return {
        ...state,
        count: action.i.count,
        chats:
          action.i.count > 10 && action.i.count == state.count
            ? state.chats
            : action.i.count == 10
            ? action.i.chat
            : state.chats.concat(action.i.chat),
      };

    case 'logout':
      return {
        ...INITIAL_STATE,
      };

    default:
        return state
  }
});
