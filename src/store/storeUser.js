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
            console.log("🚀 ~ filce: storeUser.js ~ line 7 ~ storeUser ~ payload", payload)
            return { ...state, user: payload }
        default:
            return state;
    }
}