const INITIAL_STATE = {
  version: {
    IOSVersion: '1.0.17',
    AndroidVersion: '1.0.17',
  },
  securityClearance: null,
  location: null,
  IP: null,
};

export default (metadataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getSecurityClearance':
      return {
        ...state,
        securityClearance: action.i,
      };

    case 'getIpAddress':
      return {
        ...state,
        IP: action.i,
      };

    case 'updateLocation':
      return {
        ...state,
        location: action.i,
      };

    default:
      return state;
  }
});
