import {
  getChatQuery,
  createChatMutation,
  deleteLeaveChatMutation,
  updateChatMutation,
  createUserChatMutation,
  deleteUserChatMutation,
  switchOwnershipMutation,
  getUserChatQuery,
  getAllChatIdQuery,
  getSingleChatQuery,
  getAllUserChatQuery,
  timeoutUserMutation,
  changeUserChatNotificationMutation,
  searchUserChatQuery,
  updatePinChatMutation,
  searchAtUserChatQuery
} from './query/chatQuery';
import {httpCall} from './utils/httpCall'
import {http_upload} from '../../server_config';

export const getChat = request => {
  const {groupId, count, token} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
    };

    const graphql = {
      query: getChatQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getChatReducer(result.data.getChat));
    return result.data.getChat;
  };
};

const getChatReducer = data => {
  return {
    type: 'loadChat',
    i: data,
  };
};

export const createChat = request => {
  const {
    groupId,
    name,
    rank_req,
    icon,
    token,
    allow_invite,
    allow_modify,
    second_userId,
  } = request;

  return async function(dispatch) {
    let iconData = null;

    if (icon != null) {
      iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'chat_icons');

      const upload_icon_req = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: iconData,
      });
      if (upload_icon_req.status == 500) {
        alert('Uploading icon failed');
        return 1;
      }
      iconData = await upload_icon_req.json();
      if (iconData.errors) {
        return iconData;
      }
    }

    const input = {
      groupId,
      name,
      rank_req,
      allow_invite,
      allow_modify,
      second_userId,
      icon: iconData
        ? {
            name: iconData.name,
            uri: iconData.url,
          }
        : null,
    };

    const graphql = {
      query: createChatMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getSingleChatReducer(result.data.createChat));

    return result.data.createChat;
  };
};

export const deleteLeaveChat = request => {
  const {chatId, token} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteLeaveChatMutation,
      variables: {
        chatId: chatId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateChat = request => {
  const {
    name,
    rank_req,
    icon,
    chatId,
    token,
    allow_invite,
    allow_modify,
  } = request;

  return async function(dispatch) {
    let iconData = null;

    if (icon != null) {
      iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'chat_icons');

      const upload_icon_req = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: iconData,
      });
      if (upload_icon_req.status == 500) {
        alert('Uploading icon failed');
        return 1;
      }
      iconData = await upload_icon_req.json();
      if (iconData.errors) {
        return iconData;
      }
    }

    const input = {
      chatId,
      name,
      rank_req,
      allow_invite,
      allow_modify,
      icon: iconData
        ? {
            name: iconData.name,
            uri: iconData.url,
          }
        : null,
    };

    const graphql = {
      query: updateChatMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(updateChatReducer(result.data.updateChat));
    return result.data.updateChat;
  };
};

const updateChatReducer = i => {
  return {
    type: 'updateChat',
    i: i,
  };
};

export const createUserChat = request => {
  const {token, chatId, userIds} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      userIds,
    };

    const graphql = {
      query: createUserChatMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const deleteUserChat = request => {
  const {token, chatId, userIds, groupId} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      userIds,
    };

    const graphql = {
      query: deleteUserChatMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const switchOwnership = request => {
  const {token, chatId, userIds} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      userIds,
    };

    const graphql = {
      query: switchOwnershipMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const getUserChat = request => {
  const {token, chatId} = request;

  return async function(dispatch) {
    const input = {
      chatId,
    };

    const graphql = {
      query: getUserChatQuery,
      variables: {input: input},
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return result.data.getUserChat;
  };
};

export const getAllChatId = request => {
  const {token, groupId} = request;
  return async function(dispatch) {
    const input = {
      groupId,
    };

    const graphql = {
      query: getAllChatIdQuery,
      variables: {input: input},
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return result.data.getAllChatId;
  };
};

export const updateChatInfo = request => {

  return async function(dispatch) {
    dispatch(updateChatInfoReducer(request));
    return 0;
  };
};

const updateChatInfoReducer = i => {
  return {
    type: 'updateChatInfo',
    i: i,
  };
};

export const getSingleChat = request => {
  const {token, chatId, second_userId, is_dm} = request;
  return async function(dispatch) {
    const input = {
      chatId,
      second_userId,
      is_dm,
    };

    const graphql = {
      query: getSingleChatQuery,
      variables: {input: input},
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getSingleChatReducer(result.data.getSingleChat));
    return result.data.getSingleChat;
  };
};

const getSingleChatReducer = i => {
  return {
    type: 'getSingleChat',
    i: i,
  };
};

export const resetChatReducer = () => {
  return {
    type: 'resetChat',
  };
};

export const getAllUserChat = request => {
  const {token, chatId, count, groupId} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      count,
      groupId,
    };

    const graphql = {
      query: getAllUserChatQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return result.data.getAllUserChat;
  };
};

export const timeoutUser = request => {
  const {duration, chatId, userIds, token} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      userIds,
      duration,
    };

    const graphql = {
      query: timeoutUserMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const changeUserChatNotification = request => {
  const {token, chatId} = request;

  return async function(dispatch) {
    const input = {chatId};
    const graphql = {
      query: changeUserChatNotificationMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(updateChatStatusInChats({chatId, type: 'notification'}))

    return 0;
  };
};

export const searchUserChat = request => {
  const {token, chatId, groupId, search_term, count} = request

  return async function(dispatch){
    const input = {
      chatId,
      groupId,
      search_term,
      count
    }

    const graphql = {
      query: searchUserChatQuery,
      variables: {
        input: input
      }
    }

    const result = await httpCall(token, graphql)

    if(result.errors){
      return result;
    }

    return result.data.searchUserChat

  }
}

export const searchAtUserChat = request => {
  const {token, chatId, groupId, search_term} = request 

  return async function(dispatch){
    const input = {
      chatId,
      groupId,
      search_term
    }

    const graphql = {
      query: searchAtUserChatQuery,
      variables: {
        input
      }
    }

    const result = await httpCall(token, graphql)

    if (result.errors){
      return result
    }

    return result.data.searchAtUserChat.users
  }
}

export const updatePinChat = request => {
  const {token, chatId} = request;

  return async function(dispatch) {
    const input = {chatId};
    const graphql = {
      query: updatePinChatMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(updateChatStatusInChats({chatId, type: 'is_pinned'}))

    return 0;
  };
};

const updateChatStatusInChats = i => {
  return {
    type: 'updateChatStatusInChats',
    i: i,
  };
}