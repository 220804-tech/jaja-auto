import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, RefreshControl, FlatList, StyleSheet, ToastAndroid, ScrollView, Alert } from 'react-native'
import { DataTable, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { styles as style, colors, useFocusEffect, Loading, CheckSignal, Appbar, Utils } from '../../export'

export default function OrderDeliveryScreen() {
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch()
    const reduxTracking = useSelector(state => state.order.tracking)
    const reduxReceipt = useSelector(state => state.order.receipt)
    console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 13 ~ OrderDeliveryScreen ~ reduxReceipt", reduxReceipt)
    const reduxInvoice = useSelector(state => state.order.invoice)
    console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 15 ~ OrderDeliveryScreen ~ reduxInvoice", reduxInvoice)
    const reduxAuth = useSelector(state => state.auth.auth)



    useEffect(() => {
        setLoading(true)
        getItem()
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(false);
        checkNetwork()
        getItem()
    }, []);

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=croc9bj799b291gjd0oqd06b3vr2ehm8");
        var raw = "";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(`https://jaja.id/backend/order/${reduxInvoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_TRACKING', payload: result.data.tracking })
                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 12015")
                }
                setLoading(false)
            })
            .catch(error => Utils.handleError(error, "Error with status code : 12016"));
    }

    useFocusEffect(
        useCallback(() => {
            checkNetwork()
        }, []),
    );

    const checkNetwork = () => {
        try {
            setTimeout(() => {
                CheckSignal().then(resp => {
                    handleLoopSignal(resp)
                    if (resp.connect === false) {
                        setTimeout(() => {
                            CheckSignal().then(respo => {
                                handleLoopSignal(respo)
                            })
                        }, 8000);
                    }
                })
            }, 4000);
        } catch (error) {
            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }


    const handleLoopSignal = (signal) => {
        if (signal.connect) {
            getItem();
        } else {
            ToastAndroid.show("Periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }


    return (
        <SafeAreaView style={style.container}>
            {loading ? <Loading /> : null}
            <Appbar back={true} title="Dalam Pengiriman" />
            <ScrollView style={style.column}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>No. Resi</DataTable.Title>
                        <DataTable.Title numeric>{reduxReceipt ? reduxReceipt : ""}</DataTable.Title>
                    </DataTable.Header>

                    {reduxTracking && reduxTracking.length ?
                        <FlatList
                            data={reduxTracking}
                            renderItem={({ item, index }) => (
                                <>
                                    <View style={{ felx: 1, flexDirection: 'row', width: '100%' }}>
                                        <View style={[style.column, { paddingVertical: '3%', paddingHorizontal: '2%', width: '25%' }]}>
                                            <Text style={styles.textDate}>{item.time}</Text>
                                            <Text style={styles.textDate}>{item.date}</Text>
                                        </View>
                                        <View style={{ felx: 1, flexDirection: 'row', paddingVertical: '3%', width: '75%', height: '100%', paddingHorizontal: '2%', }}>
                                            <Text numberOfLines={2} style={[styles.textInfo, { color: index === 0 ? colors.BlueJaja : colors.BlackGrayScale }]}>{item.description}</Text>
                                        </View>
                                    </View>
                                    <Divider />
                                </>
                            )}
                        /> : null}
                </DataTable>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textDate: {
        color: colors.BlackGrayScale,
        fontSize: 11,
        textAlign: 'center'
    },
    textInfo: {
        fontSize: 13,
        color: colors.BlackGrayScale
    }

})
