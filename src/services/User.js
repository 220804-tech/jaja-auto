import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';
import dynamicLinks from '@react-native-firebase/dynamic-links';

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

export async function getBadge(auth, dispatch) {
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
                try {
                    let res = JSON.parse(result);
                    if (res.status.code === 200) {
                        dispatch({ type: "SET_BADGES", payload: res.data });
                    } else {
                        Utils.handleErrorResponse(error, 'Error with status code : 12303')
                    }
                } catch (error) {
                    Utils.handleError(error, 'Error with status code : 12304')
                }
                return false
            })
            .catch(error => {
                Utils.handleError(error, 'Error with status code : 12305')
                return false
            })
    } else {
        return false
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


export async function getListAccount(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=ikeb5jtejc1l6nr5f11bvfni51ghd5ls");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/user/bankAccount", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let response = JSON.parse(result)
                if (response.status.code === 200 || response.status.code === 204) {
                    return response.data
                } else {
                    Utils.alertPopUp(response.status.message)
                    return null
                }
            } catch (error) {
                Utils.handleError(result, 'Error with status code 17021')
                return null

            }
        })
        .catch(error => {
            Utils.handleError(error, 'Error with status code : 17022')
            return null

        });
}

export async function handleWishlist(auth, idProduct) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "ci_session=t3uc2fb7opug4n91n18e70tcpjvdb12u");
    var raw = JSON.stringify({ "id_produk": idProduct });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("https://jaja.id/backend/user/addWishlist", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result?.status?.code === 200) {
                return true
            } else {
                return false
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 42025")
            return false
        });

}

export async function handleCreateLink(slugProduct) {
    try {
        const link_URL = await dynamicLinks().buildShortLink({
            link: `https://jajaid.page.link/product?slug=${slugProduct}`,
            domainUriPrefix: 'https://jajaid.page.link',
            ios: {
                bundleId: 'com.jaja.customer',
                appStoreId: '1547981332',
                fallbackUrl: 'https://apps.apple.com/id/app/jaja-id-marketplace-hobbies/id1547981332?l=id',
            },
            android: {
                packageName: 'com.jajaidbuyer',
                fallbackUrl: 'https://play.google.com/store/apps/details?id=com.jajaidbuyer',
            },
            navigation: {
                forcedRedirectEnabled: true,
            }
        });
        return link_URL
    } catch (error) {
        Utils.alertPopUp('Sepertinya ada masalah, coba lagi sesaat!')
        console.log("🚀 ~ file: ProductScreen.js ~ line 138 ~ dynamicLink ~ error", error)
        return null
    }
}



