const initialState = {
    profile: false,
}
export default function storeShowFeature(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SHOW_FEATURE_PROFILE':
            console.log("🚀 ~ file: storeShowFeature.js ~ line 6 ~ storeShowFeature ~ payload", payload)
            return { ...state, profile: payload }
        default:
            return state;
    }
}