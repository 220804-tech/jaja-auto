import { ToastAndroid, Alert } from 'react-native'

export async function getUnpaid(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=notPaid", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
            } else {
                Alert.alert(
                    "Error with status 12003",
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

export async function getWaitConfirm(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=waitConfirm", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length) === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                Alert.alert(
                    "Error with status 12004",
                    JSON.stringify(error)
                    [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
        });
}

export async function getProcess(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=prepared", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
            } else {
                Alert.alert(
                    "Error with status 12005",
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

export async function getSent(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=sent", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
            } else {
                Alert.alert(
                    "Error with status 12006",
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

export async function getCompleted(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=done", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
            } else {
                Alert.alert(
                    "Error with status 12007",
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

export async function getFailed(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=canceled", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => {
            if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
            } else {
                Alert.alert(
                    "Error with status 12008",
                    JSON.stringify(error),
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

