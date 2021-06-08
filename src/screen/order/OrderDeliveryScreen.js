import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, RefreshControl, FlatList, StyleSheet, ToastAndroid, ScrollView, Alert } from 'react-native'
import { DataTable, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { styles as style, colors, useNavigation, useFocusEffect, Loading, CheckSignal, Appbar } from '../../export'

export default function OrderDeliveryScreen(props) {
    const navigation = useNavigation();
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch()
    const reduxTracking = useSelector(state => state.order.tracking)
    const reduxReceipt = useSelector(state => state.order.receipt)
    const reduxInvoice = useSelector(state => state.order.invoice)
    const reduxAuth = useSelector(state => state.auth.auth)



    useEffect(() => {
        setLoading(true)
        getItem()
    }, [props])

    const onRefresh = useCallback(() => {
        setRefreshing(false);
        checkNetwork()
        // if (invoice) {
        getItem()
        // } else {
        //     navigation.goBack()
        //     setTimeout(() => ToastAndroid.show('Ada kesalahan teknis.', ToastAndroid.LONG, ToastAndroid.CENTER), 300);
        // }
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
                    console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 45 ~ getItem ~ result.status.code", result.data.tracking)
                } else {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message + " " + result.status.code,
                            [
                                {
                                    text: "TUTUP",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                }
                            ]
                        )
                    }, 500);
                }
                setLoading(false)
            })
            .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
    }

    useFocusEffect(
        useCallback(() => {
            checkNetwork()
        }, []),
    );

    const checkNetwork = () => {
        try {
            CheckSignal().then(res => {
                handleLoopSignal(res);
                if (res.connect === false) {
                    CheckSignal().then(resp => {
                        setTimeout(() => handleLoopSignal(resp), 4000);
                        if (resp.connect === false) {
                            CheckSignal().then(respo => {
                                setTimeout(() => handleLoopSignal(respo), 8000);
                            })
                        }
                    })

                }
            })
        } catch (error) {
            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }


    const handleLoopSignal = (signal) => {
        if (signal.connect === false) {
            ToastAndroid.show("Periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            getItem();
        }
        return signal.connect
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
