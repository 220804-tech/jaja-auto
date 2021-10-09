import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, Image, StyleSheet, Alert, Animated, BackHandler } from 'react-native'
import { styles, Wp, Hp, colors, useNavigation, ServiceCheckout, Appbar, ServiceOrder } from '../../export'
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Button, Paragraph } from 'react-native-paper';


export default function MidtransScreen() {
    const navigation = useNavigation()
    const ref = useRef()
    const reduxAuth = useSelector(state => state.auth.auth)
    const [loading, setloading] = useState(false)
    const reduxOrderId = useSelector(state => state.checkout.orderId)
    const [view, setView] = useState("")
    const [text, setText] = useState("Sedang Menghubungkan..")
    const [spinValue, setspinValue] = useState(new Animated.Value(0))
    const dispatch = useDispatch()
    useEffect(() => {
        setText("Sedang Menghubungkan..")
        setloading(true)
        if (reduxAuth) {
            getItem()
        } else {
            navigation.navigate('Login')
        }

        const backAction = () => {
            navigation.goBack()

            // Alert.alert(
            //     "Jaja.id",
            //     "Pesanan ini dapat kamu lihat di halaman pesanan",
            //     [
            //         {
            //             text: "OK", onPress: () => {

            //                 ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
            //                     if (resUnpaid) {
            //                         dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
            //                         dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
            //                     } else {
            //                         handleUnpaid()
            //                     }
            //                 })
            //                 ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
            //                     if (reswaitConfirm) {
            //                         dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
            //                     } else {
            //                         handleWaitConfirm()
            //                     }
            //                 })
            //                 navigation.goBack()
            //             }
            //         }
            //     ]);
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    const handleUnpaid = () => {
        EncryptedStorage.getItem('unpaid').then(store => {
            if (store) {
                dispatch({ type: 'SET_UNPAID', payload: JSON.parse(store) })
            }
        })
    }
    const handleWaitConfirm = () => {
        EncryptedStorage.getItem('waitConfirm').then(store => {
            if (store) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: JSON.parse(store) })
            }
        })
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
        console.log('getPaymentUrl', url);
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                setTimeout(() => setloading(false), 3000);
                console.log('payment_va_or_code_or_link', result.orderPaymentRecent.payment_va_or_code_or_link);
                setView(result.orderPaymentRecent.payment_va_or_code_or_link);

            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 22004")
            });
    }

    const getItem = () => {
        if (reduxOrderId) {
            getPayment(reduxOrderId);
            // console.log("🚀 ~ file: MidtransComponent.js ~ line 22 ~ getItem ~ reduxOrderId", reduxOrderId)
            // ServiceCheckout.getPayment(reduxAuth, reduxOrderId).then(res => {
            //     setView("")
            //     console.log("🚀 ~ file: MidtransScreen.js ~ line 39 ~ ServiceCheckout.getPayment ~ res", res)
            //     setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
            //     setView(res)
            //     setTimeout(() => setloading(false), 3000);
            // }).catch(error => {
            //     ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

            //     ServiceCheckout.getPayment(reduxAuth, reduxOrderId).then(res => {
            //         setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
            //         setView(res)
            //         setTimeout(() => setloading(false), 3000);
            //     }).catch(err => ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER) & setloading(false))
            // });
        }
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const handleCheck = () => {
        getItem()
    }
    const onMessage = (m) => {
        console.log("🚀 ~ file: MidtransScreen.js ~ line 136 ~ onMessage ~ data", data)
        //Prints out data that was passed.
        alert(m.nativeEvent.data);
    }
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Pilih Pembayaran" />
            {loading ?
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: Wp("100%"),
                    height: Hp("100%"),
                    backgroundColor: colors.White
                }}>
                    <Image
                        style={{ width: Wp("100%"), height: Wp('100%'), resizeMode: 'contain' }}
                        resizeMethod={"scale"}
                        source={require("../../assets/gifs/gif_payment.gif")}
                    />
                    <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{text}</Text>
                </View>
                :
                view === "404 Not Found" || !view ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White }}>
                        <Paragraph style={style.textJajakan}>{view === "404 Not Found" ? "404" : view ? view.slice(0, 4) : view}</Paragraph>
                        <Image
                            style={style.iconMarket}
                            source={require('../../assets/ilustrations/empty.png')}
                        />
                        <Paragraph style={style.textJajakan}>Aduh..<Text style={style.textCenter}> sepertinya ada masalah</Text></Paragraph>
                        <Button onPress={() => navigation.goBack()} mode="contained" labelStyle={{ color: colors.White }} color={colors.BlueJaja}>Kembali</Button>
                    </View>
                    :
                    <>
                        <WebView
                            style={{ alignSelf: 'stretch' }}
                            javaScriptEnabled={true}
                            allowsFullscreenVideo={true}
                            scalesPageToFit={true}
                            originWhitelist={['*']}
                            onLoad={(e) => console.log('asasasasas', e)}
                            onMessage={(event) => onMessage(event)}
                            source={{ uri: view }}
                        />
                        {/* <View style={{ position: 'absolute', width: Wp('100%'), height: Hp('100%'), justifyContent: 'flex-end', alignItems: 'center', paddingBottom: Hp('10%') }}>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.White, borderRadius: 100, width: Wp('13%'), height: Wp('13%'), justifyContent: 'center', alignItems: 'center', elevation: 10
                                }}
                                onPress={() => {
                                    Animated.timing(
                                        spinValue,
                                        {
                                            toValue: 5,
                                            duration: 5000,
                                            easing: Easing.linear,
                                            useNativeDriver: true
                                        }
                                    ).start()
                                    setTimeout(() => {
                                        Animated.timing(
                                            spinValue,
                                            {
                                                toValue: 0,
                                                duration: 0,
                                                easing: Easing.linear,
                                                useNativeDriver: true
                                            }
                                        ).start()
                                    }, 5000);
                                }}>

                                <Animated.Image
                                    style={{ transform: [{ rotate: spin }], width: '70%', height: '70%', tintColor: colors.BlueJaja, backgroundColor: colors.White }}
                                    source={require('../../assets/icons/refresh.png')} />
                            </TouchableOpacity>
                        </View> */}
                        {/* <View style={{ width: '50%', justifyContent: 'flex-end', paddingHorizontal: '3%', paddingLeft: '5%', paddingVertical: '1%' }}>
                                <Text style={[styles.font_14, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>Subtotal :</Text>
                                <Text numberOfLines={1} style={[styles.font_20, { fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>ASA</Text>
                            </View> */}
                        {/* <View style={{ position: 'relative', bottom: 0, height: Hp('7.5%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                           
                            <Button onPress={handleCheck} style={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained">
                                Cek Pembayaran
                            </Button>
                        </View> */}
                    </>
            }
        </SafeAreaView >
    )
}
const style = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja, fontFamily: 'Poppins-Regular', marginVertical: Hp('2%') },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
})