const INITIAL_STATE = {
  checkin: [],
  count: 0,
  attendee: [],
  attendee_count: 0,
};

export default (checkinReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'loadGroupCheckin':
      return {
        ...state,
        count: action.i.count,
        checkin:
          action.i.count > 10 && action.i.count == state.count
            ? state.checkin
            : action.i.count == 10
            ? action.i.checkin
            : state.checkin.concat(action.i.checkin),
      };

    case 'logout':
      return {
        ...INITIAL_STATE,
      };

    case 'cleanCheckIn':
      return {
        ...INITIAL_STATE,
      };
    case 'userCheckIn':
      return {
        ...state,
        checkin: state.checkin.map(c => {
          if (c.id == action.checkin_id) {
            return {
              ...c,
              checked: 1,
            };
          }
          return c;
        }),
      };

    case 'getGroupCheckInResult':
      return {
        ...state,
        attendee:
          action.i.count > 10 && action.i.count == state.attendee_count
            ? state.attendee
            : action.i.count == 10
            ? action.i.members
            : state.attendee.concat(action.i.members),
        attendee_count: action.i.count,
      };
    case 'deleteGroupCheckin':
      return {
        ...state,
        checkin: state.checkin.filter(c => c.id != action.checkin_id),
      };

    default:
      return state;
  }
});
