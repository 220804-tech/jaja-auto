import React, { useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux'
import { ServiceCheckout } from '../../export';

export default function MidtransComponent() {
    const reduxOrderId = useSelector(state => state.checkout.orderId)
    const [view, setView] = useState("")
    const reduxAuth = useSelector(state => state.auth.auth)


    useEffect(() => {
        getItem(JSON.parse(reduxAuth))
    }, [])

    const getItem = (val) => {
        if (reduxOrderId) {
            // console.log("🚀 ~ file: MidtransComponent.js ~ line 22 ~ getItem ~ reduxOrderId", reduxOrderId)
            ServiceCheckout.getPayment(val, reduxOrderId).then(res => {
                setView(res)
            }).catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
        }
    }

    return (
        <WebView
            style={{ alignSelf: 'stretch' }}
            // ref={(webView) => this.webView = webView}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
            scalesPageToFit={true}
            originWhitelist={['*']}
            source={{ html: payment }} />
    )
}
