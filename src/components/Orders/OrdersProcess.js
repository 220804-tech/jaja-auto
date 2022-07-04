import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, Image, RefreshControl, ToastAndroid, ScrollView, TouchableOpacity } from 'react-native'
import { colors, styles, Wp, ServiceOrder, useNavigation, Os, DefaultNotFound, FastImage } from '../../export';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';

export default function OrdersProcess() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxWaitConfirm = useSelector(state => state.order.waitConfirm)
    // 
    const reduxProcess = useSelector(state => state.order.process)

    const reduxAuth = useSelector(state => state.auth.auth)

    const [refreshing, setRefreshing] = useState(false);
    const [status, setstatus] = useState("Menunggu konfirmasi")

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 2500);
    }, []);


    const getItem = () => {
        ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
            if (reswaitConfirm && Object.keys(reswaitConfirm).length) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: reswaitConfirm.filters })
                setTimeout(() => ToastAndroid.show("Data berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 500);
            } else {
                handleWaitConfirm()
            }
        }).catch(err => {
            handleWaitConfirm()
        })

        ServiceOrder.getProcess(reduxAuth).then(resProcess => {
            if (resProcess && Object.keys(resProcess).length) {
                dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resProcess.filters })
            } else {
                handleProcess()
            }
        }).catch(err => {
            ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            handleProcess()
        })
    }

    const handleWaitConfirm = () => {
        EncryptedStorage.getItem('waitConfirm').then(store => {
            if (store) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: JSON.parse(store) })
            }
        })
    }
    const handleProcess = () => {
        EncryptedStorage.getItem('process').then(store => {
            if (store) {
                dispatch({ type: 'SET_PROCESS', payload: JSON.parse(store) })
            }
        })
    }
    const handleOrderDetails = (item, name) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_ORDER_STATUS', payload: name })
        navigation.navigate('OrderDetails', { data: item.invoice, status: name })
    }
    return (
        <View style={styles.container}>
            <View style={[styles.row_between_center, styles.mb_2]}>
                <TouchableOpacity onPress={() => setstatus("Menunggu konfirmasi")} style={[Os.buttonStatus, { borderRightWidth: 0.5, borderRightColor: colors.BlackGrey, backgroundColor: status === "Menunggu konfirmasi" ? colors.BlueJaja : colors.White }]}>
                    <Text style={[styles.font_12, { color: status === "Menunggu konfirmasi" ? colors.White : colors.BlackGrayScale }]}>Menunggu konfirmasi</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setstatus("Sedang disiapkan")} style={[Os.buttonStatus, { backgroundColor: status === "Sedang disiapkan" ? colors.BlueJaja : colors.White }]}>
                    <Text style={[styles.font_12, { color: status === "Sedang disiapkan" ? colors.White : colors.BlackGrayScale }]}>Sedang disiapkan</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                {status === "Sedang disiapkan" ?
                    reduxProcess && reduxProcess.length ?
                        <FlatList
                            data={reduxProcess}

                            keyExtractor={item => item.invoice}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={Os.card} onPress={() => handleOrderDetails(item, "Sedang Disiapkan")}>
                                        <View style={[styles.row_between_center, styles.px_2, styles.mb_3, { width: '100%' }]}>
                                            <View style={[styles.row_start_center, { width: '45%' }]}>
                                                <FastImage
                                                    style={Os.imageStore}
                                                    source={{ uri: item?.store?.image ? item.store.image : null }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                                <Text numberOfLines={1} style={[styles.font_12, {}]}>{item.store.name}</Text>
                                            </View>
                                            <View style={[styles.row_end_center, { width: '40%', }]}>
                                                <Text style={[styles.font_12, { color: colors.BlueJaja }]}>No. {item.invoice}</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.row, styles.mb, styles.px_2, { width: '100%' }]}>
                                            <FastImage
                                                style={Os.imageProduct}
                                                source={{ uri: item.products[0].image ? item.products[0].image : null }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                                <View style={[styles.column, { width: '100%' }]}>
                                                    <Text numberOfLines={1} style={styles.font_14}>{item.products[0].name}</Text>
                                                    {item.totalOtherProduct ? <Text style={styles.font_10}>({item.totalOtherProduct} produk lainnya)</Text> : null}
                                                </View>
                                                <View style={[styles.row_between_center, { width: '100%' }]}>
                                                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.totalPriceCurrencyFormat}</Text>
                                                    <TouchableOpacity style={[styles.px_3, styles.py_2, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                                        {/* <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Rincian Pesanan </Text> */}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        : <DefaultNotFound textHead="Ups.." textBody="Tampaknya pesanan kamu masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
                    : reduxWaitConfirm && reduxWaitConfirm.length ?
                        <FlatList
                            data={reduxWaitConfirm}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            keyExtractor={item => item.invoice}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={Os.card} onPress={() => handleOrderDetails(item, "Menunggu Konfirmasi")}>
                                        <View style={[styles.row_between_center, styles.px_2, styles.mb_3, { width: '100%' }]}>
                                            <View style={[styles.row_start_center, { width: '45%' }]}>
                                                <FastImage
                                                    style={Os.imageStore}
                                                    source={{ uri: item?.store?.image ? item.store.image : null }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                                <Text numberOfLines={1} style={[styles.font_12, {}]}>{item.store.name}</Text>
                                            </View>
                                            <View style={[styles.row_end_center, { width: '40%', }]}>
                                                <Text style={[styles.font_12, { color: colors.BlueJaja }]}>No. {item.invoice}</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.row, styles.mb, styles.px_2, { width: '100%' }]}>
                                            <FastImage
                                                style={Os.imageProduct}
                                                source={{ uri: item.products[0].image ? item.products[0].image : null }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            <View style={[styles.column_between_center, styles.px_2, { alignItems: 'flex-start', height: Wp('17%'), width: '83%' }]}>
                                                <View style={[styles.column, { width: '100%' }]}>
                                                    <Text numberOfLines={1} style={styles.font_14}>{item.products[0].name}</Text>
                                                    {item.totalOtherProduct ? <Text style={styles.font_10}>({item.totalOtherProduct} produk lainnya)</Text> : null}
                                                </View>
                                                <View style={[styles.row_between_center, { width: '100%' }]}>
                                                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.totalPriceCurrencyFormat}</Text>
                                                    <TouchableOpacity style={[styles.px_3, styles.py_2, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                                        {/* <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Rincian Pesanan </Text> */}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        : <DefaultNotFound textHead="Ups.." textBody="Tampaknya pesanan kamu masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
                }
            </ScrollView>
        </View>
    )
}
