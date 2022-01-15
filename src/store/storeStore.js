const initialState = {
    store: {},
    storeProduct: [],
    newProduct: [],
    loadNewProduct: [],
    storeKeyword: '',
    maxProduct: false,
    positionIndex: 1,
    storeFilter: [],
    storeSort: []


}
export default function storeStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_STORE':
            return { ...state, store: payload }
        case 'SET_STORE_PRODUCT':
            return { ...state, storeProduct: payload }
        case 'SET_NEW_PRODUCT':
            return { ...state, newProduct: payload }
        case 'SET_NEW_PRODUCT_LOAD':
            return { ...state, loadNewProduct: payload }
        case 'SET_STORE_KEYWORD':
            return { ...state, storeKeyword: payload }
        case 'SET_MAX_STORE':
            return { ...state, maxProduct: payload }
        case 'SET_STORE_INDEX':
            return { ...state, positionIndex: payload }
        case 'SET_STORE_FILTER':
            return { ...state, storeFilter: payload }
        case 'SET_STORE_SORT':
            return { ...state, storeSort: payload }

        default:
            return state;
    }
}