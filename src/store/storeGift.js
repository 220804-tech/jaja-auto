const initialState = {
    details: null
}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_GIFT':
            return { ...state, details: payload }
        default:
            return state;
    }
}