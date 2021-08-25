const INITIAL_STATE = {
  version: {
    IOSVersion: '1.0.16',
    AndroidVersion: '1.0.16',
  },
  securityClearance: null,
  location: null
};

export default (metadataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getSecurityClearance':
      return {
        ...state,
        securityClearance: action.i,
      };

    case 'updateLocation':
      return {
        ...state,
        location: action.i
      }

    default:
      return state;
  }
});
