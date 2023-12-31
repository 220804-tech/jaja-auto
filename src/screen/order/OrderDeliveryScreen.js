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
    console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 12 ~ OrderDeliveryScreen ~ reduxTracking", reduxTracking.manifest)
    const reduxReceipt = useSelector(state => state.order.receipt)
    const reduxInvoice = useSelector(state => state.order.invoice)
    const reduxAuth = useSelector(state => state.auth.auth)



    useEffect(() => {
        setLoading(true)
        getWaybill()
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // checkNetwork()
        getWaybill()
    }, []);

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=croc9bj799b291gjd0oqd06b3vr2ehm8");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://jaja.id/backend/order/${reduxInvoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 43 ~ getItem ~ result", result)
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_TRACKING', payload: result.data.tracking })
                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 12015")
                }
                setLoading(false)
            })
            .catch(error => Utils.handleError(error.message, "Error with status code : 12016"));
    }

    const getWaybill = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://elibx.jaja.id/jaja/user/order-tracking?courier=${reduxReceipt?.codeKurir ? reduxReceipt.codeKurir : ''}&waybill=${reduxReceipt?.resi ? reduxReceipt.resi : ''}`, requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result.status.code == 200) {
                        console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 62 ~ getWaybill ~ result", result.status)
                        if (reduxReceipt.codeKurir == 'rajacepat') {
                            dispatch({ type: 'SET_TRACKING', payload: result.status?.data })
                        } else {
                            dispatch({ type: 'SET_TRACKING', payload: result.status.data?.rajaongkir?.result })
                        }
                    }
                    setLoading(false)
                    setRefreshing(false)

                } catch (error) {
                    Utils.alertPopUp(error?.message + JSON.stringify(res))
                    setLoading(false)
                    setRefreshing(false)
                    console.log(error.message)

                }
            })
            .catch(error => {
                console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 85 ~ getWaybill ~ error", error.message)
                setLoading(false)
                setRefreshing(false)
            });
    }

    useFocusEffect(
        useCallback(() => {
            // checkNetwork()
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
            console.log(error.message)

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
                        <DataTable.Title numeric>{reduxReceipt?.resi ? reduxReceipt.resi : ""}</DataTable.Title>
                    </DataTable.Header>

                    {reduxTracking ?
                        <FlatList
                            data={reduxReceipt?.codeKurir == 'rajacepat' ? reduxTracking.awb : reduxTracking.manifest}
                            renderItem={({ item, index }) => {
                                console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 145 ~ OrderDeliveryScreen ~ index", index)
                                console.log("🚀 ~ file: OrderDeliveryScreen.js ~ line 144 ~ OrderDeliveryScreen ~ item", item)
                                return (
                                    <>
                                        {reduxReceipt.codeKurir == 'rajacepat' ?
                                            <View style={{ felx: 1, flexDirection: 'row', width: '100%' }}>
                                                <View style={[style.column, { paddingVertical: '3%', paddingHorizontal: '2%', width: '25%' }]}>
                                                    <Text style={styles.textDate}>{String(item.tanggal).slice(11, 16)}</Text>
                                                    <Text style={styles.textDate}>{String(item.tanggal).slice(0, 10)}</Text>
                                                </View>
                                                <View style={{ felx: 1, flexDirection: 'row', paddingVertical: '3%', width: '75%', height: '100%', paddingHorizontal: '2%', }}>
                                                    <Text numberOfLines={2} style={[styles.textInfo, { color: index === 0 ? colors.BlueJaja : colors.BlackGrayScale }]}>{item.status + "\nKota " + item.kota}</Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={{ flex: 1, flexDirection: 'row', width: '100%', marginLeft: '1%' }}>
                                                <View style={[style.column, { paddingVertical: '3%', paddingHorizontal: '2%', width: '25%' }]}>
                                                    <Text numberOfLines={2} style={[styles.textInfo, { color: index == 0 ? colors.BlueJaja : colors.BlackGrayScale }]}>Pesanan {item.manifest_description}</Text>
                                                </View>

                                                <View style={{ felx: 1, flexDirection: 'row', paddingVertical: '3%', width: '75%', height: '100%', paddingHorizontal: '2%', }}>
                                                    {index == 0 && reduxTracking?.delivery_status?.status == 'DELIVERED' ?
                                                        <Text numberOfLines={2} style={[styles.textInfo, { color: colors.BlueJaja }]}>{'Paket di terima oleh'} {index == 0 ? reduxTracking.delivery_status.pod_receiver : ''}</Text>
                                                        :
                                                        <>
                                                            <Text numberOfLines={2} style={[styles.textInfo, { color: index == 0 ? colors.BlueJaja : colors.BlackGrayScale }]}>{item.city_name}</Text>
                                                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginRight: '3%' }}>
                                                                <Text style={styles.textDate}>{item.manifest_time + "\n" + item.manifest_date}</Text>
                                                            </View>
                                                        </>
                                                    }
                                                </View>

                                            </View>
                                        }
                                        <Divider />
                                    </>

                                )
                            }
                            }
                        /> : null}
                </DataTable>
            </ScrollView>
        </SafeAreaView >
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
