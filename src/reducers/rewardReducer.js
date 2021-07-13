const INITIAL_STATE = {
  rewards: [],
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
  count: 0,
  history: [],
  history_count: 0,
};

export default (pointReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'getGroupRewardList':
      console.log(action);
      return {
        ...state,
        rewardList: action.data,
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
