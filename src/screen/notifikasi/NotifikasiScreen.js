import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, Hp, Appbar, styles as style, ServiceNotif } from '../../export';
function NotifikasiScreen(props) {
    const [index, setIndex] = useState(0);
    const [notifData, setnotifData] = useState([]);
    const [shimmer, setshimmer] = useState(Boolean);
    const reduxUser = useSelector(state => state.user.user)
    const dispatch = useDispatch()


    const sampleNotif = [
        {
            notificationId: "1ZX", from: 'jaja', title: "Selamat datang di Jaja.id.", invoice: "INFOJAJA.ID", text: 'Terimakasih telah berguabung dengan jaja, nikmati pengalaman berbelanja yang simpel dan mudah.', date: '2021-06-08', time: '11-23'
        },
        {
            notificationId: "2XZ", from: 'toko', title: "Pembayaranmu berhasil.", invoice: '20210611EURE', text: 'Tunggu ya, sampai penjual mengkonfrmasi.', date: '2021-06-08', time: '14-56'
        },
        {
            notificationId: "3ZX", from: 'toko', title: "Pesananmu telah di konfirmasi.", invoice: '20210611EURE', text: 'Pesanan akan diproses, maksimal pengiriman 3 hari setelah paket dikonfirmasi', date: '2021-06-08', time: '17-43'
        },
        {
            notificationId: "4XZ", from: 'toko', title: "Pesananmu telah di kirim.", invoice: '20210611EURE', text: 'Estimasi pengiriman 3 - 5 hari kerja', date: '2021-06-10', time: '08-27'
        },
        {
            notificationId: "5ZX", from: 'toko', title: "Pesananmu telah sampai.", invoice: '20210611EURE', text: 'Jangan lupa untuk memberikan penilaian seperti photo atau video.', date: '2021-06-12', time: '17-32'

        }
    ]


    const handleNotifikasi = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://jaja.id/core/seller/dashboard/notifikasi?id_toko=145", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    console.log("masuk sini 45678 ", result.data.transaksi)
                    setnotifData(result.data.transaksi)
                } else {
                    Alert.alert(
                        "Sepertinya ada masalah.",
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
                if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                    ToastAndroid("Tidak dapat hahaha, periksa kembali koneksi anda!")
                } else {
                    Alert.alert(
                        "Error",
                        String(error),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                        ]
                    );
                }

            });
    }

    useEffect(() => {
        handleNotifikasi()
        // readData()
        // setshimmer(true)
    }, [])

    const readData = async () => {
        try {
            var raw = "";
            var requestOptions = {
                method: 'POST',
                body: raw,
                redirect: 'follow'
            };
            fetch(`https://jaja.id/core/seller/dashboard/notifikasi?id_toko=145`, requestOptions)
                .then(response => response.json())
                .then(result => console.log("hapus notif"))
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error, "error line 95")
        }
    }

    const handleShow = (item) => {
        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 96 ~ handleShow ~ item", item)
    }

    return (
        <SafeAreaView style={style.container}>
            <Appbar back={true} title="Notifikasi" />
            <FlatList
                data={sampleNotif}
                keyExtractor={item => item.notificationId}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => handleShow(item)}>
                            <TouchableOpacity key={index} style={styles.card} onPress={() => handleShow(item)}>
                                <View style={[style.row_between_center, { flex: 0 }]}>
                                    <Text style={styles.textDate}>{item.invoice}</Text>
                                    <Text style={styles.textDate}>{item.date} {item.time}</Text>
                                </View>

                                <View style={styles.bodyCard}>
                                    <Text style={styles.textTitle}>{item.title}</Text>
                                    <Text style={styles.textBody}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )
                }}
            />

        </SafeAreaView>
    );
}
export default NotifikasiScreen

const styles = StyleSheet.create({
    card: {
        flex: 0,
        backgroundColor: 'white',
        marginBottom: '2%',
        flexDirection: 'column',
        paddingTop: '2%',
        paddingBottom: '5%',

    },
    bodyCard: {
        flex: 0,
        flexDirection: "column"
    },
    textTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'notoserif',
        paddingHorizontal: '3%',
        color: '#454545',
        marginBottom: '2%'

    },
    textDate: {
        color: '#454545',
        fontSize: 11,
        textAlign: 'left',
        fontWeight: 'bold',
        fontFamily: 'sans-serif-thin',
        fontStyle: 'italic',
        marginBottom: '3%',
        fontFamily: 'sans-serif-thin',
        paddingHorizontal: '3%',
        paddingVertical: '0.5%',
    },
    textBody: {
        color: 'grey',
        fontSize: 12,
        textAlign: 'left',
        fontWeight: 'bold',
        fontFamily: 'sans-serif-thin',
        paddingHorizontal: '3%',

    }
});
