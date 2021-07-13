export const createGroupRewardMutation = `
mutation createGroupReward($input: RewardInput!){
    createGroupReward(input: $input)
}
`;

export const getGroupRewardListQuery = `
query getGroupRewardList($input: RewardInput!){
    getGroupRewardList(input: $input){
        id
        listName
        chance1
        chance2
        chance3
        chance4
        chance5
        rewardEntryList {
            title
            data {
                id
                name
                hideContent
                createdAt
                count
            }
        }
    }
}
`;

export const updateGroupRewardSettingMutation = `
mutation updateGroupRewardSetting($input: GroupRewardSettingInput){
    updateGroupRewardSetting(input: $input)
}
`;

export const deleteGroupRewardMutation = `
mutation deleteGroupReward($rewardId: ID!){
    deleteGroupReward(rewardId: $rewardId)
}
`;

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
