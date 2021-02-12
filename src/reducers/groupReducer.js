const INITIAL_STATE = {
  groups: {groups: [], count: 0},
  group: {},
  group_join_request_count: 0
};

export default (groupReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getUserGroups':
      return {
        ...state,
        groups: {
          count: action.data.count,
          groups:
            action.data.count > 10 && action.data.count == state.groups.count
              ? state.groups.groups
              : action.data.count == 10
              ? action.data.groups
              : state.groups.groups.concat(action.data.groups),
        },
      };

    case 'getGroupJoinRequestCount':
      return {
        ...state,
        group_join_request_count: action.data
      }

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
      return {
        ...state,
        group: {
          ...action.data.joinedGroup,
        },
        groups: {
          ...action.data.groups,
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
    case 'changeGroupRequestToJoin':
      return {
        ...state,
        group: {
          ...state.group,
          request_to_join: state.group.request_to_join ? false : true,
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
        group: {
          ...state.group,
          tags: state.group.tags.concat(action.tag),
        },
      };

    case 'removeTagFromGroup':
      return {
        ...state,
        group: {
          ...state.group,
          tags: state.group.tags.filter(t => t.id != action.tag.id),
        },
      };

    case 'updateRankFeatures':
      return {
        ...state,
        group: {
          ...state.group,
          rank_setting: action.i
        }
      }

    default:
      return state;
  }
});
