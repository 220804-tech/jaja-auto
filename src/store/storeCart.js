const initialState = {
    cart: [],
    cartGift: [],
    cartStatus: 0

}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_CART':
            console.log("🚀 ~ file: storeCart.js ~ line 9 ~ storeCart ~ payload", payload)
            return { ...state, cart: payload }
        case 'SET_CART_GIFT':
            return { ...state, cartGift: payload }
        case 'SET_CART_STATUS':
            return { ...state, cartStatus: payload }
        default:
            return state;
    }
}