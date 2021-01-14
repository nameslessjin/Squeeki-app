export const loadGroupRewardsFunc = async data => {
    const {
        userLogout,
        auth,
        navigation,
        group,
        count,
        func,
        redeemed
    } = data

    const request = {
        token: auth.token,
        groupId: group.group.id,
        count: count,
        redeemed: redeemed
    }

    const req = await func(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
}

export const extractReward = (rewards, remaining_gift_card_count) => {

    const rarity1 = rewards.filter(r => r.chance == 1)
    const rarity4 = rewards.filter(r => r.chance == 4)
    const rarity10 = rewards.filter(r => r.chance == 10)
    const rarity15 = rewards.filter(r => r.chance == 15)
    const rarity30 = rewards.filter(r => r.chance == 30)
    const rarity40 = rewards.filter(r => r.chance == 40)
    // console.log(redeemed_gift_card_count)
    const sys_reward = [
        {
            id: 'point_4',
            from: 'system',
            type: 'point',
            content: '500 bonus points',
            name: '500 bonus points',
            chance: 4,
            hide: false,
            user: null
        },
        {
            id: 'point_10',
            from: 'system',
            type: 'point',
            content: '250 bonus points',
            name: '250 bonus points',
            chance: 10,
            hide: false,
            user: null
        },
        {
            id: 'point_15',
            from: 'system',
            type: 'point',
            content: '100 bonus points',
            name: '100 bonus points',
            chance: 15,
            hide: false,
            user: null
        },
        {
            id: 'point_30',
            from: 'system',
            type: 'point',
            content: '50 bonus points',
            name: '50 bonus points',
            chance: 30,
            hide: false,
            user: null
        },
        {
            id: 'point_40',
            from: 'system',
            type: 'point',
            content: '10 bonus points',
            name: '10 bonus points',
            chance: 40,
            hide: false,
            user: null
        },
        {
            id: 'giftcard',
            from: 'system',
            type: 'giftcard',
            content: 'Win a giftcard from Chipotle, Panera, Starbuck, Dokin Donut or Chick fil a.  Limited quanlity per month.',
            name: 'Monthly giftcard',
            chance: 1,
            hide: false,
            user: null
        }
    ]

    const reward = [
        {
            title: 'Diamond',
            id: '1',
            data: (remaining_gift_card_count > 0) ? rarity1.concat([sys_reward[5]]) : rarity1
        },
        {
            title: 'Sapphire',
            id: '4',
            data: (rarity4.length == 0 && rarity10 != 0) ? [sys_reward[0]] : rarity4.concat([sys_reward[0]])
        },
        {
            title: 'Emerald',
            id: '10',
            data: (rarity10.length == 0 && rarity15 != 0) ? [sys_reward[1]] : rarity10.concat([sys_reward[1]])
        },
        {
            title: 'Gold',
            id: '15',
            data: (rarity15.length == 0  && rarity30 != 0) ? [sys_reward[2]] : rarity15.concat([sys_reward[2]])
        },
        {
            title: 'Silver',
            id: '30',
            data: (rarity30.length == 0 && rarity40 != 0) ? [sys_reward[3]] : rarity30.concat([sys_reward[3]])
        },
        {
            title: 'Bronze',
            id: '40',
            data: rarity40.length == 0 ? [sys_reward[4]] : rarity40.concat([sys_reward[4]])
        },
    ]

    return reward.filter(r => r.data.length != 0)

}