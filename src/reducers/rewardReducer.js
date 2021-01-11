const INITIAL_STATE = {
    rewards: [],
    count: 0
  };
  
  export default (pointReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case 'getGroupReward':
        return {
          ...state,
          count: action.data.count,
          rewards: action.data.count == 10 ? action.data.rewards : state.rewards.concat(action.data.rewards)
        };
      
      case 'deleteGroupReward':
        return {
          ...state,
          rewards: state.rewards.filter(r => r.id != action.rewardId)
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
  