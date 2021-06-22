import { ToastAndroid, Alert } from 'react-native'
export async function getStore(slug) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=99epvnp1f3qv3bc9ed9hnkf32j11devb");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/store/${slug}`, requestOptions)
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

export async function getStoreProduct(slug, keyword, price, condition, preorder, brand, sort) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=l1pjct5fi76ke1irrounf7lc3c5g81iv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/store/${slug ? slug : ""}?page=1&limit=100&keyword=${keyword ? keyword : ""}&filter_price=&filter_location=${price ? price : ""}&filter_condition=${condition ? condition : ""}&filter_preorder=${preorder ? preorder : ""}&filter_brand=${brand ? brand : ""}&sort=${sort ? sort : ""}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("🚀 ~ file: Store.js ~ line 36 ~ getStoreProduct ~ result", result)
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}
