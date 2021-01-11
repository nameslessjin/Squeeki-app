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

export const extractReward = (rewards) => {

    const rarity1 = rewards.filter(r => r.chance == 1)
    const rarity4 = rewards.filter(r => r.chance == 4)
    const rarity10 = rewards.filter(r => r.chance == 10)
    const rarity15 = rewards.filter(r => r.chance == 15)
    const rarity30 = rewards.filter(r => r.chance == 30)
    const rarity40 = rewards.filter(r => r.chance == 40)

    const points_reward = [
        {
            id: 'point_4',
            from: 'system',
            type: 'point',
            content: '500 group points',
            name: '500 group points',
            chance: 4,
            hide: false,
            user: null
        },
        {
            id: 'point_10',
            from: 'system',
            type: 'point',
            content: '250 group points',
            name: '250 group points',
            chance: 10,
            hide: false,
            user: null
        },
        {
            id: 'point_15',
            from: 'system',
            type: 'point',
            content: '100 group points',
            name: '100 group points',
            chance: 15,
            hide: false,
            user: null
        },
        {
            id: 'point_30',
            from: 'system',
            type: 'point',
            content: '50 group points',
            name: '50 group points',
            chance: 30,
            hide: false,
            user: null
        },
        {
            id: 'point_40',
            from: 'system',
            type: 'point',
            content: '10 group points',
            name: '10 group points',
            chance: 40,
            hide: false,
            user: null
        },
    ]

    const reward = [
        {
            title: 'Chance: 1%',
            id: '1',
            data: rarity1
        },
        {
            title: 'Chance: 4%',
            id: '4',
            data: rarity4.length == 0 ? rarity4 : rarity4.concat([points_reward[0]])
        },
        {
            title: 'Chance: 10%',
            id: '10',
            data: rarity10.length == 0 ? rarity10 : rarity10.concat([points_reward[1]])
        },
        {
            title: 'Chance: 15%',
            id: '15',
            data: rarity15.length == 0 ? rarity15 : rarity15.concat([points_reward[2]])
        },
        {
            title: 'Chance: 30%',
            id: '30',
            data: rarity30.length == 0 ? rarity30 : rarity30.concat([points_reward[3]])
        },
        {
            title: 'Chance: 40%',
            id: '40',
            data: rarity40.length == 0 ? rarity40 : rarity40.concat([points_reward[4]])
        },
    ]

    return reward.filter(r => r.data.length != 0)

}