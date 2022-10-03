import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, Dimensions, ToastAndroid, StatusBar, Platform } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Unpaid from '../../components/Orders/OrdersUnpaid'
import Process from '../../components/Orders/OrdersProcess'
import Sent from '../../components/Orders/OrdersSent'
import Completed from '../../components/Orders/OrdersCompleted'
import Failed from '../../components/Orders/OrdersFailed'
import Return from '../../components/Orders/OrdersComplain'

import { colors, styles, Appbar, DefaultNotFound, ServiceOrder, ServiceFirebase, useFocusEffect, AppleType } from '../../export';
const initialLayout = { width: Dimensions.get('window').width };
import { useDispatch, useSelector } from 'react-redux'
import database from "@react-native-firebase/database";
import { Login } from '../../routes/Screen';


export default function OrderScreen(props) {
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

    const [index, setIndex] = useState(props.route?.params?.index ? props.route.params.index : 0)
    const [count, setCount] = useState(0)
    const [complain, setComplain] = useState(0)
    const reduxUser = useSelector(state => state.user.user)
    const reduxnotifCount = useSelector(state => state.notification.notifCount)

    const [routes, setRoutes] = useState([
        { key: 'first', title: 'Belum dibayar', count: reduxUnpaid?.length ? reduxUnpaid?.length : 0 },
        { key: 'second', title: 'Diproses', count: reduxProcess?.length ? reduxProcess?.length : 0 + reduxWaitConfirm?.length ? reduxWaitConfirm?.length : 0 },
        { key: 'third', title: 'Dikirim', count: 0 },
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
            handleFetch2()
        }, [reduxOrder])
    );

    useFocusEffect(
        useCallback(() => {
            handleFetch()
            if (reduxnotifCount.orders) {
                // ini fungsi update jumlah notif order
                database().ref(`/people/${reduxUser.uid}/notif`).update({ orders: 0 })
            }
        }, [reduxRefresh]),
    );

    useEffect(() => {
        return () => {
            if (Platform.OS == 'ios') {
                StatusBar.setBarStyle('light-content', true)
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

            }
        }
    }

    const handleFetch2 = () => {
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
            let newRoutes = routes
            newRoutes[2].count = sentCount
            newRoutes[5].count = complainCount


            setRoutes(newRoutes)
            setComplain(complainCount)
            if (reduxRefresh) {
                dispatch({ type: 'SET_ORDER_REFRESH', payload: false })
            }

        } catch (error) {
            console.log("🚀 ~ file: OrderScreen.js ~ line 163 ~ handleFetch2 ~ error", error)
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
                            tabStyle={{ minHeight: 50, maxHeight: Platform.OS === 'ios' ? 55 : 50, flex: 0, width: AppleType === 'ipad' ? 180 : 120, borderBottomColor: colors.BlueJaja, borderRightColor: 'grey', justifyContent: 'center', alignSelf: 'center' }} // here
                            renderLabel={({ route, focused, color }) => {
                                // console.log("🚀 ~ file: OrderScreen.js ~ line 189 ~ OrderScreen ~ route", route.count)
                                return (
                                    <View style={[styles.row_center, { width: AppleType === 'ipad' ? 160 : 100, height: '100%' }]}>
                                        <View style={[styles.row_center, { width: '100%', textAlign: 'center' }]}>
                                            <Text style={[styles.font_12, { color: colors.BlackGrayScale, textAlign: 'center', alignSelf: 'center' }]}>{route.title} </Text>
                                            {route.count ?
                                                <Text style={[styles.font_10, { color: colors.BlackGrayScale, textAlign: 'center', alignSelf: 'center' }]}>({route.count > 9 ? "9+" : route.count})</Text>
                                                : null}

                                        </View>
                                    </View>
                                )
                            }}
                        />
                    )}
                />
                :
                <Login appbar={true} orderPage={true} />
                // <DefaultNotFound textHead="Ups.." textBody="sepertinya kamu belum login.." ilustration={require('../../assets/ilustrations/empty.png')} />
            }
        </SafeAreaView>
    )
}
