import { Utils } from '../export';

export async function getCheckout(auth, coin) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
    var raw = "";
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/checkout?isCoin=${coin}`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code === 200) {
                    return result.data;
                } else if (result.status.code == 404 && String(result.status.message).includes('Alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu')) {
                    Utils.alertPopUp('Silahkan tambah alamat terlebih dahulu!')
                    return 'Alamat'
                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 12056')
                    return null
                }
            } catch (error) {
                Utils.alertPopUp(String(error) + ' 120565\n\n' + JSON.stringify(res))
            }
        })
        .catch(error => Utils.handleError(error, 'Error with status code : 12057'));
}

export async function getShipping(auth, gift) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=sj57u2rf54ump5hhscmu30jljrigpooq");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/checkout/shipping?is_gift=${gift === 1 ? 1 : 0}`, requestOptions)
        .then(response => response.json())
        .then(result => {

            if (result.status.code === 200) {
                return result.data;
            } else if (result.status.code == 404 && String(result.status.message).includes('Alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu')) {
                // Utils.alertPopUp('Silahkan tambah alamat terlebih dahuluuuuuuuuuuuuuuuuuuu!')
                return null
            } else {
                Utils.handleErrorResponse(result, 'Error with status code : 12056')
                return null
            }
        })
        .catch(error => Utils.alertPopUp(String(error)));
}


export async function getListPayment() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return await fetch("https://masterdiskon.com/front/api/common/methodPayment/1000000", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result && result.length) {
                return result
            } else {
                return null
            }
        })
        .catch(error => Utils.alertPopUp(String(error)));
}

export async function getPayment(auth, orderId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=numldefusraula0ggo63dgjjv4tf2fr3");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/webview/snapMidtrans/${orderId}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return result;
        })
        .catch(error => Utils.alertPopUp(String(error)));
}


export async function useCoin(auth, status) {
    console.log("🚀 ~ file: Checkout.js ~ line 106 ~ useCoin ~ status", status)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "ci_session=3duhmnjf8b13ub5905n38nm57kmfnfkv");

    var raw = JSON.stringify({
        "koin": status
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };

    return await fetch("https://jaja.id/backend/checkout?isCoin=1", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("🚀 ~ file: Checkout.js ~ line 122 ~ useCoin ~ result", result)
            if (result.status.code === 200) {
                return result.data.data
            } else {
                Utils.handleErrorResponse(result, 'Error with status code : 12054')
                return false
            }
        })
        .catch(error => {
            console.log("🚀 ~ file: Checkout.js ~ line 131 ~ useCoin ~ error", error)
            Utils.handleError(error, 'Error with status code : 12055')
            return false
        });
}
