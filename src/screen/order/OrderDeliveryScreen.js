import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, RefreshControl, FlatList, StyleSheet, ToastAndroid, ScrollView } from 'react-native'
import { DataTable, Divider } from 'react-native-paper';
import { styles as style, colors, useNavigation, useFocusEffect, Loading, CheckSignal, Appbar } from '../../export'
export default function OrderDeliveryScreen(props) {
    const navigation = useNavigation();
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const [invoice, setinvoice] = useState("IDS004971017968")

    const [delivery, setdelivery] = useState([
        { date: '10 Mei', time: "10.30", status: "Paket anda telah diterima oleh jasa kurir" },
        { date: '11 Mei', time: "17.44", status: "Paket dikirim ke Bekasi Center" },
        { date: '12 Mei', time: "11.01", status: "Paket telah sampai di Gudang Tarumajaya" },
        { date: '13 Mei', time: "13.00", status: "Paket anda akan dikirim hari ini" },


    ])
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
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://jaja.id/core/seller/penjualan/track/${invoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: Lacak.js ~ line 42 ~ getItem ~ result", result)
                setdata(result.data.manifest)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
            });
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
                        <DataTable.Title numeric>{invoice}</DataTable.Title>
                    </DataTable.Header>

                    <FlatList
                        data={delivery}
                        renderItem={({ item, index }) => (
                            <>
                                <View style={{ felx: 1, flexDirection: 'row', width: '100%' }}>
                                    <View style={[style.column, { paddingVertical: '3%', paddingHorizontal: '2%', width: '25%' }]}>
                                        <Text style={styles.textDate}>{item.time}</Text>
                                        <Text style={styles.textDate}>{item.date}</Text>
                                    </View>
                                    <View style={{ felx: 1, flexDirection: 'row', paddingVertical: '3%', width: '75%', height: '100%', paddingHorizontal: '2%', }}>
                                        <Text numberOfLines={2} style={[styles.textInfo, { color: index === 0 ? colors.BlueJaja : colors.BlackGrayScale }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <Divider />
                            </>
                        )}
                    />
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
