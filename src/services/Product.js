import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';
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
            if (result && Object.keys(result).length && result.status.code == 200) {
                return result.data;
            } else {
                Utils.handleErrorResponse(result, "Error with status code : 12046")
                return null
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 12047")
            return null
        });

}