import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import { colors, Hp, styles, useNavigation, ServiceCart } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Menu } from 'react-native-paper';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from "react-native-share";

export default function AppbarSecond(props) {
    const navigation = useNavigation()
    const reduxUser = useSelector(state => state.user.badges)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const handleGetCart = () => {
        if (reduxAuth) {
            ServiceCart.getTrolley(reduxAuth, props.gift ? 1 : 0, dispatch)
            dispatch({ type: 'SET_CART_STATUS', payload: props.gift ? 1 : 0 })
            navigation.navigate("Trolley")
        } else {
            navigation.navigate('Login', { navigate: 'Trolley' })
        }

    }

    const handleShareStore = async () => {
        try {
            const link_URL = await dynamicLinks().buildShortLink({
                link: `https://jajaid.page.link/store?slug=${props.storeSlug}`,
                domainUriPrefix: 'https://jajaid.page.link',
                ios: {
                    bundleId: 'com.jaja.customer',
                    appStoreId: '1547981332',
                    fallbackUrl: 'https://apps.apple.com/id/app/jaja-id-marketplace-hobbies/id1547981332?l=id',
                },
                android: {
                    packageName: 'com.jajaidbuyer',
                    fallbackUrl: 'https://play.google.com/store/apps/details?id=com.jajaidbuyer',
                },
                navigation: {
                    forcedRedirectEnabled: true,
                }
            });
            const shareOptions = {
                title: "Jaja.id",
                message: `Buka toko ${props.storename} di Jaja.id \nDownload sekarang ${link_URL}`,
            };

            Share.open(shareOptions)
                .then((res) => {
                    console.log("🚀 ~ file: AppbarSecond.js ~ line 53 ~ .then ~ res", res)
                })
                .catch((error) => {
                    console.log("🚀 ~ file: AppbarSecond.js ~ line 56 ~ handleShareStore ~ err", error.message)
                });
        } catch (error) {
            console.log("🚀 ~ file: AppbarSecond.js ~ line 59 ~ handleShareStore ~ error", error.message)
        }
    }

    return (
        <>
            <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
            <View style={[styles.appBar, styles.pb_2, { flex: 0, backgroundColor: props.backgroundColor ? props.backgroundColor : colors.BlueJaja, alignItems: 'flex-end', }]}>
                <TouchableOpacity style={[styles.row_start_center, { height: Hp('5%'), marginTop: '-5%' }]} onPress={() => navigation.goBack()}>
                    <Image style={[styles.appBarButton, { tintColor: colors.White }]} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%', height: Platform.OS === 'ios' ? Hp('4.7%') : Hp('5%') }]}>
                    <View style={[styles.row, { width: props.storename ? '90%' : '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]}>
                        <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                        <TextInput autoFocus={props.autofocus ? props.autofocus : false} keyboardType="default" returnKeyType="search" adjustsFontSizeToFit style={[styles.font_12, { marginBottom: Platform.OS === 'ios' ? '0%' : '-1%', width: '90%', padding: 0 }]} placeholder={props.title} onChangeText={text => {
                            props.handleSearch(text)
                        }}
                            onSubmitEditing={(value) => {
                                props.handleSubmit(value.nativeEvent.text)
                            }}></TextInput>
                    </View>
                    {props.storename ?
                        <View style={[styles.ml_2, { alignSelf: 'center' }]}>
                            <Menu
                                visible={visible}
                                onDismiss={() => setVisible(false)}
                                anchor={<TouchableOpacity onPress={() => setVisible(true)}><Image
                                    style={styles.appBarButton}
                                    source={require("../../assets/icons/options.png")}
                                /></TouchableOpacity>}>

                                <Menu.Item icon='cart' onPress={handleGetCart} title="Cart" />
                                <Menu.Item icon='share' onPress={handleShareStore} title="Share" />
                                <Divider />
                            </Menu>
                        </View>
                        :
                        <TouchableOpacity style={[styles.column, styles.mx_3]} onPress={() => handleGetCart()}>
                            <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                            {Object.keys(reduxUser).length && reduxUser.totalProductInCart ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.totalProductInCart >= 100 ? "99+" : reduxUser.totalProductInCart}</Text></View>
                                : null}
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </>
    );
}
