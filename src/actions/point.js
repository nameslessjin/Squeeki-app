import {
  getUserGroupPointQuery,
  getGroupPointLeaderBoardQuery,
} from './query/pointQuery';
import {httpCall} from './utils/httpCall';

export const getUserGroupPoint = request => {
  const {token, groupId} = request;

  return async function(dispatch) {
    const graphql = {
      query: getUserGroupPointQuery,
      variables: {
        input: groupId,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(getUserGroupPointReducer(result.data.getUserGroupPoint));

    return 0;
  };
};

const getUserGroupPointReducer = data => {
  return {
    type: 'getUserGroupPoint',
    point: data,
  };
};

export const getGroupPointLeaderBoard = request => {
  const {token, groupId, count, limit, period, init} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      limit: limit,
      count: count,
      period: period,
    };

    const graphql = {
      query: getGroupPointLeaderBoardQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(
      getGroupPointLeaderBoardReducer({
        ...result.data.getGroupPointLeaderBoard,
        init,
      }),
    );

    return 0;
  };
};

const getGroupPointLeaderBoardReducer = data => {
  return {
    type: 'getGroupPointLeaderBoard',
    i: data,
  };
};

export const cleanLeaderboard = data => {
  return {
    type: 'cleanLeaderboard',
  };
};
