import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, ToastAndroid } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Button } from 'react-native-paper'

export default function OrdersUnpaid() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxCompleted = useSelector(state => state.order.completed)
    const [refreshing, setRefreshing] = useState(false);
    const [auth, setAuth] = useState("")
    const reduxAuth = useSelector(state => state.auth.auth)

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.parse(res))
            } else {
                navigation.navigate('Login')
            }
        }).catch(err => {
            ToastAndroid.show(String(err) + 23, ToastAndroid.LONG, ToastAndroid.CENTER)
        })
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);


    const getItem = () => {
        ServiceOrder.getCompleted(reduxAuth).then(resUnpaid => {
            if (resUnpaid) {
                dispatch({ type: 'SET_COMPLETED', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
            } else {
                handleCompleted()
            }
        }).catch(err => {
            ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            handleCompleted()
        })
    }

    const handleCompleted = () => {
        EncryptedStorage.getItem('completed').then(store => {
            if (store) {
                dispatch({ type: 'SET_COMPLETED', payload: JSON.parse(store) })
            }
        })
    }
    const handleOrderDetails = (item) => {
        navigation.navigate('OrderDetails', { data: item.invoice, status: "Pesanan Selesai" })
    }


    return (
        <View style={[styles.container, styles.pt_2]}>
            <FlatList
                data={reduxCompleted}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                keyExtractor={item => item.invoice}

                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={Os.card} onPress={() => handleOrderDetails(item)}>
                            <View style={[styles.row_between_center, styles.px_2, styles.mb_3, { width: '100%' }]}>
                                <View style={[styles.row_start_center, { width: '45%' }]}>
                                    <Image style={{ width: Wp('8%'), height: Wp('8%'), borderRadius: 100, marginRight: '5%' }} source={{ uri: item.store.image }} />
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
                                    source={{ uri: item.products[0].image }}
                                />
                                <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                    <View style={[styles.column, { width: '100%' }]}>
                                        <Text numberOfLines={1} style={styles.font_14}>{item.products[0].name}</Text>
                                        {item.totalOtherProduct ? <Text style={styles.font_10}>({item.totalOtherProduct} produk lainnya)</Text> : null}
                                    </View>
                                    <View style={[styles.row_between_center, { width: '100%' }]}>
                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.totalPriceCurrencyFormat}</Text>
                                        <Button icon="star" color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('35%') }} style={{ width: Wp('35%'), alignSelf: 'flex-end' }} labelStyle={{ color: colors.White, fontSize: 12 }} uppercase={false} >
                                            Beri Nilai
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}