import { Alert, ToastAndroid, Platform, AlertIOS } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { Utils } from '../export';

export function regexEmail(e) {
    let val = e.nativeEvent.text;
    let rgx = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let rest = rgx.test(e.nativeEvent.text);
    if (val.length > 4 && rest === true) {
        return true
    } else if (val.length === 0) {
        return false
    }
}

export function alertPopUp(text) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(text, ToastAndroid.LONG, ToastAndroid.CENTER)
    } else {
        AlertIOS.alert(text);
    }
}

export function regex(name, value) {
    if (name === "number") {
        return (value.replace(/[^0-9]/gi, ''))
    }
}

export function cardAlert(status, error) {
    Alert.alert(
        `Error with status ${error}`,
        `${status.message + ' => ' + status.code}`,
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );
}


export async function CheckSignal() {
    let signalInfo = {}
    await NetInfo.fetch().then(state => {
        signalInfo.type = state.type
        signalInfo.connect = state.isConnected
    });
    return signalInfo
}


export function handleErrorResponse(error, errorCode) {
    if (error && Object.keys(error).length && error.status.code !== 200 && error.status.code !== 204) {
        if (error.status.message) {
            Utils.alertPopUp(JSON.stringify(error.status.message))
        } else {
            Alert.alert(
                errorCode,
                JSON.stringify(error.status.message) + " => " + JSON.stringify(error.status.code),
                [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        }
    } else {
        Alert.alert(
            errorCode,
            "Error response:" + JSON.stringify(error),
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }
}

export function handleError(error, name) {
    if (String(error).slice(11, String(error).length) === "Network request failed") {
        Utils.alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda!")
    } else {
        Alert.alert(
            JSON.stringify(name),
            `${'Error: ' + JSON.stringify(error)} `,
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }
}


