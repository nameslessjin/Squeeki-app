const INITIAL_STATE = {
  groups: {groups: [], count: 0, lastIndexId: null},
  group: {},
};

export default groupReducer = (state = INITIAL_STATE, action) => {
  let groups = state.groups;
  let group = state.group;
  switch (action.type) {
    case 'getUserGroups':
      return {
        ...state,
        groups: {
          ...action.groups,
        },
      };
    case 'loadMoreUserGroups':
      groups = state.groups.groups.concat(action.groups.groups);
      return {
        ...state,
        groups: {
          groups: groups,
          count: groups.length,
          lastIndexId: action.groups.lastIndexId,
        },
      };

    case 'group':
      return {
        ...state,
        group: {
          ...state.group,
          ...action.group,
        },
      };

    case 'leaveGroup':
      return {
        ...state,
        groups: {
          ...action.groups,
        },
      };
    case 'joinGroup':
      group = action.data.joinedGroup;
      groups = action.data.groups;
      return {
        ...state,
        group: {
          ...group,
        },
        groups: {
          ...groups,
        },
      };
    case 'changeGroupVisibility':
      return {
        ...state,
        group: {
          ...state.group,
          visibility: state.group.visibility == 'public' ? 'private' : 'public',
        },
      };
    case 'cleanGroup':
      return {
        ...state,
        group: {},
      };
    case 'logout':
      return {
        ...INITIAL_STATE,
      };

    case 'getGroupNominations':
      return {
        ...state,
        group: {
          ...state.group,
          nominations: action.nominations,
        },
      };

    case 'turnNomination':
      return {
        ...state,
        group: {
          ...state.group,
          nominations: state.group.nominations.map(n => {
            if (n.id == action.id) {
              return {
                ...n,
                on: !n.on,
              };
            }
            return n;
          }),
        },
      };

    case 'addTagToGroup':
      return {
        ...state,
        group:{
          ...state.group,
          tags: state.group.tags.concat(action.tag)
        }
      };

    case 'removeTagFromGroup':
      return {
        ...state,
        group: {
          ...state.group,
          tags: state.group.tags.filter(t => t.id != action.tag.id)
        }
      };

    default:
      return state;
  }
};
