export const signinQuery = `
query login($email: String, $password: String, $token: String){
    login(email: $email, password: $password, token: $token){
        token
        user{
            id
            username
            displayName
            email
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_comment_like
                notification_comment_reply
                notification_chat
            }
        }
    }
}
`

export const signupQuery = `
mutation signup($userInput: AuthInput!){
    signup(input: $userInput){
        token
        user{
            id
            username
            displayName
            email
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_comment_like
                notification_comment_reply
                notification_chat
            }
        }
    }
}
`

export const updateProfileMutation = `
mutation updateProfile($userInput: AuthInput!){
    updateProfile(input: $userInput){
        token
        user{
            id
            username
            displayName
            email
            icon{
                uri
            }
            notifications{
                notification_all
                notification_group
                notification_post_like
                notification_post_comment
                notification_comment_like
                notification_comment_reply
                notification_chat
            }
        } 
    }
}
`

export const changePasswordMutation = `
mutation changePassword($userInput: AuthInput!){
    changePassword(input: $userInput)
}
`

export const requireVerificationCodeMutation = `
mutation generateVerificationCode($email: String!){
    generateVerificationCode(email: $email)
}
`

export const checkVerificationCodeQuery = `
query checkVerificationCode($verificationInput: VerificationInput!){
    checkVerificationCode(input: $verificationInput)
}
`

export const resetPasswordMutation = `
mutation resetPassword($newPassword: String!){
    resetPassword(newPassword: $newPassword)
}
`

export const updateNotificationsMutation = `
mutation updateNotifications($input: NotificationsInput!){
    updateNotifications(input: $input)
}
`