export const createUpdateGroupRewardMutation = `
mutation createUpdateGroupReward($input: RewardInput!){
    createUpdateGroupReward(input: $input)
}
`;

export const getGroupRewardListQuery = `
query getGroupRewardList($input: RewardInput!){
    getGroupRewardList(input: $input){
        id
        type
        listName
        chance1
        chance2
        chance3
        chance4
        chance5
        pointCost
        rewardEntryList {
            title
            chance
            data {
                id
                expiration
                name
                createdAt
                count
            }
        }
        redeemRewardEntryList {
            id
            name
            expiration
            point
            createdAt
            count
        }
    }
}
`;

export const updateGroupRewardSettingMutation = `
mutation updateGroupRewardSetting($input: GroupRewardSettingInput){
    updateGroupRewardSetting(input: $input)
}
`;

export const getRewardEntryQuery = `
query getRewardEntry($input: RewardInput!){
    getRewardEntry(input: $input){
        id
        name
        chance
        listId
        createdAt
        from
        fromId
        to
        toId
        description
        image
        count
        point
        chanceDisplay
        expiration
    }
}
`;

export const updateRewardEntryStatusMutation = `
mutation updateRewardEntryStatus($input: RewardInput!){
    updateRewardEntryStatus(input: $input)
}
`;

// legacy

export const getUserGroupRewardHistoryQuery = `
query getUserGroupRewardHistory($input: GroupRewardInput!){
    getUserGroupRewardHistory(input: $input){
        rewards{
            id
            from
            type
            content
            name
            chance
            hide
            createdAt
        }
        count

    }
}
`;

export const getMonthlyGiftCardCountQuery = `
query getMonthlyGiftCardCount($groupId: ID!){
    getMonthlyGiftCardCount(groupId: $groupId)
}
`;

export const lootRewardMutation = `
mutation lootReward($groupId: ID!){
    lootReward(groupId: $groupId){
        reward {
            id
            from
            type
            content
            name
            chance
            hide
        }
        total_point
    }
}
`;
