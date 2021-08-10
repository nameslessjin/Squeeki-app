const INITIAL_STATE = {
  members: {members: [], count: 0},
};

export default (userReducer = (state = INITIAL_STATE, action) => {
  let members = state.members;
  switch (action.type) {
    case 'getGroupMembers':
      return {
        ...state,
        members: {
          ...action.members,
        },
      };
    case 'loadMoreGroupMembers':
      members = members.members.concat(action.moreGroupMembers.members);
      return {
        ...state,
        members: {
          members: members,
          count: action.moreGroupMembers.count,
        },
      };

    case 'cleanGroup':
      return {
        ...state,
        members: INITIAL_STATE.members,
      };

    case 'cleanMembers':
      return {
        ...state,
        members: INITIAL_STATE.members,
      };
    case 'logout':
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
});
