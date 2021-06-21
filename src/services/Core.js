import { ToastAndroid } from 'react-native'

export async function getDateTime() {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    var myHeaders = new Headers();
    myHeaders.append("token", "");
    myHeaders.append("Cookie", "ci_session=0e6r8bk4r0srht47duup3f6jmd4bdph3");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/home/tanggal", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200 || result.status.code === 204) {
                return result.data;
            } else {
                return null
            }
        })
        .catch(error => {
            Alert.alert(
                "Error get user",
                JSON.stringify(error),
                [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                ]
            );
        });
}
