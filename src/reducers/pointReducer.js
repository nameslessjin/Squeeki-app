const INITIAL_STATE = {
  total_point_semester: 0,
  bonus_point_semester: 0,
};

export default (pointReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getUserGroupPoint':
      return {
        ...state,
        ...action.point,
      };

    case 'logout':
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
});
