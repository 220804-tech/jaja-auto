import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Alert, Touchable } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, styles as style, colors, Wp, Hp, Utils, DefaultNotFound, useNavigation } from '../../export';
function NotifikasiScreen(props) {
    const [notifData, setnotifData] = useState([]);
    const [shimmer, setshimmer] = useState(Boolean);
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const handleNotifikasi = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://jaja.id/backend/notifikasi/${reduxUser ? reduxUser.id : ''}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let data = JSON.parse(result)
                    if (data.status.code === 200 || data.status.code === 204) {
                        setnotifData(data.data.notifikasi)
                    } else {
                        Alert.alert(
                            "Error with status code : 15001",
                            String(data.status.message) + " => " + String(data.status.code),
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
                    return data
                } catch (error) {
                    Utils.alertPopUp(String(error) + '\n' + 'Error with status code : 13113')
                    console.log(error.message)

                }
            })
            .catch(error => {
                Utils.handleError(error.message, 'Error with status code : 15002')
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
            fetch(`https://jsonx.jaja.id/core/seller/dashboard/notifikasi?id_toko=145`, requestOptions)
                .then(response => response.json())
                .then(result => console.log("hapus notif"))
                .catch(error => console.log('error', error.message));
        } catch (error) {
            console.log(error.message, "error line 95")
        }
    }

    const handleRead = (item) => {
        handleOrderDetails(item)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=7vgloal55kn733tsqch0v7lh1tfrcilq");


        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/notifikasi/updateNotif?id_notif=${item.id_notif}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let data = JSON.parse(result)
                    if (data.status.code === 200) {
                        handleNotifikasi()
                    } else {

                    }
                    return data
                } catch (error) {
                    // alert(m.nativeEvent.data);
                    console.log(error.message)

                }
            })
            .catch(error => {
                // Utils.handleError(error, 'Error with status code : 12002')
                console.log(error.message)

            });
    }

    const handleOrderDetails = (item) => {
        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 110 ~ handleOrderDetails ~ item", item.order_id)
        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 110 ~ handleOrderDetails ~ item", item.invoice)

        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_ORDER_STATUS', payload: null })

        navigation.navigate('OrderDetails')
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
                        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 144 ~ NotifikasiScreen ~ item", item)

                        return (
                            <TouchableRipple key={index} style={[styles.card, { backgroundColor: item.read == 'T' ? colors.BlueLight : colors.White, }]} onPress={() => handleRead(item)}>
                                <>
                                    <View style={[style.row_between_center, { flex: 0 }]}>
                                        <Text style={styles.textDate}>{item.invoice}</Text>
                                        <Text style={styles.textDate}>{String(item.created_date).slice(0, 16)} {item.time}</Text>
                                    </View>
                                    <View style={styles.bodyCard}>
                                        <Text style={styles.textTitle}>{item.title}</Text>
                                        <Text style={styles.textBody}>{item.text}</Text>
                                    </View>
                                </>
                            </TouchableRipple>
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
        fontFamily: 'SignikaNegative-SemiBold',
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
        fontFamily: 'SignikaNegative-SemiBold',
        paddingHorizontal: '3%',

    }
});
