import { Alert } from 'react-native'
import { Utils } from '../export';
export async function getCart(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=gaq70d91jnebu24rvqr1ttb6p0akqshs");
    var raw = "";
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/cart?page=1&limit=20", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                Alert.alert(
                    "Error get cart",
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
                    `${String(error)}`,
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
export async function getTrolley(auth, gift, dispatch) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=gaq70d91jnebu24rvqr1ttb6p0akqshs");
    var raw = "";
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return await fetch(`https://jaja.id/backend/cart?page=1&limit=25&is_gift=${gift ? gift : 0}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let res = JSON.parse(result)
                if (res?.status?.code === 200 || res?.status?.code === 204) {
                    if (gift) {
                        dispatch({ type: 'SET_CART', payload: res.data })
                        dispatch({ type: 'SET_CART_STATUS', payload: 'gift' })

                    } else {
                        dispatch({ type: 'SET_CART_GIFT', payload: res.data })
                        dispatch({ type: 'SET_CART_STATUS', payload: '' })

                    }
                    return true
                } else {
                    Utils.handleErrorResponse(res, 'Error with status code : 12300');
                    return true
                }
            } catch (error) {
                Utils.handleError(error, 'Eroor with status code : 12301')
                return true
            }
        })
        .catch(error => {
            Utils.handleError(error, 'Eroor with status code : 12302')
            return true
        });
}



export async function deleteCart(auth, idCart) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=e6i79o5j17q2gkfglur3ua1vf6v6qfjn");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/cart/${idCart}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                return 200;
            } else {
                Utils.handleErrorResponse(result, "Error with status code : 12040")
                return null
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 12041")
            return null
        });
}   