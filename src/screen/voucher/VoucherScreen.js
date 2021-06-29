import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, Appbar, Wp, colors, Loading, useNavigation } from '../../export'

export default function VoucherScreen() {
    const [vouchers, setVouchers] = useState([])
    const [loading, setLoading] = useState(false);
    const reduxAuth = useSelector(state => state.auth.auth)
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch()
    useEffect(() => {
        setLoading(false)
        getItem()
    }, [])

    const getItem = () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=keor4a23m53ul7lnlafdhdtoshr7cd1v");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/voucher", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    // let newArr = result.data.filter(data => data.from === "jaja")
                    setVouchers(result.data)
                } else {
                    ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.CENTER)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            })
            .catch(error => {
                setTimeout(() => {
                    setLoading(false)
                }, 500);
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Gagal memuat, periksa kembali koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 14001",
                        String(error),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            });
    }
    const handleClaimVoucher = (voucherId, index) => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "voucherId": voucherId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/voucher/claimVoucherJaja", requestOptions)
            .then(response => response.json())
            .then(result => {
                setTimeout(() => setLoading(false), 500);
                if (result.status.code === 200) {
                    getItem()
                } else {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Klaim voucher : " + result.status.message + " " + result.status.code,
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }, 100);
                }
            })
            .catch(error => {
                setLoading(false)
                setTimeout(() => {
                    Alert.alert(
                        "Jaja.id",
                        String("Klaim voucher : " + error),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }, 100);
            });
    }
    const handleVoucher = (val, index) => {
        if (val.isClaimed) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=A&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                    dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                    dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                    dispatch({ type: 'SET_KEYWORD', payload: text })
                })
                .catch(error => {
                    CheckSignal().then(res => {
                        if (res.connect == false) {
                            ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                        } else {
                            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    })
                });
            navigation.navigate('ProductSearch')

        } else {
            handleClaimVoucher(val.id, index)
        }
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.White }]}>
            <Appbar back={true} title="Voucher" />
            {loading ? <Loading /> : null}
            {vouchers && vouchers.length ?
                <ScrollView>
                    <View style={[styles.row_start_center, styles.px_3, styles.mt_3, styles.mb]}>
                        <Image source={require('../../assets/icons/coupon.png')} style={[styles.icon_21, styles.mr_2, { tintColor: colors.BlueJaja }]} />
                        <Text style={[styles.font_16, { color: colors.BlueJaja, fontWeight: 'bold' }]}>Voucher Jaja Untukmu</Text>
                    </View>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        } showsVerticalScrollIndicator={false}
                        style={styles.pt_3}
                        contentContainerStyle={styles.pb_5}
                        data={vouchers}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={[styles.row_center, styles.mb_3]}>
                                    <View style={[styles.row, { width: '95%', height: Wp('27%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                                        <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.BlueJaja, flexDirection: 'column', justifyContent: 'center' }}>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                            <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                        </View>
                                        <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.BlueJaja }]}>
                                            <Text style={[styles.font_14, styles.mb_2, { color: colors.White, fontWeight: 'bold', alignSelf: 'center' }]}>{item.name}</Text>
                                        </View>
                                        <View style={[styles.column_center, styles.px_2, { width: '33%' }]}>
                                            <Text numberOfLines={3} style={[styles.font_14, styles.mb_2, { color: colors.BlueJaja, fontWeight: 'bold', width: '100%' }]}>Diskon {item.discountText}</Text>
                                            <Text style={[styles.font_8, { position: 'absolute', bottom: 5, color: colors.BlueJaja, fontWeight: 'bold', width: '100%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                        </View>
                                        <View style={[styles.column_center, { width: '33%' }]}>
                                            <TouchableOpacity onPress={() => handleVoucher(item, index)} style={{ width: '50%', height: '35%', backgroundColor: item.isClaimed ? colors.White : colors.BlueJaja, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.BlueJaja, borderRadius: 5 }}>
                                                <Text style={[styles.font_14, { color: item.isClaimed ? colors.BlueJaja : colors.White }]}>{item.isClaimed ? item.isSelected ? "Terpakai" : "Pakai" : "Klaim"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />

                </ScrollView>
                : <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center' }]}>Sepertinya belum ada voucher</Text>
            }
        </SafeAreaView >
    )
}
