import React, { useEffect, useState, useCallback, createRef } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid, Alert, RefreshControl, Modal, FlatList } from 'react-native'
import { Appbar, colors, styles, Wp, Hp, useNavigation, useFocusEffect, Loading, Utils, ServiceStore, ServiceCheckout } from '../../export'
import Clipboard from '@react-native-community/clipboard';
import { useDispatch, useSelector } from "react-redux";
import { Button, TouchableRipple, Checkbox, RadioButton } from 'react-native-paper'
import ActionSheet from "react-native-actions-sheet";

export default function OrderDetailsScreen() {
    const navigation = useNavigation();
    const actionSheetPayment = createRef();

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState(null)
    const [refreshing, setRefreshing] = useState(null)
    const [selectedPayment, setselectedPayment] = useState('')
    const [selectedSubPayment, setselectedSubPayment] = useState('')

    const reduxStore = useSelector(state => state.store.store)
    const reduxListPayment = useSelector(state => state.checkout.listPayment)

    const reduxCheckout = useSelector(state => state.checkout.checkout)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxOrderStatus = useSelector(state => state.order.orderStatus)
    const reduxOrderInvoice = useSelector(state => state.order.invoice)

    const reduxUser = useSelector(state => state.user)
    const [subPayment, setsubPayment] = useState([])

    const [showModal, setModalShow] = useState(false);


    useEffect(() => {
        if (reduxOrderStatus == 'Menunggu Pembayaran') {
            ServiceCheckout.getListPayment().then(res => {
                if (res) {
                    dispatch({ type: 'SET_LIST_PAYMENT', payload: res })
                }
            })

        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            getItem()
        }, []),
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
    }, []);

    const handleShowPayment = (item) => {
        console.log("🚀 ~ file: CheckoutScreen.js ~ line 571 ~ handleShowPayment ~ item", item)
        setselectedPayment(item)
        if (item.payment_type_label !== 'Bank Transfer') {
            setModalShow(true)
            // setsubPayment('')
        } else {
            setsubPayment(item.subPayment)
            actionSheetPayment.current?.setModalVisible(true)
        }
    }

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

        fetch(`https://jaja.id/backend/order/${reduxOrderInvoice}`, requestOptions)
            .then(response => response.text())
            .then(data => {
                console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 85 ~ getItem ~ data", data)
                try {
                    let result = JSON.parse(data)
                    setRefreshing(false)
                    if (result.status.code === 200 || result.status.code === 204) {
                        setDetails(result.data)
                        if (!reduxOrderStatus) {
                            let status = result.data.status;
                            dispatch({ type: 'SET_ORDER_STATUS', payload: status === 'notPaid' ? "Menunggu Pembayaran" : status === 'waitConfirm' ? 'Menunggu Konfirmasi' : status === 'prepared' ? 'Sedang Disiapkan' : status === 'canceled' ? 'Pesanan Dibatalkan' : status === 'done' ? 'Pesanan Selesai' : null })

                        }
                        // dispatch({ type: 'SET_INVOICE', payload: result.data.items[0].invoice })
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 22003");
                    }
                } catch (error) {
                    Alert(data)
                }
            })
            .catch(error => {
                setRefreshing(false)

                Utils.handleError(error, "Error with status code : 22004")
            });
        setTimeout(() => {
            setRefreshing(false)
        }, 5000);
    }

    const handlePayment = () => {
        dispatch({ type: 'SET_ORDERID', payload: details.orderId })
        navigation.navigate("Midtrans")
    }

    const handleTracking = () => {
        navigation.navigate('OrderDelivery')
    }

    const handleDone = () => {
        Alert.alert(
            "Terima Pesanan",
            `Kamu akan menerima pesanan seharga ${details.totalCurrencyFormat} dan akan dilepaskan ke penjual.`,
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Terima", onPress: () => {
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
                                setLoading(false)
                                if (result.status.code === 200) {
                                    navigation.goBack()
                                } else {
                                    Utils.handleErrorResponse(result, "Error with status code : 22001")
                                }
                            })
                            .catch(error => {
                                setLoading(false)
                                Utils.handleError(error, "Error with status 22002")
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
        dispatch({ type: 'SET_SLUG', payload: item.slug })
        navigation.push("Product", { slug: item.slug, image: item.image })
    }
    const handleStore = (item) => {
        if (reduxStore && Object.keys(reduxStore).length) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 259 ~ handleStore ~ reduxStore", reduxStore)
            if (reduxStore.name != item.name) {
                dispatch({ "type": 'SET_STORE', payload: {} })
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
            }
        }
        ServiceStore.getStore(item.slug, reduxAuth).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE', payload: res })
                navigation.navigate('Store')
            }
        })
        let obj = {
            slug: item.slug,
            page: 1,
            limit: 30,
            keyword: '',
            price: '',
            condition: '',
            preorder: '',
            brand: '',
            sort: 'produk.id_produk-desc',
        }

        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                dispatch({ "type": 'SET_NEW_PRODUCT', payload: res.items })
            }
        })
        obj.sort = ''
        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
            }
        })


    }
    const handleChat = (item) => {
        let dataSeller = item.store
        dataSeller.chat = reduxUser.user.uid + dataSeller.uid
        dataSeller.id = dataSeller.uid
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: dataSeller, order: { invoice: reduxOrderInvoice, status: reduxOrderStatus, imageOrder: item.products[0].image } })
        } else {
            navigation.navigate('Login', { navigate: "OrderDetails" })
        }
    }

    const handleOpenLink = async (url) => {
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 219 ~ handleOpenLink ~ url", url)
        // const supported = await Linking.canOpenURL(url);

        // if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        Linking.openURL(url);
        // } else {
        //     Alert.alert(`Don't know how to open this URL: ${url}`);
        // }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar title="Detail Pesanan" back={true} />
            {loading ? <Loading /> : null}

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{ flex: 0, flexDirection: 'column', paddingBottom: Hp('7%') }}>
                <View style={[styles.column, styles.p_3, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row_between_center, { marginBottom: reduxOrderStatus !== "Menunggu Pembayaran" ? '4%' : "0%" }]}>
                        <View style={[styles.row]}>
                            <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/process.png')} />
                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}> Status Pesanan</Text>
                        </View>
                        <View style={[styles.px, styles.px_3, { backgroundColor: colors.YellowJaja, borderRadius: 3 }]}>
                            <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>{reduxOrderStatus}</Text>
                        </View>
                    </View>
                    {reduxOrderStatus !== "Menunggu Pembayaran" ?
                        details ?
                            <>
                                <View style={styles.row_between_center}>
                                    <View style={[styles.row]}>
                                        <Text style={[styles.font_13]}>#{details.items[0].invoice}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleOpenLink(details.downloadOrderPdf)}
                                        onLongPress={() => {
                                            Clipboard.setString(details.downloadOrderPdf)
                                            ToastAndroid.show("salin to clipboard", ToastAndroid.LONG, ToastAndroid.TOP)
                                        }}
                                        style={[styles.p, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlueJaja }]}>DOWNLOAD INVOICE</Text>
                                    </TouchableOpacity>
                                </View>
                                {reduxOrderStatus == 'Pesanan Dibatalkan' ?
                                    <View style={styles.row_between_center}>
                                        <Text style={[styles.font_13]}>Alasan pembatalan : <Text numberOfLines={5} style={{ color: colors.RedNotif }}>{details.reasonCancel}</Text></Text>
                                    </View> : null
                                }
                            </>
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
                                <View style={[styles.row_between_center, styles.px_3, styles.py_2, { width: '100%', borderBottomWidth: 0.2, borderBottomColor: colors.WhiteSilver }]}>
                                    <View style={[styles.row]}>
                                        <Image style={[styles.icon_19, { marginRight: '3%', tintColor: colors.BlueJaja }]} source={require('../../assets/icons/store.png')} />
                                        <Text onPress={() => handleStore(item.store)} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.store.name}</Text>
                                    </View>
                                    <TouchableRipple onPress={() => handleChat(item)} style={[styles.row_center, styles.px_2, { backgroundColor: colors.BlueJaja, paddingVertical: '1.5%', borderRadius: 3 }]}>
                                        <View style={styles.row}>
                                            <Text style={[styles.font_11, styles.T_medium, { color: colors.White }]}>
                                                Chat Penjual
                                            </Text>
                                        </View>
                                    </TouchableRipple>
                                </View>
                                {
                                    item.products.map((child, idx) => {
                                        return (
                                            <View key={String(idx) + "s"} style={[styles.column, styles.px_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, width: '100%' }]}>
                                                <View style={[styles.row_start_center, { width: '100%', height: Wp('25%') }]}>
                                                    <TouchableOpacity onPress={() => handleShowDetail(child)}>
                                                        <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.BlackGrey }}
                                                            resizeMethod={"scale"}
                                                            resizeMode="cover"
                                                            source={{ uri: child.image }}
                                                        />
                                                    </TouchableOpacity>
                                                    <View style={[styles.column, styles.ml_2, { height: Wp('15%'), width: Wp('85%') }]}>
                                                        <Text onPress={() => handleShowDetail(child)} numberOfLines={1} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '95%' }]}>{child.name}</Text>
                                                        <View style={[styles.row_between_center, styles.pr_2, { width: '95%', alignItems: 'flex-start' }]}>
                                                            <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale, }]}>{child.variant ? child.variant : ""}</Text>
                                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                {child.isDiscount ?
                                                                    <>
                                                                        <Text></Text>
                                                                        <Text numberOfLines={1} style={[styles.priceBefore, { fontStyle: 'italic' }]}>{child.priceCurrencyFormat}</Text>
                                                                        <View style={styles.row}>
                                                                            <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                            <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {child.priceDiscountCurrencyFormat}</Text>
                                                                        </View>
                                                                    </>
                                                                    :
                                                                    <View style={styles.row}>
                                                                        <Text></Text>
                                                                        <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                        <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {child.priceCurrencyFormat}</Text>
                                                                    </View>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.row_end_center]}>
                                                    {/* <Text style={[styles.font_14, { fontStyle: 'italic' }]}>Subtotal </Text> */}
                                                    <Text numberOfLines={1} style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}> {child.subTotalCurrencyFormat}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {
                                    item.voucherStoreSelected && Object.keys(item.voucherStoreSelected).length ?
                                        <View style={styles.column}>
                                            <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                                <TouchableOpacity style={[styles.row_between_center, styles.p_3]}>
                                                    {/* <Image style={[styles.icon_23, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} /> */}
                                                    <Text style={[styles.font_14, { color: colors.BlackGrayScale }]}>Voucher Toko</Text>
                                                    <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
                                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {item.voucherStoreSelected.discountText}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.row_end_center, styles.px_2]}>
                                                <Text style={[styles.font_14, { fontStyle: 'italic' }]}>Subtotal </Text>
                                                <Text numberOfLines={1} style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}> {item.totalDiscountCurrencyFormat}</Text>
                                            </View>
                                        </View>
                                        : null
                                }
                                {/* <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
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
                                            {reduxOrderStatus === "Pengiriman" ?
                                                <TouchableOpacity onPress={handleTracking} style={{ backgroundColor: colors.YellowJaja, borderRadius: 5, paddingHorizontal: '10%', paddingVertical: '3%' }}>
                                                    <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}> Lacak </Text>
                                                </TouchableOpacity>
                                                :
                                                <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlueJaja }]}></Text>
                                            }
                                        </View>
                                    </View> 
                            </View>*/}
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
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Total belanja</Text>
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Ongkos </Text>
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Biaya penanganan</Text>
                            {/* <Text style={[styles.font_13 { marginBottom: '2%' }]}>Voucher Toko</Text> */}
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Voucher Jaja.id</Text>
                            <Text style={[styles.font_13, styles.T_medium, { marginBottom: '2%' }]}>Total pembayaran</Text>


                        </View>
                        {details ?
                            <View style={styles.column_center_end}>
                                <Text style={[styles.font_13, { marginBottom: '2%' }]}>{details.subTotalCurrencyFormat}</Text>
                                <Text style={[styles.font_13, { marginBottom: '2%' }]}>{details.shippingCostCurrencyFormat}</Text>
                                <Text style={[styles.font_13, { marginBottom: '2%' }]}>Rp0</Text>
                                {/* <Text style={[styles.font_13, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountCurrencyFormat}</Text> */}
                                <Text style={[styles.font_13, { marginBottom: '2%', color: details.voucherDiscountJaja ? colors.RedFlashsale : colors.BlackGrayScale }]}>{details.voucherDiscountJajaCurrencyFormat}</Text>
                                <Text style={[styles.font_13, styles.T_semi_bold, { marginBottom: '2%', color: colors.BlueJaja, }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text>
                            </View>
                            : null
                        }

                    </View>

                </View>
                {reduxOrderStatus == 'Menunggu Pembayaran' || reduxOrderStatus == 'Menunggu Konfirmasi' ?
                    <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                        <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                            <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pembayaran</Text>
                        </View>
                        {reduxListPayment.map(item => {
                            return (
                                <TouchableRipple onPressIn={() => handleShowPayment(item)} style={[styles.px_3, styles.py_3, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]} onPress={() => handleShowPayment(item)} rippleColor={colors.BlueJaja} >
                                    <View style={styles.row_between_center}>
                                        <Text style={styles.font_13}>{item.payment_type_label === 'Card' ? 'Kartu Kredit' : item.payment_type_label == 'eWallet' ? item.payment_type_label + ' - ' + item.subPayment[0].payment_sub_label : item.payment_type_label}</Text>
                                        {item.id_payment_method_category !== selectedPayment.id_payment_method_category ?
                                            <Image fadeDuration={300} source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackGrey }]} />
                                            :
                                            <Image fadeDuration={300} source={require('../../assets/icons/check.png')} style={[styles.icon_14, { tintColor: colors.BlueJaja }]} />
                                        }
                                    </View>
                                </TouchableRipple>
                            )
                        })}
                        <View style={[styles.row_center, styles.my_2, { width: '95%', alignSelf: 'center' }]}>
                            {
                                reduxOrderStatus === "Menunggu Pembayaran" ?

                                    <>
                                        <TouchableRipple onPress={() => console.log("change")} style={[styles.row_center, styles.py_2, { width: 100 / 3 + '%', backgroundColor: colors.YellowJaja }]}>
                                            <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                                Ganti
                                            </Text>
                                        </TouchableRipple>
                                        <TouchableRipple onPress={() => console.log("refresh")} style={[styles.row_center, styles.py_2, { width: 100 / 3 + '%', backgroundColor: colors.GreenSuccess }]}>
                                            <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                                Cek Bayar
                                            </Text>
                                        </TouchableRipple>
                                        <TouchableRipple onPress={handlePayment} style={[styles.row_center, styles.py_2, { width: 100 / 3 + '%', backgroundColor: colors.BlueJaja }]}>
                                            <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                                Bayar Sekarang
                                            </Text>
                                        </TouchableRipple>
                                    </>

                                    : null
                            }
                        </View>

                        <View style={[styles.row_center, styles.mb_2, { width: '95%', alignSelf: 'center' }]}>
                            <TouchableRipple onPress={() => navigation.navigate('OrderCancel')} style={[styles.row_center, styles.py_2, { width: '100%', backgroundColor: colors.Silver, alignSelf: 'center' }]}>
                                <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                    Batalkan Pesanan
                                </Text>
                            </TouchableRipple>
                        </View>

                    </View>
                    : null}
                {details && Object.keys(details).length ?
                    reduxOrderStatus === "Pengiriman" ?
                        <View style={{ zIndex: 100, height: Hp('5.5%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', marginBottom: '2%' }}>
                            <Button onPress={handleDone} style={{ alignSelf: 'center', width: '100%', height: '95%', marginBottom: '2%' }} contentStyle={{ width: '100%', height: '95%' }} color={colors.BlueJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                                Terima Pesanan
                            </Button>
                            <Button onPress={() => {
                                navigation.navigate(details.complain ? 'ResponseComplain' : 'RequestComplain', { invoice: details.items[0].invoice })
                            }} style={{ alignSelf: 'center', width: '100%' }} contentStyle={{ width: '100%' }} color={colors.YellowJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                                {details.complain ? "Sedang Dikomplain" : "Komplain"}
                            </Button>
                        </View>
                        : reduxOrderStatus === "Pesanan Selesai" ?
                            <View style={{ position: 'absolute', bottom: 0, zIndex: 100, height: Hp('5.5%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: '3%' }}>
                                <Button icon="star" onPress={() => {
                                    console.log("🚀 ~ file: OrderDetailsScreenSave.js ~ line 519 ~ OrderDetailsScreen ~  details.items[0].products ", details.items[0].products)
                                    // navigation.navigate('AddReview', { data: details.items[0].products })
                                }} style={{ alignSelf: 'center', width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.YellowJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                                    Beri Penilaian
                                </Button>
                            </View>
                            : reduxOrderStatus === "Menunggu Pembayaran" || reduxOrderStatus === "Menunggu Konfirmasi" ?

                                null
                                : null
                    : null
                }
            </ScrollView>
            {/* {
                props.route.params && reduxOrderStatus === "Menunggu Pembayaran" ?
                    <View style={{ position: 'absolute', bottom: 0, zIndex: 100, elevation: 1, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                        <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '3%' }}>
                            <Text style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>Total pembayaran :</Text>
                            <Text numberOfLines={1} style={[styles.font_20, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text>
                        </View>
                        <Button onPress={handlePayment} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                            Bayar Sekarang
                        </Button>
                    </View>
                    : null
            } */}
            <ActionSheet closeOnPressBack={false} ref={actionSheetPayment} onClose={() => {
                if (!selectedSubPayment && selectedSubPayment == '') {
                    setselectedPayment('')
                }
            }} delayActionSheetDraw={false} containerStyle={{ padding: '4%', }}>
                <View style={[styles.row_between_center, styles.py_2, styles.mb_5]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '60%' }]}>Pilih Metode Pembayaran</Text>
                    <TouchableOpacity onPressIn={() => actionSheetPayment.current?.setModalVisible()}>
                        <Image style={[styles.icon_14, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.column, { minHeight: Hp('20%'), maxHeight: Hp('80%') }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                        <FlatList
                            data={subPayment}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                console.log("🚀 ~ file: CheckoutScreen.js ~ line 1057 ~ checkoutScreen ~ item", item)
                                return (
                                    <TouchableRipple onPressIn={() => setselectedSubPayment(item)} style={[styles.py_4, styles.px_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]} onPress={() => console.log('Pressed')} rippleColor={colors.BlueJaja} >
                                        <View style={styles.row_between_center}>
                                            <Text style={styles.font_13}>{item.payment_sub_label}</Text>
                                            <Checkbox
                                                color={colors.BlueJaja}
                                                status={item.payment_sub_label === selectedSubPayment.payment_sub_label ? 'checked' : 'unchecked'}
                                            />
                                            {/* {item.payment_sub_label === selectedSubPayment.payment_sub_label ?
                                                <Image source={require('../../assets/icons/check.png')} style={[styles.icon_14, { tintColor: colors.BlueJaja }]} />
                                                :
                                                <Image source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackTitle }]} />
                                            } */}
                                        </View>
                                    </TouchableRipple>
                                )
                            }}
                        />
                    </ScrollView>
                </View>
            </ActionSheet>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setModalShow(!showModal);
                }}>
                <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.column_start, styles.pt_3s, { width: Wp('95%'), height: Wp('50%'), backgroundColor: colors.White, elevation: 11, zIndex: 999 }]}>
                        {selectedPayment.payment_type_label === 'Card' ?
                            <View style={[styles.column_center_start, styles.px_4, styles.pt_5, { height: '60%' }]}>
                                <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja, height: '30%' }]}>Kartu Kredit</Text>
                                <Text style={[styles.font_14, { height: '65%' }]}>Metode pembayaran ini berlaku untuk semua jenis kartu kredit</Text>
                            </View>
                            :
                            <View style={[styles.column_center_start, styles.px_4, styles.pt_5, { height: '60%' }]}>
                                <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja, height: '30%' }]}>eWallet - Qris</Text>
                                <Text style={[styles.font_14, { height: '65%' }]}>Metode pembayaran ini berlaku untuk semua jenis dompet elektronik seperti DANA, GOPAY, OVO, dll</Text>
                            </View>
                        }
                        <View style={[styles.row_end, styles.p_2, { width: '100%' }]}>
                            <Button mode="contained" onPress={() => setModalShow(false)} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} style={{ height: '100%', width: '30%' }} color={colors.BlueJaja}>
                                OK
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}
