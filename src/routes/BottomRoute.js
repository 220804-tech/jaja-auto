import React, { useEffect, useState } from 'react'
import { View, Text, Image, Alert, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Feed, Orders, ListChat, Profile } from './Screen'
import { styles as style } from '../assets/styles/styles'
import colors from '../assets/colors';
import Language from '../utils/Language';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { Hp, ServiceOrder, Utils } from '../export';
import EncryptedStorage from 'react-native-encrypted-storage';
// import { Language } from '../utils/language/Language' 

const Tab = createBottomTabNavigator();
export default function BottomRoute() {
    const uid = useSelector(state => state.user?.user?.uid)
    const location = useSelector(state => state.user.user.location)
    const reduxnotifCount = useSelector(state => state.notification.notifCount)
    // console.log("🚀 ~ file: BottomRoute.js ~ line 21 ~ BottomRoute ~ reduxnotifCount", reduxnotifCount)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxUserNotif = useSelector(state => state.user.badges)
    const dispatch = useDispatch()

    useEffect(() => {
        handleWillMount()
        // return () => database().ref(`/people/${uid}`).off('value', onValueChange);
    }, [])

    const handleWillMount = () => {
        try {
            if (uid && reduxAuth) {
                database()
                    .ref('/people/' + uid)
                    .on('value', snapshot => {
                        let result = snapshot.val()
                        if (result && result.notif) {
                            database().ref("/friend/" + uid).on("value", function (snapshot) {
                                let arrayFriend = [];
                                snapshot.forEach(function (snap) {
                                    var item = snap.val();
                                    item.id = snap.key;
                                    if (item.id != uid && item.id != "null") {
                                        arrayFriend.push(item)
                                    }
                                });
                                let countChat = 0
                                arrayFriend.map(item => {
                                    if (item.amount) {
                                        let number = Utils.regex('number', item.amount)
                                        countChat += number
                                    }

                                })
                                result.notif.chat = countChat

                                // dispatch ini setstate global jumlah notif
                                dispatch({ type: 'SET_NOTIF_COUNT', payload: result.notif })

                                // dibawah ini set ulang jumlah notif di chat berdasar jumlah dari table friend dan jumlah notif per friend listchat
                                database().ref(`/people/${uid}/notif`).update({ chat: countChat })
                            });
                        }
                        if (result && result.notif && result.notif.orders != reduxnotifCount.orders) {
                            getOrders()
                        }
                    });
            } else {
                dispatch({ type: 'SET_NOTIF_COUNT', payload: { home: 0, chat: 0, orders: 0 } })
            }
        } catch (error) {
            console.log(error.message)

        }
    }
    const getOrders = () => {
        if (reduxAuth) {
            ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
                if (resUnpaid) {
                    dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                    dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                    dispatch({ type: 'SET_ORDER_REFRESH', payload: true })

                } else {
                    handleUnpaid()
                }
            })
            ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
                if (reswaitConfirm) {
                    dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                } else {
                    handleWaitConfirm()
                }
            })
            ServiceOrder.getProcess(reduxAuth).then(resProcess => {
                if (resProcess) {
                    dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                } else {
                    handleProcess()
                }
            })
            ServiceOrder.getSent(reduxAuth).then(resSent => {
                if (resSent) {
                    dispatch({ type: 'SET_SENT', payload: resSent.items })
                } else {
                    handleSent()
                }
            })
            ServiceOrder.getCompleted(reduxAuth).then(resCompleted => {
                if (resCompleted) {
                    dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                } else {
                    handleCompleted()
                }
            })
            ServiceOrder.getFailed(reduxAuth).then(resFailed => {
                if (resFailed) {
                    dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                } else {
                    handleFailed()
                }
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
                height: Platform.OS === 'android' ? Hp('7.5%') : Hp('9%')
            },
        }}>
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Home")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={[style.column, style.mx]}>
                                <FAIcon name="rocket" size={size} color={focused ? colors.BlueJaja : colors.Silver} style={{ marginBottom: '-2%' }} />
                                {/* {parseInt(reduxUserNotif.totalNotifUnread) ?
                                    <View style={style.countNotif}><Text style={[style.textNotif, { marginBottom: '-1%' }]}>{parseInt(reduxUserNotif.totalNotifUnread) > 99 ? "99+" : parseInt(reduxUserNotif.totalNotifUnread)}</Text></View> : null
                                } */}
                            </View>
                        )
                    }
                }}
            // options={{s
            //     tabBarLabel: ({ size, focused }) => (
            //         <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Beranda")}</Text>
            //     ),

            //     tabBarIcon: ({ size, focused }) => (
            //         <View style={style.column}>
            //             <FAIcon name="rocket" size={size} color={focused ? colors.BlueJaja : colors.Silver} style={{ marginBottom: '-2%' }} />
            //         </View>
            //     )
            // }}
            />
            <Tab.Screen name="Feed" component={Feed}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Feed")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={[style.column, style.mx]}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.BlueJaja : colors.Silver, marginBottom: '-2%' }} source={require(`../assets/icons/invoice.png`)} />
                            </View>
                        )
                    }
                }}
            />
            <Tab.Screen name="Chat" component={ListChat}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Chat")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={[style.column, style.mx]}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.BlueJaja : colors.Silver, marginBottom: '-2%' }} source={require(`../assets/icons/chat.png`)} />
                                {reduxnotifCount && parseInt(reduxnotifCount.chat) ?
                                    <View style={style.countNotif}><Text style={[style.textNotif]}>{parseInt(reduxnotifCount.chat) > 99 ? "99+" : reduxnotifCount.chat}</Text></View> : null
                                    // <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(reduxnotifCount.chat) > 99 ? "99+" : reduxnotifCount.chat}</Text></View> : null

                                }
                            </View>
                        )
                    }
                }}
            />
            {/* {reduxAuth ? */}
            <Tab.Screen name="Pesanan" component={Orders}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Pesanan")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View style={style.column}>
                            <Image style={{ width: size, height: size, tintColor: focused ? colors.BlueJaja : colors.Silver, marginBottom: '-2%' }} source={require(`../assets/icons/traffic-blue.png`)} />
                            {reduxnotifCount && parseInt(reduxnotifCount.orders) ?
                                <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(reduxnotifCount.orders) > 99 ? "99+" : reduxnotifCount.orders}</Text></View> : null
                            }
                        </View>
                    )
                }}
            />
            {/* : null} */}
            <Tab.Screen name="Akun" component={Profile}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.Silver, marginBottom: '3%' }}>{Language("Akun")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={[style.column, style.mx]}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.BlueJaja : colors.Silver, marginBottom: '-2%' }} source={require(`../assets/icons/user-active.png`)} />
                                {/* {location && location.length ? null :\ */}
                                {/* <View style={style.countNotif}><Text style={style.textNotif}>1</Text></View> */}
                                {/* } */}
                            </View>
                        )
                    }
                }}
            />
        </Tab.Navigator>
    );
}
