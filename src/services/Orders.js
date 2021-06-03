import { ToastAndroid } from 'react-native'

export async function getUnpaid(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=notPaid", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

export async function getWaitConfirm(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=waitConfirm", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

export async function getProcess(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=prepared", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

export async function getSent(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=sent", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

export async function getCompleted(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=done", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

export async function getFailed(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=o4b4prbg3c8qthna9jk3gpu5vgskgsb5");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/order?page=1&limit=10&status=canceled", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                ToastAndroid.show(String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}

