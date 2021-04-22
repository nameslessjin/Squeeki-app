import {
  createNominationMutation,
  getGroupNominationsQuery,
  updateNominationMutation,
  deleteNominationMutation,
  turnNominationMutation,
  voteNomineeMutation,
  getGroupNominationMostRecentResultsQuery,
  getGroupNominationResultsQuery
} from './query/nominationQuery';
import {httpCall} from './utils/httpCall'

export const getGroupNominations = data => {
  const {groupId, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: getGroupNominationsQuery,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getGroupNominationsReducer(result.data.getGroupNominations));
    return 0;
  };
};

const getGroupNominationsReducer = data => {
  return {
    type: 'getGroupNominations',
    nominations: data,
  };
};

export const createNomination = data => {
  const {id, groupId, name, points, period, token, type} = data;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      name: name,
      points: points,
      period: period,
      type: type
    };

    const graphql = {
      query: createNominationMutation,
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

export const updateNomination = data => {
  const {id, groupId, name, points, period, token, type} = data;

  return async function(dispatch) {
    const input = {
      id: id,
      groupId: groupId,
      name: name,
      points: points,
      period: period,
      type: type
    };

    const graphql = {
      query: updateNominationMutation,
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

export const deleteNomination = data => {
  const {id, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: deleteNominationMutation,
      variables: {
        id: id,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const turnNomination = data => {
  const {id, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: turnNominationMutation,
      variables: {
        id: id,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(turnNominationReducer(id));

    return 0;
  };
};

const turnNominationReducer = data => {
  return {
    type: 'turnNomination',
    id: data,
  };
};

export const voteNominee = data => {
  const {token, nomination, groupId} = data;
  const {nominationId, postNominationId, nomineeId} = nomination;
  return async function(dispatch) {
    const input = {
      groupId: groupId,
      nomineeId: nomineeId,
      nominationId: nominationId,
      postNominationId: postNominationId,
    };

    const graphql = {
      query: voteNomineeMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return vote;
    }

    return 0;
  };
};

export const getGroupNominationMostRecentResults = data => {
  const {groupId, token, endAt} = data;
  return async function(dispatch) {
    const input = {
      groupId: groupId,
      endAt: endAt,
    };

    const graphql = {
      query: getGroupNominationMostRecentResultsQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)
    return result;
  };
};

export const getGroupNominationResults = data => {
  const {groupId, count, token, endAt} = data;
  return async function(dispatch) {
    const input = {
      groupId: groupId,
      endAt: endAt,
      count: count
    }

    const graphql = {
      query: getGroupNominationResultsQuery,
      variables: {
        input: input
      }
    }

    const result = await httpCall(token, graphql)
    return result;


  }
}
