const initialState = {
    productDetail: {},
    slug: "",
    reviewProducts: [],
    categoryName: '',
    productLoad: false,
    productTemporary: {},
    flashsale: false
}
export default function storeProduct(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_DETAIL_PRODUCT':
            return { ...state, productDetail: payload }
        case 'SET_PRODUCT_LOAD':
            return { ...state, productLoad: payload }
        case 'SET_PRODUCT_TEMPORARY':
            return { ...state, productTemporary: payload }
        case 'SET_REVIEW_PRODUCT':
            return { ...state, reviewProducts: payload }
        case 'SET_SHOW_FLASHSALE':
            return { ...state, flashsale: payload }
        default:
            return state;
    }
}