import {
  getGroupMembersQuery,
  updateMemberMutation,
  changeGroupNotificationMutation,
  registerDeviceForNotificationMutation,
  searchUserQuery,
  addMembersMutation,
  deleteMemberMutation,
  makeOwnerMutation
} from './query/userQuery';
import {getGroup} from './group';

export const getGroupMembers = data => {
  const {groupId, token, lastIndexId} = data;

  return async function(dispatch) {
    const graphql = {
      query: getGroupMembersQuery,
      variables: {
        groupId: groupId,
        lastIndexId: lastIndexId,
      },
    };

    const groupMembers = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const membersData = await groupMembers.json();
    if (membersData.errors) {
      return membersData;
    }

    if (lastIndexId == null) {
      dispatch(getGroupMembersToReducer(membersData.data.getGroupMembers));
    } else {
      dispatch(loadMoreGroupMembers(membersData.data.getGroupMembers));
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

export const updateMember = data => {
  const {updateData, origin} = data;
  let {userId, groupId, auth, token} = updateData;
  return async function(dispatch) {
    if (auth.rank == null) {
      auth.rank = origin.rank;
    }

    if (auth.title == null) {
      auth.title = origin.title;
    }

    const memberInput = {
      memberId: userId,
      groupId: groupId,
      auth: auth,
    };

    const graphQl = {
      query: updateMemberMutation,
      variables: {
        memberInput: memberInput,
      },
    };

    const updateMember = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const updateData = await updateMember.json();
    if (updateData.errors) {
      return updateData;
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

    const graphQl = {
      query: changeGroupNotificationMutation,
      variables: {
        input: input,
      },
    };

    const group = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });
    const groupData = await group.json();

    if (groupData.errors) {
      return groupData;
    }

    dispatch(getGroup(groupData.data.changeGroupNotification));

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

    const graphQl = {
      query: registerDeviceForNotificationMutation,
      variables: {
        input: input,
      },
    };

    const userNotification = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });
    const userNotificationData = await userNotification.json();

    if (userNotificationData.errors) {
      return userNotificationData;
    }

    return 0;
  };
};

export const searchUser = data => {
  const {searchTerm, token, lastIndexId, groupId} = data;

  return async function(dispatch) {
    const searchUserInput = {
      searchTerm: searchTerm.trim(),
      lastIndexId: lastIndexId,
      groupId: groupId,
    };

    const graphql = {
      query: searchUserQuery,
      variables: {
        searchUserInput: searchUserInput,
      },
    };
    let users = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const usersData = await users.json();
    if (usersData.errors) {
      return usersData;
    }

    users = usersData.data.searchUser;
    return users;
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

    let users = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const usersData = await users.json();
    if (usersData.errors) {
      return usersData;
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

    let users = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const usersData = await users.json();
    if (usersData.errors) {
      return usersData;
    }
    return 0;
  };
};

export const makeOwner = data => {
  const {token, groupId, memberId} = data

  return async function(dispatch){
    const graphql = {
      query: makeOwnerMutation,
      variables: {
        memberId: memberId,
        groupId: groupId
      }
    }


    let mutation = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await mutation.json()
    if (result.errors){
      return result;
    }
    return 0
  }
}