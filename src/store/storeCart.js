const initialState = {
    cart: {},
}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_CART':
            return { ...state, cart: payload }
        default:
            return state;
    }
}