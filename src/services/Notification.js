import { ToastAndroid, Alert } from 'react-native'
import { kabupatenKota } from './Address';

export async function getNotifications() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://jsonx.jaja.id/core/seller/dashboard/notifikasi?id_toko=145", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                console.log("masuk sini  21211 ", result.data.transaksi)
                return result.data.transaksi;
            } else {
                Alert.alert(
                    "Sepertinya ada masalah.",
                    String(result.status.message) + " => " + String(result.status.code),
                    [
                        {
                            text: "TUTUP",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                );
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                Utils.alertPopUp('Tidak dapat terhubung, periksa kembali koneksi internet anda!')
            } else {
                Alert.alert(
                    "Error",
                    String(error),
                    [
                        {
                            text: "TUTUP",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                );
            }

        });
}