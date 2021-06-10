const initialState = {
    notifikasi: false,
}
export default function storeNotification(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_NOTIFIKASI':
            return { ...state, notifikasi: payload }
        default:
            return state;
    }
}