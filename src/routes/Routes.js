import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Splash, Product, Search, Chat, Login, Profile, Register, Trolley, ProductSearch, Checkout, Address, VerifikasiEmail, Category,
    AddAddress, Midtrans, Store, ForgotPassword, Review, ZoomReview, OrderDetails, AddReview, OrderDelivery, Account, CustomerService,
    Notification, Vouchers
} from "./Screen";

import BottomRoutes from './BottomRoute'
const Stack = createStackNavigator();

export default function Routes() {
    const [protectRoute, setprotectRoute] = useState(true)

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
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
                <Stack.Screen name="Review" component={Review} />
                <Stack.Screen name="ZoomReview" component={ZoomReview} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} />
                <Stack.Screen name="AddReview" component={AddReview} />
                <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
                <Stack.Screen name="VerifikasiEmail" component={VerifikasiEmail} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="Category" component={Category} />
                <Stack.Screen name="Account" component={Account} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="CustomerService" component={CustomerService} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="Vouchers" component={Vouchers} />

                <Stack.Screen name="IsiChat" component={Chat} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                {/* PROFIL */}
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer >
    );
}



