import {
  getLastVersionQuery,
  getUserStatusQuery,
  getSecurityClearanceQuery,
} from '../actions/query/securityQuery';
import {httpCall} from './utils/httpCall';

export const getLastVersion = () => {
  return async function(dispatch) {
    const graphql = {
      query: getLastVersionQuery,
    };

    const result = await httpCall(null, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getLastVersion;
  };
};

export const getUserStatus = data => {
  const {token} = data;
  return async function(dispatch) {
    const graphql = {
      query: getUserStatusQuery,
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    dispatch(getUserStatusReducer(result.data.getUserStatus));
    return result.data.getUserStatus;
  };
};

const getUserStatusReducer = data => {
  return {
    type: 'getUserStatus',
    i: data,
  };
};

export const getSecurityClearance = data => {
  const {token} = data;
  return async function(dispatch) {
    const graphql = {
      query: getSecurityClearanceQuery,
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    dispatch(getSecurityClearanceReducer(result.data.getSecurityClearance));
    return 0;
  };
};

const getSecurityClearanceReducer = data => {
  return {
    type: 'getSecurityClearance',
    i: data,
  };
};