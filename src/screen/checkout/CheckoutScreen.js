



import React, { useEffect, useState, createRef, useRef, useCallback } from 'react'
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, StatusBar, FlatList, ToastAndroid, TextInput, RefreshControl, Modal } from 'react-native'
import { Appbar, colors, styles, Wp, Hp, useNavigation, ServiceCheckout, Loading, Utils, ServiceCart, ServiceUser, ServiceOrder } from '../../export'
import { Button, TouchableRipple, Checkbox } from 'react-native-paper'
import ActionSheet from "react-native-actions-sheet";
import CheckBox from '@react-native-community/checkbox';
import { useDispatch, useSelector } from "react-redux";
import EncryptedStorage from 'react-native-encrypted-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function checkoutScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const reduxCheckout = useSelector(state => state.checkout.checkout)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxCoin = useSelector(state => state.user.user.coinFormat)
    const reduxUseCoin = useSelector(state => state.checkout.useCoin)


    const reduxShipping = useSelector(state => state.checkout.shipping)
    const reduxListPayment = useSelector(state => state.checkout.listPayment)
    const [refreshControl, setRefreshControl] = useState(false)
    const [showModal, setModalShow] = useState(false);

    const actionSheetVoucher = createRef();
    const actionSheetDelivery = createRef();
    const actionSheetPayment = createRef();

    const [storePressed, setstorePressed] = useState({})
    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState(false)
    const [loadAs, setloadAs] = useState(false)

    const [selectedPayment, setselectedPayment] = useState('')
    const [selectedSubPayment, setselectedSubPayment] = useState('')
    const [subPayment, setsubPayment] = useState([])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [voucherFilters, setvoucherFilters] = useState([])
    const [indexStore, setindexStore] = useState(0)
    const [sendTime, setsendTime] = useState("setiap saat")

    const [vouchers, setVouchers] = useState([])
    const [voucherOpen, setvoucherOpen] = useState("")

    const [maxSendDate, setmaxSendDate] = useState("")

    const [deliveryDate, setdeliveryDate] = useState("")
    const [notes, setNotes] = useState([])
    const [sendDate, setsendDate] = useState("")

    const [rangeDate, setrangeDate] = useState([])
    const [listMonth, setlistMonth] = useState(["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "September", "Desember"])
    const [useCoin, setUseCoin] = useState(false)

    const [dateMin, setdateMin] = useState({
        year: 0,
        month: 0,
        date: 0,
    });

    const [dateMax, setdateMax] = useState({
        year: 0,
        month: 0,
        date: 0,
    });
    useEffect(() => {
        setRefreshControl(false)
        setLoad(false)
        setLoading(false)
        if (reduxAuth) {
            getVouchers(reduxAuth)
        } else {
            navigation.navigate("Login")
        }
        if (voucherOpen) {
            actionSheetVoucher.current?.setModalVisible(true)
        }
        if (Object.keys(reduxCheckout).length) {
            setLoading(false)
        } else {
            setLoading(true)
        }

    }, [reduxCheckout, voucherOpen, reduxShipping, useCoin])

    useEffect(() => {
        if (selectedSubPayment) {
            setTimeout(() => actionSheetPayment.current?.setModalVisible(false), 750);

        }
    }, [selectedSubPayment])


    useEffect(() => {
        var future = new Date();
        future.setDate(future.getDate() + 2);
        setdateMin({
            year: future.getFullYear(),
            month: future.getMonth(),
            date: future.getDate()
        })
        future.setDate(future.getDate() + 5);

        setdateMax({
            year: future.getFullYear(),
            month: future.getMonth(),
            date: future.getDate()
        })
    }, [])



    const getCheckout = (coin) => {
        if (coin) {
            dispatch({ type: 'SET_USECOIN', payload: true })
        } else {
            dispatch({ type: 'SET_USECOIN', payload: false })

        }
        ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
            if (res) {
                dispatch({ type: 'SET_CHECKOUT', payload: res })
                actionSheetVoucher.current?.setModalVisible(false)
                return res
            } else {
                return false
            }
        }).catch(res => {
            return false
        })
        // dispatch({ type: 'SET_ACTION_SHEET', payload: true })
    }
    const getVouchers = (token) => {
        // ServiceVoucher.getVouchers(token).then(res => {
        //     if (res) {
        //         setVouchers(res.items)
        //         setvoucherFilters(res.filters)
        //     }
        // })
    }

    const handleVoucher = (val, index) => {
        if (voucherOpen == "store") {
            if (val.isClaimed) {
                actionSheetVoucher.current?.setModalVisible()
                setTimeout(() => setloadAs(true), 100);
                var myHeaders = new Headers();
                myHeaders.append("Authorization", reduxAuth);
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify({
                    "voucherId": val.id,
                    "storeId": val.storeId
                });
                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("https://jaja.id/backend/checkout/selectedVoucherStore", requestOptions)
                    .then(response => response.text())
                    .then(res => {
                        try {
                            let result = JSON.parse(res)
                            if (result.status.code === 200) {
                                Utils.alertPopUp('Voucher berhasil digunakan!')
                                getCheckout(reduxUseCoin);
                            } else {
                                Utils.handleErrorResponse(result, 'Error with status code : 12060')
                            }
                        } catch (error) {
                            Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12061'))
                        }
                        setTimeout(() => setloadAs(false), 500);
                    })
                    .catch(error => {
                        setloadAs(false)
                        setTimeout(() => Utils.handleError(error, 'Error with status code : 12062'), 100);
                    });
            } else {
                handleClaimVoucher("store", val.id, index)
            }

        } else if (voucherOpen == "jaja") {
            if (val.isClaimed) {
                actionSheetVoucher.current?.setModalVisible()
                setTimeout(() => setLoad(true), 100);
                var headers = new Headers();
                headers.append("Authorization", reduxAuth);
                headers.append("Content-Type", "application/json");
                headers.append("Cookie", "ci_session=h2pi6rhg4uma28jrsci9ium4tf7k8id4");
                var row = JSON.stringify({ "voucherId": val.id });
                var rq = {
                    method: 'PUT',
                    headers: headers,
                    body: row,
                    redirect: 'follow'
                };

                fetch("https://jaja.id/backend/checkout/selectedVoucherJaja", rq)
                    .then(response => response.text())
                    .then(res => {
                        try {
                            let result = JSON.parse(res)
                            setTimeout(() => setLoad(false), 500);
                            if (result.status.code === 200) {
                                // Utils.alertPopUp(item.isClaimed ? '' : 'Voucher berhasil digunakan!')
                                getCheckout(reduxUseCoin)
                            } else {
                                Utils.handleErrorResponse(result, 'Error with status code 12063')
                            }
                        } catch (error) {
                            setLoad(false)
                            Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12064'))
                        }
                    })
                    .catch(error => {
                        setLoad(false)
                        setTimeout(() => Utils.handleError(JSON.stringify(error), 'Error with status code : 12065'), 100);
                    });

            } else {
                handleClaimVoucher("jaja", val.id, index)
            }
        }
        setTimeout(() => setLoad(false), 5000);
    }
    const handleClaimVoucher = (name, voucherId, index) => {
        setloadAs(true)
        if (name === "store") {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");
            var raw = JSON.stringify({ "voucherId": voucherId });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/voucher/claimVoucherStore", requestOptions)
                .then(response => response.text())
                .then(res => {
                    try {
                        let result = JSON.parse(res)
                        if (result.status.code === 200) {
                            ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
                                if (res) {
                                    setvoucherOpen('store')
                                    setVouchers(res.cart[indexStore].voucherStore)
                                    dispatch({ type: 'SET_CHECKOUT', payload: res })
                                }
                            })
                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12067')
                        }
                        setTimeout(() => setloadAs(false), 500);
                    } catch (error) {
                        setloadAs(false)
                        Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12068'))

                    }
                })
                .catch(error => {
                    setloadAs(false)
                    Utils.handleError(error, 'Error with status code : 12069')
                });

        } else {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "voucherId": voucherId });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/voucher/claimVoucherJaja", requestOptions)
                .then(response => response.text())
                .then(res => {
                    setTimeout(() => setloadAs(false), 500);
                    try {
                        let result = JSON.parse(res)
                        if (result.status.code === 200) {
                            ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
                                if (res) {
                                    setvoucherOpen('jaja')
                                    setVouchers(res.voucherJaja)
                                    dispatch({ type: 'SET_CHECKOUT', payload: res })
                                }
                            })
                        } else {
                            setTimeout(() => Utils.handleErrorResponse(result, 'Error with status code : 12070'), 100);
                        }
                    } catch (error) {
                        Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12071'))
                    }
                })
                .catch(error => {
                    setloadAs(false)
                    Utils.handleError(error, 'Error with status code : 12072')
                });
        }
    }

    const deliverySelected = (code, val) => {
        actionSheetDelivery.current?.setModalVisible()
        setTimeout(() => setLoad(true), 100);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=b5p6pllgk6nasb4odeguib41hl576554");

        var raw = JSON.stringify({
            "storeId": storePressed.id,
            "shippingCode": code,
            "shippingTypeCode": val.code,
            "sendTime": sendTime,
            "dateSendTime": sendDate
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/checkout/selectedShipping", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result.status.code === 200) {
                        setTimeout(() => actionSheetVoucher.current?.setModalVisible(false), 1000);
                        ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
                            if (res) {
                                dispatch({ type: 'SET_CHECKOUT', payload: res })
                            }
                        }).catch(res => {
                            console.log("🚀 ~ file: CheckoutScreen.js ~ line 329 ~ ServiceCheckout.getCheckout ~ res", res)
                        })
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12074')
                    }
                } catch (error) {
                    Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12075'))
                }
                setTimeout(() => setLoad(false), 11000);
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12076")
                setLoad(false)
            })
        setTimeout(() => setLoad(false), 5000);
    }

    const handleDescription = voucher => {
        console.log("file: VoucherScreen.js ~ line 154 ~ VoucherScreen ~ voucher", voucher)
        Alert.alert(
            "Syarat dan Ketentuan Voucher",
            `\n\n1. ${voucher.name}
            \n2. Voucher ${String(voucher.category) === "ongkir" ? "Gratis Biaya Pengiriman" : String(voucher.category) === "diskon" ? 'Diskon Belanja' : "CASHBACK"}
            \n3. Mulai tanggal ${voucher.startDate}
            \n4. Berakhir tanggal ${voucher.endDate}
            \n5. Diskon didapatkan ${voucher.discountText}
            ${voucher.minShoppingCurrencyFormat ? '\n6. Minimal pembelian ' + voucher.minShoppingCurrencyFormat : ""}
            `,
            [
                {
                    text: "Setuju",
                    onPress: () => console.log("cok"),
                    style: "cancel",
                },
            ],
            {
                cancelable: false,
            }
        );
    }

    const handleConfirmDate = (date) => {
        try {
            let mont = new Date()
            // let year = new Date().getFullYear()
            let str = JSON.stringify(date);
            let dateDay = str.slice(9, 11);
            let dateMonth = str.slice(6, 8);
            setdeliveryDate(str.slice(1, 11))
            let min = str.slice(6, 8) - JSON.stringify(mont).slice(6, 8)
            if (str.slice(1, 8) === JSON.stringify(mont).slice(1, 8) && parseInt(min) <= 1) {
                setdeliveryDate(str.slice(1, 11))
                let string = listMonth[parseInt(dateMonth) - 1];
                setsendDate(dateDay.replace(0, "") + " " + string)
            } else {
                ToastAndroid.show(`Minimal tanggal pengiriman ${sendDate} sampai seterusnya`, ToastAndroid.LONG, ToastAndroid.CENTER)
                ToastAndroid.show(`Maksimal tanggal pengiriman 1 bulan setelah barang sampai`, ToastAndroid.LONG, ToastAndroid.CENTER)

            }
        } catch (error) {
            console.log("errorrr  ", error)
        }
        setDatePickerVisibility(false)

    };

    const handleListDate = (index) => {
        let string = new Date().getDate() + parseInt(reduxShipping[index].items[0].type[0].etd.slice(2, 3)) + " " + listMonth[new Date().getMonth()];
        console.log("🚀 ~ file: CheckoutScreen.js ~ line 160 ~ handleListDate ~ string", string)
        setmaxSendDate(string)
        setsendDate(string)

        let range = new Date().getDate() + parseInt(reduxShipping[index].items[0].type[0].etd.slice(2, 3));
        console.log("🚀 ~ file: CheckoutScreen.js ~ line 158 ~ handleListDate ~ range", range)
        let arrNewRange = [];
        for (let idx = 0; idx < range; idx++) {
            arrNewRange.push(range + idx)
        }
        setrangeDate(arrNewRange)
        actionSheetDelivery.current?.setModalVisible(true)

    }
    const checkedValue = (index) => {
        if (reduxShipping.length) {
            handleListDate(index)
        } else {
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                if (reduxShipping.length) {
                    handleListDate(index)
                } else {
                    setTimeout(() => {
                        console.log("🚀 ~ file: CheckoutScreen.js ~ line 186 ~ setTimeout ~ reduxShipping", reduxShipping)
                        if (reduxShipping.length) {
                            handleListDate(index)
                        } else {
                            console.log("keluar")
                        }
                    }, 3000);
                }
            }, 2000);
        }
    }

    const handleNotes = (val, index) => {
        let newArr = notes;
        newArr[index] = { "note": val }
        setNotes(newArr)
    }

    const handleCheckout = () => {
        console.log("🚀 ~ file: CheckoutScreen.js ~ line 433 ~ handleCheckout ~ reduxCheckout.total", reduxCheckout.total)
        Alert.alert(
            `${reduxCheckout.total > 0 ? "Pilih Pembayaran" : 'Buat Pesanan'}`,
            `${reduxCheckout.total > 0 ? 'Pesanan kamu akan dilanjutkan ke menu pembayaran!.' : 'Pesanan kamu akan dibuat!'}`,

            [
                {
                    text: "Periksa Lagi",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Bayar", onPress: () => {
                        setLoad(true)
                        let newArr = notes;
                        for (let index = 0; index < 2; index++) {
                            if (!newArr[index]) {
                                newArr[index] = { "note": "" }
                            }
                        }

                        setTimeout(() => {
                            if (reduxCheckout.total <= 0) {
                                Utils.alertPopUp('Persanan berhasil dibuat!')
                            }
                            let error = true;
                            var myHeaders = new Headers();
                            myHeaders.append("Authorization", reduxAuth);
                            myHeaders.append("Content-Type", "application/json");
                            console.log("🚀 ~ file: CheckoutScreen.js ~ line 530 ~ setTimeout ~ reduxUseCoin", reduxUseCoin)

                            var raw = JSON.stringify({
                                'cart': newArr,
                                'koin': reduxUseCoin
                            });
                            console.log("🚀 ~ file: CheckoutScreen.js ~ line 532 ~ setTimeout ~ reduxUseCoin", reduxUseCoin)
                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: raw,
                                redirect: 'follow'
                            };

                            fetch("https://jaja.id/backend/checkout", requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    error = false
                                    try {
                                        let data = JSON.parse(result)
                                        if (data && Object.keys(data).length && data.status.code == 200) {
                                            dispatch({ type: 'SET_INVOICE', payload: data.data })
                                            dispatch({ type: 'SET_ORDER_STATUS', payload: null })
                                            navigation.replace('OrderDetails')
                                            ServiceCart.getCart(reduxAuth).then(res => {
                                                if (res) {
                                                    dispatch({ type: 'SET_CART', payload: res })
                                                }
                                            })
                                            ServiceUser.getBadges(reduxAuth).then(res => {
                                                if (res) {
                                                    dispatch({ type: "SET_BADGES", payload: res })
                                                } else {
                                                    dispatch({ type: "SET_BADGES", payload: {} })
                                                }
                                            })
                                            ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
                                                if (resUnpaid && Object.keys(resUnpaid).length) {
                                                    dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                                                    dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                                                }
                                            })
                                            ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
                                                if (reswaitConfirm && Object.keys(reswaitConfirm).length) {
                                                    dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                                                    dispatch({ type: 'SET_ORDER_FILTER', payload: reswaitConfirm.filters })
                                                }
                                            })
                                        } else {
                                            setLoad(false)

                                            Utils.handleErrorResponse(data, "Error with status code : 12048")
                                            return null
                                        }
                                        setTimeout(() => {
                                            setLoad(false)
                                        }, 2000);
                                    } catch (err) {
                                        error = false
                                        Utils.handleError(result, "Error with status code : 12049")
                                        setLoad(false)

                                    }
                                    setTimeout(() => {
                                        setLoad(false)
                                    }, 2000);

                                })
                                .catch(err => {
                                    console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", err)
                                    setLoad(false)
                                    Utils.handleError(err, "Error with status code : 120477")
                                })
                            setTimeout(() => {
                                let text = "Tidak dapat terhubung, periksa kembali koneksi internet anda!"
                                if (error) {
                                    Utils.CheckSignal().then(res => {
                                        if (res.connect) {
                                            Utils.alertPopUp("Sedang memuat..")
                                        } else {
                                            setLoad(false)
                                            Utils.alertPopUp(text)
                                        }
                                        setTimeout(() => {
                                            setLoad(false)
                                            if (error) {
                                                Utils.alertPopUp(text)
                                            }
                                        }, 5000);
                                    })
                                }
                            }, 5000);
                        }, 250);

                    }
                }
            ]
        );

    }


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
    const onRefresh = useCallback(() => {
        setRefreshControl(true)
        ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
            if (res) {
                console.log("🚀 ~ file: CheckoutScreen.js ~ line 616 ~ ServiceCheckout.getCheckout ~ res", res)
                dispatch({ type: 'SET_CHECKOUT', payload: res })
                ToastAndroid.show("Updated", ToastAndroid.LONG, ToastAndroid.CENTER)
                setTimeout(() => {
                    setRefreshControl(false)
                }, 2000);
            }
        })
        ServiceCheckout.getShipping(reduxAuth).then(res => {
            if (res) {
                dispatch({ type: 'SET_SHIPPING', payload: res })
            }
        })
        setTimeout(() => {
            setRefreshControl(false)
        }, 5000);
    }, []);


    const handleUseCoin = (coin) => {
        setUseCoin(coin)
        dispatch({ type: 'SET_USECOIN', payload: coin })
        ServiceCheckout.getCheckout(reduxAuth, coin ? 1 : 0).then(res => {
            if (res) {
                dispatch({ type: 'SET_CHECKOUT', payload: res })
                actionSheetVoucher.current?.setModalVisible(false)
                return res
            } else {
                return false
            }
        }).catch(res => {
            return false
        })
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
            <StatusBar
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Checkout" />
            {load ? <Loading /> : null}
            {Object.keys(reduxCheckout).length == 0 ? <Loading /> : null}
            <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'column', paddingBottom: Hp('7%'), backgroundColor: colors.White }} refreshControl={<RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />}>
                <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                        <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                        <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
                    </View>
                    {reduxCheckout.address && Object.keys(reduxCheckout.address).length ?
                        <View style={[styles.column, styles.p_3]}>
                            <View style={styles.row_between_center}>
                                <Text numberOfLines={1} style={[styles.font_14, { width: '70%' }]}>{reduxCheckout.address.receiverName}</Text>
                                <TouchableOpacity style={{ width: '25%', paddingVertical: 5 }} onPress={() => navigation.navigate('Address', { data: "checkout" })}>
                                    <Text style={[styles.font_12, { color: colors.BlueJaja, alignSelf: 'flex-end' }]}>Ubah</Text>
                                </TouchableOpacity>
                            </View>
                            <Text numberOfLines={1} style={[styles.font_12, styles.mt]}>{reduxCheckout.address.phoneNumber}</Text>

                            <Text numberOfLines={3} style={[styles.font_12]}>{reduxCheckout.address.address}</Text>
                        </View>
                        :
                        <View style={[styles.column, styles.p_3]}>
                            <View style={styles.row_between_center}>
                                <Text numberOfLines={1} style={[styles.font_14]}>Masukkan Alamat Baru</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Address', { data: "checkout" })}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Tambah</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
                {
                    reduxCheckout.cart && reduxCheckout.cart.length ?
                        reduxCheckout.cart.map((item, idxStore) => {
                            return (
                                <View key={String(idxStore)} style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                        <Image style={[styles.icon_21, { marginRight: '2%', tintColor: colors.BlueJaja }]} source={require('../../assets/icons/store.png')} />
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
                                                            <Text numberOfLines={1} style={[styles.font_14, styles.T_medium]}>{child.name}</Text>
                                                            <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale }]}>{child.variant ? child.variant : ""}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end', paddingHorizontal: '2%' }}>
                                                            {child.isDiscount ?
                                                                <>
                                                                    <Text numberOfLines={1} style={[styles.priceBefore, styles.T_italic]}>{child.priceCurrencyFormat}</Text>
                                                                    <View style={styles.row}>
                                                                        <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                        <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlackGrayScale }]}> {child.priceDiscountCurrencyFormat}</Text>
                                                                    </View>
                                                                </>
                                                                :
                                                                <View style={styles.row}>
                                                                    <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                    <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlackGrayScale }]}> {child.priceCurrencyFormat}</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.row_end_center, styles.px_2]}>
                                                    <Text numberOfLines={1} style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja }]}> {child.subTotalCurrencyFormat}</Text>
                                                </View>
                                            </View>
                                        )
                                    })}
                                    {item.voucherDiscount ?
                                        <View style={styles.column}>
                                            <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                                <TouchableOpacity style={[styles.row_between_center, styles.pr_2, styles.pl_3, styles.py_2]} onPress={() => {
                                                    setvoucherOpen('store')
                                                    setVouchers(item.voucherStore)
                                                    setindexStore(idxStore)
                                                }}>
                                                    {/* <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} /> */}
                                                    <Text style={[styles.font_14, styles.T_medium]}>Voucher Toko</Text>
                                                    <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
                                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {item.voucherStoreSelected.discountText}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.row_end_center, styles.px_2]}>
                                                <Text style={[styles.font_13,]}>Subtotal </Text>
                                                <Text numberOfLines={1} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}> {item.totalDiscountCurrencyFormat}</Text>
                                            </View>
                                        </View>
                                        :
                                        item.voucherStore.length ?
                                            <View style={[styles.p_2, styles.mb_2]}>
                                                <Button onPress={() => {
                                                    setvoucherOpen('store')
                                                    setVouchers(item.voucherStore)
                                                    setindexStore(idxStore)
                                                }} icon="arrow-right" color={colors.RedFlashsale} uppercase={false} labelStyle={{ fontFamily: 'Poppins-Regular', color: colors.RedFlashsale }} style={{ borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 10 }} contentStyle={{ borderColor: colors.BlueJaja }} mode="outlined">
                                                    Pakai voucher toko
                                                </Button>
                                            </View>
                                            : null
                                    }
                                    {reduxCheckout.address && Object.keys(reduxCheckout.address).length ?
                                        <>
                                            <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                                <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/vehicle-yellow.png')} />
                                                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pengiriman</Text>
                                            </View>
                                            {item.shippingSelected.name ?
                                                <TouchableOpacity onPress={() => {
                                                    console.log("cok")
                                                    checkedValue(idxStore)
                                                    setstorePressed(item.store)
                                                    setindexStore(idxStore)
                                                }}
                                                    style={[styles.column, styles.p_3, { width: '100%' }]}>
                                                    <View style={styles.row_between_center}>
                                                        <View style={[styles.column_between_center, { alignItems: 'flex-start' }]}>
                                                            <Text numberOfLines={1} style={[styles.font_14]}>{item.shippingSelected.name}</Text>
                                                            <Text numberOfLines={1} style={[styles.font_12]}>{item.shippingSelected.type}</Text>
                                                            <Text numberOfLines={1} style={[styles.font_12, styles.T_italic]}>Estimasi {item.shippingSelected.etdText}</Text>

                                                        </View>
                                                        <View style={[styles.column_between_center, { alignItems: 'flex-end' }]}>
                                                            <Text numberOfLines={1} style={[styles.font_12, styles.mb_2, { color: colors.BlueJaja }]}>Ubah</Text>

                                                            {item.shippingSelected.priceNormal ?
                                                                <Text numberOfLines={1} style={[styles.priceBefore, styles.T_italic]}>{item.shippingSelected.priceCurrencyFormatNormal}</Text>
                                                                : <Text></Text>
                                                            }

                                                            <Text numberOfLines={1} style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja, }]}>{item.shippingSelected.priceCurrencyFormat}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.column, styles.mb_3]}>
                                                        <TextInput onChangeText={(text) => handleNotes(text, idxStore)} pla placeholder="Masukkan catatan untuk penjual" style={{ fontSize: 13, color: colors.BlackGrayScale, paddingHorizontal: 0, paddingVertical: '2%', borderBottomWidth: 0.7, borderBottomColor: colors.Silver, width: '100%' }} />
                                                        <Text style={[styles.font_12, { color: colors.BlackGrey }]}>Catatan untuk penjual </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                :
                                                <View style={[styles.column, styles.p_3]}>
                                                    <View style={styles.row_between_center}>
                                                        <Text numberOfLines={1} style={[styles.font_14]}>Pilih Ekspedisi</Text>
                                                        <TouchableOpacity onPress={() => {
                                                            checkedValue(idxStore)
                                                            setstorePressed(item.store)
                                                            setindexStore(idxStore)
                                                            actionSheetDelivery.current?.setModalVisible()
                                                        }}>
                                                            <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Pilih</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                </View>
                                            }
                                        </>
                                        : null
                                    }
                                </View>
                            )
                        })
                        :
                        null
                }
                {
                    reduxCheckout.voucherJajaSelected && Object.keys(reduxCheckout.voucherJajaSelected).length ?
                        <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                            <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} />
                                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Voucher Diskon</Text>
                            </View>
                            <View style={[styles.column, styles.p_3]}>
                                <View style={[styles.row_between_center, styles.mb]}>
                                    <Text numberOfLines={1} style={[styles.font_13]}>{reduxCheckout.voucherJajaSelected.name}</Text>
                                    <TouchableOpacity onPress={() => setvoucherOpen("jaja")}>
                                        <Text style={[styles.font_12, { color: colors.BlueJaja }]}>Ubah</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.row_between_center}>
                                    <Text numberOfLines={1} style={[styles.font_12, styles.mt_2]}>Berakhir dalam {reduxCheckout.voucherJajaSelected.endDate}</Text>
                                    <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {reduxCheckout.voucherJajaSelected.discountText}</Text>
                                        {console.log("🚀 ~ file: CheckoutScreen.js ~ line 823 ~ checkoutScreen ~ reduxCheckout.voucherJajaSelected.discountText", reduxCheckout.voucherJajaSelected)}
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={[styles.p_2, styles.mb_2]}>
                            <Button onPress={() => {
                                setVouchers(reduxCheckout.voucherJaja)
                                setvoucherOpen('jaja')
                            }} icon="arrow-right" color={colors.RedFlashsale} uppercase={false} labelStyle={{ fontFamily: 'Poppins-Regular', color: colors.RedFlashsale }} style={{ borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 10 }} contentStyle={{ borderColor: colors.BlueJaja }} mode="outlined">
                                Makin hemat pakai promo
                            </Button>
                        </View>
                }
                <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                        <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                        <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Ringkasan Belanja</Text>
                    </View>

                    <View style={[styles.row_between_center, styles.p_3]}>
                        <View style={styles.column_center_start}>
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Total Belanja</Text>
                            {reduxCheckout.voucherJajaType === "diskon" ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Diskon Belanja</Text> : null}
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Biaya Pengiriman</Text>
                            {reduxCheckout.voucherJajaType === "ongkir" ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Diskon Pengiriman</Text> : null}
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Biaya penanganan</Text>
                            {reduxCheckout.coinUsed ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Koin Digunakan</Text> : null}
                            <View style={[styles.row_start_center, { width: Wp('50%'), marginLeft: '-6.5%', paddingLeft: '-2%', opacity: reduxCoin == 0 ? 0.4 : 1 }]}>
                                <Checkbox
                                    disabled={reduxCoin == 0 ? true : false}
                                    theme={{ mode: 'adaptive' }}
                                    color={colors.BlueJaja}
                                    status={useCoin ? 'checked' : 'unchecked'}
                                    onPress={() => handleUseCoin(!useCoin)}
                                />
                                <Text numberOfLines={1} style={[styles.font_13, styles.T_medium, { textAlignVertical: 'center', marginBottom: '-1%' }]}>Koin dimiliki</Text>
                            </View>

                        </View>
                        <View style={styles.column_center_end}>
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>{reduxCheckout.subTotalCurrencyFormat}</Text>
                            {reduxCheckout.voucherJajaType === "diskon" ? <Text style={[styles.font_13, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountJajaCurrencyFormat}</Text> : null}
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>{reduxCheckout.shippingCostCurrencyFormat}</Text>
                            {reduxCheckout.voucherJajaType === "ongkir" ? <Text style={[styles.font_13, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountJajaCurrencyFormat}</Text> : null}
                            <Text style={[styles.font_13, { marginBottom: '2%' }]}>Rp0</Text>
                            {reduxCheckout.coinUsed ? <Text style={[styles.font_13, { color: colors.RedFlashsale, marginBottom: '2%' }]}>[-{reduxCheckout.coinUsedFormat}]</Text> : null}
                            <Text numberOfLines={1} style={[styles.font_13, styles.T_medium, styles.py_2, { textAlignVertical: 'center', marginBottom: "-2%", opacity: reduxCoin == 0 ? 0.4 : 1, backgroundColor: colors.White }]}>{reduxCoin}</Text>
                        </View>
                    </View>
                </View>
                {/* <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
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
                </View> */}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0, zIndex: 100, elevation: 3, height: Hp('7%'), width: Wp('100%'), backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                <View style={{ width: '50%', height: '100%', justifyContent: 'center', paddingHorizontal: '2%', paddingLeft: '4%', paddingVertical: '1%' }}>
                    <Text style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja, marginBottom: '-2%' }]}>Total pembayaran :</Text>
                    <Text numberOfLines={1} style={[styles.font_18, styles.T_semi_bold, { color: colors.BlueJaja }]}>{reduxCheckout.totalCurrencyFormat}</Text>
                </View>
                <Button onPress={handleCheckout} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_14, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                    {reduxCheckout.total > 0 ? 'Pilih pembayaran' : 'Buat Pesanan'}
                </Button>
            </View>
            <ActionSheet ref={actionSheetVoucher} onOpen={() => setloadAs(false)} onClose={() => setvoucherOpen("")} delayActionSheetDraw={false} containerStyle={{ padding: '4%', }}>
                <View style={[styles.row_between_center, styles.py_2, styles.mb_5]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '60%' }]}>Pilih Voucher</Text>
                    <TouchableOpacity onPressIn={() => actionSheetVoucher.current?.setModalVisible()}>
                        <Image style={[styles.icon_16, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
                    </TouchableOpacity>
                </View>
                {loadAs ? <Loading /> : null}
                <View style={[styles.column, { minHeight: Hp('20%'), maxHeight: Hp('80%') }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                        {reduxCheckout.voucherJaja && reduxCheckout.voucherJaja.length || vouchers && vouchers.length ?
                            <View>
                                <FlatList
                                    data={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === true)}
                                    keyExtractor={(item) => item.id}
                                    extraData={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === true)}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.row_center, styles.mb_3]}>
                                                <View style={[styles.row, { width: '100%', height: Wp('25%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                                                    <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.BlueJaja, flexDirection: 'column', justifyContent: 'center' }}>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    </View>
                                                    <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.BlueJaja }]}>
                                                        <Text style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>{item.category ? item.category === "ongkir" ? 'GRATIS BIAYA PENGIRIMAN' : String(item.category).toUpperCase() + " " + item.discountText : "DISKON " + item.discountText}</Text>
                                                    </View>
                                                    <View style={[styles.column_around_center, styles.px_2, { width: '44%' }]}>
                                                        <Text numberOfLines={3} style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { color: colors.BlueJaja, width: '100%', marginBottom: '-2%' }]}>{item.name}</Text>
                                                        <Text style={[styles.font_8, styles.T_semi_bold, { color: colors.BlueJaja, width: '100%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                                    </View>
                                                    <View style={[styles.column_center, { width: '22%' }]}>
                                                        <TouchableOpacity onPress={() => handleVoucher(item, index)} style={{ width: '90%', height: '30%', backgroundColor: item.isClaimed ? colors.White : colors.BlueJaja, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.BlueJaja, borderRadius: 5 }}>
                                                            <Text style={[styles.font_10, styles.T_semi_bold, { marginBottom: '-1%', color: item.isClaimed ? colors.BlueJaja : colors.White }]}>{item.isClaimed ? item.isSelected ? "TERPAKAI" : "PAKAI" : "KLAIM"}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
                                                            <Text style={[styles.font_12, { color: colors.BlueLink }]}>S&K</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />
                                {/* <Text numberOfLines={2} style={[styles.font_13, styles.T_semi_bold, styles.my_3, { color: colors.BlackGrey }]}>* Voucher yang belum sesuai dengan S&K</Text> */}
                                <FlatList
                                    data={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === false)}
                                    keyExtractor={(item) => item.id}
                                    extraData={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === false)}
                                    renderItem={({ item, index }) => {
                                        console.log("🚀 ~ file: CheckoutScreen.js ~ line 961 ~ checkoutScreen ~ item", item.isValid)

                                        if (!item.isValid) {
                                            return (
                                                <View style={[styles.row_center, styles.mb_3]}>
                                                    <View style={[styles.row, { width: '100%', height: Wp('25%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.Silver }]}>
                                                        <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.Silver, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        </View>
                                                        <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.Silver }]}>
                                                            <Text style={[styles.font_14, styles.mb_2, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>{item.category ? item.category === "ongkir" ? 'GRATIS BIAYA PENGIRIMAN' : String(item.category).toUpperCase() + " " + item.discountText : "DISKON " + item.discountText}</Text>
                                                        </View>
                                                        <View style={[styles.column_around_center, styles.px_2, { width: '44%' }]}>
                                                            <Text numberOfLines={3} style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { color: colors.Silver, width: '100%', marginBottom: '-2%' }]}>{item.name}</Text>
                                                            <Text style={[styles.font_8, styles.T_semi_bold, { color: colors.Silver, width: '100%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                                        </View>
                                                        <View style={[styles.column_center, { width: '22%' }]}>
                                                            <TouchableOpacity disabled={true} onPress={() => handleVoucher(item, index)} style={{ width: '90%', height: '30%', backgroundColor: item.isClaimed ? colors.White : colors.Silver, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.Silver, borderRadius: 5 }}>
                                                                <Text style={[styles.font_10, styles.T_semi_bold, { marginBottom: '-1%', color: item.isClaimed ? colors.Silver : colors.White }]}>{item.isClaimed ? item.isSelected ? "TERPAKAI" : "PAKAI" : "KLAIM"}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
                                                                <Text style={[styles.font_12, { color: colors.BlueLink }]}>S&K</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    }}
                                />
                            </View>
                            :
                            <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Kamu belum punya voucher</Text>}
                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetDelivery} delayActionSheetDraw={false} containerStyle={{ width: Wp('100%') }} containerStyle={{ padding: '2%' }}>
                <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_3]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.BlueJaja }]}>Pilih Ekspedisi</Text>
                    <TouchableOpacity style={{ backgroundColor: 'transparent', paddingVertical: '2%', paddingHorizontal: '3%' }} onPressIn={() => actionSheetDelivery.current?.setModalVisible()}>
                        <Image style={[styles.icon_12, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', minHeight: Hp('20%'), maxHeight: Hp('60%'), width: '100%', paddingBottom: '5%' }}>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ width: '100%' }}>
                        <View style={[styles.column, { width: '100%' }]}>
                            {/* <Text style={[styles.font_14, styles.mb_3, { color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold', borderBottomWidth: 0.5, borderBottomColor: colors.BlueJaja }]}>{item.title}</Text> */}
                            {reduxShipping && reduxShipping.length ?
                                <View style={styles.column}>
                                    <FlatList
                                        data={reduxShipping[indexStore].items}
                                        keyExtractor={(item, index) => String(index) + "d"}
                                        style={{ width: '100%' }}
                                        renderItem={({ item }) => {
                                            let code = item.code;
                                            let Ename = item.name;
                                            console.log("🚀 ~ file: CheckoutScreen.js ~ line 1014 ~ checkoutScreen ~ item.icon ", item.icon)
                                            return (
                                                <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_4, { borderBottomWidth: 1, borderBottomColor: colors.Silver, width: '100%' }]}>
                                                    <Text style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>{Ename}</Text>
                                                    <FlatList
                                                        data={item.type}
                                                        keyExtractor={(item, index) => String(index) + "a"}
                                                        style={{ width: '100%' }}
                                                        renderItem={({ item }) => {
                                                            return (
                                                                <TouchableOpacity onPress={() => deliverySelected(code, item)} style={[styles.column_center_start, styles.mb_3, styles.py_2, { width: '100%' }]}>
                                                                    <View style={styles.row_between_center}>
                                                                        <Text style={[styles.font_14, styles.T_medium, { flex: 1 }]}>{item.name}</Text>
                                                                        <Text style={[styles.font_14, styles.T_medium,]}>{item.priceCurrencyFormat}</Text>

                                                                    </View>
                                                                    <Text style={[styles.font_12, styles.T_italic]}>Estimasi {item.etdText}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        }}
                                                    />

                                                </View>

                                            )
                                        }}
                                    />
                                    <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb]}>
                                        <Text style={[styles.font_14, styles.mt_3, styles.T_semi_bold, { color: colors.BlueJaja }]}>Pilih Waktu Pengiriman</Text>
                                    </View>
                                    <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_2, { width: '100%' }]}>
                                        <FlatList
                                            inverted
                                            data={reduxShipping[0].sendTime}
                                            keyExtractor={(item, index) => String(index)}
                                            style={{ width: '100%' }}
                                            renderItem={({ item }) => {
                                                return (
                                                    <View style={[styles.column, styles.mb_3, styles.py_2, { width: '100%' }]}>
                                                        <TouchableOpacity onPress={() => setsendTime(item.value)} style={styles.row_start_center}>
                                                            <CheckBox
                                                                disabled={false}
                                                                value={sendTime === item.value ? true : false}
                                                                onValueChange={() => {
                                                                    if (item.value !== "pilih tanggal") {
                                                                        setsendDate("")
                                                                    }
                                                                    setsendTime(item.value)
                                                                }}
                                                            />
                                                            <View style={styles.row_between_center}>
                                                                <Text style={[styles.font_14, styles.T_medium, { flex: 1 }]}>{item.name}</Text>
                                                                <Text style={[styles.font_14, styles.T_medium]}>{item.priceCurrencyFormat}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        {
                                                            sendTime === "pilih tanggal" && item.value === "pilih tanggal" ?
                                                                <TouchableOpacity style={[styles.column, styles.px_2, { width: '100%' }]} onPress={() => setDatePickerVisibility(true)}>
                                                                    <View style={styles.row_between_center}>
                                                                        <Text style={styles.font_14}>{sendDate}</Text>
                                                                        <Image source={require('../../assets/icons/calendar.png')} style={[styles.icon_19, { tintColor: colors.BlueJaja }]} />
                                                                    </View>
                                                                    <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: colors.Silver, marginTop: '2%' }}>
                                                                        <Text style={[styles.font_12, styles.T_italic]}>Pilih tanggal pengiriman dari penjual</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                : null
                                                        }
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                </View> :
                                <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Sedang memuat..</Text>}
                        </View>

                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet closeOnPressBack={false} ref={actionSheetPayment} onOpen={() => setloadAs(false)} onClose={() => {
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
                {loadAs ? <Loading /> : null}
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
                    <View style={[styles.column_start, styles.pt_3s, { width: Wp('95%'), height: Wp('70%'), backgroundColor: colors.White, elevation: 11, zIndex: 999 }]}>
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
                        <View style={[styles.row_start, styles.px_4, { height: '20%' }]}>
                            <Text style={[styles.font_12, styles.T_italic]}>Note : kamu masih bisa mengganti metode pembayaran setelah pesanan ini dibuat</Text>
                        </View>
                        <View style={[styles.row_end, styles.p_2, { width: '100%' }]}>
                            <Button mode="contained" onPress={() => setModalShow(false)} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} style={{ height: '100%', width: '30%' }} color={colors.BlueJaja}>
                                OK
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                minimumDate={new Date(dateMin.year, dateMin.month, dateMin.date)}
                maximumDate={new Date(dateMax.year, dateMax.month, dateMax.date)}
                onDateChange={() => setDatePickerVisibility(false)}
                onConfirm={(text) => {
                    setTimeout(() => {
                        handleConfirmDate(text)
                    }, 200);
                }}
                onCancel={() => setDatePickerVisibility(false)}
            />
        </SafeAreaView >
    )
}

