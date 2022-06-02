import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, Dimensions, ToastAndroid, StatusBar, Platform } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Unpaid from '../../components/Orders/OrdersUnpaid'
import Process from '../../components/Orders/OrdersProcess'
import Sent from '../../components/Orders/OrdersSent'
import Completed from '../../components/Orders/OrdersCompleted'
import Failed from '../../components/Orders/OrdersFailed'
import Return from '../../components/Orders/OrdersComplain'

import { colors, styles, Appbar, DefaultNotFound, ServiceOrder, ServiceFirebase, useFocusEffect } from '../../export';
const initialLayout = { width: Dimensions.get('window').width };
import { useDispatch, useSelector } from 'react-redux'
import LoginOrderScreen from '../login/LoginOrderScreen';
import database from "@react-native-firebase/database";

export default function OrderScreen() {
    const dispatch = useDispatch()

    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxSent = useSelector(state => state.order.sent)
    const reduxProcess = useSelector(state => state.order.process)

    const reduxOrder = useSelector(state => state.order.filter)
    const reduxRefresh = useSelector(state => state.order.refresh)
    const reduxCompleted = useSelector(state => state.order.completed)
    const reduxUnpaid = useSelector(state => state.order.unPaid)
    const reduxFailed = useSelector(state => state.order.failed)
    const reduxWaitConfirm = useSelector(state => state.order.waitConfirm)

    const [index, setIndex] = useState(0)
    const [count, setCount] = useState(0)
    const [complain, setComplain] = useState(0)
    const [sent, setSent] = useState(0)
    const reduxUser = useSelector(state => state.user.user)
    const reduxnotifCount = useSelector(state => state.notification.notifCount)

    const [navigate, setNavigate] = useState("Pesanan")

    const [routes] = useState([
        { key: 'first', title: 'Belum dibayar', count: reduxUnpaid?.length ? reduxUnpaid?.length : 0 },
        { key: 'second', title: 'Diproses', count: reduxProcess?.length ? reduxProcess?.length : 0 + reduxWaitConfirm?.length ? reduxWaitConfirm?.length : 0 },
        { key: 'third', title: 'Dikirim', count: sent },
        { key: 'fourth', title: 'Selesai', count: reduxCompleted?.length ? reduxCompleted?.length : 0 },
        { key: 'fifth', title: 'Dibatalkan', count: reduxFailed?.length ? reduxFailed?.length : 0 },
        { key: 'sixth', title: 'Pengembalian', count: complain },
    ]);

    const renderScene = SceneMap({
        first: Unpaid,
        second: Process,
        third: Sent,
        fourth: Completed,
        fifth: Failed,
        sixth: Return,
    });

    useFocusEffect(
        useCallback(() => {
            return () => {
                try {
                    setCount(count + 1)
                    let sentCount = 0;
                    let complainCount = 0;
                    if (reduxSent?.length) {
                        reduxSent.map(item => {
                            if (item.complain) {
                                complainCount += 1
                            } else {
                                sentCount += 1

                            }
                        })
                    }
                    setComplain(complainCount)
                    setSent(sentCount)
                    if (reduxRefresh) {
                        dispatch({ type: 'SET_ORDER_REFRESH', payload: false })
                    }

                } catch (error) {
                    console.log("🚀 ~ file: OrderScreen.js ~ line 82 ~ useEffect ~ error", error)
                }
            }
        }, [reduxOrder, reduxRefresh, reduxUnpaid, reduxWaitConfirm])
    );

    useFocusEffect(
        useCallback(() => {
            handleFetch()
        }, [reduxRefresh]),
    );

    useEffect(() => {
        return () => {
            if (Platform.OS == 'ios') {
                StatusBar.setBarStyle('light-content', true);	//<<--- add this
                StatusBar.setBackgroundColor(colors.BlueJaja, true)
            }
        }
    }, [reduxUser])


    const handleFetch = () => {
        try {

        } catch (error) {
            if (reduxAuth || reduxRefresh) {
                dispatch({ type: 'SET_ORDER_REFRESH', payload: false })

                ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
                    if (resUnpaid) {
                        dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                        dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
                    if (reswaitConfirm) {
                        dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                ServiceOrder.getProcess(reduxAuth).then(resProcess => {
                    if (resProcess) {
                        dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                ServiceOrder.getSent(reduxAuth).then(resSent => {
                    if (resSent) {
                        dispatch({ type: 'SET_SENT', payload: resSent.items })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                ServiceOrder.getCompleted(reduxAuth).then(resCompleted => {
                    if (resCompleted) {
                        dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                ServiceOrder.getFailed(reduxAuth).then(resFailed => {
                    if (resFailed) {
                        dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                    }
                }).catch(err => {
                    // ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
                })
                // console.log("🚀 ~ file: OrderScreen.js ~ line 127 ~ useEffect ~ reduxUser.orders", reduxUser)
                if (reduxnotifCount.orders) {
                    let homeCount = reduxnotifCount.home - reduxnotifCount.orders
                    database().ref(`/people/${reduxUser.uid}/notif`).update({ home: homeCount && homeCount > 0 ? homeCount : 0, orders: 0 })
                }
            }
        }
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
            <Appbar title="Pesanan" trolley={true} notif={true} />
            {reduxAuth ?
                <TabView
                    style={{ backgroundColor: colors.WhiteBack }}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={(s) => {
                        setIndex(s)

                        // if (reduxnotifCount.orders) {
                        //     SE
                        //     database().ref(`/people/${reduxUser.uid}/`).set({ notif: { home: reduxnotifCount.home, chat: reduxnotifCount.chat, orders: 0 } })
                        // }
                    }}
                    initialLayout={initialLayout}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            pressColor={colors.BlueJaja}
                            indicatorStyle={{ backgroundColor: colors.YellowJaja }}
                            bounces={true}
                            scrollEnabled={true}
                            style={{ backgroundColor: colors.White }}
                            tabStyle={{ minHeight: 50, flex: 0, width: 120, borderBottomColor: colors.BlueJaja, borderRightColor: 'grey', justifyContent: 'center', alignSelf: 'center' }} // here
                            renderLabel={({ route, focused, color }) => {
                                return (
                                    <View style={[styles.row_center, { width: 100, height: '100%' }]}>
                                        <View style={[styles.row_center, { width: '100%', textAlign: 'center' }]}>
                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 12, textAlign: 'center', alignSelf: 'center' }}>{route.title} </Text>
                                            {route.count ?
                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>({route.count > 9 ? "9+" : route.count})</Text>
                                                : null}

                                        </View>
                                    </View>
                                )
                            }}
                        />
                    )}
                />
                :
                <LoginOrderScreen />
                // <DefaultNotFound textHead="Ups.." textBody="sepertinya kamu belum login.." ilustration={require('../../assets/ilustrations/empty.png')} />
            }
        </SafeAreaView>
    )
}


