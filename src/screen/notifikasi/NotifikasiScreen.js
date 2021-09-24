import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, styles as style, colors, Wp, Hp, Utils, DefaultNotFound } from '../../export';
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
                Utils.handleError(error, 'Error with status code : 15002')
            });
    }

    useEffect(() => {
        if (reduxUser && Object.keys(reduxUser).length) {
            handleNotifikasi()
        }
        readData()
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
                    // inverted={-1}
                    keyExtractor={item => item.notificationId}
                    renderItem={({ item, index }) => {
                        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 80 ~ NotifikasiScreen ~ item", item)
                        return (
                            <TouchableOpacity onPress={() => handleShow(item)}>
                                <TouchableOpacity key={index} style={styles.card} onPress={() => handleShow(item)}>
                                    <View style={[style.row_between_center, { flex: 0 }]}>
                                        <Text style={styles.textDate}>{item.invoice}</Text>
                                        <Text style={styles.textDate}>{String(item.created_date).slice(0, 16)} {item.time}</Text>
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
                : <DefaultNotFound textHead="Ups.." textBody="Tampaknya belum ada informasi untukmu.." ilustration={require('../../assets/ilustrations/empty.png')} />

            }
        </SafeAreaView >
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
        fontFamily: 'Poppins-SemiBold',
        paddingHorizontal: '3%',
        color: colors.BlueJaja,
        marginBottom: '2%'

    },
    textDate: {
        color: '#454545',
        fontSize: 11,
        textAlign: 'left',
        fontFamily: 'Poppins-Italic',
        fontStyle: 'italic',
        marginBottom: '3%',
        paddingHorizontal: '3%',
        paddingVertical: '0.5%',
    },
    textBody: {
        color: 'grey',
        fontSize: 12,
        textAlign: 'left',
        fontFamily: 'Poppins-SemiBold',
        paddingHorizontal: '3%',

    }
});
