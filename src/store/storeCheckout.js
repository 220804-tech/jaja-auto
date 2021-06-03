const initialState = {
    checkout: {},
    shipping: [],
    orderId: "",
}
export default function storeCheckout(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_CHECKOUT':
            return { ...state, checkout: payload }
        case 'SET_SHIPPING':
            return { ...state, shipping: payload }
        case 'SET_ORDERID':
            return { ...state, orderId: payload }
        default:
            return state;
    }
}