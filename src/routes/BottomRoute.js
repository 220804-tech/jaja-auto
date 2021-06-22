import React, { useEffect, useState } from 'react'
import { View, Text, Image, Alert } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Feed, Orders, ListChat, Profile } from './Screen'
import { styles as style } from '../assets/styles/styles'
import colors from '../assets/colors';
import Language from '../utils/language/Language';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { Hp, ServiceOrder } from '../export';
import EncryptedStorage from 'react-native-encrypted-storage';
// import { Language } from '../utils/language/Language' 
const Tab = createBottomTabNavigator();
export default function BottomRoute() {
    const [notif, setNotif] = useState("")
    const uid = useSelector(state => state.user.user.uid)
    const location = useSelector(state => state.user.user.location)
    const reduxnotifCount = useSelector(state => state.notification.notifCount)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        try {
            if (uid) {
                database()
                    .ref('/people/' + uid)
                    .on('value', snapshot => {
                        let result = snapshot.val()
                        console.log("file: BottomRoute.js ~ line 26 ~ local", reduxnotifCount.orders)
                        if (result && result.notif) {
                            dispatch({ type: 'SET_NOTIF_COUNT', payload: result.notif })
                            setNotif(result.notif)
                        }
                        if (result && result.notif && result.notif.orders != reduxnotifCount.orders) {
                            console.log("cokk update")
                            getOrders()
                        }
                    });
            }
        } catch (error) {

        }
        // return () => database().ref(`/people/${uid}`).off('value', onValueChange);
    }, [])

    const getOrders = () => {
        if (reduxAuth) {
            ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
                if (resUnpaid) {
                    dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                    dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                } else {
                    handleUnpaid()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12003",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
                handleUnpaid()
            })

            ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
                if (reswaitConfirm) {
                    dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                } else {
                    handleWaitConfirm()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12004",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
                handleWaitConfirm()
            })

            ServiceOrder.getProcess(reduxAuth).then(resProcess => {
                if (resProcess) {
                    console.log("file: BottomRoute.js ~ line 90 ~ ServiceOrder.getProcess ~ resProcess", resProcess.items)
                    dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                } else {
                    handleProcess()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12005",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );

                } handleProcess()
            })

            ServiceOrder.getSent(reduxAuth).then(resSent => {
                if (resSent) {
                    dispatch({ type: 'SET_SENT', payload: resSent.items })
                } else {
                    handleSent()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12006",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );

                } handleSent()
            })

            ServiceOrder.getCompleted(reduxAuth).then(resCompleted => {
                if (resCompleted) {
                    dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                } else {
                    handleCompleted()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12007",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );

                }
                handleCompleted()
            })

            ServiceOrder.getFailed(reduxAuth).then(resFailed => {
                if (resFailed) {
                    dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                } else {
                    handleFailed()
                }
            }).catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12008",
                        `${JSON.stringify(error)}`,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );

                }
                handleFailed()
            })
        }
    }
    const handleUnpaid = () => {
        EncryptedStorage.getItem('unpaid').then(store => {
            if (store) {
                dispatch({ type: 'SET_UNPAID', payload: JSON.parse(store) })
            }
        })
    }
    const handleWaitConfirm = () => {
        EncryptedStorage.getItem('waitConfirm').then(store => {
            if (store) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: JSON.parse(store) })
            }
        })
    }
    const handleProcess = () => {
        EncryptedStorage.getItem('process').then(store => {
            if (store) {
                dispatch({ type: 'SET_PROCESS', payload: JSON.parse(store) })
            }
        })
    }
    const handleSent = () => {
        EncryptedStorage.getItem('sent').then(store => {
            if (store) {
                dispatch({ type: 'SET_SENT', payload: JSON.parse(store) })
            }
        })
    }
    const handleCompleted = () => {
        EncryptedStorage.getItem('completed').then(store => {
            if (store) {
                dispatch({ type: 'SET_COMPLETED', payload: JSON.parse(store) })
            }
        })
    }
    const handleFailed = () => {
        EncryptedStorage.getItem('failed').then(store => {
            if (store) {
                dispatch({ type: 'SET_FAILED', payload: JSON.parse(store) })
            }
        })
    }

    return (
        <Tab.Navigator backBehavior='firstRoute' screenOptions={{
            headerShown: false, tabBarStyle: {
                height: Hp('7.5%')
            },
        }}>
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Home")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={style.column}>
                                <FAIcon name="rocket" size={size} color={focused ? colors.YellowJaja : colors.BlueJaja} style={{ marginBottom: '-2%' }} />
                                {reduxnotifCount && reduxnotifCount.home ?
                                    <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(reduxnotifCount.home) > 99 ? "99+" : reduxnotifCount.home}</Text></View> : null
                                }
                            </View>
                        )
                    }
                }}
            // options={{
            //     tabBarLabel: ({ size, focused }) => (
            //         <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Beranda")}</Text>
            //     ),

            //     tabBarIcon: ({ size, focused }) => (
            //         <View style={style.column}>
            //             <FAIcon name="rocket" size={size} color={focused ? colors.YellowJaja : colors.BlueJaja} style={{ marginBottom: '-2%' }} />
            //         </View>
            //     )
            // }}
            />
            {/* <Tab.Screen name="Feed" component={Feed}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: size, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Feed")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="stack-exchange" size={size} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View>
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name="Chat" component={ListChat}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Chat")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={style.column}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/chat.png`)} />
                                {reduxnotifCount && reduxnotifCount.chat ?
                                    <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(reduxnotifCount.chat) > 99 ? "99+" : reduxnotifCount.chat}</Text></View> : null
                                }
                            </View>
                        )
                    }
                }}
            />
            {reduxAuth ?
                <Tab.Screen name="Pesanan" component={Orders}
                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Pesanan")}</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => (
                            <View style={style.column}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/traffic-blue.png`)} />
                                {reduxnotifCount && reduxnotifCount.orders ?
                                    <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(reduxnotifCount.orders) > 99 ? "99+" : reduxnotifCount.orders}</Text></View> : null
                                }
                            </View>
                        )
                    }}
                /> : null}
            <Tab.Screen name="Akun" component={Profile}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Akun")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={style.column}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/user-active.png`)} />
                                {location && location.length ? null : <View style={style.countNotif}><Text style={style.textNotif}>1</Text></View>}
                            </View>
                        )
                    }
                }}
            />
        </Tab.Navigator>
    );
}
