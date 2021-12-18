const initialState = {
    searchProduct: [],
    filters: [],
    sorts: [],
    keywordSearch: "",
    productDetail: {},
    slug: "",
    maxProduct: false,
    flashsale: false,
    reviewProducts: [],
    categoryName: '',
    productLoad: false,
    productTemporary: {}
}
export default function storeSearch(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_SEARCH':
            return { ...state, searchProduct: payload }
        case 'SET_CATEGORY_NAME':
            return { ...state, categoryName: payload }

        case 'SET_MAX_SEARCH':
            return { ...state, maxProduct: payload }
        case 'SET_FILTERS':
            return { ...state, filters: payload }
        case 'SET_SORTS':
            return { ...state, sorts: payload }
        case 'SET_KEYWORD':
            return { ...state, keywordSearch: payload }
        // case 'SET_DETAIL_PRODUCT':
        //     return { ...state, productDetail: payload }
        // case 'SET_PRODUCT_LOAD':
        //     return { ...state, productLoad: payload }
        // case 'SET_PRODUCT_TEMPORARY':
        //     return { ...state, productTemporary: payload }
        // case 'SET_REVIEW_PRODUCT':
        //     return { ...state, reviewProducts: payload }
        case 'SET_SLUG':
            return { ...state, slug: payload }
        // case 'SET_SHOW_FLASHSALE':
        //     return { ...state, flashsale: payload }
        default:
            return state;
    }
}