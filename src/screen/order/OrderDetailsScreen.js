import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Appbar, colors, styles, Wp, Hp, useNavigation, useFocusEffect } from '../../export'
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'react-native-paper'
export default function OrderDetailsScreen(props) {
    const navigation = useNavigation();
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
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 43 ~ getItem ~ props.route.params.data", props.route.params.data)

        fetch(`https://jaja.id/backend/order/${props.route.params.data}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 45 ~ getItem ~ result.status.code", result.status.code)
                    setDetails(result.data)
                }
            })
            .catch(error => console.log('error', error));
    }

    const handleCheckout = () => {

    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar title="Detail Pesanan" back={true} />
            <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'column', paddingBottom: Hp('7%') }}>
                <View style={[styles.row_between_center, styles.p_3, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row]}>
                        <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/process.png')} />
                        <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}> Status Pesanan</Text>
                    </View>
                    <View style={[styles.p, { backgroundColor: colors.YellowJaja, borderRadius: 3 }]}>
                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>{status}</Text>
                    </View>
                </View>
                {details ?
                    <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                        <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                            <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                            <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
                        </View>
                        <View style={[styles.column, styles.p_3]}>
                            <View style={styles.row_between_center}>
                                <Text numberOfLines={1} style={[styles.font_14, { width: '70%' }]}>{details.address.receiverName}</Text>
                            </View>
                            <Text numberOfLines={1} style={[styles.font_14]}>{details.address.phoneNumber}</Text>

                            <Text numberOfLines={3} style={[styles.font_14, styles.mt_2]}>{details.address.address.replace(/<br>/g, "")}</Text>
                        </View>
                    </View> : null}
                {details && details.items.length ?
                    details.items.map((item, idxStore) => {
                        return (
                            <View key={String(idxStore)} style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                    <Image style={[styles.icon_23, { marginRight: '2%' }]} source={require('../../assets/icons/store.png')} />
                                    <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}>{item.store.name}</Text>
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
                                                        <Text numberOfLines={1} style={[styles.font_16, { color: colors.BlueJaja, fontWeight: 'bold' }]}>{child.name}</Text>
                                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale }]}>{child.variant ? child.variant : ""}</Text>
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
                                    <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/vehicle-yellow.png')} />
                                    <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}>Metode Pengiriman</Text>
                                </View>

                                <View style={[styles.column, styles.p_3, { width: '100%' }]}>
                                    <View style={styles.row_between_center}>
                                        <View style={[styles.column_between_center, { alignItems: 'flex-start' }]}>
                                            <Text numberOfLines={1} style={[styles.font_14]}>{item.shippingSelected.name}</Text>
                                            <Text numberOfLines={1} style={[styles.font_12]}>Regular</Text>
                                            <Text numberOfLines={1} style={[styles.font_12, { fontStyle: 'italic' }]}>Estimasi {item.shippingSelected.etdText}</Text>
                                        </View>
                                        <View style={[styles.column_between_center, { alignItems: 'flex-end' }]}>
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}>{item.shippingSelected.priceCurrencyFormat}</Text>
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}></Text>
                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}></Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                    :
                    null}
                <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                        <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                        <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.BlueJaja }]}>Ringkasan Belanja</Text>
                    </View>
                    <View style={[styles.row_between_center, styles.p_3]}>
                        <View style={styles.column}>
                            <Text style={[styles.font_14, { marginBottom: '1%' }]}>Total belanja</Text>
                            <Text style={[styles.font_14, { marginBottom: '1%' }]}>Ongkos kirim</Text>
                            <Text style={[styles.font_14, { marginBottom: '1%' }]}>Biaya penanganan</Text>
                            {/* <Text style={[styles.font_14, { marginBottom: '1%' }]}>Voucher Toko</Text> */}
                            <Text style={[styles.font_14, { marginBottom: '1%' }]}>Voucher Jaja.id</Text>

                        </View>
                        {details ?
                            <View style={styles.column_center_end}>
                                <Text style={[styles.font_14, { marginBottom: '1%' }]}>{details.subTotalCurrencyFormat}</Text>
                                <Text style={[styles.font_14, { marginBottom: '1%' }]}>{details.shippingCostCurrencyFormat}</Text>
                                <Text style={[styles.font_14, { marginBottom: '1%' }]}>Rp0</Text>
                                {/* <Text style={[styles.font_14, { marginBottom: '1%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountCurrencyFormat}</Text> */}
                                <Text style={[styles.font_14, { marginBottom: '1%', color: details.voucherDiscountJaja ? colors.RedFlashsale : colors.BlackGrayScale }]}>{details.voucherDiscountJajaCurrencyFormat}</Text>
                            </View>
                            : null
                        }

                    </View>
                </View>
            </ScrollView>
            {props.route.params && props.route.params.status === "Menunggu Pembayaran" ?
                <View style={{ position: 'absolute', bottom: 0, zIndex: 100, elevation: 1, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                    <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '3%' }}>
                        <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Total pembayaran :</Text>
                        <Text numberOfLines={1} style={[styles.font_20, { fontWeight: 'bold', color: colors.BlueJaja }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text>
                    </View>
                    <Button onPress={handleCheckout} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" >
                        Pilih pembayaran
                    </Button>
                </View>
                : props.route.params.status === "Pesanan Selesai" ?
                    <View style={{ position: 'absolute', bottom: 0, zIndex: 100, height: Hp('6%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: '2%' }}>
                        {/* <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '3%' }}>
                        <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Total pembayaran :</Text>
                        <Text numberOfLines={1} style={[styles.font_20, { fontWeight: 'bold', color: colors.BlueJaja }]}>{reduxCheckout.totalCurrencyFormat}</Text>
                    </View> */}
                        <Button icon="star" onPress={() => navigation.navigate('AddReview', { data: details.items[0].products })} style={{ alignSelf: 'center', width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.YellowJaja} labelStyle={{ color: colors.White }} mode="contained" >
                            Beri Penilaian
                        </Button>
                    </View>
                    : null}
        </SafeAreaView >
    )
}
