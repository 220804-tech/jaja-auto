import Appbar from '../components/Appbar/AppbarComponent'
import AppbarSecond from '../components/Appbar/AppbarSecond'

import CardProduct from '../components/CardProduct/CardProductComponent'
import CardProductAuto from '../components/CardProduct/CardProductAuto'

import Category from '../components/Category/CategoryComponent'
import Flashsale from '../components/Flashsale/FlashsaleComponent'
import HobyAverage from '../components/HobyAverage/HobyAverageComponent'
import RecomandedHobby from '../components/RecomandedHobby/RecomandedHobbyComponent'
import RecomandedCar from '../components/RecomandedCar/RecomandedCarComponent'
import Trending from '../components/Trending/TrendingComponent'
import BasedOnSearch from '../components/BasedOnSearch/BasedOnSearchComponent'
import NearestStore from '../components/NearestStore/NearestStore'
import RadioButton from '../components/RadioButton/RadioButton'


import FastImage from 'react-native-fast-image'
import ShimmerCardProduct from '../components/Shimmer/CardProduct'
import ShimmerCardProductAuto from '../components/Shimmer/CardProductAuto'


import Language from '../utils/Language'
import Loading from '../components/Loading/LoadingComponent'
import CheckSignal from '../utils/Signal'
import FilterLocation from '../utils/FilterLocation'
import axios from 'axios'

import Maps from '../components/Maps/MapsComponent'
import * as Utils from '../utils/Form'
import * as ServiceCart from '../services/Cart'
import * as ServiceCheckout from '../services/Checkout'
import * as ServiceUser from '../services/User'
import * as ServiceVoucher from '../services/Voucher'
import * as ServiceOrder from '../services/Orders'
import * as ServiceCategory from '../services/Category'
import * as ServiceProduct from '../services/Product'
import * as ServiceProductAuto from '../services/ProductAuto'

import * as ServiceStore from '../services/Store'
import * as ServiceFirebase from '../services/Firebase'
import * as ServiceNotif from '../services/Notification'
import * as ServiceCore from '../services/Core'
import { style as Ps } from '../assets/styles/productStyles'
import { style as Os } from '../assets/styles/orderStyle'
import { style as Ts } from '../assets/styles/trendingStyles'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { styles } from '../assets/styles/styles'
import { widthPercentageToDP as Wp, heightPercentageToDP as Hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import colors from '../assets/colors'
import OrderNotFound from '../components/NotFound/OrderNotFound'
import DefaultNotFound from '../components/NotFound/DefaultNotFound'
import Countdown from '../components/Flashsale/CountdownComponent'
import FlashsaleToko from '../components/FlashsaleToko/FlashsaleStore'
import HeaderTitleHome from '../components/HeaderTitleComponent/HeaderTitleComponent'

export {
    Appbar, CardProduct, Category, Flashsale, Maps, HobyAverage, RecomandedHobby, Trending, Language, Loading, CheckSignal, BasedOnSearch, styles,
    Ps, Wp, Hp, useNavigation, colors, useFocusEffect, FastImage, Utils, ServiceCart, ServiceCheckout, ServiceUser, ServiceVoucher, ServiceOrder, Os,
    ServiceCategory, ServiceProduct, ServiceStore, ServiceFirebase, Ts, ServiceNotif, ShimmerCardProduct, ServiceCore, Countdown, OrderNotFound,
    DefaultNotFound, NearestStore, FilterLocation, AppbarSecond, FlashsaleToko, RFValue, axios, HeaderTitleHome, RecomandedCar, CardProductAuto, ServiceProductAuto, RadioButton, ShimmerCardProductAuto
}
