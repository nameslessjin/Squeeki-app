import {
  getChatQuery,
  createChatMutation,
  deleteLeaveChatMutation,
  updateChatMutation,
  createUserChatMutation,
  deleteUserChatMutation,
  switchOwnershipMutation,
} from './query/chatQuery';
import {http, http_upload} from '../../server_config'

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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    dispatch(getChatReducer(result.data.getChat));
    return 0;
  };
};

const getChatReducer = data => {
  return {
    type: 'loadChat',
    i: data,
  };
};

export const createChat = request => {
  const {groupId, name, rank_req, icon, token} = request;

  return async function(dispatch) {
    let iconData = null;

    if (icon != null) {
      iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'chat_icons');

      const upload_icon_req = await fetch(
        http_upload,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: iconData,
        },
      );
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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateChat = request => {
  const {name, rank_req, icon, chatId, token} = request;

  return async function(dispatch) {
    let iconData = null;

    if (icon != null) {
      iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'chat_icons');

      const upload_icon_req = await fetch(
        http_upload,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: iconData,
        },
      );
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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return result.data.updateChat;
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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const deleteUserChat = request => {
  const {token, chatId, userIds} = request;

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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

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

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
  };
};
