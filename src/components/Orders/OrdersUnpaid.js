import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, ToastAndroid } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os, DefaultNotFound } from '../../export';
import { Button } from 'react-native-paper'
import EncryptedStorage from 'react-native-encrypted-storage';

import { useSelector, useDispatch } from 'react-redux'
export default function OrdersUnpaid() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxAuth = useSelector(state => state.auth.auth)

    const reduxUnpaid = useSelector(state => state.order.unPaid)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);


    const getItem = () => {
        ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
            if (resUnpaid) {
                dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
            } else {
                console.log("🚀 ~ file: OrdersUnpaid.js ~ line 38 ~ ServiceOrder.getUnpaid ~ resUnpaid", resUnpaid)
                handleUnpaid()
            }
        }).catch(err => {
            console.log("🚀 ~ file: OrdersUnpaid.js ~ line 54 ~ ServiceOrder.getUnpaid ~ err", err)
            ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            handleUnpaid()
        })
    }

    const handleUnpaid = () => {
        EncryptedStorage.getItem('unpaid').then(store => {
            if (store) {
                dispatch({ type: 'SET_UNPAID', payload: JSON.parse(store) })
            }
        })
    }

    const handleOrderDetails = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_ORDER_STATUS', payload: 'Menunggu Pembayaran' })
        navigation.navigate('OrderDetails', { data: item.invoice, status: 'Menunggu Pembayaran' })

    }

    return (
        <View style={[styles.container, styles.pt_2]}>
            {reduxUnpaid && reduxUnpaid.length ?
                <FlatList
                    data={reduxUnpaid}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    keyExtractor={item => item.orderId}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={[Os.card, styles.px_2, styles.pt]} onPress={() => handleOrderDetails(item)}>
                                {item.items.map((child, indx) => {
                                    return (
                                        <View key={String(indx) + "X"} style={styles.my_2}>
                                            <View style={[styles.row_between_center, styles.px_2, styles.pb_2, styles.mb_3, { width: '100%', borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                                <View style={[styles.row_start_center, { width: '45%' }]}>
                                                    <Image style={{ width: Wp('8%'), height: Wp('8%'), borderRadius: 100, marginRight: '5%', resizeMode: 'contain' }} source={{ uri: child.store.image }} />
                                                    <Text numberOfLines={1} style={[styles.font_12, {}]}>{child.store.name}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.row, styles.mb, styles.px_2, { width: '100%' }]}>
                                                <Image style={Os.image}
                                                    resizeMethod={"scale"}
                                                    resizeMode="cover"
                                                    source={{ uri: child.products[0].image }}
                                                />
                                                <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                                    <View style={[styles.column, { width: '100%' }]}>
                                                        <Text numberOfLines={1} style={styles.font_14}>{child.products[0].name}</Text>
                                                        {child.totalOtherProduct ? <Text style={styles.font_10}>({child.totalOtherProduct} produk lainnya)</Text> : null}
                                                    </View>
                                                    <View style={[styles.row_between_center, { width: '100%' }]}>
                                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{child.products[0].subTotalCurrencyFormat}</Text>
                                                        <TouchableOpacity style={[styles.px_3, styles.py_2, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                                {/* <FlatList
                                data={item.items}

                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={styles.mb}>
                                            <View style={[styles.row_between_center, styles.px_2, styles.mb_3, { width: '100%' }]}>
                                                <View style={[styles.row_start_center, { width: '45%' }]}>
                                                    <Image style={{ width: Wp('8%'), height: Wp('8%'), borderRadius: 100, marginRight: '5%' }} source={{ uri: item.store.image }} />
                                                    <Text numberOfLines={1} style={[styles.font_12, {}]}>{item.store.name}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.row, styles.mb, styles.px_2, { width: '100%' }]}>
                                                <Image style={Os.image}
                                                    resizeMethod={"scale"}
                                                    resizeMode="cover"
                                                    source={{ uri: item.products[0].image }}
                                                />
                                                <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                                    <View style={[styles.column, { width: '100%' }]}>
                                                        <Text numberOfLines={1} style={styles.font_14}>{item.products[0].name}</Text>
                                                        {item.totalOtherProduct ? <Text style={styles.font_10}>({item.totalOtherProduct} produk lainnya)</Text> : null}
                                                    </View>
                                                    <View style={[styles.row_between_center, { width: '100%' }]}>
                                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.subTotalCurrencyFormat}</Text>
                                                        <TouchableOpacity style={[styles.px_3, styles.py_2, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }}
                            /> */}
                                <View style={[styles.row_between_center, styles.mt_5]}>
                                    <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '3%' }}>
                                        <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Subtotal :</Text>
                                        <Text numberOfLines={1} style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}>{item.totalPriceCurrencyFormat}</Text>
                                    </View>
                                    <Button onPress={() => {
                                        dispatch({ type: 'SET_ORDERID', payload: item.orderId })
                                        navigation.navigate('Midtrans')
                                    }} color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('40%') }} style={{ width: Wp('40%'), alignSelf: 'flex-end' }} labelStyle={{ color: colors.White, fontSize: 14 }} uppercase={false}>
                                        Bayar Sekarang
                                    </Button>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
                : <DefaultNotFound textHead="Ups.." textBody="Tampaknya pesanan kamu masih kosong" ilustration={require('../../assets/ilustrations/empty.png')} />
            }
        </View>
    )
}