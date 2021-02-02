import {
  getChatQuery,
  createChatMutation,
  deleteLeaveChatMutation,
  updateChatMutation,
  createUserChatMutation,
  deleteUserChatMutation,
  switchOwnershipMutation,
} from './query/chatQuery';

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

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    return result.data.getChat;
  };
};

export const createChat = request => {
  const {groupId, type, name, rank_req, icon, token} = request;

  return async function(dispatch) {
    const input = {
      groupId,
      type,
      name,
      rank_req,
      icon,
    };

    const graphql = {
      query: createChatMutation,
      variables: {
        input: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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
  const {name, rank_req, icon, chatId} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      name,
      rank_req,
      icon,
    };

    const graphql = {
      query: updateChatMutation,
      variables: {
        input: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    const req = await fetch('http://192.168.86.24:8080/graphql', {
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
