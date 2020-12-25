const INITIAL_STATE = {
    token: '',
    user:{

    }
}

export default authReducer = (state = INITIAL_STATE, action) => {

    switch(action.type){
        case 'signin':
            return {
                ...state,
                token: action.auth.token,
                user: action.auth.user
            }
        case 'logout':
            return {
                user:{},
                token: ''
            }
        default: return state
    }
}