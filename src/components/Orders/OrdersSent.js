import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, RefreshControl, ToastAndroid } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os, DefaultNotFound } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Button } from 'react-native-paper'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

export default function OrdersSent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxSent = useSelector(state => state.order.sent)
    console.log("🚀 ~ file: OrdersSent.js ~ line 13 ~ OrdersSent ~ reduxSent", reduxSent)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [refreshing, setRefreshing] = useState(false);
    const [complain, setComplain] = useState(false);

    useEffect(() => {
        setComplain(false)
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log("redresh")
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);


    const getItem = () => {
        setRefreshing(true)
        ServiceOrder.getSent(reduxAuth).then(resSent => {
            console.log("🚀 ~ file: OrdersSent.js ~ line 27 ~ ServiceOrder.getSent ~ resSent", resSent.items)
            setRefreshing(false)
            if (resSent && Object.keys(resSent).length) {
                dispatch({ type: 'SET_SENT', payload: resSent.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resSent.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
                resSent.items.filter(res => {
                    if (res.complain) {
                        setComplain(true)
                    }
                    console.log("🚀 ~ file: OrdersSent.js ~ line 38 ~ ServiceOrder.getSent ~ res", res.complain)
                })
            } else {
                setRefreshing(false)
                handleSent()
            }

        }).catch(err => {
            setRefreshing(false)
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
        dispatch({ type: 'SET_ORDER_STATUS', payload: 'Pengiriman' })
        dispatch({ type: 'SET_ORDER_UID', payload: item.store.uid })
        navigation.navigate('OrderDetails', { data: item.invoice, status: "Pengiriman" })
    }

    const handleTracking = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_RECEIPT', payload: item.trackingId })
        navigation.navigate('OrderDelivery')
    }
    return (
        <View style={[styles.container, styles.pt_2]}>
            {reduxSent && reduxSent.length && !complain ?
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
                        if (!item.complain) {
                            return (
                                <View style={Os.card} >
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
                                    <TouchableOpacity style={[styles.row_between_center, styles.mt_5, styles.px_2]} onPress={() => handleTracking(item)}>
                                        <View style={[styles.row, { width: Wp('50%') }]}>
                                            <Image style={{ width: 19, height: 19, tintColor: colors.YellowJaja, marginRight: '2%' }} source={require('../../assets/icons/google-maps.png')} />
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.YellowJaja }]}>Paket telah dikirim</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={[styles.row_between_center, styles.mt_5, styles.px_2]}>
                                        <View style={[styles.row, { width: Wp('40%') }]}>

                                        </View>
                                        <>
                                            <Button onPress={() => handleTracking(item)} color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('25%') }} style={{ width: Wp('25%'), alignSelf: 'flex-end' }} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} uppercase={false} >
                                                Lacak
                                            </Button>
                                            <Button onPress={() => handleOrderDetails(item)} color={colors.BlueJaja} mode="contained" contentStyle={{ width: Wp('25%') }} style={{ width: Wp('25%'), alignSelf: 'flex-end', marginRight: '2%' }} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} uppercase={false} >
                                                Rician
                                            </Button>
                                        </>
                                    </View>
                                    {/* </TouchableOpacity> */}
                                </View>
                            )
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
                    <DefaultNotFound textHead="Ups.." textBody="Tampaknya pesanan kamu masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
                </ScrollView>
            }
        </View>
    )
}