const initialState = {
    category: [],
    categoryStatus: 'first'
}
export default function storeCategory(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_CATEGORY':
            return { ...state, category: payload }
        case 'SET_CATEGORY_STATUS':
            return { ...state, categoryStatus: payload }
        default:
            return state;
    }
}