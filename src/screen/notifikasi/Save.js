import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Alert, Touchable } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, styles as style, colors, Wp, Hp, Utils, DefaultNotFound, useNavigation } from '../../export';
function NotifikasiScreen(props) {
    const [arrOrders, setarrOrder] = useState([]);
    const [arrChats, setarrChat] = useState([]);
    const [arrEvents, setarrEvent] = useState([]);
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
                console.log("🚀 ~ file: NotifikasiScreen.js ~ line 27 ~ handleNotifikasi ~ result", result)
                try {
                    let data = JSON.parse(result)
                    if (data.status.code === 200 || data.status.code === 204) {
                        let arrChat = []
                        let arrOrder = []
                        let arrEvent = []
                        let arrCoin = []

                        if (data.data.notifikasi && data.data.notifikasi.length) {
                            data.data.notifikasi.map(item => {
                                if (item.tipe_notif === 'transaksi') {
                                    arrOrder.push(item)
                                } else if (item.tipe_notif === 'chat') {
                                    arrChat.push(item)
                                } else if (item.tipe_notif === 'event') {
                                    arrEvent.push(item)
                                } else if (item.tipe_notif === 'koin') {
                                    arrCoin.push(item)
                                }
                            })
                        }
                        setnotifData([arrOrder, arrChats, arrCoin, arrEvent])
                    } else {
                        Utils.alertPopUp('Error ', result)
                        return null
                    }
                    return data
                } catch (error) {
                    Utils.alertPopUp(String(error) + '\n' + 'Error with status code : 121672')
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
                    alert(error + ' : 12310\n\n ', result)
                }
            })
            .catch(error => {
                // Utils.handleError(error, 'Error with status code : 12002')
            });
    }

    const handleOrderDetails = (item) => {
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
                    keyExtractor={(item, index) => index + 'JH'}
                    renderItem={({ item, index }) => {
                        console.log("🚀 ~ file: NotifikasiScreen.js ~ line 144 ~ NotifikasiScreen ~ item", item)
                        if (item && item.length) {

                            return (
                                <View style={[style.column, style.pt_2, { backgroundColor: colors.White }]}>
                                    <Text style={[styles.textTitle, { color: colors.BlackGrayScale }]}>{String(item[0].tipe_notif).slice(0, 1).toUpperCase() + String(item[0].tipe_notif).slice(1, String(item[0].tipe_notif).length)}</Text>

                                    <TouchableRipple key={index} style={[styles.card, { backgroundColor: item[0].read == 'T' ? colors.BlueLight : colors.White, }]} onPress={() => handleRead(item[0])}>
                                        <>
                                            {/* <View style={[style.row_between_center, { flex: 0 }]}>
                                                <Text style={styles.textDate}>{item[0].invoice}</Text>
                                                <Text style={styles.textDate}>{String(item[0].created_date).slice(0, 16)} {item[0].time}</Text>
                                            </View> */}
                                            <View style={styles.bodyCard}>
                                                {/* <Text style={styles.textTitle}>{item[0].title}</Text> */}
                                                <Text style={styles.textBody}>{item[0].text}</Text>
                                            </View>
                                        </>
                                    </TouchableRipple>
                                </View>
                            )
                        }
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
        paddingBottom: '5%',

    },
    bodyCard: {
        flex: 0,
        flexDirection: "column"
    },
    textTitle: {
        fontSize: 13,
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
        fontFamily: 'SignikaNegative-Medium',
        paddingHorizontal: '3%',

    }
});
