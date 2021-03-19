import {gql} from '@apollo/client';

export const getChatMessageQuery = `
query getChatMessage($input: MessageQuery!){
    getChatMessage(input: $input){
        messages {
            _id
            text
            image
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


