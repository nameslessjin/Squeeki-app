export const createTagMutation = `
mutation createTag($CreateTagInput: CreateTagInput!){
    createTag(input: $CreateTagInput){
        id
        tag_name
    }
}

`;

export const searchTagQuery = `
query searchTag($SearchTagInput: SearchTagInput!){
    searchTag(input: $SearchTagInput){
            tags{
                id
                tag_name
                use_count
            }
            search_count
    }
}
`;

export const addTagToGroupMutation = `
mutation addTagToGroup($GroupTagInput: GroupTagInput!){
    addTagToGroup(input: $GroupTagInput)
}
`

export const removeTagFromGroupMutation = `
mutation removeTagFromGroup($GroupTagInput: GroupTagInput!){
    removeTagFromGroup(input: $GroupTagInput)
}
`