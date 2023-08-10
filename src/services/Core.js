import axios from 'axios';
import { ToastAndroid, Alert } from 'react-native';

export async function getDateTime() {
    try {
        const response = await axios.get("https://jaja.id/backend/home/tanggal", {
            headers: {
                "Cookie": "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o"
            }
        });

        const result = response.data;

        if (result.status.code === 200 || result.status.code === 204) {
            return result.data;
        } else {
            ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.TOP);
        }
    } catch (error) {
        // Utils.handleError(error, 'Error with status code : 12022')
    }
}

export async function getFlashsale() {
    try {
        const response = await axios.get("https://jaja.id/backend/flashsale", {
            headers: {
                "Cookie": "ci_session=0aim69ehon50j9f2n49hdrv9335sl7jb"
            }
        });

        const result = response.data;

        if (result.status.code === 200 || result.status.code === 204) {
            return result.data;
        } else {
            ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.TOP);
        }
    } catch (error) {
        console.log("getFlashsale error:", error);
        if (String(error).slice(11, String(error).length) === "Network request failed") {
            ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP);
        } else {
            Alert.alert(
                "Error get flashsale",
                String(error),
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
    }
}
