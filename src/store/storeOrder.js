const initialState = {
    unPaid: [],
    waitConfirm: [],
    process: [],
    sent: [],
    completed: [],
    failed: [],
    filter: [],
    tracking: [],
    receipt: "",
    invoice: ""
}
export default function storeOrder(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_UNPAID':
            return { ...state, unPaid: payload }
        case 'SET_WAITCONFIRM':
            return { ...state, waitConfirm: payload }
        case 'SET_PROCESS':
            return { ...state, process: payload }
        case 'SET_SENT':
            return { ...state, sent: payload }
        case 'SET_COMPLETED':
            return { ...state, completed: payload }
        case 'SET_FAILED':
            return { ...state, failed: payload }
        case 'SET_ORDER_FILTER':
            return { ...state, filter: payload }
        case 'SET_TRACKING':
            return { ...state, tracking: payload }
        case 'SET_RECEIPT':
            return { ...state, receipt: payload }
        case 'SET_INVOICE':
            return { ...state, invoice: payload }
        default:
            return state;
    }
}