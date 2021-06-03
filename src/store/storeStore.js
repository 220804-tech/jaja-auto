const initialState = {
    store: {},
    storeProduct: [],
}
export default function storeStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_STORE':
            return { ...state, store: payload }
        case 'SET_STORE_PRODUCT':
            return { ...state, storeProduct: payload }
        default:
            return state;
    }
}