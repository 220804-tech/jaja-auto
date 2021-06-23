import { ToastAndroid, Alert } from 'react-native'
export async function getBadges(auth) {
    if (auth) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Cookie", "ci_session=8jq5h19sle86cb2nhest67lejudq2e1q");
        var raw = "";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        return await fetch("https://jaja.id/backend/user/info", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    return result.data;
                } else {
                    return null
                }
            })
            .catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error get badges",
                        `${String(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
                return null
            })
    } else {
        return null
    }
}

export async function getProfile(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=s40vfqdc1qka9tlvlhqu226cc77lapfr");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    return await fetch("https://jaja.id/backend/user/profile", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                return result.data;
            } else {
                Alert.alert(
                    "Jaja.id",
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
            if (String(error).slice(11, String(error).length) === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                Alert.alert(
                    "Error get profile",
                    `${String(error)}`,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
            return null
        });
}

export async function deleteAddress(auth, alamatId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=s40vfqdc1qka9tlvlhqu226cc77lapfr");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/user/deleteAddress?id_alamat=${alamatId}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                return result.status;
            } else {
                Alert.alert(
                    "Jaja.id",
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
            if (String(error).slice(11, String(error).length) === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                Alert.alert(
                    "Error deleting address",
                    `${String(error)}`,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
            return null
        });
}