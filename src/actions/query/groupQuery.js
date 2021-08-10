export const findUserGroupsByUserIdQuery = `
query getMyGroups($count: Int!){
    getMyGroups(count: $count){
        groups{
            id
            groupname
            display_name
            shortDescription
            icon {
                uri
            }
            memberCount
            createdAt
        }
        count
    }
}
`;

export const getSingleGroupByIdQuery = `
query getGroup($groupId: ID!){
    getGroup(groupId: $groupId){
        id
        groupname
        display_name
        shortDescription
        icon {
            uri
        }
        backgroundImg {
            uri
        }
        auth {
            rank
            title
            notification
            notificationPriority
        }
        tags {
            id
            tag_name
            use_count
        }
        memberCount
        request_to_join
        visibility
        join_requested
        rank_setting {
            post_rank_required
            priority_1_rank_required
            priority_2_rank_required
            priority_3_rank_required
            manage_member_rank_required
            group_setting_rank_required
            nominate_rank_required
            manage_post_rank_required
            manage_comment_rank_required
            manage_check_in_rank_required
            manage_chat_rank_required
            manage_task_rank_required
            manage_reward_rank_required
        }
        createdAt
    }
}
`;

export const searchGroupQuery = `
query searchGroup($input: searchGroupInput!){
    searchGroup(input: $input){
        groups{
            id
            groupname
            display_name
            shortDescription
            icon {
                uri
            }
            memberCount
            createdAt
        }
        count
    }
}
`;

export const createGroupMutation = `
mutation createGroup($GroupInput: GroupInput!){
    createGroup(input: $GroupInput){
        id
        groupname
        display_name
        shortDescription
        icon {
            uri
        }
        backgroundImg {
            uri
        }
        auth {
            rank
            title
            notification
            notificationPriority
        }
        tags {
            id
            tag_name
            use_count
        }
        visibility
        request_to_join
        rank_setting {
            post_rank_required
            priority_1_rank_required
            priority_2_rank_required
            priority_3_rank_required
            manage_member_rank_required
            group_setting_rank_required
            nominate_rank_required
            manage_post_rank_required
            manage_comment_rank_required
            manage_check_in_rank_required
            manage_chat_rank_required
            manage_task_rank_required
            manage_reward_rank_required
        }
        memberCount
        createdAt
    }
}
`;

export const updateGroupMutation = `
mutation updateGroup($GroupInput: GroupInput!){
    updateGroup(input: $GroupInput){
        id
        groupname
        display_name
        shortDescription
        icon {
            uri
        }
        backgroundImg {
            uri
        }
        auth {
            rank
            title
            notification
            notificationPriority
        }
        tags {
            id
            tag_name
            use_count
        }
        visibility
        request_to_join
        rank_setting {
            post_rank_required
            priority_1_rank_required
            priority_2_rank_required
            priority_3_rank_required
            manage_member_rank_required
            group_setting_rank_required
            nominate_rank_required
            manage_post_rank_required
            manage_comment_rank_required
            manage_check_in_rank_required
            manage_chat_rank_required
            manage_task_rank_required
            manage_reward_rank_required
        }
        memberCount
        createdAt
    }
}
`;

export const joinGroupMutation = `
mutation joinGroup($groupId: ID!){
    joinGroup(groupId: $groupId){
        joinedGroup{
            id
            groupname
            display_name
            shortDescription
            icon {
                uri
            }
            backgroundImg {
                uri
            }
            auth {
                rank
                title
                notification
                notificationPriority
            }
            tags {
                id
                tag_name
                use_count
            }
            visibility
            join_requested
            rank_setting {
                post_rank_required
                priority_1_rank_required
                priority_2_rank_required
                priority_3_rank_required
                manage_member_rank_required
                group_setting_rank_required
                nominate_rank_required
                manage_post_rank_required
                manage_comment_rank_required
                manage_check_in_rank_required
                manage_chat_rank_required
                manage_task_rank_required
                manage_reward_rank_required
            }
            memberCount
            createdAt
        }
        groups{
            groups{
                id
                groupname
                display_name
                shortDescription
                icon {
                    uri
                }
                memberCount
                createdAt
            }
            count
        }
    }
}
`;

export const leaveGroupMutation = `
mutation leaveGroup($groupId: ID!){
    leaveGroup(groupId: $groupId){
        groups{
            id
            groupname
            display_name
            shortDescription
            icon {
                uri
            }
            memberCount
            createdAt
        }
        count
    }
}
`;

export const setGroupVisibilityMutation = `
mutation setGroupVisibility($groupId: ID!){
    setGroupVisibility(groupId: $groupId)
}
`;

export const setGroupRequestToJoinMutation = `
mutation setGroupRequestToJoin($groupId: ID!){
    setGroupRequestToJoin(groupId: $groupId)
}
`;

export const getGroupJoinRequestQuery = `
query getGroupJoinRequest($input: joinRequestInput!){
    getGroupJoinRequest(input: $input){
        users {
            id
            username
            displayName
            group_username
            icon{
                uri
            }
        }
        count
    }
}
`;

export const onRespondJoinRequestMutation = `
mutation onRespondJoinRequest($input: RespondJoinRequestInput!){
    onRespondJoinRequest(input: $input)
}
`;

export const onGroupRulesUpdateMutation = `
mutation onGroupRulesUpdate($input: GroupRulesInput!){
    onGroupRulesUpdate(input: $input)
}
`;

export const getGroupRulesQuery = `
query getGroupRules($groupId: ID!){
    getGroupRules(groupId: $groupId)
}

`;

export const getGroupJoinRequestCountQuery = `
query getGroupJoinRequestCount($groupId: ID!){
    getGroupJoinRequestCount(groupId: $groupId)
}
`;

export const updateRankFeaturesMutation = `
mutation updateRankFeatures($input: GroupInput!){
    updateRankFeatures(input: $input)
}
`;

export const getGroupRankNameQuery = `
query getGroupRankName($groupId: ID!){
    getGroupRankName(groupId: $groupId){
        rank1Name
        rank2Name
        rank3Name
        rank4Name
        rank5Name
        rank6Name
        rank7Name
    }
}
`;

export const updateRankNamesMutation = `
mutation updateRankNames($input: GroupRankNameInput!){
    updateRankNames(input: $input)
}
`;
