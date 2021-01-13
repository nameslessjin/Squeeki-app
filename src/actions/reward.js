import {
  createGroupRewardMutation,
  getGroupRewardQuery,
  deleteGroupRewardMutation,
  getUserGroupRewardHistoryQuery,
  getMonthlyGiftCardCountQuery,
  lootRewardMutation
} from './query/rewardQuery';

export const createGroupReward = request => {
  const {token, groupId, from, type, content, name, chance, hide} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      from: from,
      type: type,
      content: content,
      name: name,
      chance: chance,
      hide: hide,
    };

    const graphql = {
      query: createGroupRewardMutation,
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

export const getGroupReward = request => {
  const {count, groupId, token, redeemed} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
      redeemed: redeemed,
    };

    const graphql = {
      query: getGroupRewardQuery,
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
    dispatch(getGroupRewardReducer(result.data.getGroupReward, 'list'));
    return 0;
  };
};

const getGroupRewardReducer = (data, type) => {
  return {
    type: type == 'list' ? 'getGroupReward' : 'getUserGroupRewardHistory',
    data: data,
  };
};

export const deleteGroupReward = request => {
  const {token, rewardId} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteGroupRewardMutation,
      variables: {
        rewardId: rewardId,
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

    dispatch(deleteGroupRewardReducer(rewardId));

    return 0;
  };
};

const deleteGroupRewardReducer = data => {
  return {
    type: 'deleteGroupReward',
    rewardId: data,
  };
};

export const getUserGroupRewardHistory = request => {
  const {token, groupId, count} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
    };

    const graphql = {
      query: getUserGroupRewardHistoryQuery,
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

    dispatch(
      getGroupRewardReducer(result.data.getUserGroupRewardHistory, 'history'),
    );

    return 0;
  };
};

export const getMonthlyGiftCardCount = request => {
  const {token, groupId} = request;

  return async function(dispatch) {
    const graphql = {
      query: getMonthlyGiftCardCountQuery,
      variables: {
        groupId: groupId,
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

    return result.data.getMonthlyGiftCardCount;
  };
};

export const lootReward = request => {
  const {token, groupId} = request

  return async function(dispatch) {
    const graphql = {
      query: lootRewardMutation,
      variables: {
        groupId: groupId
      }
    }

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
    console.log(result.data)
    return result.data.lootReward;
  }
}