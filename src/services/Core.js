import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';

export async function getDateTime() {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/home/tanggal", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.TOP)
            }
        })
        .catch(error => {
            // Utils.handleError(error, 'Error with status code : 12022')
        });
}


export async function getFlashsale() {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=0aim69ehon50j9f2n49hdrv9335sl7jb");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/flashsale", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.TOP)
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length) === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                Alert.alert(
                    "Error get flashsale",
                    JSON.stringify(error),
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
        });
}
