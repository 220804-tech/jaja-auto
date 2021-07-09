import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid, Alert } from 'react-native'
import { Appbar, colors, styles, Wp, Hp, useNavigation, useFocusEffect, Loading } from '../../export'
import Clipboard from '@react-native-community/clipboard';
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'react-native-paper'
export default function OrderDetailsScreen(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState(null)

    const reduxCheckout = useSelector(state => state.checkout.checkout)
    const reduxAuth = useSelector(state => state.auth.auth)

    const { status } = props.route.params;

    useEffect(() => {
        // getItem();
    }, [])

    useFocusEffect(
        useCallback(() => {
            getItem()
        }, []),
    );

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
        fetch(`https://jaja.id/backend/order/${props.route.params.data}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    setDetails(result.data)
                } else {
                    Alert.alert(
                        "Sepertinya ada masalah!",
                        String(result.status.message + " => " + result.status.code),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                    ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
                } else {
                    Alert.alert(
                        "Error",
                        String(error),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                        ]
                    );
                }
            });
    }

    const handlePayment = () => {
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 57 ~ handlePayment ~ details.orderId", details.orderId)
        dispatch({ type: 'SET_ORDERID', payload: details.orderId })
        navigation.navigate("Midtrans")
    }


    const handleTracking = () => {
        navigation.navigate('OrderDelivery')
    }
    const handleDone = () => {
        Alert.alert(
            "Terima Pesanan",
            "Anda akan menerima pesanan?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        setLoading(true)
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", reduxAuth);
                        myHeaders.append("Cookie", "ci_session=7vgloal55kn733tsqch0v7lh1tfrcilq");

                        var formdata = new FormData();
                        formdata.append("invoice", details.items[0].invoice);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formdata,
                            redirect: 'follow'
                        };

                        fetch("https://jaja.id/backend/order/pesananDiterima", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.status.code === 200) {
                                    navigation.goBack()
                                } else {
                                    Alert.alert(
                                        "Sepertinya ada masalah!",
                                        String(result.status.message + " => " + result.status.code),
                                        [
                                            { text: "OK", onPress: () => console.log("OK Pressed") }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                                setTimeout(() => {
                                    setLoading(false)
                                }, 500);
                            })
                            .catch(error => {
                                setLoading(false)
                                if (String(error).slice(11, String(error).length).replace(" ", "") === "Network request failed") {
                                    ToastAndroid("Tidak dapat hahaha, periksa kembali koneksi anda!")
                                } else {
                                    Alert.alert(
                                        "Error",
                                        String(error),
                                        [
                                            {
                                                text: "TUTUP",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                        ]
                                    );
                                }
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar title="Detail Pesanan" back={true} />
            {loading ? <Loading /> : null}
            <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'column', paddingBottom: Hp('7%') }}>
                <View style={[styles.column, styles.p_3, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row_between_center, { marginBottom: props.route.params.status !== "Menunggu Pembayaran" ? '4%' : "0%" }]}>
                        <View style={[styles.row]}>
                            <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/process.png')} />
                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}> Status Pesanan</Text>
                        </View>
                        <View style={[styles.px, styles.px_3, { backgroundColor: colors.YellowJaja, borderRadius: 3 }]}>
                            <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>{status}</Text>
                        </View>
                    </View>
                    {props.route.params.status !== "Menunggu Pembayaran" ?
                        details ?
                            <View style={styles.row_between_center}>
                                <View style={[styles.row]}>
                                    <Text style={[styles.font_13]}>#{details.items[0].invoice}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    Linking.canOpenURL(details.downloadOrderPdf).then(supported => {
                                        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 82 ~ Linking.canOpenURL ~ supported", supported)
                                        if (supported) {
                                            Linking.openURL(details.downloadOrderPdf)
                                        } else {
                                            ToastAndroid.show("Sepertinya ada masalah, coba lagi nanti.", ToastAndroid.LONG, ToastAndroid.TOP)

                                        }
                                    })
                                }}
                                    onLongPress={() => {
                                        Clipboard.setString(details.downloadOrderPdf)
                                        ToastAndroid.show("salin to clipboard", ToastAndroid.LONG, ToastAndroid.TOP)
                                    }}
                                    style={[styles.p, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlueJaja }]}>DOWNLOAD INVOICE</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        : null
                    }
                </View>
                {details ?
                    <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                        <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                            <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
                        </View>
                        <View style={[styles.column, styles.p_3]}>
                            <View style={styles.row_between_center}>
                                <Text numberOfLines={1} style={[styles.font_13, { width: '70%' }]}>{details.address.receiverName}</Text>
                            </View>
                            <Text numberOfLines={1} style={[styles.font_13]}>{details.address.phoneNumber}</Text>

                            <Text numberOfLines={3} style={[styles.font_12, styles.mt_2]}>{details.address.address.replace(/<br>/g, "")}</Text>
                        </View>
                    </View> : null}
                {details && details.items.length ?
                    details.items.map((item, idxStore) => {
                        return (
                            <View key={String(idxStore)} style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                    <Image style={[styles.icon_19, { marginRight: '2%' }]} source={require('../../assets/icons/store.png')} />
                                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.store.name}</Text>
                                </View>
                                {item.products.map((child, idx) => {
                                    return (
                                        <View key={String(idx) + "s"} style={[styles.column, styles.py_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                            <View style={[styles.row_start_center, styles.p_2, { width: '100%', height: Wp('25%') }]}>
                                                <Image style={{ width: Wp('18%'), height: '90%', borderRadius: 5, backgroundColor: colors.BlackGrey }}
                                                    resizeMethod={"scale"}
                                                    resizeMode="cover"
                                                    source={{ uri: child.image }}
                                                />
                                                <View style={[styles.column_between_center, { alignItems: 'flex-start', height: '90%', width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                                    <View style={[styles.column, { width: '100%' }]}>
                                                        <Text numberOfLines={1} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>{child.name}</Text>
                                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale }]}>{child.variant ? child.variant : ""}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end', paddingHorizontal: '2%' }}>
                                                        {child.isDiscount ?
                                                            <>
                                                                <Text numberOfLines={1} style={[styles.priceBefore, { fontStyle: 'italic' }]}>{child.priceCurrencyFormat}</Text>
                                                                <View style={styles.row}>
                                                                    <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                    <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {child.priceDiscountCurrencyFormat}</Text>
                                                                </View>
                                                            </>
                                                            :
                                                            <View style={styles.row}>
                                                                <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {child.priceCurrencyFormat}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.row_end_center, styles.px_2]}>
                                                {/* <Text style={[styles.font_14, { fontStyle: 'italic' }]}>Subtotal </Text> */}
                                                <Text numberOfLines={1} style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}> {child.subTotalCurrencyFormat}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                {item.voucherStoreSelected && Object.keys(item.voucherStoreSelected).length ?
                                    <View style={styles.column}>
                                        <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                            <TouchableOpacity style={[styles.row_between_center, styles.p_3]} onPress={() => {
                                                setvoucherOpen('store')
                                                setVouchers(item.voucherStore)
                                                setindexStore(idxStore)
                                            }}>
                                                {/* <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} /> */}
                                                <Text style={[styles.font_14, { color: colors.BlackGrayScale }]}>Voucher Toko</Text>
                                                <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
                                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {item.voucherStoreSelected.discountText}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.row_end_center, styles.px_2]}>
                                            <Text style={[styles.font_14, { fontStyle: 'italic' }]}>Subtotal </Text>
                                            <Text numberOfLines={1} style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}> {item.totalDiscountCurrencyFormat}</Text>
                                        </View>
                                    </View>
                                    : null
                                }
                                <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                    <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/vehicle-yellow.png')} />
                                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pengiriman</Text>
                                </View>

                                <View style={[styles.column, styles.p_3, { width: '100%' }]}>
                                    <View style={styles.row_between_center}>
                                        <View style={[styles.column_between_center, { alignItems: 'flex-start' }]}>
                                            <Text numberOfLines={1} style={[styles.font_14]}>{item.shippingSelected.name}</Text>
                                            <Text numberOfLines={1} style={[styles.font_12]}>Regular</Text>
                                            <Text numberOfLines={1} style={[styles.font_12, styles.T_italic,]}>Estimasi {item.shippingSelected.etdText}</Text>
                                        </View>
                                        <View style={[styles.column_between_center, { alignItems: 'flex-end' }]}>
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.shippingSelected.priceCurrencyFormat}</Text>
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}></Text>
                                            {props.route.params.status === "Pengiriman" ?
                                                <TouchableOpacity onPress={handleTracking} style={{ backgroundColor: colors.YellowJaja, borderRadius: 5, paddingHorizontal: '10%', paddingVertical: '3%' }}>
                                                    <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}> Lacak </Text>
                                                </TouchableOpacity>
                                                :
                                                <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}></Text>
                                            }
                                        </View>
                                    </View>

                                </View>
                            </View>
                        )
                    })
                    :
                    null}
                <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '5%' }]}>
                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                        <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                        <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Ringkasan Belanja</Text>
                    </View>
                    <View style={[styles.row_between_center, styles.p_3]}>
                        <View style={styles.column}>
                            <Text style={[styles.font_13, { marginBottom: '1%' }]}>Total belanja</Text>
                            <Text style={[styles.font_13, { marginBottom: '1%' }]}>Ongkos kirim</Text>
                            <Text style={[styles.font_13, { marginBottom: '1%' }]}>Biaya penanganan</Text>
                            {/* <Text style={[styles.font_13, { marginBottom: '1%' }]}>Voucher Toko</Text> */}
                            <Text style={[styles.font_13, { marginBottom: '1%' }]}>Voucher Jaja.id</Text>

                        </View>
                        {details ?
                            <View style={styles.column_center_end}>
                                <Text style={[styles.font_13, { marginBottom: '1%' }]}>{details.subTotalCurrencyFormat}</Text>
                                <Text style={[styles.font_13, { marginBottom: '1%' }]}>{details.shippingCostCurrencyFormat}</Text>
                                <Text style={[styles.font_13, { marginBottom: '1%' }]}>Rp0</Text>
                                {/* <Text style={[styles.font_13, { marginBottom: '1%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountCurrencyFormat}</Text> */}
                                <Text style={[styles.font_13, { marginBottom: '1%', color: details.voucherDiscountJaja ? colors.RedFlashsale : colors.BlackGrayScale }]}>{details.voucherDiscountJajaCurrencyFormat}</Text>
                            </View>
                            : null
                        }

                    </View>
                </View>
                {details && Object.keys(details).length ?
                    props.route.params.status === "Pengiriman" ?

                        <View style={{ zIndex: 100, height: Hp('5.5%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', marginBottom: '2%' }}>
                            <Button onPress={handleDone} style={{ alignSelf: 'center', width: '100%', height: '95%', marginBottom: '2%' }} contentStyle={{ width: '100%', height: '95%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" >
                                Terima Pesanan
                            </Button>
                            <Button onPress={() => navigation.navigate('Complain')} style={{ alignSelf: 'center', width: '100%' }} contentStyle={{ width: '100%' }} color={colors.YellowJaja} labelStyle={{ color: colors.White }} mode="contained" >
                                Komplain
                            </Button>
                        </View>
                        : props.route.params.status === "Pesanan Selesai" ?
                            <View style={{ position: 'absolute', bottom: 0, zIndex: 100, height: Hp('5.5%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: '3%' }}>
                                <Button icon="star" onPress={() => navigation.navigate('AddReview', { data: details.items[0].products })} style={{ alignSelf: 'center', width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.YellowJaja} labelStyle={{ color: colors.White }} mode="contained" >
                                    Beri Penilaian
                                </Button>
                            </View>
                            : null
                    : null
                }
            </ScrollView>
            {props.route.params && props.route.params.status === "Menunggu Pembayaran" ?
                <View style={{ position: 'absolute', bottom: 0, zIndex: 100, elevation: 1, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                    <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '3%' }}>
                        <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Total pembayaran :</Text>
                        <Text numberOfLines={1} style={[styles.font_20, { fontWeight: 'bold', color: colors.BlueJaja }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text>
                    </View>
                    <Button onPress={handlePayment} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" >
                        Pilih pembayaran
                    </Button>
                </View>
                : null
            }
        </SafeAreaView >
    )
}
