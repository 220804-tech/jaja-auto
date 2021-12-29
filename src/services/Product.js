import { ToastAndroid, Alert } from 'react-native'
import { Utils, axios } from '../export';
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
                if (data?.status?.code && data.status.code === 200 || data.status.code === 204) {
                    return data;
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
            console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", error)
            Utils.handleError(String(error), "Error with status code : 12153")
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
                Utils.handleError(String(error), 'Error with status code : 12115')
                return null
            });
    } catch (error) {

    }
}


export async function getProducts(params) {
    console.log("🚀 ~ file: Product.js ~ line 98 ~ getProducts ~ params", params)
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=ar4c21d3los4kftggm2kt0fm1r4tofbv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    console.log(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=${params.keyword ? params.keyword : ''}&filter_price=&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`)


    return await fetch(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=${params.keyword ? params.keyword : ''}&filter_price=&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`, requestOptions)
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
    console.log("🚀 ~ file: Product.js ~ line 98 ~ getProducts ~ params", params)
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=ar4c21d3los4kftggm2kt0fm1r4tofbv");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    console.log(`https://jaja.id/backend/product/store/jaja-official?page=1&limit=10&keyword=${params.keyword ? params.keyword : ''}&filter_price=&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`)


    return await fetch(`https://jaja.id/backend/product/store/jaja-gift?page=1&limit=10&keyword=${params.keyword ? params.keyword : ''}&filter_price=&filter_location=&filter_condition=&filter_preorder=${params.preorder ? params.preorder : ''}&filter_brand=${params.brand ? params.brand : ''}&sort=&is_gift=${params.gift ? params.gift : 0}`, requestOptions)
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