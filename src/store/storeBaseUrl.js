const initialState = {
    urlElib: 'https://elibx.jaja.id',
}
export default function storebaseUrl(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_BASE_URL':
            return { ...state, auth: urlElib }
        default:
            return state;
    }
}