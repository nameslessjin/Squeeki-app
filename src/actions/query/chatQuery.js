export const getChatQuery = `
query getChat($input: ChatQuery!){
    getChat(input: $input){
        chat {
            id
            name
            rank_req
            icon {
                uri
            }
        }
        count
    }
}
`;

export const createChatMutation = `
mutation createChat($input: ChatMutation!){
    createChat(input: $input){
        id
        name
        rank_req
        icon {
            uri
        }
    }
}
`;

export const deleteLeaveChatMutation = `
mutation  deleteLeaveChat($input: ChatMutation!){
    deleteLeaveChat(input: $input)
}
`;

export const updateChatMutation = `
mutation updateChat($input: ChatMutation!){
    updateChat(input: $input){
        id
        name
        rank_req
        icon {
            uri
        }
    }
}
`;

export const createUserChatMutation = `
mutation createUserChat($input: ChatMutation!){
    createUserChat(input: $input)
}
`;

export const deleteUserChatMutation = `
mutation deleteUserChat($input: ChatMutation!){
    deleteUserChat(input: $input)
}
`;

export const switchOwnershipMutation = `
mutation switchOwnership($input: ChatMutation!){
    switchOwnership(input: $input)
}
`;
