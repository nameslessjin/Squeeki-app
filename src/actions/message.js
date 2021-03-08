import {getChatMessageQuery, sendMessageMutation, chatMessageSubscription} from './query/messageQuery';
import {http} from '../../server_config'
// import { useSubscription, useQuery } from '@apollo/client'

export const getChatMessage = request => {
  const {chatId, token, pointer} = request;

  return async function(dispatch) {
    const input = {
      chatId: chatId,
      pointer: pointer,
    };

    const graphql = {
      query: getChatMessageQuery,
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

    return result.data.getChatMessage;
  };
};

// const getChatMessageReducer = data => {
//   return {
//     type: 'getChatMessage',
//     i: data,
//   };
// };

export const sendMessage = request => {
  const {token, content, chatId, media} = request;

  return async function(dispatch) {
    const input = {
      content,
      chatId,
      media,
    };

    const graphql = {
      query: sendMessageMutation,
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
