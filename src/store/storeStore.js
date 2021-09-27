const initialState = {
    store: {},
    storeProduct: [],
    newProduct: [],
    storeKeyword: '',
    maxProduct: false,
    positionIndex: 1,

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
        case 'SET_STORE_KEYWORD':
            return { ...state, storeKeyword: payload }
        case 'SET_MAX_STORE':
            return { ...state, maxProduct: payload }
        case 'SET_STORE_INDEX':
            return { ...state, positionIndex: payload }
        default:
            return state;
    }
}