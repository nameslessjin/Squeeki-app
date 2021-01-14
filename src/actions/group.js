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
  onRespondJoinRequestMutation
} from './query/groupQuery';

export const findUserGroupsByUserId = data => {
  const {token, count} = data;
  return async function(dispatch) {
    const graphQl = {
      query: findUserGroupsByUserIdQuery,
      variables: {
        count: count
      }
    };
    // api request
    const groups = await fetch('http://squeeki.appspot.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });
    const groupsData = await groups.json();

    if (groupsData.errors) {
      return groupsData;
    }

    dispatch(getUserGroups(groupsData.data.getMyGroups));


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
    const graphQl = {
      query: getSingleGroupByIdQuery,
      variables: {
        groupId: id,
      },
    };

    // api request
    const group = await fetch('http://squeeki.appspot.com/graphql', {
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

    dispatch(getGroup(groupData.data.getGroup));

    return groupData;
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
      count: count
    }

    const graphQl = {
      query: searchGroupQuery,
      variables: {
        input: input
      },
    };

    let groups = await fetch('http://squeeki.appspot.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });
    const groupsData = await groups.json();

    if (groupsData.errors) {
      return groupsData;
    }
  
    groups = groupsData.data.searchGroup
    return groups;
  };
};

// const searchGroups = data => {
//   return {
//     type: 'searchGroups',
//     groups: data,
//   };
// };

export const createGroup = data => {
  const {groupname, shortDescription, backgroundImg, icon, token, visibility} = data;

  return async function(dispatch) {
    let groupIcon = null;
    let groupBackgroundImg = null;

    if (icon != null) {
      const iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'icons');

      const iconFetch = await fetch('http://squeeki.appspot.com/uploadImage', {
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
        width: icon.width,
        height: icon.height,
        uri: iconUrl.url,
        name: iconUrl.name
      };
    }

    if (backgroundImg != null) {
      const backgroundImgData = new FormData();
      // backgroundImgData.append('filename', backgroundImg.filename);
      backgroundImgData.append('fileType', backgroundImg.type);
      backgroundImgData.append('fileData', backgroundImg.data);
      backgroundImgData.append('fileCategory', 'backgroundImgs');

      const backgroundImgFetch = await fetch(
        'http://squeeki.appspot.com/uploadImage',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: backgroundImgData,
        },
      );
      if (backgroundImgFetch.status == 500) {
        alert('Uploading background image failed');
        return 1;
      }
      const backgroundImgUrl = await backgroundImgFetch.json();
      if (backgroundImgUrl.error) {
        return backgroundImgUrl;
      }

      groupBackgroundImg = {
        width: backgroundImg.width,
        height: backgroundImg.height,
        uri: backgroundImgUrl.url,
        name: backgroundImgUrl.name
      };
    }

    const groupInput = {
      groupname: groupname,
      shortDescription: shortDescription,
      backgroundImg: groupBackgroundImg,
      icon: groupIcon,
      visibility: visibility
    };

    const graphQl = {
      query: createGroupMutation,
      variables: {
        GroupInput: groupInput,
      },
    };

    // api request
    const group = await fetch('http://squeeki.appspot.com/graphql', {
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

    dispatch(getGroup(groupData.data.createGroup));

    return 0;
  };
};

export const updateGroup = data => {
  const {updateData, origin} = data;
  const {
    groupname,
    shortDescription,
    backgroundImg,
    icon,
    token,
    groupId,
  } = updateData;
  return async function(dispatch) {
    let newgroupIcon = icon;
    let newgroupBackgroundImg = backgroundImg;
    let newGroupName = groupname;
    let newShortDescription = shortDescription;

    if (icon != null) {
      const iconData = new FormData();
      iconData.append('fileType', icon.type);
      iconData.append('fileData', icon.data);
      iconData.append('fileCategory', 'icons');

      const iconFetch = await fetch('http://squeeki.appspot.com/uploadImage', {
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
        width: icon.width,
        height: icon.height,
        uri: iconUrl.url,
        name: iconUrl.name
      };
    }

    if (backgroundImg != null) {
      const backgroundImgData = new FormData();
      // backgroundImgData.append('filename', backgroundImg.filename);
      backgroundImgData.append('fileType', backgroundImg.type);
      backgroundImgData.append('fileData', backgroundImg.data);
      backgroundImgData.append('fileCategory', 'backgroundImgs');

      const backgroundImgFetch = await fetch(
        'http://squeeki.appspot.com/uploadImage',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: backgroundImgData,
        },
      );
      if (backgroundImgFetch.status == 500) {
        alert('Uploading background image failed');
        return 1;
      }
      const backgroundImgUrl = await backgroundImgFetch.json();
      if (backgroundImgUrl.error) {
        return backgroundImgUrl;
      }

      newgroupBackgroundImg = {
        width: backgroundImg.width,
        height: backgroundImg.height,
        uri: backgroundImgUrl.url,
        name: backgroundImgUrl.name
      };
    }

    if (groupname == null) {
      newGroupName = origin.groupname;
    }

    if (shortDescription == null) {
      newShortDescription = origin.shortDescription;
    }

    const groupInput = {
      groupId: groupId,
      groupname: newGroupName,
      shortDescription: newShortDescription,
      backgroundImg: newgroupBackgroundImg,
      icon: newgroupIcon,
    };

    const graphQl = {
      query: updateGroupMutation,
      variables: {
        GroupInput: groupInput,
      },
    };

    // api request
    const group = await fetch('http://squeeki.appspot.com/graphql', {
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

    dispatch(getGroup(groupData.data.updateGroup));

    return 0;
  };
};

export const joinGroup = data => {
  const {groupId, token} = data;

  return async function(dispatch) {

    const graphQl = {
      query: joinGroupMutation,
      variables: {
        groupId: groupId,
      },
    };

    const group = await fetch('http://squeeki.appspot.com/graphql', {
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

    dispatch(JoinGroup(groupData.data.joinGroup));

    return 0;
  };
};

const JoinGroup = data => {
  return {
    type: 'joinGroup',
    data: data
  }
}

export const leaveGroup = data => {
  const {groupId, token} = data;

  return async function(dispatch) {

    const graphQl = {
      query: leaveGroupMutation,
      variables: {
        groupId: groupId,
      },
    };

    const group = await fetch('http://squeeki.appspot.com/graphql', {
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
 
    dispatch(getPosts({posts: [], count: 0}))
    dispatch(LeaveGroup(groupData.data.leaveGroup))
    return 0;

  };
};

export const setGroupVisibility = data => {
  const {groupId, token} = data;
  return async function(dispatch){
    const graphQl = {
      query: setGroupVisibilityMutation,
      variables: {
        groupId: groupId,
      }
    }

    const group = await fetch('http://squeeki.appspot.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphQl)
    })
  
    const groupData = await group.json();

    if (groupData.errors){
      return groupData;
    }

    dispatch(changeGroupVisibility());
    return 0
  }
}

export const getGroupJoinRequest = data => {
  const {token, groupId, count} = data
  return async function(dispatch){
    const input = {
      count: count,
      groupId: groupId
    }
    const graphql = {
      query: getGroupJoinRequestQuery,
      variables: {
        input: input
      }
    }

    const req = await fetch('http://squeeki.appspot.com/graphql', {
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
    return result.data.getGroupJoinRequest;
  }
}

const changeGroupVisibility = () => {
  return {
    type: 'changeGroupVisibility',
  }
}

const LeaveGroup = data => {
  return {
    type: 'leaveGroup',
    groups: data,
  }
}

const getPosts = data => {
  return {
    type: 'getGroupPosts',
    data: data,
  };
};

export const cleanGroup = () => {
  return {
    type: 'cleanGroup'
  }
}

export const onRespondJoinRequest = data => {
  const {token, groupId, requesterId, type} = data

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      requesterId: requesterId,
      type: type
    }

    const graphql = {
      query: onRespondJoinRequestMutation,
      variables: {
        input: input
      }
    }

    const req = await fetch('http://squeeki.appspot.com/graphql', {
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

  }
}