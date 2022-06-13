import { ToastAndroid, Alert } from 'react-native'
import { Utils, axios, styles, useNavigation, } from '../export';
import EncryptedStorage from 'react-native-encrypted-storage'



export async function productDetail(auth, slug) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=pkkgeivel5ftbi5a9eod0r8k5276f8v9");
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
                if (data && Object.keys(data).length && data.status.code === 200) {
                    return data.data;
                } else {
                    if (data.status.code !== 400) {
                        Utils.handleErrorResponse(data, "Error with status code : 12051")
                    }
                    return data
                }
            } catch (error) {
                Utils.handleError(JSON.stringify(result), "Error with status code : 12052")
            }
        })
        .catch(error => {
            console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", error)
            Utils.handleError(String(error), "Error with status code : 120477")
            return null
        });

}

export async function getProduct(auth, slug) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=pkkgeivel5ftbi5a9eod0r8k5276f8v9");
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
                if (data?.status?.code === 200 || data?.status?.code === 204) {
                    return data;
                } else if (data?.status?.message === 'data not found') {
                    return 404
                } else {
                    Utils.handleErrorResponse(data, "Error with status code : 12151")
                    return null
                }
            } catch (error) {
                Utils.handleError(JSON.stringify(result), "Error with status code : 12152 ")
                return null
            }
        })
        .catch(error => {
            Utils.handleError(String(error), "Error with status code : 12153")
            return null
        });

}

export async function newGetProduct(auth, dispatch) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Cookie", "ci_session=pkkgeivel5ftbi5a9eod0r8k5276f8v9");
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
                    if (data?.status?.code === 200 || data?.status?.code === 204) {
                        return data.data;
                    } else if (String(data?.status?.message).includes('data not found')) {
                        return 404
                    } else {
                        Utils.handleErrorResponse(data, "Error with status code : 121515")
                        return null
                    }
                } catch (error) {
                    Utils.handleError(JSON.stringify(result), "Error with status code : 121525")
                    return null
                }
            })
            .catch(error => {
                Utils.handleError(String(error), "Error with status code : 121535")
                return null
            });
    } catch (error) {
        Utils.handleError(String(error), "Error with status code : 121545")
        return null
    }
}


export async function addCart(auth, crendentials) {
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
            Utils.handleError(String(error), 'Error with status code : 12115')
            return null
        });

}

export async function getProducts(params) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=ar4c21d3los4kftggm2kt0fm1r4tofbv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/search/result?page=1&limit=250&keyword=${params.keyword ? params.keyword : ''}&filter_price=&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("🚀 ~ file: Product.js ~ line 110 ~ getProducts ~ result", result)
            try {
                let data = JSON.parse(result)
                if (data?.status?.code === 200 || data?.status?.code === 204) {
                    return data;
                } else {
                    Utils.handleErrorResponse(data, "Error with status code : 12515")
                    return []
                }
            } catch (error) {
                console.log("🚀 ~ file: Product.js ~ line 121 ~ getProducts ~ error", error)
                Utils.handleError(JSON.stringify(result), "Error with status code : 12525 ")
                return null
            }
        })
        .catch(error => {
            Utils.handleError(String(error), "Error with status code : 12535")
            return null
        });

}

export async function getStoreProduct(params) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=ar4c21d3los4kftggm2kt0fm1r4tofbv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/store/jaja-gift?page=1&limit=${params.gift ? 750 : 250}&keyword=${params.keyword ? params.keyword : ''}&filter_price=${params.price ? params.price : ''}&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let data = JSON.parse(result)
                if (data?.status?.code === 200 || data?.status?.code === 204) {
                    return data;
                } else {
                    Utils.handleErrorResponse(data, "Error with status code : 12515")
                    return []
                }
            } catch (error) {
                Utils.handleError("Error with status code : 12525 \n" + String(error) + '\n' + JSON.stringify(result))
                return null
            }
        })
        .catch(error => {
            Utils.handleError(String(error), "Error with status code : 12535")
            return null
        });

}


export async function getRecommendation(dispatch) {
    var config = {
        method: 'get',
        url: 'https://jaja.id/backend/product/recommendation?page=1&limit=25',
        headers: {
            'Cookie': 'ci_session=3ocrqec6u5otqek055fej001v7vk1hp6'
        },
    };

    axios(config)
        .then(function (response) {
            if (response?.data?.status?.code === 200) {
                dispatch({ type: 'SET_DASHRECOMMANDED', payload: response.data.data.items })
                EncryptedStorage.setItem('dashrecommanded', JSON.stringify(response.data.data.items))
            } else {
                Utils.handleErrorResponse(response.data, 'Error with status code : 120001')
                handleProductRecommanded();
            }
        })
        .catch(function (error) {
            // alert('toolllll')
            // Utils.handleError(String(error), 'Error with status code : 120002')
            handleProductRecommanded()
        });

    const handleProductRecommanded = () => {
        EncryptedStorage.getItem('dashrecommanded').then(result => {
            if (result) {
                dispatch({ type: 'SET_DASHRECOMMANDED', payload: JSON.parse(result) });
            }
        });
    }
}

export async function handleUpdateGift(auth, credentials) {

    var config = {
        method: 'put',
        url: 'https://jaja.id/backend/checkout/changeDetailGift',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
            'Cookie': 'ci_session=hnmfki7ujbu8ta0u4m64hdhp5f0dch1a'
        },
        data: credentials
    };

    return await axios(config)
        .then(function (response) {
            if (response.data?.status?.code !== 200) {
                Utils.handleErrorResponse(error, 'Error with status code : 15001')
            }
            return true
        })
        .catch(function (error) {
            Utils.handleError(error, 'Error with status code : 15002')
            return true
        });
}
