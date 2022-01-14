const initialState = {
    productDetail: {},
    reviewProducts: [],
    categoryName: '',
    productLoad: false,
    flashsale: false,
    filterLocation: false
}
export default function storeProduct(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_DETAIL_PRODUCT':
            return { ...state, productDetail: payload }
        case 'SET_PRODUCT_LOAD':
            return { ...state, productLoad: payload }
        case 'SET_REVIEW_PRODUCT':
            return { ...state, reviewProducts: payload }
        case 'SET_SHOW_FLASHSALE':
            return { ...state, flashsale: payload }
        case 'SET_FILTER_LOCATION':
            return { ...state, filterLocation: payload }
        default:
            return state;
    }
}