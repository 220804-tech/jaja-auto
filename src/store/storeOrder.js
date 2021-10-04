const initialState = {
    unPaid: [],
    unPaidEmpty: false,
    waitConfirm: [],
    waitConfirmEmpty: false,
    process: [],
    processEmpty: false,
    sent: [],
    sentEmpty: false,
    completed: [],
    completedEmpty: false,
    failed: [],
    failedEmpty: false,
    filter: [],
    filterEmpty: false,
    tracking: [],
    receipt: "",
    invoice: "",
    orderStatus: "",
    refresh: false
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
        case 'SET_UNPAID_EMPTY':
            return { ...state, unPaidEmpty: payload }
        case 'SET_WAITCONFIRM_EMPTY':
            return { ...state, waitConfirmEmpty: payload }
        case 'SET_PROCESS_EMPTY':
            return { ...state, processEmpty: payload }
        case 'SET_SENT_EMPTY':
            return { ...state, sentEmpty: payload }
        case 'SET_COMPLETED_EMPTY':
            return { ...state, completedEmpty: payload }
        case 'SET_FAILED_EMPTY':
            return { ...state, failedEmpty: payload }
        case 'SET_ORDER_FILTER':
            return { ...state, filter: payload }
        case 'SET_TRACKING':
            return { ...state, tracking: payload }
        case 'SET_ORDER_REFRESH':
            return { ...state, refresh: payload }

        case 'SET_RECEIPT':
            return { ...state, receipt: payload }
        case 'SET_INVOICE':
            return { ...state, invoice: payload }
        case 'SET_ORDER_STATUS':
            return { ...state, orderStatus: payload }
        default:
            return state;
    }
}