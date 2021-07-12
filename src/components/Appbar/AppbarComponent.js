import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, styles, colors, Language, ServiceUser, ServiceCart } from '../../export'

export default function AppbarComponent(props) {
    let navigation = useNavigation()
    const reduxUser = useSelector(state => state.user.badges)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()

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
                        <TouchableOpacity style={[styles.row_start_center, { marginRight: '2%' }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                        </TouchableOpacity>
                    : null}
                {props.title ?
                    <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.White, width: '60%' }]}>{Language(props.title)}</Text>
                    : null
                }
            </View>
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
                            {Object.keys(reduxUser).length && reduxUser.totalProductInCart ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.totalProductInCart >= 100 ? "99+" : reduxUser.totalNotifUnread}</Text></View>
                                : null
                            }
                        </TouchableOpacity>
                        : null
                    }
                </View>
                : null
            }
        </View>
    )
}

