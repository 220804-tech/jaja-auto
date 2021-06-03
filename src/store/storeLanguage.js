const initialState = {
    language: 'ID',
}
export default function store(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_LANGUAGE':
            return { ...state, language: payload }
        default:
            return state;
    }
}