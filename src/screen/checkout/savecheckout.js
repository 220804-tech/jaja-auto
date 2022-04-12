



// import React, { useEffect, useState, createRef, useRef, useCallback } from 'react'
// import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, StatusBar, FlatList, ToastAndroid, TextInput, RefreshControl, Modal } from 'react-native'
// import { Appbar, colors, styles, Wp, Hp, useNavigation, ServiceCheckout, Loading, Utils, ServiceCart, ServiceUser, ServiceOrder, ServiceProduct } from '../../export'
// import { Button, TouchableRipple, Checkbox } from 'react-native-paper'
// import ActionSheet from "react-native-actions-sheet";
// import CheckBox from '@react-native-community/checkbox';
// import { useDispatch, useSelector } from "react-redux";
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { Platform } from 'react-native';

// export default function checkoutScreen() {
//     const navigation = useNavigation()
//     const dispatch = useDispatch();

//     const reduxCheckout = useSelector(state => state.checkout.checkout)
//     const reduxAuth = useSelector(state => state.auth.auth)
//     const reduxCoin = useSelector(state => state.user.user.coinFormat)
//     const reduxUseCoin = useSelector(state => state.checkout.useCoin)
//     const reduxShipping = useSelector(state => state.checkout.shipping)
//     const reduxListPayment = useSelector(state => state.checkout.listPayment)
//     const cartStatus = useSelector(state => state.cart.cartStatus)

//     const [refreshControl, setRefreshControl] = useState(false)
//     const [showModal, setModalShow] = useState(false);
//     const [showModal2, setModalShow2] = useState(false);
//     const [giftSelected, setgiftSelected] = useState('');
//     const [dateSendTime, setdateSendTime] = useState('');
//     const actionSheetVoucher = createRef();
//     const actionSheetDelivery = createRef();
//     const actionSheetPayment = createRef();
//     const [storePressed, setstorePressed] = useState({})
//     const [loading, setLoading] = useState(false)
//     const [load, setLoad] = useState(false)
//     const [loadAs, setloadAs] = useState(false)
//     const [selectedPayment, setselectedPayment] = useState('')
//     const [selectedSubPayment, setselectedSubPayment] = useState('')
//     const [subPayment, setsubPayment] = useState([])
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     const [voucherFilters, setvoucherFilters] = useState([])
//     const [indexStore, setindexStore] = useState(0)
//     const [sendTime, setsendTime] = useState("setiap saat")
//     const [vouchers, setVouchers] = useState([])
//     const [voucherOpen, setvoucherOpen] = useState("")
//     const [maxSendDate, setmaxSendDate] = useState("")
//     const [deliveryDate, setdeliveryDate] = useState("")
//     const [notes, setNotes] = useState([])
//     const [sendDate, setSendDate] = useState("")
//     const [rangeDate, setrangeDate] = useState([])
//     const [listMonth, setlistMonth] = useState(["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "September", "Desember"])
//     const [useCoin, setUseCoin] = useState(false)
//     const [dateMin, setdateMin] = useState({
//         year: 0,
//         month: 0,
//         date: 0,
//     });

//     const [dateMax, setdateMax] = useState({
//         year: 0,
//         month: 0,
//         date: 0,
//     });

//     const [textGift, settextGift] = useState('')
//     const [voucherFocus, setvoucherFocus] = useState('1')
//     const [voucherCode, setvoucherCode] = useState('')

//     useEffect(() => {
//         setRefreshControl(false)
//         setLoad(false)
//         setLoading(false)
//         setloadAs(false)
//         if (reduxAuth) {
//             getVouchers(reduxAuth)
//         } else {
//             navigation.navigate("Login")
//         }
//         if (voucherOpen) {
//             actionSheetVoucher.current?.setModalVisible(true)
//         } else {
//             actionSheetVoucher.current?.setModalVisible(false)

//         }
//         if (Object.keys(reduxCheckout).length) {
//             setLoading(false)
//         } else {
//             setLoading(true)
//         }

//     }, [reduxCheckout, voucherOpen, reduxShipping, useCoin])

//     useEffect(() => {
//         if (selectedSubPayment) {
//             setTimeout(() => actionSheetPayment.current?.setModalVisible(false), 750);
//         }
//     }, [selectedSubPayment])

//     useEffect(() => {
//         var future = new Date();
//         if (cartStatus === 1) {
//             future.setDate(future.getDate() + 3);
//             setdateMin({
//                 year: future.getFullYear(),
//                 month: future.getMonth(),
//                 date: future.getDate()
//             })
//             setSendDate(String(future.getFullYear() + "-" + future.getMonth() + '-' + future.getDate()))
//             future.setMonth(future.getMonth() + 4);
//             setdateMax({
//                 year: future.getFullYear(),
//                 month: future.getMonth(),
//                 date: future.getDate()
//             })
//         } else {
//             future.setDate(future.getDate() + 3);
//             setdateMin({
//                 year: future.getFullYear(),
//                 month: future.getMonth(),
//                 date: future.getDate()
//             })
//             future.setDate(future.getDate() + 7);

//             setdateMax({
//                 year: future.getFullYear(),
//                 month: future.getMonth(),
//                 date: future.getDate()
//             })
//         }
//     }, [])

//     const getCheckout = (coin) => {
//         if (coin) {
//             dispatch({ type: 'SET_USECOIN', payload: true })
//         } else {
//             dispatch({ type: 'SET_USECOIN', payload: false })

//         }
//         ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
//             if (res) {
//                 dispatch({ type: 'SET_CHECKOUT', payload: res })
//                 actionSheetVoucher.current?.setModalVisible(false)
//                 return res
//             } else {
//                 return false
//             }
//         }).catch(res => {
//             return false
//         })
//         // dispatch({ type: 'SET_ACTION_SHEET', payload: true })
//     }

//     const getVouchers = (token) => {
//         // ServiceVoucher.getVouchers(token).then(res => {
//         //     if (res) {
//         //         setVouchers(res.items)
//         //         setvoucherFilters(res.filters)
//         //     }
//         // })
//     }

//     const handleVoucher = async (val, index) => {
//         if (voucherOpen == "store") {
//             if (val.isClaimed) {
//                 actionSheetVoucher.current?.setModalVisible(false)
//                 setTimeout(() => setloadAs(true), 100);
//                 var myHeaders = new Headers();
//                 myHeaders.append("Authorization", reduxAuth);
//                 myHeaders.append("Content-Type", "application/json");
//                 var raw = JSON.stringify({
//                     "voucherId": val.id,
//                     "storeId": val.storeId
//                 });
//                 var requestOptions = {
//                     method: 'PUT',
//                     headers: myHeaders,
//                     body: raw,
//                     redirect: 'follow'
//                 };
//                 fetch("https://jaja.id/backend/checkout/selectedVoucherStore", requestOptions)
//                     .then(response => response.text())
//                     .then(res => {
//                         try {
//                             let result = JSON.parse(res)
//                             if (result.status.code === 200) {
//                                 if (result.status.message === 'voucher berhasil digunakan') {
//                                     Utils.alertPopUp('Voucher berhasil digunakan!')
//                                 } else if (result.status.message === 'voucher tidak digunakan') {

//                                 }
//                                 getCheckout(reduxUseCoin);
//                             } else {
//                                 Utils.handleErrorResponse(result, 'Error with status code : 12060')
//                             }
//                         } catch (error) {
//                             Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12061'))
//                         }
//                         setTimeout(() => setloadAs(false), 500);
//                     })
//                     .catch(error => {
//                         setloadAs(false)
//                         setTimeout(() => Utils.handleError(error, 'Error with status code : 12062'), 100);
//                     });
//             } else {
//                 handleClaimVoucher("store", val.id, index)
//             }

//         } else if (voucherOpen == "jaja") {
//             if (val?.isClaimed || index === 'khusus') {
//                 actionSheetVoucher.current?.setModalVisible(false)
//                 if (index !== 'khusus') {
//                     setTimeout(() => setLoad(true), 200);
//                 }
//                 var headers = new Headers();
//                 headers.append("Authorization", reduxAuth);
//                 headers.append("Content-Type", "application/json");
//                 headers.append("Cookie", "ci_session=h2pi6rhg4uma28jrsci9ium4tf7k8id4");
//                 var row = JSON.stringify({ "voucherId": index === 'khusus' ? val.id_promo : val.id });
//                 var rq = {
//                     method: 'PUT',
//                     headers: headers,
//                     body: row,
//                     redirect: 'follow'
//                 };

//                 fetch("https://jaja.id/backend/checkout/selectedVoucherJaja", rq)
//                     .then(response => response.text())
//                     .then(res => {
//                         console.log("🚀 ~ file: CheckoutScreen.js ~ line 233 ~ handleVoucher ~ res", res)
//                         try {
//                             let result = JSON.parse(res)
//                             setTimeout(() => setLoad(false), 500);
//                             if (result.status.code === 200) {
//                                 if (index == 'khusus') {
//                                     setvoucherOpen(null)
//                                     // Utils.alertPopUp('Kode voucher berhasil digunakan')
//                                 } else {
//                                     Utils.alertPopUp('Voucher berhasil digunakan')
//                                 }
//                                 getCheckout(reduxUseCoin)
//                             } else {
//                                 Utils.handleErrorResponse(result, 'Error with status code 12063')
//                             }
//                             if (index === 'khusus') {
//                                 getCheckout(reduxUseCoin)
//                             }
//                         } catch (error) {
//                             setLoad(false)
//                             Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12064'))
//                         }
//                     })
//                     .catch(error => {
//                         setLoad(false)
//                         setTimeout(() => Utils.handleError(String(error), 'Error with status code : 12065'), 100);
//                     });

//             } else {
//                 handleClaimVoucher("jaja", val.id, index)
//             }
//         }
//         setTimeout(() => setLoad(false), 5000);
//     }

//     const handleClaimVoucher = async (name, voucherId, index) => {
//         if (index !== 'khusus') {
//             setloadAs(true)
//         }
//         if (name === "store") {
//             var myHeaders = new Headers();
//             myHeaders.append("Authorization", reduxAuth);
//             myHeaders.append("Content-Type", "application/json");
//             myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");
//             var raw = JSON.stringify({ "voucherId": voucherId });
//             var requestOptions = {
//                 method: 'POST',
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: 'follow'
//             };
//             fetch("https://jaja.id/backend/voucher/claimVoucherStore", requestOptions)
//                 .then(response => response.text())
//                 .then(res => {
//                     try {
//                         let result = JSON.parse(res)
//                         if (result.status.code === 200) {
//                             if (index == 'khusus') {
//                                 Utils.alertPopUp('Kode voucher berhasil diklaim')
//                             } else {
//                                 ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
//                                     if (res) {
//                                         setvoucherOpen('store')
//                                         setVouchers(res.cart[indexStore].voucherStore)
//                                         dispatch({ type: 'SET_CHECKOUT', payload: res })
//                                     }
//                                 })
//                             }
//                         } else {
//                             Utils.handleErrorResponse(result, 'Error with status code : 12067')
//                         }
//                         setTimeout(() => setloadAs(false), 500);
//                     } catch (error) {
//                         setloadAs(false)
//                         Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12068'))

//                     }
//                 })
//                 .catch(error => {
//                     setloadAs(false)
//                     Utils.handleError(error, 'Error with status code : 12069')
//                 });

//         } else {
//             var myHeaders = new Headers();
//             myHeaders.append("Authorization", reduxAuth);
//             myHeaders.append("Content-Type", "application/json");
//             var raw = JSON.stringify({ "voucherId": voucherId });
//             var requestOptions = {
//                 method: 'POST',
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: 'follow'
//             };

//             await fetch("https://jaja.id/backend/voucher/claimVoucherJaja", requestOptions)
//                 .then(response => response.text())
//                 .then(res => {

//                     setTimeout(() => setloadAs(false), 500);
//                     try {
//                         let result = JSON.parse(res)
//                         if (result.status.code === 200) {
//                             ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
//                                 if (res) {
//                                     setvoucherOpen('jaja')
//                                     setVouchers(res.voucherJaja)
//                                     dispatch({ type: 'SET_CHECKOUT', payload: res })
//                                 }
//                             })
//                         } else {
//                             if (index !== 'khusus') {
//                                 if (result.status.message === 'voucher has claim') {
//                                     Utils.alertPopUp('Kode voucher sudah pernah digunakan!')
//                                 } else {
//                                     setTimeout(() => Utils.handleErrorResponse(result, 'Error with status code : 12070'), 100);
//                                 }
//                             } else {
//                                 actionSheetVoucher.current?.setModalVisible()
//                             }

//                         }
//                     } catch (error) {
//                         Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12071'))
//                     }
//                 })
//                 .catch(error => {
//                     setloadAs(false)
//                     Utils.handleError(error, 'Error with status code : 12072')
//                 });
//         }
//     }

//     const deliverySelected = (code, val) => {
//         actionSheetDelivery.current?.setModalVisible()
//         setTimeout(() => setLoad(true), 100);
//         var myHeaders = new Headers();
//         myHeaders.append("Authorization", reduxAuth);
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("Cookie", "ci_session=f7mkmnsrubv4fb7flu6tfcv8uecmproe");

//         var raw = JSON.stringify({
//             "storeId": storePressed.id,
//             "shippingCode": code,
//             "shippingTypeCode": val.code,
//             "sendTime": sendTime,
//             "dateSendTime": sendDate
//         });

//         var requestOptions = {
//             method: 'PUT',
//             headers: myHeaders,
//             body: raw,
//             redirect: 'follow'
//         };

//         fetch(`https://jaja.id/backend/checkout/selectedShipping?is_gift=${cartStatus === 1 ? 1 : 0}`, requestOptions)
//             .then(response => response.text())
//             .then(res => {
//                 console.log("🚀 ~ file: CheckoutScreen.js ~ line 340 ~ deliverySelected ~ res", res)
//                 try {
//                     let result = JSON.parse(res)
//                     if (result.status.code === 200) {
//                         setTimeout(() => actionSheetVoucher.current?.setModalVisible(false), 1000);
//                         if (cartStatus === 1) {
//                             handleGetCheckout()
//                         } else {
//                             ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
//                                 if (res) {
//                                     dispatch({ type: 'SET_CHECKOUT', payload: res })
//                                 }
//                             })
//                         }
//                     } else {
//                         Utils.handleErrorResponse(result, 'Error with status code : 12074')
//                     }
//                 } catch (error) {
//                     Utils.handleErrorResponse(JSON.stringify(res + '\n\n' + error, 'Error with status code : 12075'))
//                 }
//                 setTimeout(() => setLoad(false), 11000);
//             })
//             .catch(error => {
//                 Utils.handleError(error, "Error with status code : 12076")
//                 setLoad(false)
//             })
//         setTimeout(() => setLoad(false), 5000);
//     }

//     const handleDescription = voucher => {
//         console.log("file: VoucherScreen.js ~ line 154 ~ VoucherScreen ~ voucher", voucher)
//         Alert.alert(
//             "Syarat dan Ketentuan Voucher",
//             `\n\n1. ${voucher.name}
//             \n2. Voucher ${String(voucher.category) === "ongkir" ? "Gratis Biaya Pengiriman" : String(voucher.category) === "diskon" ? 'Diskon Belanja' : "CASHBACK"}
//             \n3. Mulai tanggal ${voucher.startDate}
//             \n4. Berakhir tanggal ${voucher.endDate}
//             \n5. Diskon didapatkan ${voucher.discountText}
//             ${voucher.minShoppingCurrencyFormat ? '\n6. Minimal pembelian ' + voucher.minShoppingCurrencyFormat : ""}
//             `,
//             [
//                 {
//                     text: "Setuju",
//                     onPress: () => console.log("cok"),
//                     style: "cancel",
//                 },
//             ],
//             {
//                 cancelable: false,
//             }
//         );
//     }

//     const handleConfirmDate = (date) => {
//         //     console.log("🚀 ~ file: CheckoutScreen.js ~ line 393 ~ handleConfirmDate ~ date", date)
//         //     console.log("🚀 ~ file: CheckoutScreen.js ~ line 393 ~ handleConfirmDate ~ date", date.getDate())
//         //     console.log("🚀 ~ file: CheckoutScreen.js ~ line 393 ~ handleConfirmDate ~ date", date.getMonth() + 1)
//         //     console.log("🚀 ~ file: CheckoutScreen.js ~ line 393 ~ handleConfirmDate ~ date", date.getFullYear())
//         let mothSelected = parseInt(date.getMonth()) < 12 ? date.getMonth() + 1 : '01'
//         let dateSelected = date.getFullYear() + "-" + mothSelected + '-' + date.getDate()
//         console.log("🚀 ~ file: CheckoutScreen.js ~ line 399 ~ handleConfirmDate ~ dateSelected", dateSelected)

//         try {
//             if (cartStatus !== 1) {
//                 let mont = new Date()
//                 // let year = new 399().getFullYear()
//                 let str = JSON.stringify(date);
//                 let dateDay = str.slice(9, 11);
//                 let dateMonth = str.slice(6, 8);
//                 setdeliveryDate(str.slice(1, 11))
//                 let min = str.slice(6, 8) - JSON.stringify(mont).slice(6, 8)
//                 setdeliveryDate(str.slice(1, 11))
//                 let string = listMonth[parseInt(dateMonth) - 1];
//                 setSendDate(dateSelected)
//             } else {
//                 setSendDate(dateSelected)
//             }
//         } catch (error) {
//             console.log("errorrr  ", error)
//         }
//         setDatePickerVisibility(false)

//     };

//     const handleListDate = (index) => {
//         let dateNow = new Date()
//         let mothSelected = parseInt(dateNow.getMonth()) < 12 ? dateNow.getMonth() + 1 : '01'
//         let string = new Date().getDate() + parseInt(reduxShipping?.[index]?.items[0]?.type[0]?.etd.toString().slice(2, 3))
//         if (!string || string == NaN) {
//             string = reduxShipping?.[index]?.items[0]?.type[0]?.etd
//         }
//         setmaxSendDate(string)
//         // setSendDate(dateNow.getFullYear() + '-' + mothSelected + "-" + string)

//         // let range = new Date().getDate() + parseInt(String(reduxShipping?.[index]?.items[0]?.type[0]?.etd).slice(2, 3));
//         let arrNewRange = [];
//         for (let idx = 0; idx < string; idx++) {
//             arrNewRange.push(string + idx)
//         }
//         setrangeDate(arrNewRange)
//         actionSheetDelivery.current?.setModalVisible(true)

//     }

//     const checkedValue = (index) => {
//         if (reduxShipping.length) {
//             handleListDate(index)
//         } else {
//             setLoad(true)
//             setTimeout(() => {
//                 setLoad(false)
//                 if (reduxShipping.length) {
//                     handleListDate(index)
//                 } else {
//                     setTimeout(() => {
//                         if (reduxShipping.length) {
//                             handleListDate(index)
//                         } else {
//                             console.log("keluar")
//                         }
//                     }, 3000);
//                 }
//             }, 2000);
//         }
//     }

//     const handleNotes = (val, index) => {
//         let newArr = notes;
//         newArr[index] = { "note": val }
//         setNotes(newArr)
//     }

//     const handleCheckout = () => {
//         Alert.alert(
//             `${reduxCheckout.total > 0 ? "Pilih Pembayaran" : 'Buat Pesanan'}`,
//             `${reduxCheckout.total > 0 ? 'Pesanan kamu akan dilanjutkan ke menu pembayaran!.' : 'Pesanan kamu akan dibuat!'}`,

//             [
//                 {
//                     text: "Periksa Lagi",
//                     onPress: () => console.log("Cancel Pressed"),
//                     style: "cancel"
//                 },
//                 {
//                     text: "Bayar", onPress: () => {
//                         setLoad(true)
//                         let newArr = notes;
//                         for (let index = 0; index < 2; index++) {
//                             if (!newArr[index]) {
//                                 newArr[index] = { "note": "" }
//                             }
//                         }

//                         setTimeout(() => {
//                             if (reduxCheckout.total <= 0) {
//                                 Utils.alertPopUp('Persanan berhasil dibuat!')
//                             }
//                             let error = true;
//                             var myHeaders = new Headers();
//                             myHeaders.append("Authorization", reduxAuth);
//                             myHeaders.append("Content-Type", "application/json");

//                             var raw = JSON.stringify({
//                                 'cart': newArr,
//                                 'koin': reduxUseCoin
//                             });
//                             var requestOptions = {
//                                 method: 'POST',
//                                 headers: myHeaders,
//                                 body: raw,
//                                 redirect: 'follow'
//                             };

//                             fetch(`https://jaja.id/backend/checkout?is_gift=${cartStatus === 1 ? 1 : 0}`, requestOptions)
//                                 .then(response => response.text())
//                                 .then(result => {
//                                     error = false
//                                     try {
//                                         let data = JSON.parse(result)
//                                         if (data && Object.keys(data).length && data.status.code == 200) {
//                                             dispatch({ type: 'SET_INVOICE', payload: data.data })
//                                             dispatch({ type: 'SET_ORDER_STATUS', payload: null })
//                                             navigation.replace('OrderDetails')
//                                             ServiceCart.getTrolley(reduxAuth, cartStatus === 1 ? 1 : 0, dispatch)

//                                             ServiceUser.getBadges(reduxAuth).then(res => {
//                                                 if (res) {
//                                                     dispatch({ type: "SET_BADGES", payload: res })
//                                                 } else {
//                                                     dispatch({ type: "SET_BADGES", payload: {} })
//                                                 }
//                                             })
//                                             ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
//                                                 if (resUnpaid && Object.keys(resUnpaid).length) {
//                                                     dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
//                                                     dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
//                                                 }
//                                             })
//                                             ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
//                                                 if (reswaitConfirm && Object.keys(reswaitConfirm).length) {
//                                                     dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
//                                                     dispatch({ type: 'SET_ORDER_FILTER', payload: reswaitConfirm.filters })
//                                                 }
//                                             })
//                                         } else {
//                                             setLoad(false)
//                                             Utils.handleErrorResponse(data, "Error with status code : 12048")
//                                             return null
//                                         }
//                                         setTimeout(() => {
//                                             setLoad(false)
//                                         }, 2000);
//                                     } catch (err) {
//                                         error = false
//                                         Utils.handleError(result, "Error with status code : 12049")
//                                         setLoad(false)

//                                     }
//                                     setTimeout(() => {
//                                         setLoad(false)
//                                     }, 2000);

//                                 })
//                                 .catch(err => {
//                                     console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", err)
//                                     setLoad(false)
//                                     Utils.handleError(err, "Error with status code : 120477")
//                                 })
//                             setTimeout(() => {
//                                 let text = "Tidak dapat terhubung, periksa kembali koneksi internet anda!"
//                                 if (error) {
//                                     Utils.CheckSignal().then(res => {
//                                         if (res.connect) {
//                                             Utils.alertPopUp("Sedang memuat..")
//                                         } else {
//                                             setLoad(false)
//                                             Utils.alertPopUp(text)
//                                         }
//                                         setTimeout(() => {
//                                             setLoad(false)
//                                             if (error) {
//                                                 Utils.alertPopUp(text)
//                                             }
//                                         }, 5000);
//                                     })
//                                 }
//                             }, 5000);
//                         }, 250);

//                     }
//                 }
//             ]
//         );

//     }

//     const handleShowPayment = (item) => {
//         console.log("🚀 ~ file: CheckoutScreen.js ~ line 571 ~ handleShowPayment ~ item", item)
//         setselectedPayment(item)
//         if (item.payment_type_label !== 'Bank Transfer') {
//             setModalShow(true)
//             // setsubPayment('')
//         } else {
//             setsubPayment(item.subPayment)
//             actionSheetPayment.current?.setModalVisible(true)
//         }
//     }

//     const onRefresh = useCallback(() => {
//         setRefreshControl(true)
//         if (cartStatus === 1) {
//             console.log('masuk sini')
//             handleGetCheckout()
//         } else {
//             ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(res => {
//                 if (res) {
//                     dispatch({ type: 'SET_CHECKOUT', payload: res })
//                     ToastAndroid.show("Updated", ToastAndroid.LONG, ToastAndroid.CENTER)
//                     setTimeout(() => {
//                         setRefreshControl(false)
//                     }, 2000);
//                 }
//             })
//         }
//         ServiceCheckout.getShipping(reduxAuth, cartStatus === 1 ? 1 : 0).then(res => {
//             if (res) {
//                 dispatch({ type: 'SET_SHIPPING', payload: res })
//             }
//         })
//         setTimeout(() => {
//             setRefreshControl(false)
//         }, 5000);
//     }, []);

//     const handleGetCheckout = () => {
//         var myHeaders = new Headers();
//         myHeaders.append("Authorization", reduxAuth);
//         myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
//         var requestOptions = {
//             method: 'GET',
//             headers: myHeaders,
//             redirect: 'follow'
//         };

//         fetch(`https://jaja.id/backend/checkout?fromCart=1&is_gift=${cartStatus === 1 ? 1 : 0}&isCoin=${reduxUseCoin ? 1 : 0}`, requestOptions)
//             .then(response => response.text())
//             .then(res => {
//                 try {
//                     let result = JSON.parse(res)
//                     if (result.status.code === 200) {
//                         dispatch({ type: 'SET_CHECKOUT', payload: result.data })
//                         navigation.navigate('Checkout')
//                     } else if (result.status.code == 404 && result.status.message == 'alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu') {
//                         Utils.alertPopUp('Silahkan tambah alamat terlebih dahulu!')
//                         navigation.navigate('Address', { data: "checkout" })
//                     } else {
//                         Utils.handleErrorResponse(result, 'Error with status code : 12156')
//                         return null
//                     }
//                 } catch (error) {
//                     Utils.alertPopUp(JSON.stringify(res) + ' : 12157\n\n' + res)
//                 }
//             })
//             .catch(error => Utils.handleError(error, 'Error with status code : 12158'));
//     }

//     const handleUseCoin = (coin) => {
//         setUseCoin(coin)
//         dispatch({ type: 'SET_USECOIN', payload: coin })
//         ServiceCheckout.getCheckout(reduxAuth, coin ? 1 : 0).then(res => {
//             if (res) {
//                 dispatch({ type: 'SET_CHECKOUT', payload: res })
//                 actionSheetVoucher.current?.setModalVisible(false)
//                 return res
//             } else {
//                 return false
//             }
//         }).catch(res => {
//             return false
//         })
//     }

//     const handleGiftCard = async () => {
//         setModalShow2(false)
//         setLoad(true)

//         var credentials = JSON.stringify({
//             "cartId": giftSelected,
//             "dateSendTime": dateSendTime,
//             "greetingCardGift": textGift
//         });

//         let res = await ServiceProduct.handleUpdateGift(reduxAuth, credentials);

//         if (res) {
//             setTimeout(() => {
//                 setLoad(false)
//             }, 2000);
//             handleGetCheckout()
//         } else {
//             setTimeout(() => {
//                 handleGetCheckout()
//                 if (!res) {
//                     setLoad(false)
//                 }
//             }, 10000);
//         }

//     }

//     const handleCheckVoucher = () => {
//         if (voucherCode) {
//             if (voucherCode.length > 5) {
//                 setloadAs(true)
//                 setvoucherOpen('jaja')
//                 var myHeaders = new Headers();
//                 myHeaders.append("Authorization", reduxAuth);
//                 myHeaders.append("Cookie", "ci_session=vah7ivbaoqeus4qfh89d7c8o2q55216c");


//                 var requestOptions = {
//                     method: 'GET',
//                     headers: myHeaders,
//                     redirect: 'follow'
//                 };

//                 fetch(`https://jaja.id/backend/checkout/getDataVoucherTamiya/${voucherCode}`, requestOptions)
//                     .then(response => response.json())
//                     .then(async res => {
//                         if (res.status.code === 200) {
//                             let id_promo = res.data.id_promo
//                             try {
//                                 await handleClaimVoucher('jaja', id_promo, 'khusus')
//                             } catch (error) {

//                             }
//                             try {
//                                 await handleVoucher(res.data, 'khusus')
//                             } catch (error) {

//                             }
//                             setTimeout(() => {
//                                 setloadAs(false)
//                             }, 1000);
//                         } else {
//                             setloadAs(false)
//                             if (res.status.message === 'data not found') {
//                                 Utils.alertPopUp('Kode voucher tidak ditemukan')
//                             } else {
//                                 Utils.alertPopUp(res.status.message)
//                             }
//                         }
//                     })
//                     .catch(error => {
//                         setloadAs(false)
//                         Utils.handleError(error)
//                     })
//             } else {
//                 setloadAs(false)
//                 Utils.alertPopUp('Kode voucher tidak ditemukan')
//             }
//         }
//     }

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
//             <StatusBar
//                 animated={true}
//                 backgroundColor={colors.BlueJaja}
//                 barStyle='default'
//                 showHideTransition="fade"
//             />
//             {load ? <Loading /> : null}
//             <Appbar back={true} title="Checkout" />
//             {Object.keys(reduxCheckout).length === 0 ? <Loading /> : null}
//             <View style={{ flex: 1, backgroundColor: 'white' }}>
//                 <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'column', paddingBottom: Hp('7%'), backgroundColor: colors.White }} refreshControl={<RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />}>
//                     <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                         <View style={[styles.row_between_center, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                             <View style={styles.row}>
//                                 <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
//                                 <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Alamat Pengiriman</Text>
//                             </View>
//                             {/* {reduxCheckout?.address && Object.keys(reduxCheckout.address).length ?
//                                 <TouchableOpacity style={{ width: '49%', alignSelf: 'flex-end', justifyContent: 'flex-end' }} onPress={() => navigation.navigate('Address', { data: "extra" })}>
//                                     <Text style={[styles.font_12, { color: colors.BlueJaja, alignSelf: 'flex-end' }]}>+ Tambah Penerima</Text>
//                                 </TouchableOpacity>
//                                 : null} */}
//                         </View>
//                         {reduxCheckout.address && Object.keys(reduxCheckout.address).length ?
//                             <View style={[styles.column, styles.p_3]}>
//                                 <View style={styles.row_between_center}>
//                                     <Text numberOfLines={1} style={[styles.font_14, { width: '70%' }]}>{reduxCheckout.address.receiverName}</Text>
//                                     <TouchableOpacity style={{ width: '25%', paddingVertical: 5 }} onPress={() => navigation.navigate('Address', { data: "checkout" })}>
//                                         <Text style={[styles.font_12, { color: colors.BlueJaja, alignSelf: 'flex-end' }]}>Ubah</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <Text numberOfLines={1} style={[styles.font_12, styles.mt]}>{reduxCheckout.address.phoneNumber}</Text>

//                                 <Text numberOfLines={3} style={[styles.font_12]}>{reduxCheckout.address.address}</Text>
//                             </View>
//                             :
//                             <View style={[styles.column, styles.p_3]}>
//                                 <View style={styles.row_between_center}>
//                                     <Text numberOfLines={1} style={[styles.font_14]}>Masukkan Alamat Baru</Text>
//                                     <TouchableOpacity onPress={() => navigation.navigate('Address', { data: "checkout" })}>
//                                         <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Tambah</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         }
//                         {/* {reduxCheckout.address && Object.keys(reduxCheckout.address).length ?
//                             <View style={[styles.column, styles.py_3, styles.px_5,]}>
//                                 <View style={styles.row_between_center}>
//                                     <Text numberOfLines={1} style={[styles.font_14, { width: '70%' }]}>{reduxCheckout.address.receiverName}</Text>
//                                     <View style={styles.row_end_center}>
//                                         <Text style={[styles.font_12, { color: colors.BlueJaja, alignSelf: 'flex-end', textAlignVertical: 'center' }]}>1+</Text>
//                                         <TouchableOpacity style={[styles.ml_4, { width: '25%', paddingVertical: 5 }]} onPress={() => navigation.navigate('Address', { data: "checkout" })}>
//                                             <Image style={[styles.icon_16, { tintColor: colors.RedNotif }]} source={require('../../assets/icons/delete.png')} />
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                                 <Text numberOfLines={1} style={[styles.font_12, styles.mt]}>{reduxCheckout.address.phoneNumber}</Text>
//                                 <Text numberOfLines={3} style={[styles.font_12]}>{reduxCheckout.address.address}</Text>
//                             </View>
//                             :
//                             <View style={[styles.column, styles.p_3]}>
//                                 <View style={styles.row_between_center}>
//                                     <Text numberOfLines={1} style={[styles.font_14]}>Masukkan Alamat Baru</Text>
//                                     <TouchableOpacity onPress={() => navigation.navigate('Address', { data: "checkout" })}>
//                                         <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Tambah</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         } */}
//                     </View>
//                     {
//                         reduxCheckout.cart && reduxCheckout.cart.length ?
//                             reduxCheckout.cart.map((item, idxStore) => {
//                                 return (
//                                     <View key={String(idxStore)} style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                                         <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                                             <Image style={[styles.icon_21, { marginRight: '2%', tintColor: colors.BlueJaja }]} source={require('../../assets/icons/store.png')} />
//                                             <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.store.name}</Text>
//                                         </View>
//                                         {item.products.map((child, idx) => {
//                                             return (
//                                                 <View key={String(idx) + "s"} style={[styles.column, styles.p_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
//                                                     <View style={[styles.row_start_center, styles.py_2, { width: '100%', height: Wp('25%') }]}>
//                                                         <Image style={{
//                                                             width: Wp('18%'), height: '90%', borderRadius: 5, backgroundColor: colors.White,
//                                                             borderWidth: 0.2,
//                                                             borderColor: colors.Silver,
//                                                             alignSelf: 'center'
//                                                         }}
//                                                             resizeMethod={"scale"}
//                                                             resizeMode="cover"
//                                                             source={{ uri: child.image }}
//                                                         />
//                                                         <View style={[styles.column_between_center, { alignItems: 'flex-start', height: '90%', width: Wp('82%'), paddingHorizontal: '3%' }]}>
//                                                             <View style={[styles.column, { width: '100%' }]}>
//                                                                 <Text numberOfLines={1} style={[styles.font_14, styles.T_medium]}>{child.name}</Text>
//                                                                 <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale }]}>{child.variant ? child.variant : ""}</Text>
//                                                             </View>
//                                                             <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end', paddingHorizontal: '2%' }}>
//                                                                 {child.isDiscount ?
//                                                                     <>
//                                                                         <Text numberOfLines={1} style={[styles.priceBefore, styles.T_italic]}>{child.priceCurrencyFormat}</Text>
//                                                                         <View style={styles.row}>
//                                                                             <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
//                                                                             <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlackGrayScale }]}> {child.priceDiscountCurrencyFormat}</Text>
//                                                                         </View>
//                                                                     </>
//                                                                     :
//                                                                     <View style={styles.row}>
//                                                                         <Text numberOfLines={1} style={[styles.font_14]}>{child.qty} x</Text>
//                                                                         <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlackGrayScale }]}> {child.priceCurrencyFormat}</Text>
//                                                                     </View>
//                                                                 }
//                                                             </View>
//                                                         </View>
//                                                     </View>
//                                                     <View style={[styles.row_end_center]}>
//                                                         <Text numberOfLines={1} style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja }]}> {child.subTotalCurrencyFormat}</Text>
//                                                     </View>
//                                                     {cartStatus === 1 ?
//                                                         <TouchableRipple onPress={() => {
//                                                             setgiftSelected(child.cartId)
//                                                             setModalShow2(true)
//                                                             settextGift(child.greetingCardGift)
//                                                         }} rippleColor={colors.White} style={[styles.column_center_start, styles.mt_2, styles.p_2, { width: '99%', alignSelf: 'center', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.BlueJaja, borderRadius: 5 }]}>
//                                                             {/* <View style={styles.row_between_center}> */}
//                                                             <>
//                                                                 <View style={[styles.row_between_center, { width: '100%' }]}>
//                                                                     <TouchableRipple style={{ width: '33.3%' }} onPress={handleGiftCard}>
//                                                                         <Text style={[styles.font_14, { color: colors.BlueJaja, alignSelf: 'flex-start', width: '100%', textAlign: 'left' }]}>Kartu ucapan : </Text>
//                                                                     </TouchableRipple>
//                                                                     <Text style={[styles.font_10, { color: colors.BlueJaja, width: '33.3%', textAlign: 'right' }]}>Ubah</Text>
//                                                                 </View>
//                                                                 {/* <TextInput placeholder='Isi kartu ucapan' textAlignVertical='top' maxLength={1000} numberOfLines={3} multiline={true} style={[styles.font_12, styles.p_2, {  borderColor: colors.BlackGrey, width: '100%', maxHeight: Hp('33%') }]} value={textGift} onChangeText={text => settextGift(text)} /> */}

//                                                                 <Text numberOfLines={2} style={[styles.font_11, { alignSelf: 'flex-start', textAlign: 'left', width: '100%' }]}>{child.greetingCardGift ? child.greetingCardGift : 'Ubah kartu ucapan!'}</Text>
//                                                             </>
//                                                         </TouchableRipple> : null
//                                                     }
//                                                 </View>
//                                             )
//                                         })}
//                                         {item.voucherDiscount ?
//                                             <View style={styles.column}>
//                                                 <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                                                     <TouchableOpacity style={[styles.row_between_center, styles.pr_2, styles.pl_3, styles.py_2]} onPress={() => {
//                                                         setvoucherFocus('1')
//                                                         setvoucherFocus('1')
//                                                         setvoucherOpen('store')
//                                                         setVouchers(item.voucherStore)
//                                                         setindexStore(idxStore)
//                                                     }}>
//                                                         {/* <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} /> */}
//                                                         <Text style={[styles.font_14, styles.T_medium]}>Voucher Toko</Text>
//                                                         <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
//                                                             <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {item.voucherStoreSelected.discountText}</Text>
//                                                         </View>
//                                                     </TouchableOpacity>
//                                                 </View>
//                                                 <View style={[styles.row_end_center, styles.px_2]}>
//                                                     <Text style={[styles.font_13,]}>Subtotal </Text>
//                                                     <Text numberOfLines={1} style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}> {item.totalDiscountCurrencyFormat}</Text>
//                                                 </View>
//                                             </View>
//                                             :
//                                             item.voucherStore.length ?
//                                                 <View style={[styles.p_2, styles.mb_2]}>
//                                                     <Button onPress={() => {
//                                                         setvoucherFocus('1')
//                                                         setvoucherOpen('store')
//                                                         setVouchers(item.voucherStore)
//                                                         setindexStore(idxStore)
//                                                     }} icon="arrow-right" color={colors.RedFlashsale} uppercase={false} labelStyle={{ fontFamily: 'Poppins-Regular', color: colors.RedFlashsale }} style={{ borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 10 }} contentStyle={{ borderColor: colors.BlueJaja }} mode="outlined">
//                                                         Pakai voucher toko
//                                                     </Button>
//                                                 </View>
//                                                 : null
//                                         }
//                                         {reduxCheckout.address && Object.keys(reduxCheckout.address).length ?
//                                             <>
//                                                 <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                                                     <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/vehicle-yellow.png')} />
//                                                     <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pengiriman</Text>
//                                                 </View>
//                                                 {item.shippingSelected.name ?
//                                                     <View

//                                                         style={[styles.column, styles.p_3, { width: '100%' }]}>
//                                                         <TouchableOpacity onPress={() => {
//                                                             checkedValue(idxStore)
//                                                             setstorePressed(item.store)
//                                                             setindexStore(idxStore)
//                                                             if (item.shippingSelected?.dateSendTime) {
//                                                                 setSendDate(item.shippingSelected.dateSendTime)
//                                                             }
//                                                         }}>
//                                                             <View style={styles.row_between_center}>
//                                                                 <View style={[styles.column_between_center, { alignItems: 'flex-start' }]}>
//                                                                     <Text numberOfLines={1} style={[styles.font_14]}>{item.shippingSelected.name}</Text>
//                                                                     <Text numberOfLines={1} style={[styles.font_12]}>{item.shippingSelected.type}</Text>
//                                                                     <Text numberOfLines={1} style={[styles.font_12]}>Estimasi {item.shippingSelected.etdText}</Text>
//                                                                     {item.shippingSelected.sendTime === 'pilih tanggal' ?
//                                                                         <Text numberOfLines={1} style={[styles.font_12]}>Akan dikirim</Text>
//                                                                         : null
//                                                                     }


//                                                                 </View>
//                                                                 <View style={[styles.column_between_center, { alignItems: 'flex-end' }]}>
//                                                                     <Text numberOfLines={1} style={[styles.font_12, styles.mb_2, { color: colors.BlueJaja }]}>Ubah</Text>

//                                                                     {item.shippingSelected.priceNormal ?
//                                                                         <Text numberOfLines={1} style={[styles.priceBefore, styles.T_italic]}>{item.shippingSelected.priceCurrencyFormatNormal}</Text>
//                                                                         : <Text></Text>
//                                                                     }

//                                                                     <Text numberOfLines={1} style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja, }]}>{item.shippingSelected.priceCurrencyFormat}</Text>
//                                                                     {item.shippingSelected.sendTime === 'pilih tanggal' ?
//                                                                         <Text numberOfLines={1} style={[styles.font_12]}>{item.shippingSelected.dateSendTime}</Text>
//                                                                         :
//                                                                         null

//                                                                     }


//                                                                 </View>
//                                                             </View>
//                                                         </TouchableOpacity>
//                                                         <View style={[styles.column,]}>
//                                                             <TextInput onChangeText={(text) => handleNotes(text, idxStore)} placeholder="Masukkan catatan untuk penjual" style={[styles.font_12, styles.py_2, { color: colors.BlackGrayScale, paddingHorizontal: 0, borderBottomWidth: 0.7, borderBottomColor: colors.Silver, width: '100%' }]} />
//                                                         </View>

//                                                     </View>
//                                                     :
//                                                     <View style={[styles.column, styles.p_3]}>
//                                                         <View style={styles.row_between_center}>
//                                                             <Text numberOfLines={1} style={[styles.font_14]}>Pilih Ekspedisi</Text>
//                                                             <TouchableOpacity onPress={() => {
//                                                                 checkedValue(idxStore)
//                                                                 setstorePressed(item.store)
//                                                                 setindexStore(idxStore)
//                                                                 if (item.shippingSelected?.dateSendTime) {
//                                                                     setSendDate(item.shippingSelected.dateSendTime)
//                                                                 }
//                                                                 actionSheetDelivery.current?.setModalVisible()
//                                                             }}>
//                                                                 <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Pilih</Text>
//                                                             </TouchableOpacity>
//                                                         </View>

//                                                     </View>
//                                                 }
//                                             </>
//                                             : null
//                                         }
//                                     </View>
//                                 )
//                             })
//                             :
//                             null
//                     }
//                     {
//                         reduxCheckout.voucherJajaSelected && Object.keys(reduxCheckout.voucherJajaSelected).length ?
//                             <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                                 <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                                     <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/offer.png')} />
//                                     <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Voucher Diskon</Text>
//                                 </View>
//                                 <View style={[styles.column, styles.p_3]}>
//                                     <View style={[styles.row_between_center, styles.mb]}>
//                                         <Text numberOfLines={1} style={[styles.font_13]}>{reduxCheckout.voucherJajaSelected.name}</Text>
//                                         <TouchableOpacity onPress={() => setvoucherOpen("jaja")}>
//                                             <Text style={[styles.font_12, { color: colors.BlueJaja }]}>Ubah</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                     <View style={styles.row_between_center}>
//                                         <Text numberOfLines={1} style={[styles.font_12, styles.mt_2]}>Berakhir dalam {reduxCheckout.voucherJajaSelected.endDate}</Text>
//                                         <View style={[styles.p, { backgroundColor: colors.RedFlashsale, borderRadius: 3 }]}>
//                                             {console.log("🚀 ~ file: CheckoutScreen.js ~ line 1093 ~ checkoutScreen ~ reduxCheckout.voucherJajaSelected", reduxCheckout.voucherJajaSelected)}
//                                             <Text numberOfLines={1} style={[styles.font_12, { color: colors.White }]}>- {reduxCheckout.voucherJajaSelected.discountText}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             </View>
//                             :
//                             cartStatus == '1' ?
//                                 null :
//                                 <View style={[styles.p_2, styles.mb_2]}>
//                                     <Button onPress={() => {
//                                         setVouchers(reduxCheckout.voucherJaja)
//                                         setvoucherOpen('jaja')
//                                     }} icon="arrow-right" color={colors.RedFlashsale} uppercase={false} labelStyle={{ fontFamily: 'Poppins-Regular', color: colors.RedFlashsale }} style={{ borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 10 }} contentStyle={{ borderColor: colors.BlueJaja }} mode="outlined">
//                                         Makin hemat pakai promo
//                                     </Button>
//                                 </View>
//                     }
//                     <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                         <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                             <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
//                             <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Ringkasan Belanja</Text>
//                         </View>

//                         <View style={[styles.row_between_center, styles.p_3]}>
//                             <View style={styles.column_center_start}>
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>Total Belanja</Text>
//                                 {reduxCheckout.voucherJajaType === "diskon" ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Diskon Belanja</Text> : null}
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>Biaya Pengiriman</Text>
//                                 {reduxCheckout.voucherJajaType === "ongkir" ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Diskon Pengiriman</Text> : null}
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>Biaya penanganan</Text>
//                                 {reduxCheckout.coinUsed ? <Text style={[styles.font_13, { marginBottom: '2%' }]}>Koin Digunakan</Text> : null}
//                                 <View style={[styles.row_start_center, { width: Wp('50%'), marginLeft: Platform.OS === 'android' ? '-6.5%' : 0, marginTop: Platform.OS === 'android' ? 0 : '3%', paddingLeft: '-2%', opacity: reduxCoin == 0 ? 0.4 : 1 }]}>
//                                     {Platform.OS === 'android' ? <Checkbox
//                                         disabled={reduxCoin == 0 ? true : false}
//                                         theme={{ mode: 'adaptive' }}
//                                         color={colors.BlueJaja}
//                                         status={useCoin ? 'checked' : 'unchecked'}
//                                         onPress={() => handleUseCoin(!useCoin)}
//                                     /> :
//                                         <CheckBox
//                                             disabled={reduxCoin == 0 ? true : false}
//                                             value={useCoin ? true : false}
//                                             onValueChange={() => handleUseCoin(!useCoin)}
//                                             style={[styles.mr_4]}
//                                         />}
//                                     <Text numberOfLines={1} style={[styles.font_13, { textAlignVertical: 'center', marginBottom: '-1%' }]}>Koin dimiliki</Text>
//                                 </View>

//                             </View>
//                             <View style={styles.column_center_end}>
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>{reduxCheckout.subTotalCurrencyFormat}</Text>
//                                 {reduxCheckout.voucherJajaType === "diskon" ? <Text style={[styles.font_13, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountJajaCurrencyFormat}</Text> : null}
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>{reduxCheckout.shippingCostCurrencyFormat}</Text>
//                                 {reduxCheckout.voucherJajaType === "ongkir" ? <Text style={[styles.font_13, { marginBottom: '2%', color: colors.RedFlashsale }]}>{reduxCheckout.voucherDiscountJajaCurrencyFormat}</Text> : null}
//                                 <Text style={[styles.font_13, { marginBottom: '2%' }]}>Rp0</Text>
//                                 {reduxCheckout.coinUsed ? <Text style={[styles.font_13, { color: colors.RedFlashsale, marginBottom: '2%' }]}>[-{reduxCheckout.coinUsedFormat}]</Text> : null}
//                                 <Text numberOfLines={1} style={[styles.font_13, styles.py_2, { textAlignVertical: 'center', marginBottom: "-2%", opacity: reduxCoin == 0 ? 0.4 : 1, backgroundColor: colors.White }]}>({reduxCoin})</Text>
//                             </View>
//                         </View>
//                     </View>
//                     {/* <View style={[styles.column, { backgroundColor: colors.White, marginBottom: '2%' }]}>
//                     <View style={[styles.row, styles.p_3, { borderBottomWidth: 0.5, borderBottomColor: colors.BlackGrey }]}>
//                         <Image style={[styles.icon_21, { tintColor: colors.BlueJaja, marginRight: '2%' }]} source={require('../../assets/icons/invoice.png')} />
//                         <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja }]}>Metode Pembayaran</Text>
//                     </View>
//                     {reduxListPayment.map(item => {
//                         return (
//                             <TouchableRipple onPressIn={() => handleShowPayment(item)} style={[styles.px_3, styles.py_3, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]} onPress={() => handleShowPayment(item)} rippleColor={colors.BlueJaja} >
//                                 <View style={styles.row_between_center}>
//                                     <Text style={styles.font_13}>{item.payment_type_label === 'Card' ? 'Kartu Kredit' : item.payment_type_label == 'eWallet' ? item.payment_type_label + ' - ' + item.subPayment[0].payment_sub_label : item.payment_type_label}</Text>
//                                     {item.id_payment_method_category !== selectedPayment.id_payment_method_category ?
//                                         <Image fadeDuration={300} source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackGrey }]} />
//                                         :
//                                         <Image fadeDuration={300} source={require('../../assets/icons/check.png')} style={[styles.icon_14, { tintColor: colors.BlueJaja }]} />
//                                     }
//                                 </View>
//                             </TouchableRipple>
//                         )
//                     })}
//                 </View> */}
//                 </ScrollView>
//                 <View style={{ position: 'absolute', bottom: 0, zIndex: 100, elevation: 3, height: Hp('7%'), width: Wp('100%'), backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
//                     <View style={{ width: '50%', height: '100%', justifyContent: 'center', paddingHorizontal: '2%', paddingLeft: '4%', paddingVertical: '1%' }}>
//                         <Text style={[styles.font_12, styles.T_medium, { color: colors.BlueJaja, marginBottom: '-2%' }]}>Total pembayaran :</Text>
//                         <Text numberOfLines={1} style={[styles.font_17, styles.T_semi_bold, { color: colors.BlueJaja }]}>{reduxCheckout.totalCurrencyFormat}</Text>
//                     </View>
//                     {/* <Button  style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
//                         </Button> */}
//                     <TouchableRipple style={{ backgroundColor: colors.BlueJaja, width: "50%", height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={handleCheckout}>
//                         <Text numberOfLines={1} style={[styles.font_13, styles.T_semi_bold, { color: colors.White }]}>{reduxCheckout.total > 0 ? 'PILIH PEMBAYARAN' : 'BUAT PESANAN'}</Text>
//                     </TouchableRipple>
//                 </View>
//             </View>
//             <ActionSheet ref={actionSheetVoucher} onOpen={() => setloadAs(false)} onClose={() => setvoucherOpen("")} delayActionSheetDraw={false} containerStyle={{ padding: '4%', }}>
//                 {/* <View style={[styles.row_between_center, styles.py_2, styles.mb_5]}>
//                     <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '60%' }]}>Pilih Voucher</Text>
//                     <TouchableOpacity onPressIn={() => actionSheetVoucher.current?.setModalVisible()}>
//                         <Image style={[styles.icon_16, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
//                     </TouchableOpacity>
//                 </View> */}
//                 <View style={[styles.row_between_center, styles.py_2, styles.mb_5]}>
//                     <View style={[styles.row_start_center, { width: '70%' }]}>
//                         <TouchableRipple onPress={() => setvoucherFocus(1)} style={[styles.px_2, styles.py, styles.mr_2, { flex: 0, width: '50%', backgroundColor: voucherFocus == '1' ? colors.BlueJaja : colors.White, borderWidth: 0.2, borderColor: colors.BlueJaja, borderRadius: 3, }]}>
//                             <Text style={[styles.font_11, styles.T_semi_bold, {
//                                 alignSelf: 'center', textAlign: 'center', color: voucherFocus == '1' ? colors.White : colors.BlueJaja, width: '100%',
//                                 shadowColor: colors.BlueJaja,
//                                 shadowOffset: {
//                                     width: 0,
//                                     height: 1,
//                                 },
//                                 shadowOpacity: 0.18,
//                                 shadowRadius: 1.00,
//                                 elevation: 1,
//                             }]}>Pilih Voucher</Text>
//                         </TouchableRipple>
//                         {voucherOpen !== 'store' ?
//                             <TouchableRipple onPress={() => setvoucherFocus(2)} style={[styles.px_2, styles.py, { flex: 0, width: '50%', backgroundColor: voucherFocus == '2' ? colors.BlueJaja : colors.White, borderWidth: 0.2, borderColor: colors.BlueJaja, borderRadius: 3 }]}>
//                                 <Text style={[styles.font_11, styles.T_semi_bold, {
//                                     alignSelf: 'center', textAlign: 'center', color: voucherFocus == '2' ? colors.White : colors.BlueJaja, width: '100%',
//                                     shadowColor: "#000",
//                                     shadowOffset: {
//                                         width: 0,
//                                         height: 1,
//                                     },
//                                     shadowOpacity: 0.18,
//                                     shadowRadius: 1.00,

//                                     elevation: 1,
//                                 }]}>Input Voucher</Text>
//                             </TouchableRipple>
//                             : null}
//                     </View>
//                     <TouchableOpacity onPressIn={() => actionSheetVoucher.current?.setModalVisible()}>
//                         <Image style={[styles.icon_16, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
//                     </TouchableOpacity>
//                 </View>
//                 {loadAs ? <Loading /> : null}
//                 <View style={[styles.column, { minHeight: Hp('20%'), maxHeight: Hp('80%') }]}>

//                     {voucherFocus == '1' ?
//                         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
//                             {reduxCheckout.voucherJaja && reduxCheckout.voucherJaja.length || vouchers && vouchers.length ?
//                                 <View>
//                                     <FlatList
//                                         data={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === true)}
//                                         keyExtractor={(item) => item.id + 'ES'}
//                                         extraData={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === true)}
//                                         renderItem={({ item, index }) => {
//                                             return (
//                                                 <View style={[styles.row_center, styles.mb_3]}>
//                                                     <View style={[styles.row, { width: '100%', height: Wp('25%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
//                                                         <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.BlueJaja, flexDirection: 'column', justifyContent: 'center' }}>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                         </View>
//                                                         <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.BlueJaja }]}>
//                                                             <Text style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>{item.category ? item.category === "ongkir" ? 'GRATIS BIAYA PENGIRIMAN' : String(item.category).toUpperCase() + " " + item.discountText : "DISKON " + item.discountText}</Text>
//                                                         </View>
//                                                         <View style={[styles.column_around_center, styles.px_2, { width: '44%' }]}>
//                                                             <Text numberOfLines={3} style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { color: colors.BlueJaja, width: '100%', marginBottom: '-2%' }]}>{item.name}</Text>
//                                                             <Text style={[styles.font_8, styles.T_semi_bold, { color: colors.BlueJaja, width: '100%' }]}>Akan berakhir {item.endDate}</Text>
//                                                         </View>
//                                                         <View style={[styles.column_center, { width: '22%' }]}>
//                                                             <TouchableOpacity onPress={() => handleVoucher(item, index)} style={{ width: '90%', height: '30%', backgroundColor: item.isClaimed ? colors.White : colors.BlueJaja, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.BlueJaja, borderRadius: 5 }}>
//                                                                 <Text style={[styles.font_10, styles.T_semi_bold, { marginBottom: '-1%', color: item.isClaimed ? colors.BlueJaja : colors.White }]}>{item.isClaimed ? item.isSelected ? "TERPAKAI" : "PAKAI" : "KLAIM"}</Text>
//                                                             </TouchableOpacity>
//                                                             <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
//                                                                 <Text style={[styles.font_12, { color: colors.BlueLink }]}>S&K</Text>
//                                                             </TouchableOpacity>
//                                                         </View>
//                                                     </View>
//                                                 </View>
//                                             )
//                                         }}
//                                     />
//                                     {/* <Text numberOfLines={2} style={[styles.font_13, styles.T_semi_bold, styles.my_3, { color: colors.BlackGrey }]}>* Voucher yang belum sesuai dengan S&K</Text> */}
//                                     <FlatList
//                                         data={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === false)}
//                                         keyExtractor={(item) => item.id + 'JH'}
//                                         extraData={voucherOpen === "store" ? vouchers : reduxCheckout.voucherJaja.filter(item => item.isValid === false)}
//                                         renderItem={({ item, index }) => {
//                                             if (!item.isValid) {
//                                                 return (
//                                                     <View style={[styles.row_center, styles.mb_3]}>
//                                                         <View style={[styles.row, { width: '100%', height: Wp('25%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.Silver }]}>
//                                                             <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.Silver, flexDirection: 'column', justifyContent: 'center' }}>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                                 <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
//                                                             </View>
//                                                             <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.Silver }]}>
//                                                                 <Text style={[styles.font_14, styles.mb_2, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>{item.category ? item.category === "ongkir" ? 'GRATIS BIAYA PENGIRIMAN' : String(item.category).toUpperCase() + " " + item.discountText : "DISKON " + item.discountText}</Text>
//                                                             </View>
//                                                             <View style={[styles.column_around_center, styles.px_2, { width: '44%' }]}>
//                                                                 <Text numberOfLines={3} style={[styles.font_12, styles.mb_2, styles.T_semi_bold, { color: colors.Silver, width: '100%', marginBottom: '-2%' }]}>{item.name}</Text>
//                                                                 <Text style={[styles.font_8, styles.T_semi_bold, { color: colors.Silver, width: '100%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
//                                                             </View>
//                                                             <View style={[styles.column_center, { width: '22%' }]}>
//                                                                 <TouchableOpacity disabled={true} onPress={() => handleVoucher(item, index)} style={{ width: '90%', height: '30%', backgroundColor: item.isClaimed ? colors.White : colors.Silver, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.Silver, borderRadius: 5 }}>
//                                                                     <Text style={[styles.font_10, styles.T_semi_bold, { marginBottom: '-1%', color: item.isClaimed ? colors.Silver : colors.White }]}>{item.isClaimed ? item.isSelected ? "TERPAKAI" : "PAKAI" : "KLAIM"}</Text>
//                                                                 </TouchableOpacity>
//                                                                 <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
//                                                                     <Text style={[styles.font_12, { color: colors.BlueLink }]}>S&K</Text>
//                                                                 </TouchableOpacity>
//                                                             </View>
//                                                         </View>
//                                                     </View>
//                                                 )
//                                             }
//                                         }}
//                                     />
//                                 </View>
//                                 :
//                                 <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Kamu belum punya voucher</Text>}
//                         </ScrollView>
//                         :
//                         <View style={[styles.row_between_center, { borderColor: colors.BlueJaja, borderWidth: 0.2, borderColor: colors.BlueJaja, borderRadius: 3, borderTopRightRadius: 3, borderBottomEndRadius: 3, alignItems: 'center' }]}>
//                             <TextInput
//                                 onChangeText={text => setvoucherCode(text.toLocaleUpperCase())}
//                                 maxLength={12}
//                                 value={voucherCode}
//                                 style={[styles.font_13, { width: '70%', padding: '2%', alignItems: 'center' }]}
//                                 placeholder='Masukkan kode voucher'
//                             />
//                             <TouchableRipple
//                                 onPress={() => handleCheckVoucher()}
//                                 style={[styles.row_center, styles.px_2, styles.py, {
//                                     flex: 0, width: '26%', height: '100%', backgroundColor: voucherFocus == '2' ? colors.BlueJaja : colors.White,
//                                     shadowColor: colors.BlueJaja,
//                                     shadowOffset: {
//                                         width: 0,
//                                         height: 1,
//                                     },
//                                     shadowOpacity: 0.18,
//                                     shadowRadius: 1.00,
//                                     borderTopRightRadius: 3,
//                                     borderBottomRightRadius: 3,

//                                     elevation: 1,
//                                     alignItems: 'center'
//                                 }]}>
//                                 <Text style={[styles.font_12, styles.T_semi_bold, { alignSelf: 'center', textAlign: 'center', color: voucherFocus == '2' ? colors.White : colors.BlueJaja, width: '100%', }]}>Klaim</Text>
//                             </TouchableRipple>
//                         </View>
//                     }

//                 </View>
//             </ActionSheet>
//             <ActionSheet ref={actionSheetDelivery} delayActionSheetDraw={false} containerStyle={{ padding: '2%' }}>
//                 <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_3]}>
//                     <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%' }]}>{cartStatus === 1 ? 'Pilih Tanggal Pengiriman' : 'Pilih Waktu Pengiriman'}</Text>
//                     <TouchableOpacity style={{ backgroundColor: 'transparent', paddingVertical: '2%', paddingHorizontal: '3%' }} onPressIn={() => actionSheetDelivery.current?.setModalVisible()}>
//                         <Image style={[styles.icon_12, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{ flexDirection: 'column', minHeight: Hp('20%'), maxHeight: Hp('60%'), width: '100%', paddingBottom: '5%' }}>
//                     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ width: '100%' }}>
//                         <View style={[styles.column, { width: '100%' }]}>
//                             {/* <Text style={[styles.font_14, styles.mb_3, { color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold', borderBottomWidth: 0.5, borderBottomColor: colors.BlueJaja }]}>{item.title}</Text> */}
//                             {reduxShipping && reduxShipping.length ?
//                                 <View style={styles.column}>
//                                     {cartStatus === 1 ?
//                                         <>
//                                             <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_2, { width: '100%' }]}>
//                                                 <TouchableOpacity style={[styles.column, styles.px_2, { width: '100%' }]} onPress={() => setDatePickerVisibility(true)}>
//                                                     <View style={styles.row_between_center}>
//                                                         <Text style={styles.font_14}>{sendDate}</Text>
//                                                         <Image source={require('../../assets/icons/calendar.png')} style={[styles.icon_19, { tintColor: colors.BlueJaja }]} />
//                                                     </View>
//                                                     <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: colors.Silver, marginTop: '2%' }}>
//                                                         <Text style={[styles.font_12, styles.T_italic]}>Pilih tanggal pengiriman dari penjual</Text>
//                                                     </View>
//                                                 </TouchableOpacity>
//                                             </View>
//                                             {/* <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb]}>
//                                                 <Text style={[styles.font_14, styles.mt_3, styles.T_semi_bold, { color: colors.BlueJaja }]}>Pilih Ekspedisi</Text>
//                                             </View> */}

//                                         </>
//                                         :
//                                         <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_2, { width: '100%' }]}>
//                                             <FlatList
//                                                 inverted
//                                                 data={reduxShipping[0].sendTime}
//                                                 keyExtractor={(item, index) => String(index + 'SA')}
//                                                 style={{ width: '100%' }}
//                                                 renderItem={({ item }) => {
//                                                     return (
//                                                         <View style={[styles.column, styles.mb_3, styles.py_2, { width: '100%' }]}>
//                                                             <TouchableOpacity onPress={() => setsendTime(item.value)} style={styles.row_start_center}>
//                                                                 <CheckBox
//                                                                     disabled={false}
//                                                                     value={sendTime === item.value ? true : false}
//                                                                     onValueChange={() => {
//                                                                         if (item.value !== "pilih tanggal") {
//                                                                             setSendDate("")
//                                                                         } else {
//                                                                             setsendTime(item.value)
//                                                                         }
//                                                                     }}
//                                                                 />
//                                                                 <View style={[styles.row_between_center, Platform.OS === 'ios' ? styles.ml_3 : styles.ml_2]}>
//                                                                     <Text style={[styles.font_14, styles.T_medium, { flex: 1 }]}>{item.name}</Text>
//                                                                     <Text style={[styles.font_14, styles.T_medium]}>{item.priceCurrencyFormat}</Text>
//                                                                 </View>
//                                                             </TouchableOpacity>
//                                                             {
//                                                                 sendTime === "pilih tanggal" && item.value === "pilih tanggal" ?
//                                                                     <TouchableOpacity style={[styles.column, styles.px_2, { width: '100%' }]} onPress={() => {
//                                                                         actionSheetDelivery.current?.setModalVisible(false)
//                                                                         setTimeout(() => {
//                                                                             setDatePickerVisibility(true)
//                                                                         }, 500);
//                                                                     }}>
//                                                                         <View style={styles.row_between_center}>
//                                                                             <Text style={styles.font_14}>{sendDate}</Text>
//                                                                             <Image source={require('../../assets/icons/calendar.png')} style={[styles.icon_19, { tintColor: colors.BlueJaja }]} />
//                                                                         </View>
//                                                                         <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: colors.Silver, marginTop: '2%' }}>
//                                                                             <Text style={[styles.font_12, styles.T_italic]}>Pilih tanggal pengiriman dari penjual</Text>
//                                                                         </View>
//                                                                     </TouchableOpacity>
//                                                                     : null
//                                                             }
//                                                         </View>
//                                                     )
//                                                 }}
//                                             />
//                                         </View>
//                                     }
//                                     <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_3]}>
//                                         <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.BlueJaja }]}>Pilih Ekpedisi</Text>
//                                     </View>
//                                     <FlatList
//                                         data={reduxShipping[indexStore].items}
//                                         keyExtractor={(item, index) => String(index) + "KJ"}
//                                         style={{ width: '100%' }}
//                                         renderItem={({ item }) => {
//                                             let code = item.code;
//                                             let Ename = item.name;
//                                             return (
//                                                 <View style={[styles.column_center_start, styles.mb_2, styles.py_2, styles.px_4, { borderBottomWidth: 1, borderBottomColor: colors.Silver, width: '100%' }]}>
//                                                     <Text style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>{Ename}</Text>
//                                                     <FlatList
//                                                         data={item.type}
//                                                         keyExtractor={(item, index) => String(index) + "AL"}
//                                                         style={{ width: '100%' }}
//                                                         renderItem={({ item }) => {
//                                                             return (
//                                                                 <TouchableOpacity onPress={() => deliverySelected(code, item)} style={[styles.column_center_start, styles.mb_3, styles.py_2, { width: '100%' }]}>
//                                                                     <View style={styles.row_between_center}>
//                                                                         <Text style={[styles.font_14, styles.T_medium, { flex: 1 }]}>{item.name}</Text>
//                                                                         <Text style={[styles.font_14, styles.T_medium,]}>{item.priceCurrencyFormat}</Text>

//                                                                     </View>
//                                                                     <Text style={[styles.font_12, styles.T_italic]}>Estimasi {item.etdText}</Text>
//                                                                 </TouchableOpacity>
//                                                             )
//                                                         }}
//                                                     />

//                                                 </View>

//                                             )
//                                         }}
//                                     />
//                                 </View> :
//                                 <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Sedang memuat..</Text>}
//                         </View>
//                     </ScrollView>
//                 </View>
//             </ActionSheet>
//             <ActionSheet closeOnPressBack={false} ref={actionSheetPayment} onOpen={() => setloadAs(false)} onClose={() => {
//                 if (!selectedSubPayment && selectedSubPayment == '') {
//                     setselectedPayment('')
//                 }
//             }} delayActionSheetDraw={false} containerStyle={{ padding: '4%', }}>
//                 <View style={[styles.row_between_center, styles.py_2, styles.mb_5]}>
//                     <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, width: '60%' }]}>Pilih Metode Pembayaran</Text>
//                     <TouchableOpacity onPressIn={() => actionSheetPayment.current?.setModalVisible()}>
//                         <Image style={[styles.icon_14, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
//                     </TouchableOpacity>
//                 </View>
//                 {loadAs ? <Loading /> : null}
//                 <View style={[styles.column, { minHeight: Hp('20%'), maxHeight: Hp('80%') }]}>
//                     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
//                         <FlatList
//                             data={subPayment}
//                             keyExtractor={(item) => item.id + "GF"}
//                             renderItem={({ item, index }) => {
//                                 console.log("🚀 ~ file: CheckoutScreen.js ~ line 1057 ~ checkoutScreen ~ item", item)
//                                 return (
//                                     <TouchableRipple onPressIn={() => setselectedSubPayment(item)} style={[styles.py_4, styles.px_2, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]} onPress={() => console.log('Pressed')} rippleColor={colors.BlueJaja} >
//                                         <View style={styles.row_between_center}>
//                                             <Text style={styles.font_13}>{item.payment_sub_label}</Text>
//                                             <Checkbox
//                                                 color={colors.BlueJaja}
//                                                 status={item.payment_sub_label === selectedSubPayment.payment_sub_label ? 'checked' : 'unchecked'}
//                                             />
//                                             {/* {item.payment_sub_label === selectedSubPayment.payment_sub_label ?
//                                                 <Image source={require('../../assets/icons/check.png')} style={[styles.icon_14, { tintColor: colors.BlueJaja }]} />
//                                                 :
//                                                 <Image source={require('../../assets/icons/right-arrow.png')} style={[styles.icon_14, { tintColor: colors.BlackTitle }]} />
//                                             } */}
//                                         </View>
//                                     </TouchableRipple>
//                                 )
//                             }}
//                         />
//                     </ScrollView>
//                 </View>
//             </ActionSheet>
//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={showModal}
//                 onRequestClose={() => {
//                     setModalShow(!showModal);
//                 }}>
//                 <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
//                     <View style={[styles.column_start, styles.pt_3s, { width: Wp('95%'), height: Wp('70%'), backgroundColor: colors.White, elevation: 11, zIndex: 999 }]}>
//                         {selectedPayment.payment_type_label === 'Card' ?
//                             <View style={[styles.column_center_start, styles.px_4, styles.pt_5, { height: '60%' }]}>
//                                 <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja, height: '30%' }]}>Kartu Kredit</Text>
//                                 <Text style={[styles.font_14, { height: '65%' }]}>Metode pembayaran ini berlaku untuk semua jenis kartu kredit</Text>
//                             </View>
//                             :
//                             <View style={[styles.column_center_start, styles.px_4, styles.pt_5, { height: '60%' }]}>
//                                 <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja, height: '30%' }]}>eWallet - Qris</Text>
//                                 <Text style={[styles.font_14, { height: '65%' }]}>Metode pembayaran ini berlaku untuk semua jenis dompet elektronik seperti DANA, GOPAY, OVO, dll</Text>
//                             </View>
//                         }
//                         <View style={[styles.row_start, styles.px_4, { height: '20%' }]}>
//                             <Text style={[styles.font_12, styles.T_italic]}>Note : kamu masih bisa mengganti metode pembayaran setelah pesanan ini dibuat</Text>
//                         </View>
//                         <View style={[styles.row_end, styles.p_2, { width: '100%' }]}>
//                             <Button mode="contained" onPress={() => setModalShow(false)} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} style={{ height: '100%', width: '30%' }} color={colors.BlueJaja}>
//                                 OK
//                             </Button>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={showModal2}
//                 onRequestClose={() => {
//                     setModalShow2(!showModal2);
//                 }}>
//                 <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
//                     <View style={[styles.column_start, styles.pt, { width: Wp('95%'), minHeight: Wp('50%'), maxHeight: Wp('100%'), backgroundColor: colors.White, elevation: 11, zIndex: 999 }]}>
//                         <View style={[styles.column_center_start, styles.px_4, styles.pt_3, { width: '100%' }]}>
//                             <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja }]}>Kartu Ucapan</Text>
//                             <TextInput maxLength={500} textAlignVertical='top' numberOfLines={4} multiline={true} style={[styles.font_12, styles.p_2, { borderRadius: 4, borderWidth: 0.5, borderColor: colors.Silver, width: '100%', maxHeight: Wp('45%') }]} value={textGift} onChangeText={text => String(text).length < 500 ? settextGift(text) : ''} />
//                         </View>

//                         <View style={[styles.row_end, styles.p_2, { width: '100%' }]}>
//                             <Button mode="contained" onPress={handleGiftCard} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} style={{ height: '100%', width: '30%' }} color={colors.BlueJaja}>
//                                 Simpan
//                             </Button>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//             <DateTimePickerModal
//                 isVisible={isDatePickerVisible}
//                 mode="date"

//                 minimumDate={new Date(dateMin.year, dateMin.month, dateMin.date)}
//                 maximumDate={new Date(dateMax.year, dateMax.month, dateMax.date)}
//                 onHide={() => {
//                     setTimeout(() => {
//                         actionSheetDelivery.current?.setModalVisible()
//                     }, 500);
//                 }}
//                 onDateChange={() => {
//                     setDatePickerVisibility(false)

//                 }}
//                 onConfirm={(text) => {
//                     setTimeout(() => {
//                         handleConfirmDate(text)
//                     }, 200);

//                 }}
//                 onCancel={() => {
//                     setDatePickerVisibility(false)
//                 }}
//             />
//         </SafeAreaView >
//     )
// }
import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, YellowBox, AsyncStorage, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Warna from "../../config/Warna";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import { firebaseAuth } from "../../service/Firebase";
// GoogleSignin.configure({
//   webClientId: "459144285250-8rc7dfleoeggl7qjk897hteok1i8d166.apps.googleusercontent.com",
//   offlineAccess: true
// 
// })

// GoogleSignin.configure();
YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

import { async } from "../../config/async";
let User = new async();

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);

    const Email = useRef("emails");
    const Password = useRef("pass");

    async function onGoogleButtonPress() {
        // Get the users ID token
        const idToken = await GoogleSignin.signIn();

        console.log("ini id token: ", idToken);
        // Create a Google credential with the token
        const googleCredential = firebaseAuth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        await firebaseAuth().signInWithCredential(googleCredential);
    }

    //   const signIn = async () => {
    // 
    // 
    //     const user = await GoogleSignin.hasPlayServices();
    //     const userInfo = await GoogleSignin.signIn();
    //     setUserInfo(userInfo);
    // 
    //     console.log(user + " " + userInfo);
    // 
    // 
    //   }


    useEffect(() => {
        console.log("useee");
        GoogleSignin.configure({
            // webClientId: '459144285250-8rc7dfleoeggl7qjk897hteok1i8d166.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            // webClientId: '418304997066-dav3mvkk12tuemom37um8bmckr5liv45.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            webClientId: '825597736757-gdksf2jv7pullmmjmss5h6knt2lmf3rd.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });

    }, [])
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();
            // this.setState({ userInfo: userInfo, logedin: true });
            console.log(userInfo);
            // const { accessToken, idToken } = await GoogleSignin.signIn();
            setloggedIn(true);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                alert("errorrrrrr:" + JSON.stringify(statusCodes));
                // some other error happened
            }
        }
    };

    function postLogin() {
        if (username == "" || username == null) {
            Alert.alert("Notif", "kolom email tidak boleh kosong");
        } else if (password == "" || password == null) {
            Alert.alert("Notif", "kolom password tidak boleh kosong");
        } else {
            var formdata = new FormData();
            formdata.append("tag", "login");
            formdata.append("emails", username);
            formdata.append("pass", password);

            var requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };

            fetch(
                "http://eurekalogistics.co.id/jsn/emc/login/index.php",
                requestOptions
            )
                .then(response => response.json())
                .then(result => {
                    if (result.success === 1) {
                        // User.setUserId(result.id);
                        // User.setReferral(result.pin);
                        // User.setUser(result.user);
                        // User.setEmail(result.email);
                        // User.setPhone(result.phone);
                        // User.setFoto(result.foto);
                        // User.setDeposit(result.deposit);
                        // User.setPoint(result.point);

                        AsyncStorage.setItem("id", result.id);
                        AsyncStorage.setItem("referral", result.pin);
                        AsyncStorage.setItem("user", result.user);
                        AsyncStorage.setItem("email", result.email);
                        AsyncStorage.setItem("phone", result.phone);
                        AsyncStorage.setItem("foto", result.foto);
                        AsyncStorage.setItem("deposit", result.deposit);
                        AsyncStorage.setItem("point", result.point);

                        navigation.replace("Home", { screen: "Beranda" });
                    } else {
                        Alert.alert('LOGIN', 'Email/Password salah!')
                    }

                })
                .catch(error => console.log("error", error));
        }
    }

    return (
        <ScrollView style={{ backgroundColor: Warna.purpleRace }}>

            <View style={{ backgroundColor: Warna.orangeRace, height: 350, borderBottomLeftRadius: 100, borderBottomRightRadius: 100 }}></View>
            <View style={{
                marginTop: -250, padding: 25, backgroundColor: 'white', margin: 30, borderRadius: 25, elevation: 2, shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            }}>

                <View style={{ marginTop: 8, alignItems: "center", justifyContent: "center" }}>
                    <Image source={require("../../logo/logo-race2020.png")} style={[styles.RaceLogo]} />
                </View>

                <View>
                    <Text style={{ color: Warna.purpleRace, fontWeight: 'bold' }}> Email </Text>
                    <TextInput onSubmitEditing={() => Password.current.focus()} ref={Email} placeholder="Email"
                        style={{ padding: 10, marginTop: 5, borderColor: Warna.purpleRace, borderWidth: 0.5, borderRadius: 10 }}
                        value={username}
                        onChangeText={username => setUsername(username)}
                    />
                    <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
                </View>
                <View>
                    <Text style={{ color: Warna.purpleRace, fontWeight: 'bold', marginTop: 10 }}> Password </Text>
                    <TextInput ref={Password} placeholder="Password"
                        style={{ padding: 10, marginTop: 5, borderColor: Warna.purpleRace, borderWidth: 0.5, borderRadius: 10 }}
                        secureTextEntry
                        autoCorrect={false}
                        returnKeyType="go"
                        value={password}
                        onSubmitEditing={() => postLogin()}
                        onChangeText={password => setPassword(password)} />
                    <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
                </View>

                <TouchableOpacity
                    onPress={() => { postLogin() }} style={styles.submitContainer}>
                    <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}
                    >  Login </Text>
                </TouchableOpacity>
                {/* <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      // disabled={this.state.isSigninInProgress} 
      /> */}
                <Text onPress={() => { navigation.navigate("User", { screen: "ForgotPassword" }) }} style={{ fontSize: 15, color: Warna.purpleRace, textAlign: "center", marginTop: 24, fontWeight: 'bold', alignSelf: 'flex-end' }}>Forgot Password</Text>
                <Text onPress={() => { console.log(JSON.stringify(userInfo)) }} style={{ fontSize: 15, color: Warna.purpleRace, textAlign: "center", marginTop: 24 }}> Don't have an account?
                    <Text style={{ fontWeight: 'bold', color: 'red' }} onPress={() => navigation.navigate('Register')}> Register Now</Text> </Text>


                <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
                    {/* <TouchableOpacity onPress={() => { onGoogleButtonPress().then(() => alert("hmm")), console.log("proses") }}>
          <View style={styles.socialButton}>
            <Image source={require("../../icons/facebook.png")} style={styles.socialLogo} />
            <Text style={styles.text}>Facebook</Text>
          </View>
        </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => signIn()} style={styles.socialButton}>
                        <Image source={require("../../icons/google.png")} style={styles.socialLogo} />
                        <Text style={styles.text}>Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30
    },
    text: {
        fontFamily: "Avenir Next",
        fontStyle: 'italic',
        color: "black"
    },
    socialButton: {
        flexDirection: "row",
        marginHorizontal: 12,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(171, 180, 189, 0.65)",
        borderRadius: 4,
        backgroundColor: "#fff",
        shadowColor: "rgba(171, 180, 189, 0.35)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    },
    socialLogo: {
        width: 16,
        height: 16,
        marginRight: 8
    },
    RaceLogo: {
        width: 150,
        height: 110,
        marginRight: 8
    },
    link: {
        color: "#FF1654",
        fontSize: 14,
        fontWeight: "500"
    },
    submitContainer: {
        backgroundColor: "#003087",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "rgba(255, 22, 84, 0.24)",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    }
});

