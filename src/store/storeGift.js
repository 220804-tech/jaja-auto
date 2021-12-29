const initialState = {
    productGift: [],
    filterGift: [],
    sortGift: []

}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_PRODUCT_GIFT':
            return { ...state, productGift: payload }
        case 'SET_FILTER_GIFT':
            return { ...state, filterGift: payload }
        case 'SET_SORT_GIFT':
            return { ...state, sortGift: payload }
        default:
            return state;
    }
}