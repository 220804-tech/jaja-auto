import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native'
import MidtransComponent from '../../components/Midtrans/MidtransComponent'
import { Loading, styles, Wp, Hp, colors, useNavigation, ServiceCheckout, Appbar } from '../../export'
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
        if (view) {
            getItem()
        }
    }, [view])

    const getItem = () => {
        if (reduxOrderId) {
            console.log("🚀 ~ file: MidtransComponent.js ~ line 22 ~ getItem ~ reduxOrderId", reduxOrderId)
            ServiceCheckout.getPayment(reduxAuth, reduxOrderId).then(res => {
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
                    <WebView
                        style={{ alignSelf: 'stretch' }}
                        javaScriptEnabled={true}
                        allowsFullscreenVideo={true}
                        scalesPageToFit={true}
                        originWhitelist={['*']}
                        source={{ html: view }}
                    />
            }
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.BlueJaja, fontFamily: 'notoserif', marginVertical: Hp('2%') },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
})