import { Alert } from 'react-native'
import { Utils } from '../export';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export async function getBadges(auth) {
    if (auth) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Cookie", "ci_session=8jq5h19sle86cb2nhest67lejudq2e1q");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch("https://jaja.id/backend/user/info", requestOptions)
            .then(response => {
                console.log("getBadges response:", response);
                return response.json();
            })
            .then(result => {
                console.log("getBadges result:", result);
                if (result?.status?.code === 200) {
                    return result.data;
                } else {
                    return null;
                }
            })
            .catch(error => {
                console.error("getBadges error:", error);
                // ... handle error as before ...
            });
    } else {
        return null;
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
            .then(response => {
                console.log("getBadge response:", response);
                return response.json();
            })
            .then(res => {
                console.log("getBadge result:", res);
                if (res.status.code === 200) {
                    dispatch({ type: "SET_BADGES", payload: res.data });
                } else {
                    Utils.handleErrorResponse(error, 'Error with status code : 12303')
                }
                return false
            })
            .catch(error => {
                console.error("getBadge error:", error);
                // ... handle error as before ...
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
                Utils.alertPopUp("Tidak dapat terhubung, periksa koneksi anda!")
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
                Utils.alertPopUp("Tidak dapat terhubung, periksa koneksi anda!")
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
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data
            } else {
                Utils.alertPopUp(result.status.message)
                return null
            }
        })
        .catch(error => {
            Utils.handleError(error, 'Error with status code : 17022')
            return null
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
        Utils.alertPopUp('Something went wrong')
        return null
    }
}
