const initialState = {
    complainDetails: {},
    complainStep: 0,
    complainStatus: 0,
    complainUpdate: true,
    complainUid: '',
    complainTarget: '',

}

export default function complainStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_COMPLAIN_DETAILS':
            return { ...state, complainDetails: payload }
        case 'SET_COMPLAIN_STATUS':
            return { ...state, complainStatus: payload }
        case 'SET_COMPLAIN_STEPS':
            return { ...state, complainStep: payload }
        case 'SET_ORDER_UID':
            return { ...state, complainUid: payload }
        case 'SET_COMPLAIN_TARGET':
            return { ...state, complainTarget: payload }
        case 'SET_COMPLAIN_UPDATE':
            return { ...state, complainUpdate: payload }
        default:
            return state;
    }
}
// SET_COMPLAIN_DETAILS