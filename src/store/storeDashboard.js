const initialState = {
    category: [],
    flashsale: [],
    showFlashsale: false,
    trending: [],
    hobyAverage: [],
    basedOnSearch: [],
    recommanded: [],
    nearestStore: [],
    showNearestStore: false,
    loadmore: false,
    out: false,
    maxRecomandded: false
}
export default function storeDashboard(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_DASHCATEGORY':
            return { ...state, category: payload }
        case 'SET_DASHFLASHSALE':
            return { ...state, flashsale: payload }
        case 'SET_SHOW_FLASHSALE':
            return { ...state, showFlashsale: payload }
        case 'SET_DASHNEAREST':
            return { ...state, nearestStore: payload }
        case 'SET_SHOW_NEAREST':
            return { ...state, showNearestStore: payload }
        case 'SET_DASHTRENDING':
            return { ...state, trending: payload }
        case 'SET_DASHHOBYAVERAGE':
            return { ...state, hobyAverage: payload }
        case 'SET_DASHPOPULAR':
            return { ...state, basedOnSearch: payload }
        case 'SET_DASHRECOMMANDED':
            return { ...state, recommanded: payload }
        case 'SET_MAX_RECOMMANDED':
            return { ...state, maxRecomandded: payload }
        case 'SET_LOADMORE':
            return { ...state, loadmore: payload }
        case 'SET_OUT':
            return { ...state, out: payload }
        default:
            return state;
    }
}