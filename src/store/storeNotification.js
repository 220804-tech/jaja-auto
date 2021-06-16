const initialState = {
    notifikasi: false,
    notifCount: { home: 0, chat: 0, orders: 0 }
}
export default function storeNotification(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_NOTIFIKASI':
            return { ...state, notifikasi: payload }
        case 'SET_NOTIF_COUNT':
            return { ...state, notifCount: payload }
        default:
            return state;
    }
}