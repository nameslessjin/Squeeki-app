import {
  createGroupRewardMutation,
  getGroupRewardListQuery,
  updateGroupRewardSettingMutation,
  deleteGroupRewardMutation,
  getUserGroupRewardHistoryQuery,
  getMonthlyGiftCardCountQuery,
  lootRewardMutation,
} from './query/rewardQuery';
import {httpCall} from './utils/httpCall';

export const createGroupReward = request => {
  const {
    name,
    chance,
    listNum,
    count,
    content,
    contentList,
    separateContent,
    from,
    fromId,
    to,
    toId,
    status,
    token,
  } = request;

  return async function(dispatch) {
    const input = {
      name,
      chance,
      listNum,
      count: parseInt(count),
      content: separateContent ? null : content,
      contentList: separateContent ? contentList.map(c => c.content) : null,
      separateContent,
      from,
      fromId,
      to,
      toId,
      status: 'active',
    };

    const graphql = {
      query: createGroupRewardMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const getGroupRewardList = request => {
  const {groupId, token} = request;

  return async function(dispatch) {
    const input = {
      groupId,
    };

    const graphql = {
      query: getGroupRewardListQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(getGroupRewardListReducer(result.data.getGroupRewardList));

    return 0;
  };
};

const getGroupRewardListReducer = data => {
  return {
    type: 'getGroupRewardList',
    data,
  };
};

export const updateGroupRewardSetting = request => {
  const {
    token,
    groupId,
    listNum,
    listName,
    chance1,
    chance2,
    chance3,
    chance4,
    chance5,
  } = request;

  return async function(dispatch) {
    const input = {
      groupId,
      listNum,
      listName,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
    };

    const graphql = {
      query: updateGroupRewardSettingMutation,
      variables: {
        input
      }
    }

    const result = await httpCall(token, graphql)
    
    if (result.errors){
      return result
    }

    return 0

  };
};

// const getGroupRewardReducer = (data, type) => {
//   return {
//     type: type == 'list' ? 'getGroupReward' : 'getUserGroupRewardHistory',
//     data: data,
//   };
// };

export const deleteGroupReward = request => {
  const {token, rewardId} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteGroupRewardMutation,
      variables: {
        rewardId: rewardId,
      },
    };

    const result = await httpCall(token, graphql);

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

    // const graphql = {
    //   query: getUserGroupRewardHistoryQuery,
    //   variables: {
    //     input: input,
    //   },
    // };

    // const result = await httpCall(token, graphql);

    // if (result.errors) {
    //   return result;
    // }

    // dispatch(
    //   getGroupRewardReducer(result.data.getUserGroupRewardHistory, 'history'),
    // );

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

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.getMonthlyGiftCardCount;
  };
};

export const lootReward = request => {
  const {token, groupId} = request;

  return async function(dispatch) {
    const graphql = {
      query: lootRewardMutation,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.lootReward;
  };
};
