const INITIAL_STATE = {
  rewardList: [
    {
      id: '1',
      type: 'loot',
      listName: 'Daily Luck',
      chance1: 1,
      chance2: 5,
      chance3: 14,
      chance4: 30,
      chance5: 50,
      pointCost: 100,
      rewardEntryList: [],
    },
    {
      id: '2',
      type: 'loot',
      listName: 'Big Or Nothing',
      chance1: 1,
      chance2: 5,
      chance3: 14,
      chance4: 30,
      chance5: 50,
      pointCost: 1000,
      rewardEntryList: [],
    },
    // {
    //   id: '3',
    //   type: 'loot',
    //   listName: 'Reserve',
    //   chance1: 1,
    //   chance2: 5,
    //   chance3: 14,
    //   chance4: 30,
    //   chance5: 50,
    //   pointCost: 100,
    //   rewardEntryList: [],
    // },
    {
      id: '0',
      type: 'redeem',
      listName: 'Fair Trade',
      redeemRewardEntryList: []
    },
    {
      id: '4',
      type: 'loot',
      listName: 'Reward Drops (100pts)',
      chance1: 1,
      chance2: 5,
      chance3: 14,
      chance4: 30,
      chance5: 50,
      pointCost: 100,
      rewardEntryList: [],
    },
    {
      id: '5',
      type: 'loot',
      listName: 'Reward Drops (200pts)',
      chance1: 1,
      chance2: 5,
      chance3: 14,
      chance4: 30,
      chance5: 50,
      pointCost: 200,
      rewardEntryList: [],
    },
    {
      id: '6',
      type: 'loot',
      listName: 'Reward Drops (1000pts)',
      chance1: 1,
      chance2: 5,
      chance3: 14,
      chance4: 30,
      chance5: 50,
      pointCost: 1000,
      rewardEntryList: [],
    },
  ],
  groupRewardHistory: [],
  groupRewardHistoryCount: 0,
  userRewardHistory: [],
  userRewardHistoryCount: 0,
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
