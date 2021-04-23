const INITIAL_STATE = {
  chats: [],
  count: 0,
  chat: null,
};

export default (chatReducer = (state = INITIAL_STATE, action) => {
  const updatedChats = [...state.chats];
  switch (action.type) {
    case 'loadChat':
      return {
        ...state,
        count: action.i.count,
        chats:
          action.i.count == 50
            ? action.i.chat
            : state.chats.concat(action.i.chat),
      };

    case 'updateChatStatusInChats':
      return {
        ...state,
        chats: state.chats.map(c => {
          if (c.id === action.i.chatId) {
            return {
              ...c,
              is_pinned:
                action.i.type == 'is_pinned' ? !c.is_pinned : c.is_pinned,
              notification:
                action.i.type == 'notification'
                  ? !c.notification
                  : c.notification,
            };
          }
          return c;
        }),
      };

    case 'updateChatInfo':
      const updatedChatIndex = updatedChats.findIndex(
        c => c.id === action.i.chatId,
      );
      if (updatedChatIndex > -1) {
        updatedChats[updatedChatIndex] = {
          ...updatedChats[updatedChatIndex],
          last_message: action.i.message,
          unread_message_count:
            updatedChats[updatedChatIndex].unread_message_count + 1,
        };
      }
      return {
        ...state,
        chats: updatedChats,
      };

    case 'updateChat':
      return {
        ...state,
        chat: action.i,
      };

    case 'getSingleChat':
      return {
        ...state,
        chat: action.i,
      };

    case 'resetChat':
      return {
        ...INITIAL_STATE,
      };

    case 'logout':
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
});
