import React, { useEffect, useState, useCallback, createRef } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid, Alert, RefreshControl, Modal, FlatList, ActivityIndicator, BackHandler, DynamicColorIOS } from 'react-native'
import { Appbar, colors, styles, Wp, Hp, useNavigation, useFocusEffect, Loading, Utils, ServiceStore, ServiceCheckout, ServiceOrder, ServiceProduct } from '../../export'
import Clipboard from '@react-native-community/clipboard';
import { useDispatch, useSelector } from "react-redux";
import { Button, TouchableRipple, RadioButton } from 'react-native-paper'
import ActionSheet from "react-native-actions-sheet";
import { WebView } from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';
import { useAndroidBackHandler } from "react-navigation-backhandler";

export default function OrderDetailsScreen() {
    const navigation = useNavigation();
    const actionSheetPayment = createRef();

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState(null)
    // console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 19 ~ OrderDetailsScreen ~ details",)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedSubPayment, setselectedSubPayment] = useState('')
    const [selectedPayment, setselectedPayment] = useState('')
    const [orderPaymentRecent, setOrderPaymentRecent] = useState({
        "id_token": "",
        "order_id": "",
        "billing_id": "",
        "token": "",
        "grand_total": "0",
        "fee": "0",
        "token_app": "",
        "payment_type": "",
        "payment_type_label": "",
        "payment_sub": "",
        "payment_va_or_code_or_link": "",
        "payment_form": "",
        "created_date": ""
    });
    const [midtrans, setMidtrans] = useState();
    const [loadingOrderPaymentRecent, setLoadingOrderPaymentRecent] = useState(true);
    const [listPayment, setListPayment] = useState([]);

    const reduxStore = useSelector(state => state.store.store)
    const reduxListPayment = useSelector(state => state.checkout.listPayment)

    const reduxCheckout = useSelector(state => state.checkout.checkout)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxOrderStatus = useSelector(state => state.order.orderStatus)
    const reduxOrderInvoice = useSelector(state => state.order.invoice)
    const [downloadInvoice, setdownloadInvoice] = useState(false)

    const reduxUser = useSelector(state => state.user)
    const [subPayment, setsubPayment] = useState([])

    const [showModal, setModalShow] = useState(false);

    const [modalComplain, setmodalComplain] = useState(false);
    const [checkbox, setcheckbox] = useState(false)
    const [productsComplain, setproductsComplain] = useState([])
    const [count, setcount] = useState(0)
    const reduxLoad = useSelector(state => state.product.productLoad)

    useAndroidBackHandler(() => {
        navigation.reset({
            routes: [{ name: 'Pesanan' }],
        })
    });


    // useEffect(() => {
    //     return () => {
    //         if (details && Object.keys(details).length) {
    //             setLoading(false)
    //             let status = details.status;
    //             dispatch({ type: 'SET_ORDER_STATUS', payload: status === 'notPaid' ? "Menunggu Pembayaran" : status === 'waitConfirm' ? 'Menunggu Konfirmasi' : status === 'prepared' ? 'Sedang Disiapkan' : status === 'canceled' ? 'Pesanan Dibatalkan' : status === 'done' ? 'Pesanan Selesai' : status === 'sent' ? 'Pengiriman' : null })
    //             if (status === 'notPaid') {
    //                 dispatch({ type: 'SET_INVOICE', payload: details.orderId })
    //                 // ServiceCheckout.getListPayment().then(res => {
    //                 //     if (res) {
    //                 //         dispatch({ type: 'SET_LIST_PAYMENT', payload: details })
    //                 //     }
    //                 // })
    //                 getPayment(details.orderId);
    //             } else {
    //                 dispatch({ type: 'SET_INVOICE', payload: details.items[0].invoice })
    //             }

    //         }
    //     };

    // }, [details, count])

    useEffect(() => {
        setdownloadInvoice('')
        const backAction = () => {
            getOrder()
            navigation.goBack()
            return true
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();

    }, [])


    const getOrder = () => {
        ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
            if (resUnpaid) {
                dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
            }
        })
        ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
            if (reswaitConfirm) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
            }
        })
        ServiceOrder.getProcess(reduxAuth).then(resProcess => {
            if (resProcess) {
                dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
            }
        })
        dispatch({ type: 'SET_ORDER_REFRESH', payload: true })

    }

    useEffect(() => {
        if (downloadInvoice) {
            setTimeout(() => {
                setdownloadInvoice(false)
            }, 7000);
        }
    }, [downloadInvoice])

    useEffect(() => {
        if (selectedPayment != '') {
            handleShowPayment()
        }
    }, [selectedPayment])

    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            setselectedPayment('')
            getItem()
        }, [count, reduxOrderInvoice]),
    );
    // useEffect(() => {
    //     if (String(reduxOrderInvoice).includes('INV')) {
    //         getItem()
    //     }
    // }, [reduxOrderInvoice])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
    }, []);

    const gotoPaymentDetail = (item) => {
        //const { navigation} = this.props;
        //const {id_order,config} =this.state;

        //console.log(config.midtransMethod);
        var dataPayment = {
            payment_type: item.payment_type,
            payment_qris: item.qris,

            payment_type_label: item.payment_type_label,
            payment_sub: item.subPayment[0].payment_sub,
            payment_sub_label: item.subPayment[0].payment_sub_label,
            payment_fee: item.subPayment[0].fee,
            payment_form: item.subPayment[0].payment_form,
        }

        var param = {
            id_order: orderPaymentRecent.order_id,
            dataPayment: dataPayment
        }
        // console.log('paramNosSub', JSON.stringify(param));


        if (dataPayment.payment_form == "screenOther") {
            if (dataPayment.payment_type == "gopay") {
                tokenMidtransUpdateCore(param);
            } else {
                tokenMidtransUpdate(param);
            }

        } else {
            tokenMidtransUpdateCore(param);
        }

    }


    const gotoPaymentDetailSub = (item) => {
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 266 ~ gotoPaymentDetailSub ~ item", item)
        setModalShow(false);
        var dataPayment = {
            payment_type: item.payment_type,
            param_qris: item.qris,
            payment_type_label: selectedPayment.payment_type_label,
            payment_sub: item.payment_sub,
            payment_sub_label: item.payment_sub_label,
            payment_fee: item.fee,
            payment_form: item.payment_form
        }
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 203 ~ gotoPaymentDetailSub ~ dataPayment", dataPayment)

        var param = {
            id_order: orderPaymentRecent.order_id,
            dataPayment: dataPayment
        }
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 282 ~ gotoPaymentDetailSub ~ param", param)


        if (dataPayment.payment_form == "screenOther") {
            if (dataPayment.payment_type == "gopay") {
                tokenMidtransUpdateCore(param);
            } else {
                tokenMidtransUpdate(param);
            }

        } else {
            tokenMidtransUpdateCore(param);
        }
    }


    const tokenMidtransUpdate = (param) => {
        var dataPayment = param.dataPayment;
        var fee = dataPayment.payment_fee;
        var totalPembayaran = parseInt(orderPaymentRecent.grand_total) + parseInt(fee);
        var authBasicHeader = midtrans.authBasicHeader;

        var payment_type = dataPayment.payment_type;
        var payment_sub = dataPayment.payment_sub;

        var transaction_details = {
            gross_amount: totalPembayaran,
            order_id: orderPaymentRecent.payment_id
        }
        var customer_details = {
            email: reduxUser.user.email,
            first_name: reduxUser.user.name,
            last_name: '',
            phone: reduxUser.user.phoneNumber,
        }

        var enabled_payments = [payment_sub];

        var credit_card = "";


        if (dataPayment.payment_type == "credit_card") {
            credit_card = {
                "secure": true,
                "save_card": true
            };
        }

        var paramPay = {
            transaction_details: transaction_details,
            customer_details: customer_details,
            enabled_payments,
            credit_card
        }

        var url = midtrans.url_snap + "snap/v1/transactions";

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic " + authBasicHeader);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=6mmg253sca0no2e0gqas59up68f6ljlo");

        var raw = JSON.stringify(paramPay);
        console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 361 ~ tokenMidtransUpdate ~ raw", raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 285 ~ tokenMidtransUpdate ~ result", result)
                // actionSheetPayment.current?.setModalVisible()

                var paramPayMD = {
                    "total_pembayaran": totalPembayaran,
                    "fee": fee,
                    "payment_id": orderPaymentRecent.payment_id,
                    "dataPayment": dataPayment,
                    "token": result.token,
                    "order_id": orderPaymentRecent.order_id,
                    "va_or_code_or_link": result.redirect_url
                }
                console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 297 ~ tokenMidtransUpdate ~ paramPayMD", paramPayMD)
                // console.log('paramPayMD', JSON.stringify(paramPayMD));

                if (dataPayment.payment_type == "gopay") {
                    var qr_code_url = snapCharge(result.token);
                    param.qr_code_url = qr_code_url;
                    snapTokenUpdate(paramPayMD);
                } else {
                    snapTokenUpdate(paramPayMD);
                }

            })
            .catch(error => { Utils.alertPopUp(`Kegagalan Respon Server : 20203 => ${String(error.message)}`); });


    }


    const snapCharge = (token) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic U0ItTWlkLXNlcnZlci1rYUg3VlctakNpVjAyOGtWcmJmbjZITGY6");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "payment_type": "gopay" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(midtrans.url_snap + "snap/v2/transactions/" + token + "/charge", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result.qr_code_url;

            })
            .catch(error => { Utils.alertPopUp(`Kegagalan Respon Server : 20204 => ${String(error.message)}`); });
    }


    const tokenMidtransUpdateCore = (params) => {
        var dataPayment = params.dataPayment;
        var fee = dataPayment.payment_fee;

        var totalPembayaran = parseInt(orderPaymentRecent.grand_total) + parseInt(fee);
        var authBasicHeader = midtrans.authBasicHeader;

        var payment_type = dataPayment.payment_type;
        var payment_sub = dataPayment.payment_sub;

        var transaction_details = {
            gross_amount: totalPembayaran,
            order_id: orderPaymentRecent.payment_id
        }
        var customer_details = {
            email: reduxUser.user.email,
            first_name: reduxUser.user.name,
            last_name: '',
            phone: reduxUser.user.phoneNumber,
        }

        var bank_transfer = {
            "bank": dataPayment.payment_sub,
            "va_number": "1234567890"
        }

        if (dataPayment.payment_type == "gopay") {
            var gopay = {
                "secure": true,
                "save_card": true
            };

            var paramPay = {
                payment_type: dataPayment.payment_type,
                transaction_details: transaction_details,
                gopay,
                customer_details: customer_details,

            }

        } else {
            var paramPay = {
                payment_type: dataPayment.payment_type,
                transaction_details: transaction_details,
                customer_details: customer_details,
            }
        }

        if (dataPayment.payment_type == "bank_transfer") {
            paramPay.bank_transfer = bank_transfer;
        } else if (dataPayment.payment_type == "echannel") {
            paramPay.echannel = {
                "bill_info1": "Payment For:",
                "bill_info2": "Masterdiskon"
            }
        }

        var url = midtrans.url + "v2/charge";
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic " + authBasicHeader);
        myHeaders.append("Cookie", "__cfduid=d4ff313b0fa4bdbbb74a64dd1f5a4ccb51616649753");

        var raw = JSON.stringify(paramPay);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {

                var va_or_code_or_link = "";
                var token = "";
                if (dataPayment.payment_type == "bank_transfer") {
                    if (dataPayment.payment_sub == "bni") {
                        va_or_code_or_link = result.va_numbers[0].va_number;
                    } else if (dataPayment.payment_sub == "permata") {
                        va_or_code_or_link = result.permata_va_number;
                    }
                } else if (dataPayment.payment_type == "echannel") {
                    if (dataPayment.payment_sub == "echannel") {
                        va_or_code_or_link = result.bill_key;
                    }
                } else if (dataPayment.payment_type == "gopay") {
                    va_or_code_or_link = result?.actions?.[0].url;
                    token = result.transaction_id;

                }

                var paramPayMD = {
                    "total_pembayaran": totalPembayaran,
                    "fee": fee,
                    "payment_id": orderPaymentRecent.payment_id,
                    "dataPayment": dataPayment,
                    "token": result.token,
                    "order_id": orderPaymentRecent.order_id,
                    "va_or_code_or_link": va_or_code_or_link,
                }

                snapTokenUpdate(paramPayMD);

            })
            .catch(error => { Utils.alertPopUp(`Kegagalan Respon Server : 20205 => ${String(error)}`); });

    }
    const snapTokenUpdate = (paramPayMD) => {
        var url = midtrans.url_base + 'payment/snap_token_update';


        // console.log('urlss', url, JSON.stringify(paramPayMD));
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=6mmg253sca0no2e0gqas59up68f6ljlo");

        var raw = JSON.stringify(paramPayMD);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 486 ~ snapTokenUpdate ~ result", result)
                // console.log('snapTokenUpdate', JSON.stringify(result));


                if (paramPayMD.dataPayment.payment_form == "screenOther") {
                    handlePayment();
                    // navigation.navigate("PembayaranDetail",{
                    //     param:params,
                    // });

                } else if (paramPayMD.dataPayment.payment_form == "screenSelf") {
                    // var param={
                    //     id_order:.id_order,
                    //     dataPayment:{},
                    // }
                    //navigation.navigate("Loading",{redirect:'Pembayaran',param:param});
                } else if (paramPayMD.dataPayment.payment_form == "screenLink") {

                    var param = {
                        id_order: dataBooking[0].id_order,
                        dataPayment: {},
                    }
                    navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });

                    var link = paramPayMD.va_or_code_or_link;
                    Linking.openURL(link);
                }

            })
            .catch(error => { Utils.alertPopUp(`Kegagalan Respon Server : 20206 => ${String(error.message)}`); });

    }


    const handleShowPayment = () => {
        if (selectedPayment.payment_type_label != 'Bank Transfer') {
            // setModalShow(true)
            gotoPaymentDetail(selectedPayment);
            actionSheetPayment.current?.setModalVisible(false)
            // console.log('pilih');
        }
        else {
            //alert('sd');
            actionSheetPayment.current?.setModalVisible(true)
        }
    }

    const getListPayment = (total) => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=mo3huphq5niakt3grmetuf4djpvcd76q");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/payment/methodPayment/" + total, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 545 ~ getListPayment ~ result", result)
                setListPayment(result);
            })
            .catch(error => {
                Utils.handleError(error.message, "Error with status code : 22004")
            });

    }
    const getItem = () => {
        // setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=croc9bj799b291gjd0oqd06b3vr2ehm8");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/order/${reduxOrderInvoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 568 ~ getItem ~ result", result.data)
                if (result.status.code === 200 || result.status.code === 204) {
                    setDetails(result.data)
                    let status = result.data.status;
                    if (reduxOrderStatus) {
                        dispatch({ type: 'SET_ORDER_STATUS', payload: status === 'notPaid' ? "Menunggu Pembayaran" : status === 'waitConfirm' ? 'Menunggu Konfirmasi' : status === 'prepared' ? 'Sedang Disiapkan' : status === 'canceled' ? 'Pesanan Dibatalkan' : status === 'done' ? 'Pesanan Selesai' : status === 'sent' ? 'Dalam Pengiriman' : null })
                    }
                    if (reduxOrderStatus == 'Menunggu Pembayaran' && status != 'notPaid') {
                        updateUnpaid()
                        // console.log('kesini')
                        return setcount(count + 1)
                    }
                    if (status == 'notPaid') {
                        dispatch({ type: 'SET_INVOICE', payload: result.data.orderId })
                        getPayment(result.data.orderId);
                        // setcount(count + 1)
                    } else {
                        dispatch({ type: 'SET_INVOICE', payload: result.data.items[0].invoice })
                    }

                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 22003");
                }
                setRefreshing(false)
                setLoading(false)
            })
            .catch(error => {
                setRefreshing(false)
                setLoading(false)
                Utils.handleError(error.message, "Error with status code : 22004")
            });

        setTimeout(() => {
            if (refreshing) {
                Utils.CheckSignal(item => {
                    if (!item.connect) {
                        setRefreshing(false)
                        Utils.alertPopUp('Tidak dapat terhubung, periksa kembali koneksi internet anda!')
                    }
                })

            }
        }, 10000);
    }

    const updateUnpaid = () => {
        ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
            if (resUnpaid && Object.keys(resUnpaid).length) {
                dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                setTimeout(() => Utils.alertPopUp("Data berhasil diperbahrui"), 500);
            } else {
                console.log("🚀 ~ file: OrdersUnpaid.js ~ line 38 ~ ServiceOrder.getUnpaid ~ resUnpaid", resUnpaid)
                handleUnpaid()
            }
        }).catch(error => {
            console.log("🚀 ~ file: OrdersUnpaid.js ~ line 54 ~ ServiceOrder.getUnpaid ~ err", error.message)
            Utils.alertPopUp(String(error))
            handleUnpaid()
        })
    }
    const submitChange = () => {
        var paramPayMD = {
            "order_id": orderPaymentRecent.order_id,
            "id_token": orderPaymentRecent.id_token,
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=7glbt8ufb9pgaiv13v6fm7bbbr33k91d");

        var raw = JSON.stringify(paramPayMD);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/payment/new_invoice", requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoadingOrderPaymentRecent(false);
                setTimeout(() => {
                    getPayment(orderPaymentRecent.order_id);
                }, 50);
            })
            .catch(error => {
                Utils.handleError(error.message, "Error with status code : 22004")
            });
    }



    const getPayment = (orderId) => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=nvha2jep6gogidt9rmcle1par0j8ul4f");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        var url = "https://jaja.id/backend/payment/getPayment/" + orderId;
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                getListPayment(result.orderPaymentRecent.grand_total);

                setOrderPaymentRecent(result.orderPaymentRecent);
                setMidtrans(result.midtrans);
                setLoadingOrderPaymentRecent(false);
                // console.log("resultGetPayment", result.orderPaymentRecent);
                // console.log("resultMidtrans", result.midtrans);

            })
            .catch(error => {
                Utils.handleError(error.message, "Error with status code : 22004")
            });
    }

    const handlePayment = () => {
        dispatch({ type: 'SET_ORDERID', payload: details.orderId })
        navigation.navigate("Midtrans")
    }

    const handleTracking = () => {
        let newObj = {
            resi: details?.trackingId,
            codeKurir: details?.items?.[0]?.shippingSelected?.code
        }
        dispatch({ type: 'SET_INVOICE', payload: details.invoice })
        dispatch({ type: 'SET_RECEIPT', payload: newObj })
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
                                setTimeout(() => setLoading(false), 2000);
                                if (result.status.code === 200) {
                                    navigation.goBack()
                                    ServiceOrder.getSent(reduxAuth).then(resSent => {
                                        if (resSent) {
                                            dispatch({ type: 'SET_SENT', payload: resSent.items })
                                        } else {
                                            handleSent()
                                        }
                                    })
                                    ServiceOrder.getCompleted(reduxAuth).then(resCompleted => {
                                        if (resCompleted) {
                                            dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                                        } else {
                                            handleCompleted()
                                        }
                                    })
                                    dispatch({ type: 'SET_ORDER_REFRESH', payload: true })

                                } else {
                                    Utils.handleErrorResponse(result, "Error with status code : 22001")
                                }
                            })
                            .catch(error => {
                                setLoading(false)
                                Utils.handleError(error.message, "Error with status 22002")
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    // const handleShowDetail = item => {
    //     dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
    //     dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
    //     dispatch({ type: 'SET_SLUG', payload: item.slug })
    //     navigation.navigate("Product", { slug: item.slug, image: item.image })
    // }
    const handleShowDetail = async (item, status, gift) => {
        let error = true;
        try {
            if (!reduxLoad) {
                !status ? await navigation.push(!gift ? "Product" : "GiftDetails") : null
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
                    error = false
                    if (res === 404) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        navigation.goBack()
                    } else if (res?.data) {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        setTimeout(() => dispatch({ type: 'SET_FILTER_LOCATION', payload: true }), 7000);
                    }
                })
            } else {
                error = false
            }
        } catch (error) {
            console.log(error.message)

            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
            error = false
        }
        setTimeout(() => {
            if (error) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                Utils.handleSignal()
                setTimeout(() => Utils.alertPopUp('Sedang memuat ulang..'), 2000);
                error = false
                handleShowDetail(item, true, gift)
            }
        }, 15000);
    }

    const handleStore = (item) => {
        if (reduxStore && Object.keys(reduxStore).length) {
            if (reduxStore.name != item.name) {
                dispatch({ "type": 'SET_STORE', payload: {} })
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
            }
        }
        dispatch({ type: 'SET_STORE_PRODUCT', payload: [] })
        dispatch({ type: 'SET_NEW_PRODUCT', payload: [] })
        dispatch({ "type": 'SET_STORE_LOAD', payload: true })
        navigation.navigate('Store', { slug: item.slug })
        ServiceStore.getStoreNew(item.slug, dispatch, reduxAuth)
    }

    const handleChat = (item) => {
        let dataSeller = item.store
        dataSeller.chat = reduxUser.user.uid + dataSeller.uid
        dataSeller.id = dataSeller.uid
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: dataSeller, order: { invoice: item.invoice, status: reduxOrderStatus, imageOrder: item.products[0].image } })
        } else {
            navigation.navigate('Login', { navigate: "OrderDetails" })
        }
    }
    const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));


    const handleComplain = (idxStore, item, idx) => {
        let newProductComplain = productsComplain
        let newOrderDetail = details
        let boolean = Boolean(newProductComplain.find(e => e === item.productId))
        if (!boolean) {
            newProductComplain.push(item.productId)
            newOrderDetail.items[idxStore].products[idx].onComplain = true

        } else {
            newOrderDetail.items[idxStore].products[idx].onComplain = false
            newProductComplain = newProductComplain.filter(element => element.indexOf(newProductComplain[idx]) === -1)
        }
        setproductsComplain(newProductComplain)
        setDetails(newOrderDetail)
        setcount(count + 1)
        // // if (!newProductComplain.length && !boolean) {
        // //     newProductComplain.push(item.productId)
        // //     console.log(true)

        // // } else {
        // //     newProductComplain = filter
        // // }
        // setDetails(details.items[idxStore] = newOrderDetail)
        // setproductsComplain(newProductComplain)
        // setcount(count + 1)
    }
    // navigation.reset({
    //     routes: [{ name: 'Pesanan' }],
    // })
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : '' }]}>
            <Appbar reset='Pesanan' title="Detail Pesanan" back={true} />
            {loading ? <Loading /> : null}
            {/* {
                downloadInvoice ?
                    <View style={{ flex: 1, backgroundColor: colors.White }} >
                        <WebView source={{ uri: downloadInvoice }} />
                        <TouchableRipple onPress={() => setdownloadInvoice(false)} style={[styles.row_center, styles.py_2, { width: '95%', backgroundColor: colors.Silver, alignSelf: 'center', borderRadius: 4, position: 'absolute', bottom: 11 }]}>
                            <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                Tutup
                            </Text>
                        </TouchableRipple>
                    </View > 
            :*/}
            <View style={[styles.container, { backgroundColor: colors.WhiteBack }]}>
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
                            {reduxOrderStatus ?
                                <View style={[styles.px_3, { paddingVertical: '0.5%', backgroundColor: colors.YellowJaja, borderRadius: 3 }]}>
                                    <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>{reduxOrderStatus}</Text>
                                </View> : null}
                        </View>
                        {reduxOrderStatus !== "Menunggu Pembayaran" ?
                            details && details.items && details.items.length ?
                                <View style={styles.row_between_center}>
                                    <View style={[styles.row]}>
                                        <Text style={[styles.font_12]}>#{details.items[0].invoice}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        setdownloadInvoice(details.downloadOrderPdf)
                                    }}

                                        // }}
                                        onLongPress={() => {
                                            Clipboard.setString(details.downloadOrderPdf)
                                            ToastAndroid.show("salin to clipboard", ToastAndroid.LONG, ToastAndroid.TOP)
                                        }}
                                        style={[styles.p, { backgroundColor: colors.White, borderRadius: 3 }]}>
                                        <Text numberOfLines={1} style={[styles.font_11, { color: colors.BlueJaja }]}>DOWNLOAD INVOICE</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                            : null
                        }
                    </View>
                    {/* {details ?
                        <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                            <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '1%' }]} source={require('../../assets/icons/google-maps.png')} />
                                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
                            </View>
                            <View style={[styles.column, styles.p_3]}>
                                <View style={styles.row_between_center}>
                                    <Text numberOfLines={1} style={[styles.font_12, { width: '70%' }]}>{details.address.receiverName}</Text>
                                </View>
                                <Text numberOfLines={1} style={[styles.font_11]}>{details.address.phoneNumber}</Text>
                                <Text numberOfLines={3} style={[styles.font_12, styles.mt_2]}>{details.address.address.replace(/<br>/g, "\n")}</Text>
                                <Text numberOfLines={4} style={[styles.font_12, styles.mt_2]}>Catatan : {details.items[0].note ? details.items[0].note : 'Tidak ada catatan'}</Text>
                                {details.items[0].shippingSelected?.sendTime === 'pilih tanggal' ?
                                    < Text numberOfLines={1} style={[styles.font_12]}>Akan Dikirim : {details.items[0].shippingSelected.dateSendTime}</Text>
                                    : null}

                            </View>
                        </View>
                        : null
                    } */}
                    {details && details.items.length ?
                        details.items.map((item, idxStore) => {

                            return (
                                <View key={String(idxStore) + 'AL'} style={[styles.column, styles.mb_3, { backgroundColor: colors.White }]} >
                                    <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                                        <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                            <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '1%' }]} source={require('../../assets/icons/google-maps.png')} />
                                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
                                        </View>
                                        <View style={[styles.column, styles.p_3]}>
                                            <View style={styles.row_between_center}>
                                                <Text numberOfLines={1} style={[styles.font_12, { width: '70%' }]}>{item.address.receiverName}</Text>
                                            </View>
                                            <Text numberOfLines={1} style={[styles.font_11]}>{item.address.phoneNumber}</Text>
                                            <Text numberOfLines={3} style={[styles.font_12, styles.mt_2]}>{item.address.address.replace(/<br>/g, "\n")}</Text>
                                            <Text numberOfLines={4} style={[styles.font_12, styles.mt_2]}>Catatan : {item.note ? item.note : 'Tidak ada catatan'}</Text>
                                            {details.items[0].shippingSelected?.sendTime === 'pilih tanggal' ?
                                                < Text numberOfLines={1} style={[styles.font_12]}>Akan Dikirim : {item.shippingSelected.dateSendTime}</Text>
                                                : null}

                                        </View>
                                    </View>
                                    <View style={[styles.row_between_center, styles.px_3, styles.py_2, { width: '100%', borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                        <View style={[styles.row]}>
                                            <Image style={[styles.icon_19, { marginRight: '3%', tintColor: colors.BlueJaja }]} source={require('../../assets/icons/store.png')} />
                                            <Text onPress={() => handleStore(item.store)} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.store.name}</Text>
                                        </View>
                                        <TouchableRipple onPress={() => handleChat(item)} style={[styles.row_center, styles.px_3, { backgroundColor: colors.BlueJaja, paddingVertical: '1.5%', elevation: 3, borderRadius: 2 }]}>
                                            <View style={styles.row}>
                                                <Text style={[styles.font_10, styles.T_medium, { color: colors.White }]}>
                                                    Chat Penjual
                                                </Text>
                                            </View>
                                        </TouchableRipple>
                                    </View>
                                    {
                                        item.products.map((child, idx) => {
                                            return (
                                                <View key={String(idx) + "SV"} style={[styles.column, styles.px_2, { width: '100%' }]}>
                                                    <View style={[styles.row_start_center, { width: '100%', height: Wp('25%') }]}>
                                                        <TouchableOpacity onPress={() => handleShowDetail(child, false, item.isGift)}>
                                                            <Image style={{
                                                                width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.White,
                                                                borderWidth: 0.2,
                                                                borderColor: colors.Silver,
                                                                alignSelf: 'center',
                                                                // resizeMode: 'stretchss'
                                                                borderWidth: 0.2,
                                                                borderColor: colors.Silver,
                                                                borderRadius: 3
                                                            }}
                                                                resizeMethod={"scale"}
                                                                resizeMode="contain"
                                                                source={{ uri: child.image }}
                                                            />
                                                        </TouchableOpacity>
                                                        <View style={[styles.column, styles.ml_2, { height: Wp('15%'), width: Wp('85%') }]}>
                                                            <Text onPress={() => handleShowDetail(child, false, item.isGift)} numberOfLines={1} style={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja, width: '95%' }]}>{child.name}</Text>
                                                            <View style={[styles.row_between_center, styles.pr_2, { width: '95%', alignItems: 'flex-start' }]}>
                                                                <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale, }]}>{child.variant ? child.variant : ""}</Text>
                                                                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                    {child.isDiscount ?
                                                                        <>
                                                                            <Text></Text>
                                                                            <Text numberOfLines={1} style={[styles.priceBefore, { fontStyle: 'italic' }]}>{child.priceCurrencyFormat}</Text>
                                                                            <View style={styles.row}>
                                                                                <Text numberOfLines={1} style={[styles.font_12]}>{child.qty} x</Text>
                                                                                <Text numberOfLines={1} style={[styles.font_12]}> {child.priceDiscountCurrencyFormat}</Text>
                                                                            </View>
                                                                        </>
                                                                        :
                                                                        <View style={styles.row}>
                                                                            <Text></Text>
                                                                            <Text numberOfLines={1} style={[styles.font_12]}>{child.qty} x</Text>
                                                                            <Text numberOfLines={1} style={[styles.font_12]}> {child.priceCurrencyFormat}</Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.row_end_center]}>
                                                        {/* <Text style={[styles.font_13, { fontStyle: 'italic' }]}>Subtotal </Text> */}
                                                        <Text numberOfLines={1} style={[styles.font_13, styles.mt_3, styles.T_bold, { color: colors.YellowJaja }]}> {child.subTotalCurrencyFormat}</Text>
                                                    </View>
                                                    {child.greetingCardGift ?
                                                        <>
                                                            <View style={[styles.mb_3, styles.p_3, { width: '95%', borderRadius: 3, backgroundColor: colors.WhiteGrey, alignSelf: 'center' }]}>
                                                                {/* <Text numberOfLines={4} style={[styles.font_12, styles.px_3, styles.mb_2]}></Text> */}
                                                                <Text numberOfLines={4} style={[styles.font_12, { alignSelf: 'flex-start' }]}>Kartu Ucapan : {child.greetingCardGift}</Text>
                                                            </View>
                                                        </>
                                                        : null
                                                    }
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
                                                    <Text numberOfLines={1} style={[styles.font_14, { fontFamily: 'SignikaNegative-SemiBold', color: colors.BlueJaja }]}> {item.totalDiscountCurrencyFormat}</Text>
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
                                                <Text numberOfLines={1} style={[styles.font_14]}>{item.shippingSelected.nam e}</Text>
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
                                    </View> */}
                                </View>
                            )
                        })
                        :
                        null}
                    <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                        <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                            <Image style={[styles.icon_19, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                            <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Ringkasan Belanja</Text>
                        </View>
                        <View style={[styles.row_between_center, styles.p_3, {}]}>
                            <View style={styles.column}>
                                <Text style={[styles.font_12, { marginBottom: '2%' }]}>Total belanja ({details?.totalAllProduct} produk)</Text>
                                <Text style={[styles.font_12, { marginBottom: '2%' }]}>Ongkos </Text>
                                <Text style={[styles.font_12, { marginBottom: '2%' }]}>Biaya penanganan</Text>
                                {/* <Text style={[styles.font_12 { marginBottom: '2%' }]}>Voucher Toko</Text> */}
                                <Text style={[styles.font_12, { marginBottom: '2%' }]}>Voucher Jaja.id</Text>
                                <Text style={[styles.font_12, { marginBottom: '2%' }]}>Koin digunakan</Text>

                                {/* <Text style={[styles.font_12, styles.T_medium, { marginBottom: '2%' }]}>Fee</Text> */}
                                <Text style={[styles.font_13, styles.T_medium, { marginBottom: '2%' }]}>Total pembayaran</Text>

                            </View>

                            {details ?
                                <View style={styles.column_end}>
                                    <Text style={[styles.font_12, { marginBottom: '2%' }]}>{details.subTotalCurrencyFormat}</Text>
                                    <Text style={[styles.font_12, { marginBottom: '2%' }]}>{details.shippingCostCurrencyFormat}</Text>

                                    <Text style={[styles.font_12, { marginBottom: '2%' }]}>Rp {priceSplitter(reduxOrderStatus !== 'Menunggu Pembayaran' ? details.orderPaymentRecent.fee : orderPaymentRecent.fee)}</Text>
                                    {/* <Text style={[styles.font_12, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountCurrencyFormat}</Text> */}
                                    <Text style={[styles.font_12, { marginBottom: '2%', color: details.voucherDiscountJaja ? colors.RedFlashsale : colors.BlackGrayScale }]}>{details.voucherDiscountJajaCurrencyFormat}</Text>
                                    {/* <Text style={[styles.font_12, { marginBottom: '2%', color: details.voucherDiscountJaja ? colors.RedFlashsale : colors.BlackGrayScale }]}>Rp {priceSplitter(orderPaymentRecent.fee)}</Text> */}
                                    {/* <Text style={[styles.font_12, styles.T_semi_bold, { marginBottom: '2%', color: colors.BlueJaja, }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text> */}
                                    <Text style={[styles.font_12, { marginBottom: '2%', color: details.coin ? colors.RedFlashsale : colors.BlackGrayScale }]}>{details.coinCurrencyFormat}</Text>

                                    <Text style={[styles.font_13, styles.T_bold, { marginBottom: '2%', color: colors.YellowJaja, }]}>{reduxOrderStatus !== 'Menunggu Pembayaran' ? details.totalCurrencyFormat : 'Rp' + priceSplitter(orderPaymentRecent.grand_total)}</Text>

                                </View>
                                : null
                            }
                        </View>
                        <View style={[styles.px_3]}>
                            {reduxOrderStatus === 'Pesanan Dibatalkan' && details ?
                                <Text style={[styles.font_11, styles.T_italic, { marginBottom: '2%', color: colors.RedMaroon, }]}>*{details.cancelBy} {details.cancelReason ? ' - ' + details.cancelReason : ''}</Text>
                                : null
                            }
                        </View>
                    </View>
                    {reduxOrderStatus === 'Menunggu Pembayaran' || reduxOrderStatus === 'Menunggu Konfirmasi' ?
                        <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
                            {reduxOrderStatus === 'Menunggu Pembayaran' ?
                                <>
                                    <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
                                        <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
                                        <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pembayaran</Text>
                                    </View>
                                    {
                                        loadingOrderPaymentRecent ?
                                            <ActivityIndicator size="large" />
                                            :
                                            orderPaymentRecent.payment_type == "" ?
                                                <View style={[styles.column, styles.mb_3]}>
                                                    {listPayment.map((item, indx) => {
                                                        if (item.payment_type != 'card') {
                                                            return (
                                                                <TouchableRipple
                                                                    key={indx + 'HY'}
                                                                    //onPressIn={() => handleShowPayment(item)} 
                                                                    style={[styles.px_3, styles.py_3, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}
                                                                    onPress={() => {
                                                                        setselectedPayment(item)
                                                                        if (item.payment_type_label != 'Bank Transfer') {
                                                                            // setModalShow(true)
                                                                            setsubPayment('')
                                                                        } else {
                                                                            setsubPayment(item.subPayment)
                                                                        }
                                                                    }}
                                                                    rippleColor={colors.BlueJaja} >
                                                                    <View style={styles.row_between_center}>
                                                                        <Text style={styles.font_12}>{item.payment_type_label === 'Card' ? 'Kartu Kredit' : item.payment_type_label == 'eWallet' ? item.payment_type_label + ' - ' + item.subPayment[0].payment_sub_label : item.payment_type_label}</Text>
                                                                        <Image fadeDuration={300} source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackGrey }]} />
                                                                    </View>
                                                                </TouchableRipple>
                                                            )
                                                        }

                                                    })}
                                                </View>
                                                :
                                                <View style={[styles.row_center, styles.my_2, { width: '95%', alignSelf: 'center' }]}>
                                                    <TouchableRipple
                                                        //onPress={() => console.log("change")} 
                                                        onPress={() => {
                                                            submitChange()

                                                            //     Alert.alert(
                                                            //         'Ganti Metode',
                                                            //         'Ingin mengganti metode pembayaran ?',
                                                            //         [
                                                            //             {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                                                            //             {text: 'YES', onPress: () => submitChange() },
                                                            //         ]
                                                            //     );

                                                        }}
                                                        style={[styles.row_center, styles.py_2, { width: 99 / 2 + '%', backgroundColor: colors.YellowJaja }]}>
                                                        <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                                            Ganti
                                                        </Text>
                                                    </TouchableRipple>
                                                    {/* <TouchableRipple onPress={() => console.log("refresh")} style={[styles.row_center, styles.py_2, { width: 99 / 3 + '%', backgroundColor: colors.GreenSuccess }]}>
<Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
    4
</Text>
</TouchableRipple> */}
                                                    <TouchableRipple onPress={handlePayment} style={[styles.row_center, styles.py_2, { width: 99 / 2 + '%', backgroundColor: colors.BlueJaja }]}>
                                                        <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                                            Bayar Sekarang
                                                        </Text>
                                                    </TouchableRipple>
                                                </View>
                                    }
                                </>
                                : null}


                            <View style={[styles.row_center, styles.mb_2, { width: '99%', alignSelf: 'center' }]}>
                                <TouchableRipple onPress={() => navigation.navigate('OrderCancel')} style={[styles.row_center, styles.py_2, { width: '95%', backgroundColor: colors.Red, alignSelf: 'center' }]}>
                                    <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                        Batalkan Pesanan
                                    </Text>
                                </TouchableRipple>
                            </View>


                        </View>
                        : null}
                    {/* <Button onPress={() => {
                        setmodalComplain(true)
                    }} style={{ alignSelf: 'center', width: '100%' }} contentStyle={{ width: '100%' }} color={colors.YellowJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                        Komplain
                    </Button> */}
                    {/* navigation.navigate(details.complain?'DetailComplain': 'RequestComplain', {invoice: details.items[0].invoice }) */}

                    {details && Object.keys(details).length ?
                        reduxOrderStatus === "Dalam Pengiriman" ?
                            <View style={{ zIndex: 100, height: Hp('5.5%'), width: '97%', backgroundColor: 'transparent', flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginBottom: '2%' }}>
                                {/* <Button onPress={handleDone} style={{ alignSelf: 'center', width: '100%', height: '95%', marginBottom: '2%' }} contentStyle={{ width: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.White }]} mode="contained" > */}
                                <TouchableRipple onPress={() => details.complain ? navigation.navigate('DetailComplain', { invoice: details.items[0].invoice }) : setmodalComplain(true)} style={[styles.row_center, styles.py_3, { marginHorizontal: '0.5%', borderRadius: 3, flex: 1, backgroundColor: colors.YellowJaja, alignSelf: 'center' }]}>
                                    <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                        {details.complain ?
                                            "Sedang Dikomplai"
                                            : "Komplain"}
                                        {console.log('masuk sini kan')}
                                    </Text>
                                </TouchableRipple>

                                {details?.trackingId !== 'DIGITALVOUCHER' ?
                                    <TouchableRipple onPress={handleTracking} style={[styles.row_center, styles.py_3, { marginHorizontal: '0.5%', borderRadius: 3, flex: 1, backgroundColor: colors.BlueJaja, alignSelf: 'center' }]}>
                                        <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                            Lacak
                                        </Text>
                                    </TouchableRipple>
                                    : null
                                }

                                <TouchableRipple onPress={handleDone} style={[styles.row_center, styles.py_3, { marginHorizontal: '0.5%', borderRadius: 3, flex: 1, backgroundColor: colors.GreenSuccess, alignSelf: 'center' }]}>
                                    <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                        Terima Pesanan
                                    </Text>
                                </TouchableRipple>
                                {/* </Button> */}

                            </View>
                            : reduxOrderStatus === "Pesanan Selesai" && details.items[0].isRating ?
                                <View style={{ position: 'absolute', bottom: 0, zIndex: 100, height: Hp('5.5%'), width: '95%', backgroundColor: 'transparent', flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: '3%' }}>
                                    <Button icon="star" onPress={() => {
                                        navigation.navigate('AddReview', { data: details.items[0].products })
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
                            <Text style={[styles.font_14, { fontFamily: 'SignikaNegative-SemiBold', color: colors.BlueJaja }]}>Total pembayaran :</Text>
                            <Text numberOfLines={1} style={[styles.font_20, { fontFamily: 'SignikaNegative-SemiBold', color: colors.BlueJaja }]}>{details ? details.totalCurrencyFormat : "Rp.0"}</Text>
                        </View>
                        <Button onPress={handlePayment} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                            Bayar Sekarang
                        </Button>
                    </View>
                    : null
            } */}
            </View >
            {
                downloadInvoice ?
                    <View style={{ height: 1, backgroundColor: colors.White }
                    } >
                        <WebView source={{ uri: downloadInvoice }} />
                    </View > : null
            }
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
                                console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 1348 ~ item", item)
                                if (item.payment_sub_label != 'BNI') {
                                    return (
                                        <TouchableRipple
                                            //onPressIn={() => gotoPaymentDetailSub(item)} 
                                            style={[styles.py_4, styles.px_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}
                                            onPress={() => {
                                                actionSheetPayment.current?.setModalVisible()
                                                gotoPaymentDetailSub(item)
                                            }}
                                            rippleColor={colors.BlueJaja} >
                                            <View style={styles.row_between_center}>
                                                <Text style={styles.font_13}>{item.payment_sub_label == 'BCA' ? 'BNI' : item.payment_sub_label}</Text>
                                                <Image fadeDuration={300} source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackGrey }]} />

                                                {/* {item.payment_sub_label === selectedSubPayment.payment_sub_label ?
                                                <Image source={require('../../assets/icons/check.png')} style={[styles.icon_14, { tintColor: colors.BlueJaja }]} />
                                                :
                                                <Image source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackTitle }]} />
                                            } */}
                                            </View>
                                        </TouchableRipple>
                                    )
                                }

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
                    <View style={[styles.column_start, styles.pt_s, { width: Wp('95%'), height: Wp('50%'), backgroundColor: colors.White, elevation: 11, zIndex: 999 }]}>
                        {selectedPayment.payment_type_label === 'Card' ?
                            null
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalComplain}
                onRequestClose={() => {
                    setmodalComplain(!modalComplain);
                }}>
                <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.column_start, { width: Wp('95%'), elevation: 11, zIndex: 999, backgroundColor: colors.White }]}>
                        <Text style={[styles.font_14, styles.T_medium, styles.px_3, styles.pt_3, { color: colors.BlueJaja }]}>Pilih produk yang ingin dikomplain</Text>

                        {details && details.items.length ?
                            details.items.map((item, idxStore) => {
                                return (
                                    <View key={String(idxStore) + 'FA'} style={[styles.column, styles.mb, { width: '100%', }]}>
                                        {item.products.map((child, idx) => {
                                            return (
                                                <View key={String(idx) + "SC"} style={[styles.column, styles.px_3, styles.py_2, { width: Wp('95%'), backgroundColor: colors.White }]}>
                                                    <View style={styles.row_between_center}>
                                                        <View style={[styles.row_start_center, { flex: 1, height: Wp('25%') }]}>
                                                            <TouchableOpacity >
                                                                <Image style={{
                                                                    width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.White,
                                                                    borderWidth: 0.2,
                                                                    borderColor: colors.Silver,
                                                                    alignSelf: 'center'
                                                                }}
                                                                    resizeMethod={"scale"}
                                                                    resizeMode="cover"
                                                                    source={{ uri: child.image }}
                                                                />
                                                            </TouchableOpacity>
                                                            <View style={[styles.column, styles.ml_2, { height: Wp('15%'), width: Wp('85%') }]}>
                                                                <Text numberOfLines={1} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '75%' }]}>{child.name}</Text>
                                                                <Text numberOfLines={1} style={[styles.font_11, { color: colors.BlackGrayScale }]}>{child.variant ? child.variant : "Variasi Biru"}</Text>
                                                                <View style={styles.row}>
                                                                    <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
                                                                    <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {child.priceCurrencyFormat}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <CheckBox disabled={false}
                                                            value={child.onComplain ? true : false}
                                                            onFillColor={colors.Red}
                                                            tintColors={{
                                                                false: colors.Silver,
                                                                true: colors.BlueJaja
                                                            }}
                                                            onValueChange={() => handleComplain(idxStore, child, idx)} />
                                                    </View>
                                                </View>
                                            )
                                        })
                                        }

                                    </View>
                                )
                            })
                            :
                            null}
                        <View style={[styles.row_end_center, styles.p_3, { width: '100%' }]}>
                            <View styl={{ width: '40%' }}>
                            </View>
                            <Button mode='contained' onPress={() => setmodalComplain(false)} style={[styles.mr_2, { width: '35%' }]} color={colors.YellowJaja} labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>
                                Batal
                            </Button>
                            <Button mode='contained' onPress={() => {
                                if (productsComplain && productsComplain.length) {
                                    setmodalComplain(false)
                                    navigation.navigate('RequestComplain', { invoice: details.items[0].invoice, productsComplain: productsComplain })
                                } else {
                                    Utils.alertPopUp('Pilih produk yang ingin di complain!')
                                }
                            }} style={[{ width: '35%' }]} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>
                                Komplain
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}
