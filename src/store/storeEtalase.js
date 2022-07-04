const initialState = {
    searchProduct: [],
    filters: [],
    sorts: [],
    keywordSearch: "",
    slug: "",
    maxProduct: false,
    flashsale: false,
    reviewProducts: [],
    categoryName: '',
    productLoad: false,
    productTemporary: {},
    searchLoading: false,
    etalaseId: null
}
export default function storeEtalase(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_ETALASE_SEARCH':
            return { ...state, searchProduct: payload }
        case 'SET_ETALASE_CATEGORY_NAME':
            return { ...state, categoryName: payload }

        case 'SET_ETALASE_MAX_SEARCH':
            return { ...state, maxProduct: payload }
        case 'SET_ETALASE_FILTERS':
            return { ...state, filters: payload }
        case 'SET_ETALASE_SORTS':
            return { ...state, sorts: payload }
        case 'SET_ETALASE_KEYWORD':
            return { ...state, keywordSearch: payload }
        case 'SET_ETALASE_SEARCH_BY':
            return { ...state, searchBy: payload }
        case 'SET_ETALASE_SEARCH_LOADING':
            return { ...state, searchLoading: payload }
        case 'SET_ETALASE_ID':
            return { ...state, etalaseId: payload }
        // case 'SET_ETALASE_REVIEW_PRODUCT':
        //     return { ...state, reviewProducts: payload }
        case 'SET_ETALASE_SLUG':
            return { ...state, slug: payload }
        // case 'SET_ETALASE_SHOW_FLASHSALE':
        //     return { ...state, flashsale: payload }
        default:
            return state;
    }
}