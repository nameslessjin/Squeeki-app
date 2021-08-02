const INITIAL_STATE = {
  rewardList: [
    {
      id: '1',
      listName: 'List 1',
      chance1: 5,
      chance2: 10,
      chance3: 15,
      chance4: 30,
      chance5: 40,
    },
    {
      id: '2',
      listName: 'List 2',
      chance1: 5,
      chance2: 10,
      chance3: 15,
      chance4: 30,
      chance5: 40,
    },
    {
      id: '3',
      listName: 'List 3',
      chance1: 5,
      chance2: 10,
      chance3: 15,
      chance4: 30,
      chance5: 40,
    },
  ],
  groupRewardHistory: [],
  groupRewardHistoryCount: 0,
  userRewardHistory: [],
  userRewardHistoryCount: 0
  
};

export default (pointReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getGroupRewardList':
      return {
        ...state,
        rewardList: action.data,
      };

    case 'getGroupRewardHistory':
      return {
        ...state,
        groupRewardHistory: action.data.init
          ? action.data.reward
          : state.groupRewardHistory.concat(action.data.reward),
          groupRewardHistoryCount: action.data.count,
      };

    case 'getUserRewardHistory':
      console.log(action)
      return {
        ...state,
        userRewardHistory: action.data.init
          ? action.data.reward
          : state.userRewardHistory.concat(action.data.reward),
          userRewardHistoryCount: action.data.count,
      };

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
