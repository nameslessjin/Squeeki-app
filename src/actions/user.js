import {
  getGroupMembersQuery,
  updateMemberMutation,
  changeGroupNotificationMutation,
  registerDeviceForNotificationMutation,
  searchUserQuery,
  addMembersMutation,
  deleteMemberMutation,
  makeOwnerMutation,
  getStatusInGroupQuery,
  searchGroupMembersQuery,
  getUserRelationQuery,
  updateUserRelationMutation,
  searchAtUserQuery,
} from './query/userQuery';
import {getGroup} from './group';
import {httpCall} from './utils/httpCall';

export const getGroupMembers = data => {
  const {groupId, token, count, userIdList} = data;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
      userIdList: userIdList,
    };

    const graphql = {
      query: getGroupMembersQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    if (count == 0) {
      dispatch(getGroupMembersToReducer(result.data.getGroupMembers));
    } else {
      dispatch(loadMoreGroupMembers(result.data.getGroupMembers));
    }

    return 0;
  };
};

const getGroupMembersToReducer = data => {
  return {
    type: 'getGroupMembers',
    members: data,
  };
};

const loadMoreGroupMembers = data => {
  return {
    type: 'loadMoreGroupMembers',
    moreGroupMembers: data,
  };
};

export const searchGroupMembers = data => {
  const {count, groupId, search_term, token} = data;
  return async function(dispatch) {
    const input = {
      groupId,
      count,
      search_term: search_term.trim(),
    };

    const graphql = {
      query: searchGroupMembersQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.searchGroupMembers;
  };
};

export const updateMember = data => {
  const {updateData, origin} = data;
  let {userId, groupId, auth, token, group_username} = updateData;
  return async function(dispatch) {
    if (auth.rank == null) {
      auth.rank = origin.auth.rank;
    }

    if (auth.title == null) {
      auth.title = origin.auth.title;
    }

    if (group_username == null) {
      group_username = origin.group_username;
    }

    const memberInput = {
      memberId: userId,
      groupId: groupId,
      auth: auth,
      group_username,
    };

    const graphql = {
      query: updateMemberMutation,
      variables: {
        memberInput: memberInput,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const changeGroupNotification = data => {
  const {groupId, token, notificationPriority} = data;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      notificationPriority: notificationPriority,
    };

    const graphql = {
      query: changeGroupNotificationMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(getGroup(result.data.changeGroupNotification));

    return 0;
  };
};

export const registerDeviceForNotification = data => {
  const {token, FCMtoken, deviceId} = data;

  return async function(dispatch) {
    const input = {
      token: FCMtoken,
      deviceId: deviceId,
    };

    const graphql = {
      query: registerDeviceForNotificationMutation,
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

export const searchUser = data => {
  const {
    searchTerm,
    token,
    count,
    groupId,
    userIdList,
    inGroup,
    checkin_id,
    chatId,
  } = data;

  return async function(dispatch) {
    const searchUserInput = {
      searchTerm: searchTerm.trim(),
      count: count,
      groupId: groupId,
      userIdList: userIdList,
      inGroup: inGroup,
      checkin_id: checkin_id,
      chatId,
    };

    const graphql = {
      query: searchUserQuery,
      variables: {
        searchUserInput: searchUserInput,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.searchUser;
  };
};

export const addMembers = data => {
  const {groupId, token, chosenUserIds} = data;

  return async function(dispatch) {
    const addMembersInput = {
      userIds: chosenUserIds,
      groupId: groupId,
    };

    const graphql = {
      query: addMembersMutation,
      variables: {
        input: addMembersInput,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const deleteMember = data => {
  const {memberId, token, groupId} = data;
  return async function(dispatch) {
    const graphql = {
      query: deleteMemberMutation,
      variables: {
        memberId: memberId,
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const makeOwner = data => {
  const {token, groupId, memberId} = data;

  return async function(dispatch) {
    const graphql = {
      query: makeOwnerMutation,
      variables: {
        memberId: memberId,
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const getStatusInGroup = data => {
  const {token, groupId} = data;

  return async function(dispatch) {
    const graphql = {
      query: getStatusInGroupQuery,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.getStatusInGroup;
  };
};

export const getUserRelation = data => {
  const {token, second_userId, chatId} = data;

  return async function(dispatch) {
    const input = {
      second_userId,
      chatId,
    };

    const graphql = {
      query: getUserRelationQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.getUserRelation;
  };
};

export const updateUserRelation = data => {
  const {token, second_userId, is_dm_blocked, chatId} = data;

  return async function(dispatch) {
    const input = {
      second_userId,
      is_dm_blocked,
      chatId,
    };

    const graphql = {
      query: updateUserRelationMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.updateUserRelation;
  };
};

export const searchAtUser = data => {
  const {searchTerm, groupId, token} = data;

  return async function(dispatch) {
    const input = {
      searchTerm,
      groupId,
    };

    const graphql = {
      query: searchAtUserQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.searchAtUser;
  };
};

export const cleanMembers = () => {
  return {
    type: 'cleanMembers',
  };
};
