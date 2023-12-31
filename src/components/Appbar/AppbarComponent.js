import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Alert, StatusBar, Platform, CameraRoll } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { TouchableRipple } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, styles, colors, Language, ServiceUser, ServiceCart, Wp } from '../../export'

export default function AppbarComponent(props) {
    let navigation = useNavigation()
    const reduxUser = useSelector(state => state.user.badges)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        if (Platform.OS == 'ios') {
            StatusBar.setBarStyle('light-content', true);	//<<--- add this
            StatusBar.setBackgroundColor(colors.BlueJaja, true)
        }
    }, [reduxUser])

    const handleGetCart = () => {
        if (reduxAuth) {
            ServiceCart.getCart(reduxAuth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_CART', payload: res })
                }
            })
            getBadges()
            navigation.navigate("Trolley")
        } else {
            navigation.navigate('Login', { navigate: 'Trolley' })
        }
    }

    const handleNotif = () => {
        if (reduxAuth) {
            navigation.navigate('Notification')
        } else {
            navigation.navigate('Login', { navigate: 'Trolley' })
        }
    }

    const getBadges = () => {
        ServiceUser.getBadges(reduxAuth).then(res => {
            if (res) {
                dispatch({ type: "SET_BADGES", payload: res })
            } else {
                dispatch({ type: "SET_BADGES", payload: {} })
            }
        })
    }


    return (
        <View style={styles.column}>

            <StatusBar translucent={false} backgroundColor={props.bgTop ? props.bgTop : colors.BlueJaja} barStyle="light-content" />
            <View style={[styles.appBar, { justifyContent: 'flex-start', backgroundColor: props.Bg ? props.Bg : colors.BlueJaja }]}>
                <View style={[styles.row_start_center, { flex: 1 }]}>
                    {props.back ?
                        props.route ?
                            <TouchableOpacity style={[styles.row_start_center, { marginRight: '2%' }]} onPress={() => {

                                navigation.navigate(props.route)
                            }}>
                                <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.row_start_center, { marginRight: '2%' }]} onPress={() => {
                                if (props.reset) {
                                    navigation.navigate(props.reset)
                                } else {
                                    navigation.goBack()
                                }
                            }}>
                                <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                            </TouchableOpacity>
                        : null}
                    {props.title ?
                        <Text numberOfLines={1} style={[styles.font_15, { fontFamily: 'SignikaNegative-SemiBold', color: colors.White, width: props.chat ? Wp('85%') : '60%', marginBottom: 0, marginTop: Platform.OS === 'android' ? '-0.5%' : 0 }]}>{Language(props.title)}</Text>
                        : null
                    }
                </View>
                {props.share ?
                    <TouchableRipple onPress={props.handlePress} style={[styles.py, styles.px_5, { backgroundColor: colors.White, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginBottom: '-0.5%' }]} rippleColor={colors.BlueJaja} >
                        <Text style={[styles.font_13, styles.T_bold, { color: colors.BlueJaja, textAlign: 'center', textAlignVertical: 'center', marginTop: '-1%' }]}>Share</Text>
                    </TouchableRipple> : null
                }
                {props.trolley || props.notif && Object.keys(reduxUser).length ?
                    <View style={[styles.row_between_center]}>
                        {props.trolley ?
                            <TouchableOpacity style={[styles.column, styles.mx]} onPress={handleGetCart}>
                                <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                                {Object.keys(reduxUser).length && reduxUser.totalProductInCart ?
                                    <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.totalProductInCart >= 100 ? "99+" : reduxUser.totalProductInCart}</Text></View>
                                    : null
                                }
                            </TouchableOpacity>
                            : null
                        }
                        {props.notif ?
                            <TouchableOpacity style={[styles.column, styles.mx_2]} onPress={handleNotif}>
                                <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, tintColor: colors.White }} />
                                {Object.keys(reduxUser).length && reduxUser.totalNotifUnread ?
                                    <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.totalNotifUnread >= 100 ? "99+" : reduxUser.totalNotifUnread}</Text></View>
                                    : null
                                }
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    : null
                }
            </View>
        </View>
    )
}

