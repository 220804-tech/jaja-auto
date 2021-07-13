import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo";

export function regexEmail(e) {
    console.log(e, ' email');
    let val = e.nativeEvent.text;
    let regex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let rest = regex.test(e.nativeEvent.text);
    console.log("index -> handleEmail -> val.length", val.length)

    if (val.length > 4 && rest === true) {
        return true
    } else if (val.length === 0) {
        return false
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

export function handleResponse(error) {
    if (error.status.code !== 200 && error.status.code !== 204) {
        Alert.alert(
            "Error with status 12001",
            String(error.status.message) + " => " + String(error.status.code),
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    } else {

    }
}
export function handleError(error, name) {
    if (String(error).slice(11, String(error).length) === "Network request failed") {
        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
    } else {
        Alert.alert(
            "Error with status 19001",
            `${name + " " + String(error)}`,
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
