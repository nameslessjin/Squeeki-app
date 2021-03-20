
export const getChatMessageQuery = `
query getChatMessage($input: MessageQuery!){
    getChatMessage(input: $input){
        messages {
            _id
            text
            image
            status
            createdAt
            user {
                _id
                name
                title
                avatar
            }
        }
        pointer
    }
}
`;


export const sendMessageMutation = `
mutation sendMessage($input: MessageMutation!){
    sendMessage(input: $input)
}
`;

export const updateUserMessageMutation = `
mutation updateUserMessage($input: UserMessageMutation!){
  updateUserMessage(input: $input)
}

`


