const initialState = {
    auth: false,
    verifikasi: null
}
export default function storeAuth(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_AUTH':
            return { ...state, auth: payload }
        case 'SET_VERIFIKASI':
            return { ...state, verifikasi: payload }
        default:
            return state;
    }
}