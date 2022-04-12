import React, { useCallback, useState, createRef, useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, FlatList, ScrollView, Alert, TextInput, Modal } from 'react-native'
import { Checkbox, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, colors, styles, Hp, Wp, useNavigation, useFocusEffect, Utils, Loading, ServiceCheckout, ServiceUser, ServiceCart, ServiceOrder } from '../../export'
import CheckBox from '@react-native-community/checkbox';
import ActionSheet from "react-native-actions-sheet";
// const cartStatus = useSelector((state) => state.cart.cartStatus);

export default function CheckoutMultiDropScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const actionSheetDelivery = createRef();

    const reduxAuth = useSelector((state) => state.auth.auth);
    const reduxCoin = useSelector((state) => state.user.user.coinFormat);
    const reduxUseCoin = useSelector((state) => state.checkout.useCoin);
    // const reduxShipping = useSelector((state) => state.checkout.shipping);
    const [reduxShipping, setreduxShipping] = useState([])
    console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 20 ~ CheckoutMultiDropScreen ~ reduxShipping", reduxShipping.length)

    const [dataCheckout, setdataCheckout] = useState('')
    const [loading, setloading] = useState(false)
    const [useCoin, setUseCoin] = useState(0);
    const [modalNext, setmodalNext] = useState(false);

    const [dateMin, setdateMin] = useState({ year: 0, month: 0, date: 0, });
    const [dateMax, setdateMax] = useState({ year: 0, month: 0, date: 0, });
    const [storePressed, setstorePressed] = useState({});
    const [shippingSelected, setshippingSelected] = useState([]);

    const [indexStore, setindexStore] = useState(null);
    const [sendTime, setsendTime] = useState("setiap saat");
    const [sendDate, setSendDate] = useState("");
    const [notes, setNotes] = useState([]);
    const [addressId, setaddressId] = useState(null)
    const [count, setcount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setindexStore(null)
            handleDataCheckout(useCoin)
        }, []),
    );

    const handleGetShipping = () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=sj57u2rf54ump5hhscmu30jljrigpooq");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/checkout/shipping?is_gift=0&is_multidrop=1`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setreduxShipping(result.data)
                        setcount(count + 1)
                        // dispatch({ type: 'SET_SHIPPING', payload: result.data })
                    } else if (result.status.code === 404 && result.status.message === 'alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu') {
                        // Utils.alertPopUp('Silahkan tambah alamat terlebih dahuluuuuuuuuuuuuuuuuuuu!')
                        return null
                    } else if (result?.status?.message === 'Data tidak ditemukan') {

                    }
                    else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12056')
                        return null
                    }
                    setloading(false)
                })
                .catch(error => {
                    Utils.alertPopUp(String(error))
                    setloading(false)

                });
        } catch (error) {
            setloading(false)

            console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 70 ~ handleGetShipping ~ error", error)

        }
    }


    useEffect(() => {
        try {
            if (indexStore) {
                let arr = JSON.parse(JSON.stringify(reduxShipping?.filter(item => item.store.id === indexStore && addressId === item.addressId)))
                if (arr[0]?.items.length) {
                    setshippingSelected(arr[0].items)
                    setcount(count + 1)
                    actionSheetDelivery.current?.setModalVisible(true)
                } else {
                    setshippingSelected([])
                }
            }
        } catch (error) {

        }
    }, [indexStore])

    const handleNotes = (val, index) => {
        let newArr = notes;
        newArr[index] = { note: val };
        setNotes(newArr);
    };

    const handleDataCheckout = (coin) => {
        setUseCoin(coin);
        setloading(true)
        dispatch({ type: "SET_USECOIN", payload: coin });

        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://jaja.id/backend/checkout/test_multidrop?isCoin=${coin ? 1 : 0}&fromCart=0&is_gift=0`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 124 ~ handleDataCheckout ~ result", result)
                if (result?.status?.code === 200) {
                    handleGetShipping()
                    setdataCheckout(result?.data)
                    // setloading(false)
                } else if (result?.status?.code === 204) {
                    // navigation.replace('Trolley')

                } else if (result?.status?.code === 404 && result?.status?.message === "Data tidak ditemukan") {
                    // Utils.alertPopUp("Silahkan tambah alamat terlebih dahulu!");
                    // navigation.replace('Trolley')
                }
                else {
                    Utils.handleErrorResponse(result, 'Error with status code : 13010')
                    setloading(false)
                }
            })
            .catch(error => {
                setloading(false)
                Utils.handleError(error, "Error with status code : 13011")
            });
        setTimeout(() => {
            setloading(false)
        }, 15000);
    }

    const handleShipping = () => {
        ServiceCheckout.getShipping(reduxAuth, 0).then(res => {
            if (res) {
                dispatch({ type: 'SET_SHIPPING', payload: res })
            }
        })
    }

    const renderItem = ({ item, index }) => {
        let idxStore = index
        return (
            <View style={[styles.column, styles.mb_3, styles.pb_3, {
                backgroundColor: colors.White,
                shadowColor: colors.BlueJaja,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
            }]}>
                <View style={[styles.p_2, { backgroundColor: colors.WhiteGrey, width: Wp('100%') }]}>
                    <Text style={[styles.font_14, styles.T_semi_bold]}>
                        Pesanan {index + 1}
                    </Text>
                </View>
                <View style={[styles.column, styles.px_2,]}>

                    {renderAlamat(item.address, index)}
                    <FlatList
                        data={item.products}
                        keyExtractor={(item, index) => index + 'JX'}
                        renderItem={renderProduct}
                    />
                    <>
                        <View
                            style={[
                                styles.row,
                                styles.p_3,
                                {
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: colors.BlueJaja,
                                },
                            ]}
                        >
                            <Image
                                style={[
                                    styles.icon_21,
                                    { tintColor: colors.BlueJaja, marginRight: "2%" },
                                ]}
                                source={require("../../assets/icons/vehicle-yellow.png")}
                            />
                            <Text
                                style={[
                                    styles.font_14,
                                    styles.T_semi_bold,
                                    { color: colors.BlueJaja },
                                ]}
                            >
                                Metode Pengiriman
                            </Text>
                        </View>
                        {item.shippingSelected.name ? (
                            <View
                                style={[
                                    styles.column,
                                    styles.p_3,
                                    { width: "100%" },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        try {
                                            setaddressId(item.address.id)
                                            setstorePressed(item.store);
                                            setindexStore(item.store?.id);
                                            if (item.shippingSelected?.dateSendTime) {
                                                setSendDate(item.shippingSelected.dateSendTime);
                                            }
                                        } catch (error) {
                                            console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 168 ~ renderItem ~ error", error)

                                        }
                                    }}
                                >
                                    <View style={styles.row_between_center}>
                                        <View
                                            style={[
                                                styles.column_between_center,
                                                { alignItems: "flex-start" },
                                            ]}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[styles.font_14]}
                                            >
                                                {item.shippingSelected.name}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={[styles.font_12]}
                                            >
                                                {item.shippingSelected.type}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={[styles.font_12]}
                                            >
                                                Estimasi {item.shippingSelected.etdText}
                                            </Text>
                                            {item.shippingSelected?.sendTime ===
                                                "pilih tanggal" ? (
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styles.font_12]}
                                                >
                                                    Akan dikirim
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={[styles.column_between_center, { alignItems: "flex-end" },]} >
                                            <Text numberOfLines={1} style={[styles.font_12, styles.mb_2, { color: colors.BlueJaja },]} >Ubah</Text>
                                            {item.shippingSelected.priceNormal ? (
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        styles.priceBefore,
                                                        styles.T_italic,
                                                    ]}
                                                >
                                                    {
                                                        item.shippingSelected.priceCurrencyFormatNormal
                                                    }
                                                </Text>
                                            ) : (
                                                <Text></Text>
                                            )}
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styles.font_14,
                                                    styles.T_medium,
                                                    { color: colors.BlueJaja },
                                                ]}
                                            >
                                                {item.shippingSelected.priceCurrencyFormat}
                                            </Text>
                                            {item.shippingSelected.sendTime ===
                                                "pilih tanggal" ? (
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styles.font_12]}
                                                >
                                                    {item.shippingSelected.dateSendTime}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.column, styles.mb_3]}>
                                    <TextInput
                                        onChangeText={(text) => handleNotes(text, idxStore)}
                                        placeholder="Masukkan catatan untuk penjual"
                                        placeholderTextColor={colors.BlackGrey}
                                        style={[styles.font_12, styles.py, { backgroundColor: colors.White, color: colors.BlackGrayScale, paddingHorizontal: 0, borderBottomWidth: 0.7, borderBottomColor: colors.Silver, width: "100%", }]}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.column, styles.p_3]}>
                                <View style={styles.row_between_center}>
                                    <Text numberOfLines={1} style={[styles.font_14]}>
                                        Pilih Ekspedisi
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setaddressId(item.address.id)
                                            setstorePressed(item.store);
                                            setindexStore(item.store.id);
                                            if (item.shippingSelected?.dateSendTime) {
                                                setSendDate(item.shippingSelected.dateSendTime);
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.font_14,
                                                { color: colors.BlueJaja },
                                            ]}
                                        >
                                            Pilih
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                        }
                    </>
                </View>
            </View >
        )
    }

    const renderAlamat = (address, index) => {
        return (
            <View style={styles.column}>
                <View style={[styles.row, styles.px_2, styles.py_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlueJaja, }]}>
                    <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: "2%" },]} source={require("../../assets/icons/google-maps.png")} />
                    <View style={[styles.row_between_center, { flex: 1 }]}>
                        <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>
                            Alamat Pengiriman
                        </Text>
                    </View>
                </View>
                <View style={[styles.column, styles.p_3]}>
                    <View style={styles.row_between_center}>
                        <Text numberOfLines={1} style={[styles.font_14, { width: "70%" }]}>
                            {address.receiverName}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.font_12, styles.mt]}>
                        {address.phoneNumber}
                    </Text>

                    <Text numberOfLines={3} style={[styles.font_12]}>
                        {address.address}
                    </Text>
                </View>
            </View>
        )
    }

    const renderProduct = ({ item }) => {
        return (
            <View style={[styles.column, styles.p_2, { width: '100%' }]}>
                <View style={[styles.row_start_center, styles.py_2, { flex: 1, width: "100%", height: Wp("24%") }]}>
                    <Image style={{ width: "20%", height: "100%", borderRadius: 4, backgroundColor: colors.White, borderWidth: 0.2, borderColor: colors.Silver, alignSelf: "center", }}
                        resizeMethod={"scale"}
                        resizeMode="cover"
                        source={{ uri: item.image }}
                    />
                    <View style={[styles.column_between_center, { width: '80%', alignItems: "flex-start", height: "100%", paddingLeft: '2%', }]} >
                        <View style={[styles.column, { width: '100%' }]}>
                            <Text numberOfLines={1} style={[styles.font_14, styles.T_medium]}>{item.name}</Text>
                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale }]}>{item.variant ? item.variant : ""}</Text>
                        </View>
                        <View style={{ flexDirection: "column", width: "100%", alignItems: "flex-end" }}>
                            {item.isDiscount ? (
                                <>
                                    <Text numberOfLines={1} style={[styles.priceBefore, styles.T_italic]}>
                                        {item.priceCurrencyFormat}
                                    </Text>
                                    <View style={styles.row}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.font_14]}
                                        >
                                            {item.qty} x
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styles.priceAfter,
                                                { color: colors.BlackGrayScale },
                                            ]}
                                        >
                                            {" "}
                                            {item.priceDiscountCurrencyFormat}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.row}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.font_14]}
                                    >
                                        {item.qty} x
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.priceAfter,
                                            { color: colors.BlackGrayScale },
                                        ]}
                                    >
                                        {" "}
                                        {item.priceCurrencyFormat}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View style={[styles.row_end_center]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.font_14,
                            styles.T_medium,
                            { color: colors.BlueJaja },
                        ]}
                    >
                        {" "}
                        {item.subTotalCurrencyFormat}
                    </Text>
                </View>
            </View >

        )
    }

    const deliverySelected = (code, val) => {
        actionSheetDelivery.current?.setModalVisible();
        setTimeout(() => setloading(true), 100);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=f7mkmnsrubv4fb7flu6tfcv8uecmproe");

        var raw = JSON.stringify({
            storeId: storePressed.id,
            shippingCode: code,
            shippingTypeCode: val.code,
            sendTime: sendTime === "pilih tangall" && sendDate ? sendTime : "setiap saat",
            dateSendTime: sendDate,
            addressId: addressId,
        });
        console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 464 ~ deliverySelected ~ raw", raw)

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(`https://jaja.id/backend/checkout/selectedShipping?is_gift=0&is_multidrop=1`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                console.log("🚀 ~ file: CheckoutMultiDropScreen.js ~ line 500 ~ .then ~ res", res)
                setloading(false);
                try {
                    let result = JSON.parse(res);
                    if (result?.status?.code === 200) {
                        setaddressId(null)
                        handleDataCheckout(useCoin)
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12101");
                    }
                } catch (error) {
                    Utils.handleErrorResponse(JSON.stringify(res + "\n\n" + error, "Error with status code : 12102"));
                }
            })
            .catch((error) => {
                Utils.handleError(error, "Error with status code : 12103");
                setloading(false);
            });
        setTimeout(() => setloading(false), 15000);
    };


    // const handleDataCheckout = (coin) => {
    //     setUseCoin(coin);
    //     dispatch({ type: "SET_USECOIN", payload: coin });
    //     ServiceCheckout.getCheckout(reduxAuth, coin ? 1 : 0)
    //       .then((res) => {
    //         if (res) {
    //           dispatch({ type: "SET_CHECKOUT", payload: res });
    //           actionSheetVoucher.current?.setModalVisible(false);
    //           return res;
    //         } else {
    //           return false;
    //         }
    //       })
    //       .catch((res) => {
    //         return false;
    //       });
    //   };

    const handleCheckoutMultiDrop = () => {
        // Alert.alert(
        //     `${dataCheckout.total > 0 ? "Pilih Pembayaran" : "Buat Pesanan"}`,
        //     `${dataCheckout.total > 0
        //         ? "Pesanan kamu akan dilanjutkan ke menu pembayaran!."
        //         : "Pesanan kamu akan dibuat!"
        //     }`,

        //     [
        //         {
        //             text: "Periksa Lagi",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel",
        //         },
        //         {
        //             text: "Bayar",
        // onPress: () => {
        setmodalNext(false)
        setloading(true);
        let newArr = notes;
        for (let index = 0; index < 2; index++) {
            if (!newArr[index]) {
                newArr[index] = { note: "" };
            }
        }

        setTimeout(() => {
            if (dataCheckout.total <= 0) {
                Utils.alertPopUp("Persanan berhasil dibuat!");
            }
            let error = true;
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                cart: newArr,
                koin: reduxUseCoin,
            });
            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            fetch("https://jaja.id/backend/checkout/test_multidrop?is_gift=0", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    error = false;
                    try {
                        let data = JSON.parse(result);
                        if (data && Object.keys(data).length && data.status.code == 200) {
                            dispatch({ type: "SET_INVOICE", payload: data.data });
                            dispatch({ type: "SET_ORDER_STATUS", payload: null });
                            navigation.replace("OrderDetails");

                            ServiceCart.getTrolley(reduxAuth, 0, dispatch);

                            ServiceUser.getBadges(reduxAuth).then((res) => {
                                if (res) {
                                    dispatch({ type: "SET_BADGES", payload: res });
                                } else {
                                    dispatch({ type: "SET_BADGES", payload: {} });
                                }
                            });
                            ServiceOrder.getUnpaid(reduxAuth).then((resUnpaid) => {
                                if (resUnpaid && Object.keys(resUnpaid).length) {
                                    dispatch({
                                        type: "SET_UNPAID",
                                        payload: resUnpaid.items,
                                    });
                                    dispatch({
                                        type: "SET_ORDER_FILTER",
                                        payload: resUnpaid.filters,
                                    });
                                }
                            });
                            ServiceOrder.getWaitConfirm(reduxAuth).then(
                                (reswaitConfirm) => {
                                    if (
                                        reswaitConfirm &&
                                        Object.keys(reswaitConfirm).length
                                    ) {
                                        dispatch({
                                            type: "SET_WAITCONFIRM",
                                            payload: reswaitConfirm.items,
                                        });
                                        dispatch({
                                            type: "SET_ORDER_FILTER",
                                            payload: reswaitConfirm.filters,
                                        });
                                    }
                                }
                            );
                        } else {
                            setloading(false);
                            Utils.handleErrorResponse(
                                data,
                                "Error with status code : 120488"
                            );
                            return null;
                        }
                        setTimeout(() => {
                            setloading(false);
                        }, 2000);
                    } catch (err) {
                        error = false;
                        Utils.handleError(result, "Error with status code : 120499");
                        setloading(false);
                    }
                    setTimeout(() => {
                        setloading(false);
                    }, 2000);
                })
                .catch((err) => {
                    setloading(false);
                    Utils.handleError(err, "Error with status code : 1204777");
                });
            setTimeout(() => {
                let text = "Tidak dapat terhubung, periksa kembali koneksi internet anda!";
                if (error) {
                    Utils.CheckSignal().then((res) => {
                        if (res.connect) {
                            Utils.alertPopUp("Sedang memuat..");
                        } else {
                            setloading(false);
                            Utils.alertPopUp(text);
                        }
                        setTimeout(() => {
                            setloading(false);
                            if (error) {
                                Utils.alertPopUp(text);
                            }
                        }, 5000);
                    });
                }
            }, 5000);
        }, 250);
        //             },
        //         },
        //     ]
        // );
    }


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BlueJaja }]}>
            <StatusBar backgroundColor={colors.BlueJaja} barStyle="light-content" />
            <View style={{ flex: 1, backgroundColor: colors.WhiteBack }}>
                {loading ? <Loading /> : null}
                {/* <View style={[styles.row_start_center, { height: Platform.OS === 'ios' ? Hp('7%') : Hp('7%'), width: Wp('100%'), backgroundColor: colors.BlueJaja, paddingHorizontal: '4%', paddingBottom: '4%' }]}>
                    <TouchableOpacity style={[styles.row_start_center, { marginRight: '2%' }]} onPress={() => navigation.replace('TrolleyMultiDrop')}>
                        <Image style={[styles.appBarButton, { tintColor: colors.White }]} source={require('../../assets/icons/arrow.png')} />
                    </TouchableOpacity>
                    <Text style={[styles.font_15, { fontFamily: 'Poppins-SemiBold', width: '60%', color: colors.White }]}>Checkout</Text>
                </View> */}
                <Appbar back={true} title="Checkout" />

                <View style={[styles.container]}>
                    <ScrollView contentContainerStyle={{ paddingBottom: Hp('7%') }} showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={dataCheckout?.cart}
                            keyExtractor={(item, index) => String(index + 'KC')}
                            renderItem={renderItem}
                        />
                        <View
                            style={[
                                styles.column,
                                { backgroundColor: colors.White, marginBottom: "2%" },
                            ]}
                        >
                            <View
                                style={[
                                    styles.row,
                                    styles.p_3,
                                    { borderBottomWidth: 0.5, borderBottomColor: colors.BlueJaja },
                                ]}
                            >
                                <Image
                                    style={[
                                        styles.icon_21,
                                        { tintColor: colors.BlueJaja, marginRight: "2%" },
                                    ]}
                                    source={require("../../assets/icons/invoice.png")}
                                />
                                <Text
                                    style={[
                                        styles.font_14,
                                        styles.T_semi_bold,
                                        { color: colors.BlueJaja },
                                    ]}
                                >
                                    Ringkasan Belanja
                                </Text>
                            </View>

                            <View style={[styles.row_between_center, styles.p_3]}>
                                <View style={styles.column_center_start}>
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        Total Belanja ({dataCheckout?.totalAllProduct} produk)
                                    </Text>
                                    {dataCheckout.voucherJajaType === "diskon" ? (
                                        <Text style={[xstyles.font_13, { marginBottom: "2%" }]}>
                                            Diskon Belanja
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        Biaya Pengiriman
                                    </Text>
                                    {dataCheckout.voucherJajaType === "ongkir" ? (
                                        <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                            Diskon Pengiriman
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        Biaya penanganan
                                    </Text>
                                    {dataCheckout.coinUsed ? (
                                        <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                            Koin Digunakan
                                        </Text>
                                    ) : null}
                                    <View
                                        style={[
                                            styles.row_start_center,
                                            {
                                                width: Wp("50%"),
                                                marginLeft: Platform.OS === "android" ? "-6.5%" : 0,
                                                marginTop: Platform.OS === "android" ? 0 : "3%",
                                                paddingLeft: "-2%",
                                                opacity: reduxCoin == 0 ? 0.4 : 1,
                                            },
                                        ]}
                                    >
                                        {Platform.OS === "android" ? (
                                            <Checkbox
                                                disabled={reduxCoin == 0 ? true : false}
                                                theme={{ mode: "adaptive" }}
                                                color={colors.BlueJaja}
                                                status={useCoin ? "checked" : "unchecked"}
                                                onPress={() => handleDataCheckout(!useCoin)}
                                            />
                                        ) : (
                                            <CheckBox
                                                disabled={reduxCoin == 0 ? true : false}
                                                value={useCoin ? true : false}
                                                onValueChange={() => handleDataCheckout(!useCoin)}
                                                style={[styles.mr_4]}
                                            />
                                        )}
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styles.font_13,
                                                { textAlignVertical: "center", marginBottom: "-1%" },
                                            ]}
                                        >
                                            Koin dimiliki
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.column_center_end}>
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        {dataCheckout.subTotalCurrencyFormat}
                                    </Text>
                                    {dataCheckout.voucherJajaType === "diskon" ? (
                                        <Text
                                            style={[
                                                styles.font_13,
                                                { marginBottom: "2%", color: colors.RedFlashsale },
                                            ]}
                                        >
                                            {dataCheckout.voucherDiscountJajaCurrencyFormat}
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        {dataCheckout.shippingCostCurrencyFormat}
                                    </Text>
                                    {dataCheckout.voucherJajaType === "ongkir" ? (
                                        <Text
                                            style={[
                                                styles.font_13,
                                                { marginBottom: "2%", color: colors.RedFlashsale },
                                            ]}
                                        >
                                            {dataCheckout.voucherDiscountJajaCurrencyFormat}
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.font_13, { marginBottom: "2%" }]}>
                                        Rp0
                                    </Text>
                                    {dataCheckout.coinUsed ? (
                                        <Text
                                            style={[
                                                styles.font_13,
                                                { color: colors.RedFlashsale, marginBottom: "2%" },
                                            ]}
                                        >
                                            [-{dataCheckout.coinUsedFormat}]
                                        </Text>
                                    ) : null}
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.font_13,
                                            styles.py_2,
                                            {
                                                textAlignVertical: "center",
                                                marginBottom: "-2%",
                                                opacity: reduxCoin == 0 ? 0.4 : 1,
                                                backgroundColor: colors.White,
                                            },
                                        ]}
                                    >
                                        ({reduxCoin})
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* {dataCheckout?.voucherJajaSelected ?
                        <View
                            style={[
                                styles.column,
                                { backgroundColor: colors.White, marginBottom: "2%" },
                            ]}
                        >
                            <View
                                style={[
                                    styles.row,
                                    styles.p_3,
                                    {
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: colors.BlackGrey,
                                    },
                                ]}
                            >
                                <Image
                                    style={[
                                        styles.icon_21,
                                        { tintColor: colors.BlueJaja, marginRight: "2%" },
                                    ]}
                                    source={require("../../assets/icons/offer.png")}
                                />
                                <Text
                                    style={[
                                        styles.font_14,
                                        styles.T_semi_bold,
                                        { color: colors.BlueJaja },
                                    ]}
                                >
                                    Voucher Diskon
                                </Text>
                            </View>
                            <View style={[styles.column, styles.p_3]}>
                                <View style={[styles.row_between_center, styles.mb]}>
                                    <Text numberOfLines={1} style={[styles.font_13]}>
                                        {dataCheckout.voucherJajaSelected.name}
                                    </Text>
                                    <TouchableOpacity onPress={() => setvoucherOpen("jaja")}>
                                        <Text style={[styles.font_12, { color: colors.BlueJaja }]}>     Ubah </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.row_between_center}>
                                    <Text numberOfLines={1} style={[styles.font_12, styles.mt_2]}>Berakhir dalam {dataCheckout.voucherJajaSelected.endDate}</Text>
                                    <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3, },]}>
                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}> - {dataCheckout.voucherJajaSelected.discountText} </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null} */}
                    </ScrollView>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            zIndex: 100,
                            elevation: 3,
                            height: Hp("7%"),
                            width: Wp("100%"),
                            backgroundColor: colors.White,
                            flex: 0,
                            flexDirection: "row",
                        }}
                    >
                        <View
                            style={{
                                width: "50%",
                                height: "100%",
                                justifyContent: "center",
                                paddingHorizontal: "2%",
                                paddingLeft: "4%",
                                paddingVertical: "1%",
                            }}
                        >
                            <Text
                                style={[
                                    styles.font_12,
                                    styles.T_medium,
                                    { color: colors.BlueJaja, marginBottom: "-2%" },
                                ]}
                            >
                                Total pembayaran :
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.font_17,
                                    styles.T_semi_bold,
                                    { color: colors.BlueJaja },
                                ]}
                            >
                                {dataCheckout.totalCurrencyFormat}
                            </Text>
                        </View>
                        {/* <Button  style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                </Button> */}
                        <TouchableRipple
                            style={{
                                backgroundColor: colors.BlueJaja,
                                width: "50%",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() => setmodalNext(true)}
                        >
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.font_13,
                                    styles.T_semi_bold,
                                    { color: colors.White },
                                ]}
                            >
                                {dataCheckout.total > 0 ? "PILIH PEMBAYARAN" : "BUAT PESANAN"}
                            </Text>
                        </TouchableRipple>
                    </View>
                </View>

                <ActionSheet
                    ref={actionSheetDelivery}
                    delayActionSheetDraw={false}
                    containerStyle={{ width: Wp("100%"), padding: "3%" }}
                    onClose={() => setindexStore(null)}
                >
                    <View
                        style={[
                            styles.row_between_center,
                            styles.py_2,
                            styles.px_3,
                            styles.mb_3,
                        ]}
                    >
                        <Text
                            style={[
                                styles.font_14,
                                styles.T_semi_bold,
                                { marginBottom: "-1%" },
                            ]}
                        >
                            Pilih Pengiriman
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "transparent",
                                paddingVertical: "2%",
                                paddingHorizontal: "3%",
                            }}
                            onPressIn={() => actionSheetDelivery.current?.setModalVisible()}
                        >
                            <Image
                                style={[styles.icon_12, { tintColor: colors.BlackGrayScale }]}
                                source={require("../../assets/icons/close.png")}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "column", minHeight: Hp("20%"), maxHeight: Hp("60%"), width: "100%", paddingBottom: "5%", }} >
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ width: "100%" }} >
                            <View style={[styles.column, { width: "100%" }]}>
                                {/* <Text style={[styles.font_14, styles.mb_3, { color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold', borderBottomWidth: 0.5, borderBottomColor: colors.BlueJaja }]}>{item.title}</Text> */}
                                {reduxShipping && reduxShipping.length ? (
                                    <View style={styles.column}>
                                        <View
                                            style={[
                                                styles.column_center_start,
                                                styles.mb_2,
                                                styles.py_2,
                                                styles.px_2,
                                                { width: "100%" },
                                            ]}
                                        >
                                            <FlatList
                                                inverted
                                                data={reduxShipping[0]?.sendTime}
                                                keyExtractor={(item, index) => String(index + 'KA')}
                                                style={{ width: "100%" }}
                                                renderItem={({ item }) => {
                                                    if (item.value !== 'pilih tanggal') {
                                                        return (
                                                            <View
                                                                style={[
                                                                    styles.column,
                                                                    styles.mb_3,
                                                                    styles.py_2,
                                                                    { width: "100%" },
                                                                ]}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => setsendTime(item.value)}
                                                                    style={styles.row_start_center}
                                                                >
                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={sendTime === item.value ? true : false}
                                                                        onValueChange={() => {
                                                                            if (item.value !== "pilih tanggal") {
                                                                                setSendDate("");
                                                                            }
                                                                            setsendTime(item.value);
                                                                        }}
                                                                    />
                                                                    <View
                                                                        style={[
                                                                            styles.row_between_center,
                                                                            Platform.OS === "ios"
                                                                                ? styles.ml_3
                                                                                : styles.ml_2,
                                                                        ]}
                                                                    >
                                                                        <Text
                                                                            style={[
                                                                                styles.font_14,
                                                                                styles.T_medium,
                                                                                { flex: 1 },
                                                                            ]}
                                                                        >
                                                                            {item.name}
                                                                        </Text>
                                                                        <Text
                                                                            style={[styles.font_14, styles.T_medium]}
                                                                        >
                                                                            {item.priceCurrencyFormat}
                                                                        </Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {sendTime === "pilih tanggal" &&
                                                                    item.value === "pilih tanggal" ? (
                                                                    <TouchableOpacity
                                                                        style={[
                                                                            styles.column,
                                                                            styles.px_2,
                                                                            { width: "100%" },
                                                                        ]}
                                                                        onPress={() => {
                                                                            actionSheetDelivery.current?.setModalVisible(
                                                                                false
                                                                            );
                                                                            setTimeout(() => {
                                                                                setDatePickerVisibility(true);
                                                                            }, 500);
                                                                        }}
                                                                    >
                                                                        <View style={styles.row_between_center}>
                                                                            <Text style={styles.font_14}>
                                                                                {sendDate}
                                                                            </Text>
                                                                            <Image
                                                                                source={require("../../assets/icons/calendar.png")}
                                                                                style={[
                                                                                    styles.icon_19,
                                                                                    { tintColor: colors.BlueJaja },
                                                                                ]}
                                                                            />
                                                                        </View>
                                                                        <View
                                                                            style={{
                                                                                width: "100%",
                                                                                borderTopWidth: 1,
                                                                                borderTopColor: colors.Silver,
                                                                                marginTop: "2%",
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={[styles.font_12, styles.T_italic]}
                                                                            >
                                                                                Pilih tanggal pengiriman dari penjual
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                ) : null}
                                                            </View>
                                                        );
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_3]}>
                                            <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: "-1%" },]} >Pilih EkpedisI</Text>
                                        </View>
                                        <FlatList

                                            data={shippingSelected}
                                            keyExtractor={(item, index) => String(index) + "KJ"}
                                            style={{ width: "100%" }}
                                            renderItem={({ item }) => {
                                                let code = item.code;
                                                let Ename = item.name;
                                                return (
                                                    <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_4, { borderBottomWidth: 1, borderBottomColor: colors.Silver, width: "100%", }]}>
                                                        <Text style={[styles.font_14, { fontFamily: "Poppins-SemiBold", color: colors.BlueJaja, }]}>{Ename}</Text>
                                                        <FlatList
                                                            data={item.type}
                                                            keyExtractor={(item, index) => String(index) + "AL"}
                                                            style={{ width: "100%" }}
                                                            renderItem={({ item }) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        onPress={() => deliverySelected(code, item)}
                                                                        style={[styles.column_center_start, styles.mb_3, styles.py_2, { width: "100%" }]}>
                                                                        <View style={styles.row_between_center}>
                                                                            <Text style={[styles.font_14, styles.T_medium, { flex: 1 }]}>{item.name}</Text>
                                                                            <Text style={[styles.font_14, styles.T_medium]}     >
                                                                                {item.priceCurrencyFormat}
                                                                            </Text>
                                                                        </View>
                                                                        <Text style={[styles.font_12, styles.T_italic]}>
                                                                            Estimasi {item.etdText}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                );
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <Text style={[styles.font_14, styles.mt_5, { alignSelf: "center" }]}>
                                        Sedang memuat..
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </ActionSheet >
            </View>
            <Modal
                statusBarTranslucent={true}
                animationType="fade"
                transparent={true}
                visible={modalNext}
                onRequestClose={() => {
                    setmodalNext(!modalNext);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        width: Wp("100%"),
                        height: Hp("100%"),
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={[
                            styles.column_between_center,
                            styles.p_3,
                            {
                                alignItems: 'flex-start',
                                width: Wp("85%"),
                                height: Wp("45%"),
                                borderRadius: 7,
                                backgroundColor: colors.White,
                                elevation: 11,
                                zIndex: 999,
                            },
                        ]}
                    >

                        <Text style={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja }]} >{dataCheckout.total > 0 ? "Pilih Pembayaran" : "Buat Pesanan"}</Text>
                        <Text style={[styles.font_13, styles.T_medium, { marginTop: '-3%' }]} >{dataCheckout.total > 0
                            ? "Pesanan kamu akan dilanjutkan ke menu pembayaran!."
                            : "Pesanan kamu akan dibuat!"
                        }</Text>
                        <View style={[styles.row_end, { width: '100%' }]}>
                            <TouchableRipple onPress={() => setmodalNext(false)} style={[styles.px_4, styles.py_2, { borderRadius: 3, backgroundColor: colors.YellowJaja }]}>
                                <Text style={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>PERIKSA LAGI</Text>
                            </TouchableRipple>
                            <TouchableRipple onPress={handleCheckoutMultiDrop} style={[styles.px_4, styles.py_2, styles.ml_2, { borderRadius: 3, backgroundColor: colors.BlueJaja }]}>
                                <Text style={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>BAYAR</Text>
                            </TouchableRipple>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}