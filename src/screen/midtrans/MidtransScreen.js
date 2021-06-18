import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, StyleSheet, Alert, Animated, BackHandler } from 'react-native'
import { styles, Wp, Hp, colors, useNavigation, ServiceCheckout, Appbar } from '../../export'
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Button, Paragraph } from 'react-native-paper';


export default function MidtransScreen() {
    const navigation = useNavigation()
    const reduxAuth = useSelector(state => state.auth.auth)
    const [loading, setloading] = useState(false)
    const reduxOrderId = useSelector(state => state.checkout.orderId)
    const [view, setView] = useState("")
    const [text, setText] = useState("Sedang Menghubungkan..")
    const [spinValue, setspinValue] = useState(new Animated.Value(0))

    useEffect(() => {
        setText("Sedang Menghubungkan..")
        setloading(true)
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                getItem()
            } else {
                navigation.navigate('Login')
            }
        })

        const backAction = () => {
            Alert.alert("Jaja.id", "Pesanan ini dapat kamu lihat di halaman pesanan", [
                { text: "OK", onPress: () => navigation.navigate("Pesanan") }
            ]);
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    const getItem = () => {
        if (reduxOrderId) {
            console.log("🚀 ~ file: MidtransComponent.js ~ line 22 ~ getItem ~ reduxOrderId", reduxOrderId)
            ServiceCheckout.getPayment(reduxAuth, reduxOrderId).then(res => {
                setView("")
                console.log("🚀 ~ file: MidtransScreen.js ~ line 39 ~ ServiceCheckout.getPayment ~ res", res)
                setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
                setView(res)
                setTimeout(() => setloading(false), 3000);
            }).catch(error => {
                ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

                ServiceCheckout.getPayment(reduxAuth, reduxOrderId).then(res => {
                    setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
                    setView(res)
                    setTimeout(() => setloading(false), 3000);
                }).catch(err => ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER) & setloading(false))
            });
        }
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const handleCheck = () => {
        getItem()
    }
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Pilih Pembayaran" route="Pesanan" />
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
                    <Text style={{ fontWeight: "bold" }}>{text}</Text>
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
                            source={{ html: view }}
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
                        <View style={{ position: 'relative', bottom: 0, height: Hp('7.5%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                            {/* <View style={{ width: '50%', justifyContent: 'flex-end', paddingHorizontal: '3%', paddingLeft: '5%', paddingVertical: '1%' }}>
                                <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Subtotal :</Text>
                                <Text numberOfLines={1} style={[styles.font_20, { fontWeight: 'bold', color: colors.BlueJaja }]}>ASA</Text>
                            </View> */}
                            <Button onPress={handleCheck} style={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained">
                                Cek Pembayaran
                            </Button>
                        </View>
                    </>
            }
        </SafeAreaView >
    )
}
const style = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.BlueJaja, fontFamily: 'notoserif', marginVertical: Hp('2%') },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
})