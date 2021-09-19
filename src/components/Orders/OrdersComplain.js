import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, RefreshControl, ToastAndroid } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os, DefaultNotFound } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

export default function OrdersSent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxSent = useSelector(state => state.order.sent)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [refreshing, setRefreshing] = useState(false);
    const [complain, setComplain] = useState(true)


    useEffect(() => {
        if (complain) {
            dispatch({ type: 'SET_ORDER_STATUS', payload: 'Pengiriman' })
        }
    }, [complain])
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, [complain]);


    const getItem = () => {
        ServiceOrder.getSent(reduxAuth).then(resSent => {
            console.log("🚀 ~ file: OrdersComplain.js ~ line 33 ~ ServiceOrder.getSent ~ resSent", resSent.items)
            if (resSent && Object.keys(resSent).length) {
                console.log("masuk sini kannnn")
                dispatch({ type: 'SET_SENT', payload: resSent.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resSent.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
            } else {
                handleSent()
            }
        }).catch(err => {
            ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            handleSent()
        })
    }

    const handleSent = () => {
        EncryptedStorage.getItem('sent').then(store => {
            if (store) {
                dispatch({ type: 'SET_SENT', payload: JSON.parse(store) })
            }
        })
    }
    const handleOrderDetails = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_RECEIPT', payload: item.trackingId })
        // dispatch({ type: 'SET_ORDER_STATUS', payload: 'Pengiriman' })
        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
        dispatch({ type: 'SET_ORDER_UID', payload: item.store.uid })
        navigation.navigate('DetailComplain')
    }

    const handleTracking = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_RECEIPT', payload: item.trackingId })
        navigation.navigate('OrderDelivery')
    }
    return (
        <View style={[styles.container, styles.pt_2]}>
            {reduxSent && reduxSent.length ?
                <FlatList
                    data={reduxSent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    keyExtractor={item => item.invoice}
                    renderItem={({ item }) => {
                        if (item.complain === true) {
                            setComplain(true)
                            return (
                                <TouchableOpacity style={Os.card} onPress={() => handleOrderDetails(item)}>
                                    <View style={[styles.row_between_center, styles.px_2, styles.mb_3, { width: '100%' }]}>
                                        <View style={[styles.row_start_center, { width: '45%' }]}>
                                            <Image style={{ width: Wp('8%'), height: Wp('8%'), borderRadius: 100, marginRight: '5%', resizeMode: 'contain' }} source={{ uri: item.store.image ? item.store.image : null }} />
                                            <Text numberOfLines={1} style={[styles.font_12, {}]}>{item.store.name}</Text>
                                        </View>
                                        <View style={[styles.row_end_center, { width: '40%', }]}>
                                            <Text style={[styles.font_12, { color: colors.BlueJaja }]}>No. {item.invoice}</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.row, styles.mb, styles.px_2, { width: '100%' }]}>
                                        <Image style={Os.image}
                                            resizeMethod={"scale"}
                                            resizeMode="cover"
                                            source={{ uri: item.products[0].image ? item.products[0].image : null }}
                                        />
                                        <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                            <View style={[styles.column, { width: '100%' }]}>
                                                <Text numberOfLines={1} style={styles.font_14}>{item.products[0].name}</Text>
                                                {item.totalOtherProduct ? <Text style={styles.font_10}>({item.totalOtherProduct} produk lainnya)</Text> : null}
                                            </View>
                                            <View style={[styles.row_between_center, { width: '100%' }]}>
                                                <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.totalPriceCurrencyFormat}</Text>
                                                <TouchableOpacity style={[styles.px_3, styles.py_2, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                                    {/* <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Rician Pesanan </Text> */}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )
                        } else {
                            setComplain(false)
                        }
                    }}
                />
                :
                <ScrollView contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <DefaultNotFound textHead="Ups..asas" textBody="Tampaknya pesanan kamu masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
                </ScrollView>
            }
        </View >
    )
}