import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';

export async function getUnpaid(auth) {
    if (auth) {
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

        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=notPaid", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12003")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12201\n' + JSON.stringify(res) + '\n' + String(error))
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12004")
            });
    }
}

export async function getWaitConfirm(auth) {
    if (auth) {
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
        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=waitConfirm", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12005")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12203\n' + String(error) + '\n\n' + JSON.stringify(res))
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12006")
            });
    }
}

export async function getProcess(auth) {
    if (auth) {
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

        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=prepared", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12007")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12202\n' + JSON.stringify(res) + '\n' + String(error))
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12008")
            });
    }
}

export async function getSent(auth) {
    if (auth) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Cookie", "ci_session=5brdv3mukq89aljo7pe4n46skfmvcl7i");
        var raw = "";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=sent", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12009")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12204\n' + JSON.stringify(res) + '\n' + String(error))
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12010")
            });
    }
}

export async function getCompleted(auth) {
    if (auth) {
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

        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=done", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 120011")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12205\n' + res + '\n' + String(error))
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12012")
            });
    }
}

export async function getFailed(auth) {
    if (auth) {
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

        return await fetch("https://jaja.id/backend/order?page=1&limit=50&status=canceled", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result && Object.keys(result).length && result.status.code === 200 || result.status.code === 204) {
                        return result.data;
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12013")
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp('Error with status code : 12206\n' + JSON.stringify(res) + '\n' + String(error))
                }
            })
            .catch(error => {

                Utils.handleError(error, "Error with status code : 12014")
            });
    }
}

