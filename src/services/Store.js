import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';
export async function getStore(slug, auth) {
    var myHeaders = new Headers();
    if (auth) {
        myHeaders.append("Authorization", auth);
    }
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
        .catch(error => {
            Utils.handleError(error, 'Error with status code : 12019')
            return null
        });
}

export async function getStoreProduct(data) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=l1pjct5fi76ke1irrounf7lc3c5g81iv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/store/${data.slug ? data.slug : ""}?page=${data.page}&limit=${data.limit}&keyword=${data.keyword ? data.keyword : ""}&filter_price=&filter_location=${data.price ? data.price : ""}&filter_condition=${data.condition ? data.condition : ""}&filter_preorder=${data.preorder ? data.preorder : ""}&filter_brand=${data.brand ? data.brand : ""}&sort=${data.sort ? data.sort : ""}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                return null
            }
        })
        .catch(error => Utils.handleError(error, 'Error with status code : 12020'));
}
