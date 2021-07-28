import {
  createUpdateGroupRewardMutation,
  getGroupRewardListQuery,
  updateGroupRewardSettingMutation,
  getRewardEntryQuery,
  updateRewardEntryStatusMutation,
  getUserGroupRewardHistoryQuery,
  getMonthlyGiftCardCountQuery,
  lootRewardMutation,
  lootRedeemRewardMutation,
} from './query/rewardQuery';
import {httpCall, httpUpload} from './utils/httpCall';

export const createUpdateGroupReward = request => {
  const {
    name,
    chance,
    listId,
    count,
    description,
    contentList,
    separateContent,
    from,
    fromId,
    to,
    toId,
    status,
    token,
    image,
    entryId,
    pointCost,
    expiration,
  } = request;

  return async function(dispatch) {
    let imageData = null;
    if (image != null) {
      if (image.data) {
        imageData = await httpUpload(token, image, 'rewardImage');
        if (imageData.errors) {
          alert('Upload image failed, please try again later');
          return;
        }
      }
    }

    const input = {
      entryId,
      name,
      chance,
      listId,
      count: parseInt(count),
      description: description,
      contentList: separateContent ? contentList.map(c => c.content) : null,
      separateContent,
      from,
      fromId,
      to,
      toId,
      status: 'active',
      image: imageData,
      pointCost: parseInt(pointCost),
      expiration: expiration ? new Date(expiration) : null,
    };

    const graphql = {
      query: createUpdateGroupRewardMutation,
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
    listId,
    listName,
    chance1,
    chance2,
    chance3,
    chance4,
    chance5,
    chance1Name,
    chance2Name,
    chance3Name,
    chance4Name,
    chance5Name,
    pointCost,
  } = request;

  return async function(dispatch) {
    const input = {
      groupId,
      listId,
      listName,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      chance1Name,
      chance2Name,
      chance3Name,
      chance4Name,
      chance5Name,
      pointCost,
    };

    const graphql = {
      query: updateGroupRewardSettingMutation,
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

export const getRewardEntry = request => {
  const {entryId, token} = request;

  return async function(dispatch) {
    const input = {entryId};

    const graphql = {
      query: getRewardEntryQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getRewardEntry;
  };
};

export const updateRewardEntryStatus = request => {
  const {entryId, status, token} = request;

  return async function(dispatch) {
    const input = {entryId, status};

    const graphql = {
      query: updateRewardEntryStatusMutation,
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

export const lootRedeemReward = request => {
  const {token, entryId, type, GroupRewardList, groupId, pointCost} = request;

  return async function(dispatch) {
    const input = {
      type,
      entryId,
      groupId,
      pointCost: parseInt(pointCost),
      GroupRewardList,
    };

    const graphql = {
      query: lootRedeemRewardMutation,
      variables: {input},
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.lootRedeemReward;
  };
};

// legacy

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
