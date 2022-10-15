import { Alert, ToastAndroid, Platform, AlertIOS } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';

export function regexEmail(e) {
    let val = e.nativeEvent.text;
    let rgx = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let rest = rgx.test(e.nativeEvent.text);
    if (val.length > 4 && rest === true) {
        return true
    } else if (val.length === 0) {
        return false
    }
}

export function handleLanguange(e) {
    if (String(e).toLocaleLowerCase().includes('seni') || String(e).toLocaleLowerCase().includes('art')) {
        return 'art-shop'
    } else if (String(e).toLocaleLowerCase().includes('otomotif') || String(e).toLocaleLowerCase().includes('oto') || String(e).toLocaleLowerCase().includes('auto')) {
        return 'automotive'
    } else if (String(e).toLocaleLowerCase().includes('buku') || String(e).toLocaleLowerCase().includes('book') || String(e).toLocaleLowerCase().includes('books')) {
        return 'books'
    } else if (String(e).toLocaleLowerCase().includes('kopi') || String(e).toLocaleLowerCase().includes('kopi') || String(e).toLocaleLowerCase().includes('drink') || String(e).toLocaleLowerCase().includes('alat kopi')) {
        return 'cooking--coffee-maker'
    } else if (String(e).toLocaleLowerCase().includes('voucher') || String(e).toLocaleLowerCase().includes('kopi') || String(e).toLocaleLowerCase().includes('drink') || String(e).toLocaleLowerCase().includes('alat kopi')) {
        return 'digital-voucher'
    } else if (String(e).toLocaleLowerCase().includes('bunga') || String(e).toLocaleLowerCase().includes('penjual bunga') || String(e).toLocaleLowerCase().includes('flower')) {
        return 'florist'
    } else if (String(e).toLocaleLowerCase().includes('gaming') || String(e).toLocaleLowerCase().includes('game') || String(e).toLocaleLowerCase().includes('nitendo') || String(e).toLocaleLowerCase().includes('playstation') || String(e).toLocaleLowerCase().includes('video game') || String(e).toLocaleLowerCase().includes('permainan')) {
        return 'gaming'
    } else if (String(e).toLocaleLowerCase().includes('bekebun') || String(e).toLocaleLowerCase().includes('taman') || String(e).toLocaleLowerCase().includes('kebun')) {
        return 'gardening'
    } else if (String(e).toLocaleLowerCase().includes('kpop') || String(e).toLocaleLowerCase().includes('korea')) {
        return 'k-pop'
    } else if (String(e).toLocaleLowerCase().includes('lokal') || String(e).toLocaleLowerCase().includes('produk lokal') || String(e).toLocaleLowerCase().includes('kebanggaan lokal')) {
        return 'local-pride'
    } else if (String(e).toLocaleLowerCase().includes('musik') || String(e).toLocaleLowerCase().includes('lagu') || String(e).toLocaleLowerCase().includes('mp3')) {
        return 'musics'
    } else if (String(e).toLocaleLowerCase().includes('hewan') || String(e).toLocaleLowerCase().includes('peliharaan') || String(e).toLocaleLowerCase().includes('binatang')) {
        return 'pets'
    } else if (String(e).toLocaleLowerCase().includes('foto') || String(e).toLocaleLowerCase().includes('fotograpis') || String(e).toLocaleLowerCase().includes('camera') || String(e).toLocaleLowerCase().includes('kamera')) {
        return 'photographys'
    } else if (String(e).toLocaleLowerCase().includes('olahraga') || String(e).toLocaleLowerCase().includes('badminton') || String(e).toLocaleLowerCase().includes('futsal') || String(e).toLocaleLowerCase().includes('swimming') || String(e).toLocaleLowerCase().includes('sepeda') || String(e).toLocaleLowerCase().includes('bicycle') || String(e).toLocaleLowerCase().includes('cycling')) {
        return 'sports'
    } else if (String(e).toLocaleLowerCase().includes('mainan') || String(e).toLocaleLowerCase().includes('anak')) {
        return 'toys'
    } else if (String(e).toLocaleLowerCase().includes('jalan') || String(e).toLocaleLowerCase().includes('bepergian')) {
        return 'travelling'
    } else {
        return String(e).toLowerCase()
    }
}

export function alertPopUp(text) {
    if (String(text).includes('504 Gateway Time-out')) {

    } else {
        try {
            if (Platform.OS === 'android') {
                ToastAndroid.show(text, ToastAndroid.LONG)
            } else {
                Toast.show(text);
            }
        } catch (error) {

        }
    }
}

export function regex(name, value) {
    try {
        if (name === "number") {
            return (value.replace(/[^0-9]/gi, ''))
        }
    } catch (error) {

    }
}

export function cardAlert(status, error) {
    Alert.alert(
        `Error with status ${error}`,
        `${status.message + ' => ' + status.code}`,
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );
}

export function handleJSONParse(message, code) {
    Alert.alert(
        `Error with status ${code}`,
        `${String(message)}`,
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );
}

export async function CheckSignal() {
    let signalInfo = {}
    await NetInfo.fetch().then(state => {
        signalInfo.type = state.type
        signalInfo.connect = state.isConnected
    });
    return signalInfo
}

export async function handleSignal() {
    try {
        let signalInfo = {}
        await NetInfo.fetch().then(state => {
            if (state.isConnected) {
                alertPopUp('Tidak dapat memuat ke server')
            } else {
                alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda!")
            }
        });

    } catch (error) {
        console.log("🚀 ~ file: Form.js ~ line 71 ~ handleSignal ~ error", error)
    }
}

export function handleErrorResponse(error, errorCode) {
    if (error?.status?.code !== 200 && error?.status?.code !== 204) {
        if (!!error?.status?.message) {
            alertPopUp(String(error.status.message))
        } else {
            Alert.alert(
                errorCode,
                String(errorCode) + " => " + String(error),
                [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        }
    } else {
        Alert.alert(
            errorCode,
            "Error response:" + JSON.stringify(error),
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }
}

export function handleError(error, name) {
    if (String(error).includes("request failed")) {
        alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda!")
    } else {
        if (Platform.OS === 'android') {
            Alert.alert(
                String(name),
                `${'Error: ' + String(error)} `,
                [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        } else {

        }
    }

}



export function handleCurrency(number) {
    try {
        if (number) {
            var reverse = number.toString().split("").reverse().join(""),
                ribuan = reverse.match(/\d{1,3}/g);
            ribuan = ribuan.join(".").split("").reverse().join("");
            return ribuan;
        }
    } catch (error) {

    }
}



export function handleWarningText(text) {
    try {
        if (text) {
            let warningText = String('shopee shope lazada tokoped tokopedia jd.id jdid bukalapak whatsapp').split(" ")
            let word = text
            var words = text.split(" ");
            words.map(res => {
                warningText.map(result => {
                    if (res.toLowerCase() === result.toLowerCase()) {
                        console.log("true")
                        word = word.replace(res, '***')
                    } else {
                        console.log("false")
                    }
                })
            })
            setdeskripsiLenght(word.length)
            setdeskripsi(word)
        } else {
            return text
        }
    } catch (error) {

    }
}
