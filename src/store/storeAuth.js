const initialState = {
    auth: null,
    verifikasi: false,
    deviceToken: ''

}
export default function storeAuth(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_AUTH':
            return { ...state, auth: payload }
        case 'SET_VERIFIKASI':
            return { ...state, verifikasi: payload }
        case 'SET_DEVICE_TOKEN':
            return { ...state, deviceToken: payload }
        case 'USER_LOGOUT':
            console.log("logout")
            return { ...state, auth: null, verifikasi: false }
        default:
            return state;
    }
}