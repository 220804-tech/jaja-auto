const initialState = {
    cart: {},
}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_CART':
            console.log("file: storeCart.js ~ line 7 ~ storeCart ~ type", payload)
            return { ...state, cart: payload }
        default:
            return state;
    }
}