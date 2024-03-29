export const signinQuery = `
query login($input: AuthInput!){
    login(input: $input){
        token
        user{
            id
            username
            displayName
            status
            email
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_post_mention
                notification_comment_like
                notification_comment_reply
                notification_comment_mention
                notification_chat
                notification_chat_message
                notification_chat_mention
            }
            visibilities{
                visibility_all
                visibility_chat_search
                visibility_group_search
                visibility_post_at
                visibility_chat_at
            }
            theme
        }
    }
}
`;

export const signupQuery = `
mutation signup($userInput: AuthInput!){
    signup(input: $userInput){
        token
        user{
            id
            username
            displayName
            email
            status
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_post_mention
                notification_comment_like
                notification_comment_reply
                notification_comment_mention
                notification_chat
                notification_chat_message
                notification_chat_mention
            }
            visibilities{
                visibility_all
                visibility_chat_search
                visibility_group_search
                visibility_post_at
                visibility_chat_at
            }
            theme
        }
    }
}
`;

export const updateProfileMutation = `
mutation updateProfile($userInput: AuthInput!){
    updateProfile(input: $userInput){
        token
        user{
            id
            username
            displayName
            email
            status
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_post_mention
                notification_comment_like
                notification_comment_reply
                notification_comment_mention
                notification_chat
                notification_chat_message
                notification_chat_mention
            }
            visibilities{
                visibility_all
                visibility_chat_search
                visibility_group_search
                visibility_post_at
                visibility_chat_at
            }
            theme
        } 
    }
}
`;

export const changePasswordMutation = `
mutation changePassword($userInput: AuthInput!){
    changePassword(input: $userInput)
}
`;

export const requireVerificationCodeMutation = `
mutation generateVerificationCode($email: String!){
    generateVerificationCode(email: $email)
}
`;

export const checkVerificationCodeQuery = `
query checkVerificationCode($verificationInput: VerificationInput!){
    checkVerificationCode(input: $verificationInput)
}
`;

export const resetPasswordMutation = `
mutation resetPassword($newPassword: String!){
    resetPassword(newPassword: $newPassword)
}
`;

export const updateNotificationsMutation = `
mutation updateNotifications($input: NotificationsInput!){
    updateNotifications(input: $input)
}
`;

export const updateVisibilitiesMutation = `
mutation updateVisibilities($input: VisibilitiesInput!){
    updateVisibilities(input: $input)
}
`;
export const getDefaultIconQuery = `
query getDefaultIcon {
    getDefaultIcon {
        id
        url
    }
}
`;

export const updateThemeMutation = `
mutation updateTheme($input: ThemeInput!){
    updateTheme(input: $input)
}
`;

export const createEmailAndPasswordMutation = `
mutation createEmailAndPassword($input: AuthInput!){
    createEmailAndPassword(input: $input){
        token
        user{
            id
            username
            displayName
            email
            status
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_post_mention
                notification_comment_like
                notification_comment_reply
                notification_comment_mention
                notification_chat
                notification_chat_message
                notification_chat_mention
            }
            visibilities{
                visibility_all
                visibility_chat_search
                visibility_group_search
                visibility_post_at
                visibility_chat_at
            }
            theme
        } 
    }
}
`;
