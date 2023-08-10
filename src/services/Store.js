import axios from 'axios';
import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';
import database from "@react-native-firebase/database";

export async function getStore(slug, auth, navigation, seller) {
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
        .then(async result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                Utils.alertPopUp(result?.status?.message)
                database().ref(`/messages/${seller.chat}`).remove(() => {
                    console.log('cok ocmplete')
                });
                database().ref(`/friend/${seller.target}` + '/' + `${seller.id}`).remove(() => {
                    console.log('cok ocmplete 2222')
                });
                database().ref(`/friend/${seller.id}`).remove(() => {
                    console.log('cok ocmplete 3333')
                });
                database().ref(`/people/${seller.id}`).remove(() => {
                    console.log('cok ocmplete 4444')
                });
                navigation.navigate('OrderDetails')
                return null
            }
        })
        .catch(error => {
            Utils.handleError(error, 'Error with status code : 12019')
            return null
        });
}


export async function getStoreNew(slug, dispatch, auth) {
    try {
        const config = {
            headers: {
                Cookie: 'ci_session=99epvnp1f3qv3bc9ed9hnkf32j11devb',
            },
        };
        if (auth) {
            config.headers.Authorization = auth;
        }
        const url = `https://jaja.id/backend/store/${slug}`;
        const response = await axios.get(url, config);
        const result = response.data;

        if (result.status.code === 200 || result.status.code === 204) {
            console.log("🚀 ~ file: Store.js ~ line 60 ~ getStoreNew ~ result", result)
            dispatch({ "type": 'SET_STORE', payload: result.data })
            dispatch({ "type": 'SET_STORE_LOAD', payload: false })
            dispatch({ "type": 'SET_NEW_PRODUCT_LOAD', payload: false })
            return true
        } else {
            Utils.alertPopUp(result?.status?.message)
            return null
        }
    } catch (error) {
        Utils.handleError(error, 'Error with status code : 12019')
        return null
    }
}

export async function getStoreProduct(data) {
    try {
        const config = {
            headers: {
                Cookie: 'ci_session=l1pjct5fi76ke1irrounf7lc3c5g81iv',
            },
        };

        const url = `https://jaja.id/backend/product/store/${data.slug}?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}&filter_price=&filter_category=&filter_condition=${data.condition}&filter_preorder=${data.preorder}&filter_brand=${data.brand}&is_gift=0&sort=${data.sort}`;
        const response = await axios.get(url, config);
        const result = response.data;

        if (result.status.code === 200 || result.status.code === 204) {
            return result.data;
        } else {
            return null
        }
    } catch (error) {
        Utils.handleError(error, 'Error with status code : 12020');
        return null;
    }
}


export async function getProductStore(data, dispatch, newProduct) {
    try {
        const config = {
            headers: {
                Cookie: 'ci_session=l1pjct5fi76ke1irrounf7lc3c5g81iv',
            },
        };

        const url = `https://jaja.id/backend/product/store/${data.slug}?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}&filter_price=&filter_category=&filter_condition=${data.condition}&filter_preorder=${data.preorder}&filter_brand=${data.brand}&is_gift=0&sort=${data.sort}`;

        const response = await axios.get(url, config);
        const result = response.data;

        if (result?.status?.code === 200 || result?.status?.code === 204) {
            if (newProduct) {
                console.log("🚀 ~ file: Store.js ~ line 81 ~ getProductStore ~ result", result.data.items)
                dispatch({ type: 'SET_NEW_PRODUCT', payload: result.data.items })
                dispatch({ "type": 'SET_NEW_PRODUCT_LOAD', payload: false })
            } else {
                console.log("🚀 ~ file: Store.js ~ line 87 ~ getProductStore ~ result", result.data.items)
                dispatch({ type: 'SET_STORE_PRODUCT', payload: result.data.items })
                dispatch({ "type": 'STORE_PRODUCT_LOADING', payload: false })
            }
            dispatch({ type: 'SET_STORE_FILTER', payload: result.data.filters })
            dispatch({ type: 'SET_STORE_SORT', payload: result.data.sorts })
            return true
        } else {
            return null
        }

    } catch (error) {
        Utils.handleError(error, 'Error with status code : 12020')
        return null
    }
}


export async function getEtalase(toko) {
    try {
        let errorResponse = true;
        const config = {
            headers: {
                Cookie: 'ci_session=akeeif474rkhuhqgj7ah24ksdljm0248',
            },
            timeout: 22000,
        };

        return await axios.get(`https://elibx.jaja.id/jaja/etalase/get-etalase-product?id=${toko}&type=buyer`, config)
            .then(response => {
                errorResponse = false;
                const result = response.data;
                if (result?.status?.code === 200) {
                    return result.data;
                } else if (!result?.data?.length) {
                    return [];
                } else {
                    Utils.alertPopUp(result?.status?.message);
                    return [];
                }
            })
            .catch(error => {
                if (errorResponse) {
                    Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!');
                }
                if (error.response) {
                    Utils.handleError(error.response.data, `Error with status code : ${error.response.status}`);
                } else if (error.request) {
                    Utils.handleError(error.request, 'No response received');
                } else {
                    Utils.handleError(error.message, 'Error with request setup');
                }
                return [];
            });
    } catch (error) {
        Utils.alertPopUp(String(error), 'Error with status code : 51002');
        return [];
    }
}


export async function getEtalaseProducts(object) {
    try {
        return await axios.get(`https://elibx.jaja.id/jaja/etalase/get-product-by-etalase?page=${object.page}&limit=20&etalaseId=${object.etalase}&sellerId=${object.toko}&keyword=${object.keyword}`)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    Utils.alertPopUp(response?.status?.message);
                    return [];
                }
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    Utils.handleError(error.response.data, `Error with status code : ${error.response.status}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    Utils.handleError(error.request, 'No response received');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    Utils.handleError(error.message, 'Error with request setup');
                }
                return [];
            });
    } catch (error) {
        Utils.alertPopUp(String(error), 'Error with status code : 51002');
        return [];
    }
}
