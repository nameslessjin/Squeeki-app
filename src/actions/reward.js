import {
  createUpdateGroupRewardMutation,
  getGroupRewardListQuery,
  updateGroupRewardSettingMutation,
  getRewardEntryQuery,
  updateRewardEntryStatusMutation,
  lootRedeemRewardMutation,
  getGroupRewardHistoryQuery,
  getRewardQuery,
  getUserRewardHistoryQuery,
  searchRewardQuery,
  redeemUserRewardMutation,
  getSystemRewardListSettingQuery,
  getGroupRewardDropFromListQuery,
  scanQRCodeQuery,
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
      pointCost: pointCost ? parseInt(pointCost) : null,
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
  const {groupId, token, isGift} = request;

  return async function(dispatch) {
    const input = {
      groupId,
    };

    const graphql = {
      query: isGift ? getGroupRewardDropFromListQuery : getGroupRewardListQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(
      getGroupRewardListReducer(
        isGift
          ? result.data.getGroupRewardDropFromList
          : result.data.getGroupRewardList,
      ),
    );

    return 0;
  };
};

const getGroupRewardListReducer = data => {
  return {
    type: 'getGroupRewardList',
    data,
  };
};

export const getGroupRewardHistory = request => {
  const {groupId, count, token, init} = request;

  return async function(dispatch) {
    const input = {
      groupId,
      count,
    };

    const graphql = {
      query: getGroupRewardHistoryQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(
      getGroupRewardHistoryReducer({
        ...result.data.getGroupRewardHistory,
        init,
      }),
    );

    return 0;
  };
};

const getGroupRewardHistoryReducer = data => {
  return {
    type: 'getGroupRewardHistory',
    data,
  };
};

export const getReward = request => {
  const {token, rewardId} = request;

  return async function(dispatch) {
    const input = {
      rewardId,
    };

    const graphql = {
      query: getRewardQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getReward;
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
      pointCost: pointCost ? parseInt(pointCost) : null,
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

export const getUserRewardHistory = request => {
  const {token, groupId, count, init} = request;

  return async function(dispatch) {
    const input = {groupId, count};
    const graphql = {
      query: getUserRewardHistoryQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(
      getUserRewardHistoryReducer({
        ...result.data.getUserRewardHistory,
        init,
      }),
    );

    return 0;
  };
};

const getUserRewardHistoryReducer = data => {
  return {
    type: 'getUserRewardHistory',
    data,
  };
};

export const searchReward = request => {
  const {token, groupId, count, searchTerm} = request;

  return async function(dispatch) {
    const input = {groupId, count, searchTerm};
    const graphql = {
      query: searchRewardQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.searchReward;
  };
};

export const redeemUserReward = request => {
  const {rewardId, token} = request;

  return async function(dispatch) {
    const input = {rewardId};

    const graphql = {
      query: redeemUserRewardMutation,
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

export const getSystemRewardListSetting = request => {
  return async function(dispatch) {
    const graphql = {
      query: getSystemRewardListSettingQuery,
    };

    const result = await httpCall(null, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getSystemRewardListSetting;
  };
};

export const scanQRCode = request => {
  const {token, id, type} = request;

  return async function(dispatch) {
    const input = {
      id,
      type,
    };

    const graphql = {
      query: scanQRCodeQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.scanQRCode;
  };
};
