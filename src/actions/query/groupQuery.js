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
                width
                height
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
            width
            height
        }
        backgroundImg {
            uri
            width
            height
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
                width
                height
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
            width
            height
        }
        backgroundImg {
            uri
            width
            height
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
            width
            height
        }
        backgroundImg {
            uri
            width
            height
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
                width
                height
            }
            backgroundImg {
                uri
                width
                height
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
                    width
                    height
                }
                memberCount
                createdAt
            }
            count
        }
    }
}
`

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
                width
                height
            }
            memberCount
            createdAt
        }
        count
    }
}
`

export const setGroupVisibilityMutation = `
mutation setGroupVisibility($groupId: ID!){
    setGroupVisibility(groupId: $groupId)
}
`

export const setGroupRequestToJoinMutation = `
mutation setGroupRequestToJoin($groupId: ID!){
    setGroupRequestToJoin(groupId: $groupId)
}
`

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
                width
                height
            }
        }
        count
    }
}
`

export const onRespondJoinRequestMutation = `
mutation onRespondJoinRequest($input: RespondJoinRequestInput!){
    onRespondJoinRequest(input: $input)
}
`

export const onGroupRulesUpdateMutation = `
mutation onGroupRulesUpdate($input: GroupRulesInput!){
    onGroupRulesUpdate(input: $input)
}
`

export const getGroupRulesQuery = `
query getGroupRules($groupId: ID!){
    getGroupRules(groupId: $groupId)
}

`

export const getGroupJoinRequestCountQuery = `
query getGroupJoinRequestCount($groupId: ID!){
    getGroupJoinRequestCount(groupId: $groupId)
}
`