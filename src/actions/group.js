import {
  findUserGroupsByUserIdQuery,
  getSingleGroupByIdQuery,
  searchGroupQuery,
  createGroupMutation,
  updateGroupMutation,
  joinGroupMutation,
  leaveGroupMutation,
  setGroupVisibilityMutation,
  getGroupJoinRequestQuery,
  onRespondJoinRequestMutation,
  setGroupRequestToJoinMutation,
  onGroupRulesUpdateMutation,
  getGroupRulesQuery,
  getGroupJoinRequestCountQuery,
  updateRankFeaturesMutation,
} from './query/groupQuery';
import {http_upload} from '../../server_config';
import {httpCall} from './utils/httpCall'

export const findUserGroupsByUserId = data => {
  const {token, count} = data;
  return async function(dispatch) {
    const graphql = {
      query: findUserGroupsByUserIdQuery,
      variables: {
        count: count,
      },
    };
    
    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getUserGroups(result.data.getMyGroups));

    return 0;
  };
};

const getUserGroups = data => {
  return {
    type: 'getUserGroups',
    data: data,
  };
};

export const getSingleGroupById = data => {
  const {id, token} = data;
  return async function(dispatch) {
    const graphql = {
      query: getSingleGroupByIdQuery,
      variables: {
        groupId: id,
      },
    };
    const result = await httpCall(token, graphql)
    dispatch(cleanGroup());
    if (result.errors) {
      return result;
    }

    dispatch(getGroup(result.data.getGroup));

    return result;
  };
};

export const getGroup = data => {
  return {
    type: 'group',
    group: data,
  };
};

export const searchGroup = data => {
  const {name, token, count} = data;
  return async function(dispatch) {
    const input = {
      name: name,
      count: count,
    };

    const graphql = {
      query: searchGroupQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return result.data.searchGroup;
  };
};

// const searchGroups = data => {
//   return {
//     type: 'searchGroups',
//     groups: data,
//   };
// };

export const createGroup = data => {
  const {
    groupname,
    shortDescription,
    backgroundImg,
    icon,
    token,
    visibility,
    request_to_join,
    tagIds,
    display_name,
  } = data;

  return async function(dispatch) {
    let groupIcon = null;
    let groupBackgroundImg = null;

    if (icon != null) {
      const iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'icons');

      const iconFetch = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: iconData,
      });
      if (iconFetch.status == 500) {
        alert('Uploading icon failed');
        return 1;
      }

      const iconUrl = await iconFetch.json();
      if (iconUrl.error) {
        return iconUrl;
      }
      groupIcon = {
        uri: iconUrl.url,
        name: iconUrl.name,
      };
    }

    if (backgroundImg != null) {
      const backgroundImgData = new FormData();
      // backgroundImgData.append('filename', backgroundImg.filename);
      backgroundImgData.append('fileType', backgroundImg.type);
      backgroundImgData.append('fileData', backgroundImg.data);
      backgroundImgData.append('fileCategory', 'backgroundImgs');

      const backgroundImgFetch = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: backgroundImgData,
      });
      if (backgroundImgFetch.status == 500) {
        alert('Uploading background image failed');
        return 1;
      }
      const backgroundImgUrl = await backgroundImgFetch.json();
      if (backgroundImgUrl.error) {
        return backgroundImgUrl;
      }

      groupBackgroundImg = {
        uri: backgroundImgUrl.url,
        name: backgroundImgUrl.name,
      };
    }

    const groupInput = {
      display_name,
      groupname: groupname,
      shortDescription: shortDescription,
      backgroundImg: groupBackgroundImg,
      icon: groupIcon,
      visibility: visibility,
      request_to_join,
      tagIds,
    };

    const graphql = {
      query: createGroupMutation,
      variables: {
        GroupInput: groupInput,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getGroup(result.data.createGroup));

    return 0;
  };
};

export const updateGroup = data => {
  const {updateData, origin} = data;
  const {
    display_name,
    shortDescription,
    backgroundImg,
    icon,
    token,
    groupId,
  } = updateData;
  return async function(dispatch) {
    let newgroupIcon = icon;
    let newgroupBackgroundImg = backgroundImg;
    let new_display_name = display_name;
    let newShortDescription = shortDescription;

    if (icon != null) {
      const iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'icons');

      const iconFetch = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: iconData,
      });
      if (iconFetch.status == 500) {
        alert('Uploading icon failed failed');
        return 1;
      }
      const iconUrl = await iconFetch.json();
      if (iconUrl.error) {
        return iconUrl;
      }
      newgroupIcon = {
        uri: iconUrl.url,
        name: iconUrl.name,
      };
    }

    if (backgroundImg != null) {
      const backgroundImgData = new FormData();
      // backgroundImgData.append('filename', backgroundImg.filename);
      backgroundImgData.append('fileType', backgroundImg.type);
      backgroundImgData.append('fileData', backgroundImg.data);
      backgroundImgData.append('fileCategory', 'backgroundImgs');

      const backgroundImgFetch = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: backgroundImgData,
      });
      if (backgroundImgFetch.status == 500) {
        alert('Uploading background image failed');
        return 1;
      }
      const backgroundImgUrl = await backgroundImgFetch.json();
      if (backgroundImgUrl.error) {
        return backgroundImgUrl;
      }

      newgroupBackgroundImg = {
        uri: backgroundImgUrl.url,
        name: backgroundImgUrl.name,
      };
    }

    if (display_name == null) {
      new_display_name = origin.display_name;
    }

    if (shortDescription == null) {
      newShortDescription = origin.shortDescription;
    }

    const groupInput = {
      groupId: groupId,
      display_name: new_display_name,
      shortDescription: newShortDescription,
      backgroundImg: newgroupBackgroundImg,
      icon: newgroupIcon,
    };

    const graphql = {
      query: updateGroupMutation,
      variables: {
        GroupInput: groupInput,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getGroup(result.data.updateGroup));

    return 0;
  };
};

export const joinGroup = data => {
  const {groupId, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: joinGroupMutation,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return groupData;
    }

    dispatch(JoinGroup(result.data.joinGroup));

    return 0;
  };
};

const JoinGroup = data => {
  return {
    type: 'joinGroup',
    data: data,
  };
};

export const leaveGroup = data => {
  const {groupId, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: leaveGroupMutation,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(getPosts({posts: [], count: 0}));
    dispatch(LeaveGroup(result.data.leaveGroup));
    return 0;
  };
};

export const setGroupVisibility = data => {
  const {groupId, token} = data;
  return async function(dispatch) {
    const graphql = {
      query: setGroupVisibilityMutation,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return groupData;
    }

    dispatch(changeGroupVisibility());
    return 0;
  };
};

export const setGroupRequestToJoin = data => {
  const {groupId, token} = data;
  return async function(dispatch) {
    const graphql = {
      query: setGroupRequestToJoinMutation,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(changeGroupRequestToJoin());
    return 0;
  };
};

export const getGroupJoinRequest = data => {
  const {token, groupId, count} = data;
  return async function(dispatch) {
    const input = {
      count: count,
      groupId: groupId,
    };
    const graphql = {
      query: getGroupJoinRequestQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }
    return result.data.getGroupJoinRequest;
  };
};

const changeGroupVisibility = () => {
  return {
    type: 'changeGroupVisibility',
  };
};

const changeGroupRequestToJoin = () => {
  return {
    type: 'changeGroupRequestToJoin',
  };
};

const LeaveGroup = data => {
  return {
    type: 'leaveGroup',
    groups: data,
  };
};

const getPosts = data => {
  return {
    type: 'getGroupPosts',
    data: data,
  };
};

export const cleanGroup = () => {
  return {
    type: 'cleanGroup',
  };
};

export const onRespondJoinRequest = data => {
  const {token, groupId, requesterId, type} = data;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      requesterId: requesterId,
      type: type,
    };

    const graphql = {
      query: onRespondJoinRequestMutation,
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

export const onGroupRulesUpdate = data => {
  const {token, groupId, rules} = data;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      rules: rules,
    };

    const graphql = {
      query: onGroupRulesUpdateMutation,
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

export const getGroupRules = data => {
  const {token, groupId} = data;

  return async function(dispatch) {
    const graphql = {
      query: getGroupRulesQuery,
      variables: {
        groupId: groupId,
      },
    };
    const result = await httpCall(token, graphql)
    if (result.errors) {
      return result;
    }
    return result.data.getGroupRules ? result.data.getGroupRules : 0;
  };
};

export const getGroupJoinRequestCount = data => {
  const {token, groupId} = data;

  return async function(dispatch) {
    const graphql = {
      query: getGroupJoinRequestCountQuery,
      variables: {
        groupId: groupId,
      },
    };

    const result = await httpCall(token, graphql)
    if (result.errors) {
      return result;
    }

    dispatch(
      getGroupJoinRequestCountReducer(result.data.getGroupJoinRequestCount),
    );

    return 0;
  };
};

const getGroupJoinRequestCountReducer = data => {
  return {
    type: 'getGroupJoinRequestCount',
    data: data,
  };
};

export const updateRankFeatures = data => {
  const {token, groupId, rank_setting} = data;
  return async function(dispatch) {
    const input = {
      groupId,
      rank_setting,
    };

    const graphql = {
      query: updateRankFeaturesMutation,
      variables: {
        input: input,
      },
    };
    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(updateRankFeaturesReducer(rank_setting));
    return 0;
  };
};

const updateRankFeaturesReducer = data => {
  return {
    type: 'updateRankFeatures',
    i: data,
  };
};
