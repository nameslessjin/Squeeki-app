const INITIAL_STATE = {
  total_point_semester: 0,
  base_point_semester: 0,
  leaderboard: {
    users: [],
    count: 0,
  },
};

export default (pointReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getUserGroupPoint':
      return {
        ...state,
        ...action.point,
      };

    case 'getGroupPointLeaderBoard':
      return {
        ...state,
        leaderboard: {
          users:
            action.i.count == 3
              ? action.i.users
              : state.leaderboard.users.concat(action.i.users),
          count: action.i.count,
        },
      };
    case 'cleanLeaderboard':
      return {
        ...state,
        leaderboard:{
          ...INITIAL_STATE.leaderboard
        }
      }

    case 'logout':
      return {
        ...INITIAL_STATE,
      };
    case 'cleanGroup':
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
});
