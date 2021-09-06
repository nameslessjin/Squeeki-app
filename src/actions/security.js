import {
  getLastVersionQuery,
  getUserStatusQuery,
  getSecurityClearanceQuery,
  searchASAdminQuery,
  adminActionMutation,
  updateSecurityClearanceMutation,
  getAPIKeyQuery,
} from '../actions/query/securityQuery';
import {httpCall} from './utils/httpCall';
import DeviceInfo from 'react-native-device-info';

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

export const getIpAddress = () => {
  return async function(dispatch) {
    const input = {
      type: 'ip',
    };
    const graphql = {
      query: getAPIKeyQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(null, graphql);
    if (result.errors) {
      console.log(result.errors);
      return;
    }

    fetch(`https://api.ipdata.co?api-key=${result.data.getAPIKey}`)
      .then(res => res.json())
      .then(data => {
        dispatch(getIpAddressReducer(data));
      })
      .catch(e => console.log(e));
  };
};

const getIpAddressReducer = data => {
  return {
    type: 'getIpAddress',
    i: data,
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

export const getUserAgent = () => {
  return async function(dispatch) {
    const device = await DeviceInfo.getUserAgent();

    dispatch(getUserAgentReducer(device));

    return 0;
  };
};

const getUserAgentReducer = data => {
  return {
    type: 'getUserAgent',
    i: data,
  };
};

export const searchASAdmin = data => {
  const {token, searchTerm, type, count} = data;
  return async function(dispatch) {
    const input = {
      searchTerm,
      type,
      count,
    };

    const graphql = {
      query: searchASAdminQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.searchASAdmin;
  };
};

export const adminAction = data => {
  const {token, id, comment, action, type, ip, userAgent} = data;

  return async function(dispatch) {
    const input = {
      id,
      comment: comment.trim(),
      action,
      type,
      ip,
      userAgent
    };

    const graphql = {
      query: adminActionMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateSecurityClearance = data => {
  const {token, securityClearance, ip} = data;

  return async function(dispatch) {
    const input = {
      ...securityClearance,
      ip,
    };

    const graphql = {
      query: updateSecurityClearanceMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateLocationReducer = data => {
  return {
    type: 'updateLocation',
    i: data,
  };
};
