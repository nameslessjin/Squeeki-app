const INITIAL_STATE = {
    currentScreen: 'Home',
}

export default currentScreenReducer = (state = INITIAL_STATE, action) => {

    switch(action.type){
        case 'changeScreen':
            return {
                ...state,
                currentScreen: action.screen
            }
        default: return state
    }
}