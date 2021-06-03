import { ToastAndroid } from 'react-native'
export async function productDetail(auth, slug) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=8jq5h19sle86cb2nhest67lejudq2e1q");

    var requestOptions = {
        method: 'GET',
        headers: auth ? myHeaders : "",
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/${slug}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                return result.data;
            }
            else {
                ToastAndroid.show(String(result.status.message) + " " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        })
        .catch(error => {
            return error
        });

}