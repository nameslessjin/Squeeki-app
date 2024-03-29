const INITIAL_STATE = {
  token: '',
  user: {},
};

export default (authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'signin':
      return {
        ...state,
        token: action.auth.token,
        user: {
          ...state.user,
          ...action.auth.user,
        },
      };
    case 'logout':
      return {
        user: {},
        token: '',
      };

    case 'updateNotifications':
      return {
        ...state,
        user: {
          ...state.user,
          notifications: action.i,
        },
      };

    case 'updateVisibilities':
      return {
        ...state,
        user: {
          ...state.user,
          visibilities: action.i,
        },
      };

    case 'updateTheme':
      return {
        ...state,
        user: {
          ...state.user,
          theme: action.i,
        },
      };

    case 'getUserStatus':
      return {
        ...state,
        user: {
          ...state.user,
          status: action.i.status
        }
      }

    default:
      return state;
  }
});
