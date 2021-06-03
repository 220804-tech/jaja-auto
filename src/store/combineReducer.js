import { combineReducers } from 'redux'
import notification from './storeNotification'
import language from './storeLanguage'
import dashboard from './storeDashboard'
import search from './storeSearch'
import cart from './storeCart'
import checkout from './storeCheckout'
import user from './storeUser'
import order from './storeOrder'
import category from './storeCategory'
import store from './storeStore'
import auth from './storeAuth'


export default combineReducers({
    notification,
    language,
    dashboard,
    search,
    cart,
    checkout,
    user,
    order,
    category,
    store,
    auth
})