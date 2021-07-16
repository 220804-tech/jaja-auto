import { ToastAndroid, Alert } from 'react-native'
export async function productDetail(auth, slug) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=8jq5h19sle86cb2nhest67lejudq2e1q");

    var requestOptions = {
        method: 'GET',
        headers: auth ? myHeaders : "",
        redirect: 'follow'
    };

    return await fetch(`https://jaja.id/backend/product/${slug}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result && result.status.code == 200) {
                return result.data;
            } else {
                Alert.alert(
                    "Error get product ",
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
            console.log("file: Product.js ~ line 35 ~ productDetail ~ error", error)
            if (String(error).slice(11, String(error).length).replace(" ", "") === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        });

}