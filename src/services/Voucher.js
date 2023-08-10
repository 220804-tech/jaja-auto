import { ToastAndroid, Alert } from 'react-native'
export async function getVouchers(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=ss71d1kvsjjv4j3kdm2najq1bth9ku2h");
    var raw = "";
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }
    var url = "https://jaja.id/backend/user/voucher?page=1&limit=10&status=unUsed";
    console.log('urlgetVouchers', url)
    console.log('headergetVoucher', JSON.stringify(myHeaders));

    return await fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                return null
            }
        })
        .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
}