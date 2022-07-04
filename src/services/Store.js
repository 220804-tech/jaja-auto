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
        .then(response => response.text())
        .then(result => {
            try {
                let data = JSON.parse(result)
                if (data.status.code === 200 || data.status.code === 204) {
                    return data.data;
                } else {
                    return null
                }
            } catch (error) {
                Utils.handleError(String(result), "Error with status code 120191")
                console.log("🚀 ~ file: Store.js ~ line 26 ~ getStore ~ error", error)
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

    return await fetch(`https://jaja.id/backend/product/store/${data.slug ? data.slug : ""}?page=${data.page}&limit=${data.limit}&keyword=${data.keyword ? data.keyword : ""}&filter_price=&filter_location=&filter_condition=${data.condition ? data.condition : ""}&filter_preorder=${data.preorder ? data.preorder : ""}&filter_brand=${data.brand ? data.brand : ""}&filter_category=${data.category ? data.category : ""}&sort=${data.sort ? data.sort : ""} `, requestOptions)
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

export async function getProductStore(data, dispatch, newProduct) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=l1pjct5fi76ke1irrounf7lc3c5g81iv");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch(`https://jaja.id/backend/product/store/${data.slug ? data.slug : ""}?page=${data.page}&limit=${data.limit}&keyword=${data.keyword ? data.keyword : ""}&filter_price=&filter_location=&filter_condition=${data.condition ? data.condition : ""}&filter_preorder=${data.preorder ? data.preorder : ""}&filter_brand=${data.brand ? data.brand : ""}&filter_category=${data.category ? data.category : ""}&sort=${data.sort ? data.sort : ""} `, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: Store.js ~ line 66 ~ getProductStore ~ result", result.data.items.length)
                if (result?.status?.code === 200 || result?.status?.code === 204) {
                    if (newProduct) {
                        dispatch({ type: 'SET_NEW_PRODUCT', payload: result.data.items })
                    } else {
                        dispatch({ type: 'SET_STORE_PRODUCT', payload: result.data.items })
                    }
                    dispatch({ type: 'SET_STORE_FILTER', payload: result.data.filters })
                    dispatch({ type: 'SET_STORE_SORT', payload: result.data.sorts })
                    return true
                } else {
                    return null
                }
            })
            .catch(error => {
                Utils.handleError(error, 'Error with status code : 12020')
                return null
            });
    } catch (error) {
        Utils.handleError(error, 'Error with status code : 12020')
        return null
    }
}

export async function getEtalase(toko) {
    try {
        let errorResponse = true
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        setTimeout(() => {
            if (errorResponse) {
                Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
            }
        }, 22000);

        return await fetch(`https://elibx.jaja.id/jaja/etalase/get-etalase-product?id=${toko}&type=buyer`, requestOptions)
            .then(response => response.text())
            .then(json => {
                try {
                    errorResponse = false
                    let result = JSON.parse(json)
                    if (result?.status?.code == 200) {
                        return result.data
                    } else if (!result?.data?.length) {
                        return []
                    } else {
                        Utils.alertPopUp(result?.status?.message)
                        return []
                    }
                } catch (error) {
                    return []
                }
            })
            .catch(error => {
                Utils.handleError(String(error), 'Error with status code : 81002')
                return []
            });


    } catch (error) {
        Utils.alertPopUp(String(error), 'Error with status code : 51002')
        return []
    }

}
export async function getEtalaseProducts(object) {
    try {
        let errorResponse = true

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        setTimeout(() => {
            if (errorResponse) {
                Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
            }
        }, 22000);

        return await fetch(`https://elibx.jaja.id/jaja/etalase/get-product-by-etalase?page=${object.page}&limit=20&etalaseId=${object.etalase}&sellerId=${object.toko}&keyword=${object.keyword}`, requestOptions)
            .then(response => response.text())
            .then(json => {
                console.log("🚀 ~ file: Store.js ~ line 165 ~ getEtalaseProducts ~ json", json)
                try {
                    errorResponse = false
                    let result = JSON.parse(json)
                    if (result?.status?.code == 200) {
                        return result.data
                    } else if (!result?.data?.length) {
                        return []
                    } else {
                        Utils.alertPopUp(result?.status?.message)
                        return []
                    }
                } catch (error) {
                    return []
                }
            })
            .catch(error => {
                Utils.handleError(String(error), 'Error with status code : 81002')
                return []
            });


    } catch (error) {
        Utils.alertPopUp(String(error), 'Error with status code : 51002')
        return []
    }

}