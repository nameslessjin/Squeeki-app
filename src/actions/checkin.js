import {
  createCheckInMutation,
  getGroupCheckInQuery,
  createUserCheckInMutation,
  deleteCheckInMutation,
  getGroupCheckInResultQuery,
  createUserCheckInBatchMutation,
} from './query/checkinQuery';
import {httpCall} from './utils/httpCall';

export const createCheckIn = request => {
  const {
    groupId,
    postId,
    point,
    name,
    password,
    isLocal,
    endAt,
    token,
  } = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      postId: postId,
      point: point,
      name: name,
      isLocal: isLocal,
      password: password,
      endAt: endAt,
    };

    const graphql = {
      query: createCheckInMutation,
      variables: {
        checkInInput: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const getGroupCheckIn = request => {
  const {token, groupId, count} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
    };
    const graphql = {
      query: getGroupCheckInQuery,
      variables: {
        groupCheckInInput: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(loadGroupCheckInReducer(result.data.getGroupCheckIn));
    return 0;
  };
};

const loadGroupCheckInReducer = data => {
  return {
    type: 'loadGroupCheckin',
    i: data,
  };
};

export const cleanCheckIn = () => {
  return {
    type: 'cleanCheckIn',
  };
};

export const userCheckIn = request => {
  const {password, token, checkin_id, groupId, auth} = request;

  return async function(dispatch) {
    const input = {
      password: password,
      checkin_id: checkin_id,
      groupId: groupId,
      auth: auth,
    };

    const graphql = {
      query: createUserCheckInMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(userCheckInReducer(checkin_id));

    return 0;
  };
};

const userCheckInReducer = data => {
  return {
    type: 'userCheckIn',
    checkin_id: data,
  };
};

export const deleteCheckIn = request => {
  const {token, checkin_id} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteCheckInMutation,
      variables: {
        input: checkin_id,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(deleteCheckInReducer(checkin_id));
    return 0;
  };
};

const deleteCheckInReducer = data => {
  return {
    type: 'deleteGroupCheckin',
    checkin_id: data,
  };
};

export const getGroupCheckInResult = request => {
  const {token, count, checkin_id} = request;

  return async function(dispatch) {
    const input = {
      checkin_id: checkin_id,
      count: count,
    };

    const graphql = {
      query: getGroupCheckInResultQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(getGroupCheckInResultReducer(result.data.getGroupCheckInResult));
    return 0;
  };
};

const getGroupCheckInResultReducer = data => {
  return {
    type: 'getGroupCheckInResult',
    i: data,
  };
};

export const userCheckInBatch = request => {
  const {token, userId, groupId, checkin_id} = request;

  return async function(dispatch) {
    const input = {
      checkin_id: checkin_id,
      groupId: groupId,
      userId: userId,
    };

    const graphql = {
      query: createUserCheckInBatchMutation,
      variables: {
        input: input,
      },
    };
    console.log(graphql)
    const result = await httpCall(token, graphql);

    if (result.errors) {
      console.log(result.errors)
      return result;
    }

    return 0;
  };
};
