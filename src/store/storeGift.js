const initialState = {
    productGiftHome: [],
    productGift: [],
    productGiftSave: [],

    filterGift: [],
    sortGift: [],
    giftLoading: ''

}
export default function storeCart(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_PRODUCT_GIFT':
            return { ...state, productGift: payload }
        case 'SET_PRODUCT_GIFT_SAVE':
            return { ...state, productGiftSave: payload }
        case 'SET_PRODUCT_GIFT_HOME':
            return { ...state, productGiftHome: payload }
        case 'SET_FILTER_GIFT':
            return { ...state, filterGift: payload }
        case 'SET_SORT_GIFT':
            return { ...state, sortGift: payload }
        case 'SET_GIFT_LOADING':
            return { ...state, giftLoading: payload }
        default:
            return state;
    }
}