import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Splash, Product, Search, Chat, Login, Profile, Register, Trolley, ProductSearch, Checkout, Address, VerifikasiEmail, Category,
    AddAddress, Midtrans, Store, ForgotPassword, Review, ZoomReview, OrderDetails, AddReview, OrderDelivery, Account, CustomerService,
    Notification, Vouchers, Flashsale, Wishlist, HistoryProduct, Reward, Referral, DetailComplain, OrderCancel, RequestComplain,
    AddAccount, CoinPage, DownloadInvoice, Gift, GiftSearch, GiftDetails, CheckoutMultiDrop, TrolleyMultiDrop, EtalaseProducts
} from "./Screen";
import dynamicLinks from '@react-native-firebase/dynamic-links';

import BottomRoutes from './BottomRoute'
const Stack = createStackNavigator();

export default function Routes() {
    const [protectRoute, setprotectRoute] = useState(true)

    useEffect(() => {

        // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        // console.log("🚀 ~ file: Sasasasa.js ~ line 134 ~ useEffect ~ unsubscribe", unsubscribe)
        // return () => unsubscribe();
    }, [])


    const handleDynamicLink = link => {
        // alert(JSON.stringify(link))
        // alert(link)
        // Handle dynamic link inside your own application
        // const parsed = queryString.parseUrl(link.url);
        if ('https://jajaid.page.link/product?' === String(link.url).slice(0, 33)) {
            // dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
            // dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
            // let slug = Object.keys(parsed.query)
            // dispatch({ type: 'SET_SLUG', payload: slug[0] })
            // navigation.push("Product", { slug: slug[0], image: null })
            // navigation.navigate('Pesanan')
        }
    };

    const config = {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 1,
        },
    };
    return (
        <NavigationContainer>
            <Stack.Navigator

                initialRouteName="Splash" screenOptions={{
                    headerShown: false,
                    // gestureEnab  led: true,
                    // transitionSpec: {
                    //     open: config,
                    //     close: config
                    // }
                }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Beranda" component={BottomRoutes} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Product" component={Product} />
                <Stack.Screen name="ProductSearch" component={ProductSearch} />
                <Stack.Screen name="Trolley" component={Trolley} />
                <Stack.Screen name="Address" component={Address} />
                <Stack.Screen name="AddAddress" component={AddAddress} />
                <Stack.Screen name="Midtrans" component={Midtrans} />
                <Stack.Screen name="Store" component={Store} />
                <Stack.Screen name="EtalaseProducts" component={EtalaseProducts} />

                <Stack.Screen name="Review" component={Review} />
                <Stack.Screen name="ZoomReview" component={ZoomReview} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} />
                <Stack.Screen name="DownloadInvoice" component={DownloadInvoice} />
                <Stack.Screen name="Gift" component={Gift} />
                <Stack.Screen name="GiftSearch" component={GiftSearch} />
                <Stack.Screen name="GiftDetails" component={GiftDetails} />
                <Stack.Screen name="CheckoutMultiDrop" component={CheckoutMultiDrop} />
                <Stack.Screen name="TrolleyMultiDrop" component={TrolleyMultiDrop} />
                <Stack.Screen name="AddReview" component={AddReview} />
                <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
                <Stack.Screen name="VerifikasiEmail" component={VerifikasiEmail} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="Category" component={Category} />
                <Stack.Screen name="Account" component={Account} />
                <Stack.Screen name="AddAccount" component={AddAccount} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="CustomerService" component={CustomerService} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="Vouchers" component={Vouchers} />
                <Stack.Screen name="Flashsale" component={Flashsale} />
                <Stack.Screen name="Wishlist" component={Wishlist} />
                <Stack.Screen name="HistoryProduct" component={HistoryProduct} />
                <Stack.Screen name="Reward" component={Reward} />
                <Stack.Screen name="Referral" component={Referral} />
                <Stack.Screen name="DetailComplain" component={DetailComplain} />
                <Stack.Screen name="OrderCancel" component={OrderCancel} />
                <Stack.Screen name="RequestComplain" component={RequestComplain} />

                <Stack.Screen name="CoinPage" component={CoinPage} />

                <Stack.Screen name="IsiChat" component={Chat} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                {/* PROFIL */}
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer >
    );
}



