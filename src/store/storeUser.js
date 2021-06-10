const initialState = {
    badges: {},
    user: {},
}
export default function storeUser(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_BADGES':
            return { ...state, badges: payload }
        case 'SET_USER':
            return { ...state, user: payload }
        case 'USER_LOGOUT':
            console.log("🚀 ~ file: storeUser.js ~ line 17 ~ storeUser ~ USER_LOGOUT")
            return { ...state, badges: {}, user: {} }
        default:
            return state;
    }
}