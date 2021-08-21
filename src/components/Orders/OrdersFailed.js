import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, RefreshControl, ToastAndroid } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os, DefaultNotFound } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function OrdersFailed() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxFailed = useSelector(state => state.order.failed)
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
        ServiceOrder.getFailed(reduxAuth).then(resUnpaid => {
            if (resUnpaid) {
                dispatch({ type: 'SET_FAILED', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
            } else {
                handleFailed()
            }
        }).catch(err => {
            ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            handleFailed()
        })
    }

    const handleFailed = () => {
        EncryptedStorage.getItem('failed').then(store => {
            if (store) {
                dispatch({ type: 'SET_FAILED', payload: JSON.parse(store) })
            }
        })
    }
    const handleOrderDetails = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_ORDER_STATUS', payload: "Pesanan Dibatalkan" })
        navigation.navigate('OrderDetails', { data: item.invoice, status: "Pesanan Dibatalkan" })
    }
    return (
        <View style={[styles.container, styles.pt_2]}>
            {reduxFailed && reduxFailed.length ?
                <FlatList
                    data={reduxFailed}
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
                                    {item.store && Object.keys(item.store).length ?
                                        <View style={[styles.row_start_center, { width: '45%' }]}>
                                            <Image style={{ width: Wp('8%'), height: Wp('8%'), borderRadius: 100, marginRight: '5%', resizeMode: 'contain' }} source={{ uri: item.store.image ? item.store.image : null }} />
                                            <Text numberOfLines={1} style={[styles.font_12]}>{item.store.name}</Text>
                                        </View>
                                        : null}
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
                    }}
                /> :
                <DefaultNotFound textHead="Ups.." textBody="Tampaknya pesanan kamu masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
            }
        </View>
    )
}