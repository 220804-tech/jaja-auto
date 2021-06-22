
const initialState = {
    wishlist: [],
    historyProduct: [],
}
export default function storeProfile(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_WISHLIST':
            return { ...state, wishlist: payload }
        case 'SET_HISTORY_PRODUCT':
            return { ...state, historyProduct: payload }
        default:
            return state;
    }
}