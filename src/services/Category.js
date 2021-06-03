import { ToastAndroid } from 'react-native'
export async function getAllCategory(auth) {

    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/master/category", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}
