import Appbar from '../components/Appbar/AppbarComponent'
import CardProduct from '../components/CardProduct/CardProductComponent'
import Category from '../components/Category/CategoryComponent'
import Flashsale from '../components/Flashsale/FlashsaleComponent'
import HobyAverage from '../components/HobyAverage/HobyAverageComponent'
import RecomandedHobby from '../components/RecomandedHobby/RecomandedHobbyComponent'
import Trending from '../components/Trending/TrendingComponent'
import BasedOnSearch from '../components/BasedOnSearch/BasedOnSearchComponent'
import FastImage from 'react-native-fast-image'
import Card from '../components/CardProduct/CardProductComponent'

import Language from '../utils/language/Language'
import Loading from '../components/Loading/LoadingComponent'
import CheckSignal from '../utils/Signal'
import Maps from '../components/Maps/MapsComponent'
import * as Form from '../utils/Form'
import * as ServiceCart from '../services/Cart'
import * as ServiceCheckout from '../services/Checkout'
import * as ServiceUser from '../services/User'
import * as ServiceVoucher from '../services/Voucher'
import * as ServiceOrder from '../services/Orders'
import * as ServiceCategory from '../services/Category'
import * as ServiceProduct from '../services/Product'
import * as ServiceStore from '../services/Store'
import * as ServiceFirebase from '../services/Firebase'
import * as ServiceNotif from '../services/Notification'

import { style as Ps } from '../assets/styles/productStyles'
import { style as Os } from '../assets/styles/orderStyle'
import { style as Ts } from '../assets/styles/trendingStyles'

import { styles } from '../assets/styles/styles'
import { widthPercentageToDP as Wp, heightPercentageToDP as Hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import colors from '../assets/colors'
export {
    Appbar, CardProduct, Category, Flashsale, Maps, HobyAverage, RecomandedHobby, Trending, Language, Loading, CheckSignal, BasedOnSearch, styles,
    Ps, Wp, Hp, useNavigation, colors, useFocusEffect, FastImage, Form, ServiceCart, ServiceCheckout, ServiceUser, ServiceVoucher, ServiceOrder, Os,
    ServiceCategory, ServiceProduct, ServiceStore, ServiceFirebase, Card, Ts, ServiceNotif
}
