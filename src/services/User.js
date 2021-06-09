import { ToastAndroid } from 'react-native'
export async function getBadges(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=8jq5h19sle86cb2nhest67lejudq2e1q");
    var raw = "";
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    return await fetch("https://jaja.id/backend/user/info", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                return result.data;
            } else {
                Alert.alert(
                    "Jaja.id",
                    String(result.status.message) + " => " + String(result.status.code),
                    [
                        {
                            text: "TUTUP",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                );
                return null
            }
        })
        .catch(error => {
            Alert.alert(
                "Error get badges",
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


export async function getProfile(auth) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=s40vfqdc1qka9tlvlhqu226cc77lapfr");

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    return await fetch("https://jaja.id/backend/user/profile", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code === 200) {
                return result.data;
            } else {
                Alert.alert(
                    "Jaja.id",
                    String(result.status.message) + " => " + String(result.status.code),
                    [
                        {
                            text: "TUTUP",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                );
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