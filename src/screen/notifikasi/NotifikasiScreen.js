import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Alert, I18nManager, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, styles as style, colors, Wp, Hp } from '../../export';
import { Paragraph } from 'react-native-paper'
function NotifikasiScreen(props) {
    const [notifData, setnotifData] = useState([]);
    const [shimmer, setshimmer] = useState(Boolean);
    const reduxUser = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    const handleNotifikasi = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        console.log("file: NotifikasiScreen.js ~ line 20 ~ handleNotifikasi ~ reduxUser.id", reduxUser.id)
        fetch(`https://jaja.id/backend/notifikasi/${reduxUser ? reduxUser.id : ''}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    setnotifData(result.data.notifikasi)
                } else {
                    Alert.alert(
                        "Error with status code : 15001",
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
        if (reduxUser && Object.keys(reduxUser).length) {
            handleNotifikasi()
        }
        // readData()
        // setshimmer(true)
    }, [reduxUser])

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
            {notifData && notifData.length ?
                <FlatList
                    data={notifData}
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
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White }}>
                    <Image
                        style={styles.iconMarket}
                        source={require('../../assets/ilustrations/empty.png')}
                    />
                    <Paragraph style={styles.textJajakan}>Ups..<Text style={styles.textCenter}> sepertinya belum ada informasi untukmu.</Text></Paragraph>
                </View>
            }
        </SafeAreaView >
    );
}
export default NotifikasiScreen

const styles = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.BlueJaja, fontFamily: 'notoserif', marginVertical: Hp('2%') },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
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
