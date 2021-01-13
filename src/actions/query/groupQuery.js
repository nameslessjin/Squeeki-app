export const findUserGroupsByUserIdQuery = `
query getMyGroups($count: Int!){
    getMyGroups(count: $count){
        groups{
            id
            groupname
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
        visibility
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
            memberCount
            createdAt
        }
        groups{
            groups{
                id
                groupname
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