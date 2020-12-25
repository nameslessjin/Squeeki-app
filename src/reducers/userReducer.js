
const INITIAL_STATE = {
    members: { members: [], lastIndexId: null}
}

export default userReducer = (state = INITIAL_STATE, action) => {
    let members = state.members
    switch(action.type) {
        case 'getGroupMembers':
            return {
                ...state,
                members: {
                    ...action.members
                }
            }
        case 'loadMoreGroupMembers':
            members = members.members.concat(action.moreGroupMembers.members)
        return {
            ...state,
            members: {
                members: members,
                lastIndexId: action.moreGroupMembers.lastIndexId
            }

        }

        case 'cleanMembers':
            return {
                ...state,
                members: INITIAL_STATE.members
            }
        case 'logout':
            return {
                ...INITIAL_STATE
            }
        default: return state
    }
}