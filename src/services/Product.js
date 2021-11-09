import { ToastAndroid, Alert } from 'react-native'
import { Utils, axios } from '../export';
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
        .then(response => response.text())
        .then(result => {
            try {
                let data = JSON.parse(result)
                if (data && Object.keys(data).length && data.status.code == 200) {
                    return data.data;
                } else {
                    Utils.handleErrorResponse(data, "Error with status code : 12051")
                    return null
                }
            } catch (error) {
                Utils.handleError(result, "Error with status code : 12052")
            }
        })
        .catch(error => {
            console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", error)
            Utils.handleError(error, "Error with status code : 120477")
            return null
        });

}

export async function addCart(auth, crendentials) {
    try {
        var config = {
            method: 'post',
            url: 'https://jaja.id/backend/cart',
            headers: {
                'Authorization': auth
            },
            data: crendentials
        };

        return await axios(config)
            .then(function (response) {
                return response.data
            })
            .catch(function (error) {
                Utils.handleError(JSON.stringify(error), 'Error with status code : 12115')
                return null
            });
    } catch (error) {

    }
}