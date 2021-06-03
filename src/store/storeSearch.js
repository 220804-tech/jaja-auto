const initialState = {
    searchProduct: [],
    filters: [],
    sorts: [],
    keywordSearch: "",
    productDetail: {},
}
export default function storeSearch(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_SEARCH':
            return { ...state, searchProduct: payload }
        case 'SET_FILTERS':
            return { ...state, filters: payload }
        case 'SET_SORTS':
            return { ...state, sorts: payload }
        case 'SET_KEYWORD':
            return { ...state, keywordSearch: payload }
        case 'SET_DETAIL_PRODUCT':
            return { ...state, productDetail: payload }
        default:
            return state;
    }
}