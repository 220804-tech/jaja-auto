import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Unpaid from '../../components/Orders/OrdersUnpaid'
import Process from '../../components/Orders/OrdersProcess'
import Sent from '../../components/Orders/OrdersSent'
import Completed from '../../components/Orders/OrdersCompleted'
import Failed from '../../components/Orders/OrdersFailed'
import Return from '../../components/Orders/OrdersComplain'

import { colors, styles, Appbar } from '../../export';
const initialLayout = { width: Dimensions.get('window').width };
import { useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';

export default function OrderScreen() {
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxSent = useSelector(state => state.order.sent)

    const reduxOrder = useSelector(state => state.order.filter)
    const [index, setIndex] = useState(0)
    const [count, setCount] = useState(0)
    const [complain, setComplain] = useState(0)
    const [sent, setSent] = useState(0)

    const [navigate, setNavigate] = useState("Pesanan")

    const [routes] = useState([
        { key: 'first', title: 'Belum dibayar' },
        { key: 'second', title: 'Diproses' },
        { key: 'third', title: 'Dikirim' },
        { key: 'fourth', title: 'Selesai' },
        { key: 'fifth', title: 'Dibatalkan' },
        { key: 'sixth', title: 'Pengembalian' },
    ]);

    const renderScene = SceneMap({
        first: Unpaid,
        second: Process,
        third: Sent,
        fourth: Completed,
        fifth: Failed,
        sixth: Return,
    });

    useEffect(() => {
        console.log("🚀 ~ file: OrderScreen.js ~ line 49 ~ useEffect ~ reduxOrder[3]", reduxOrder[3])
        setCount(count + 1)
        let sentCount = 0;
        let complainCount = 0;
        if (reduxSent && reduxSent.length) {
            reduxSent.map(item => {
                if (item.complain) {
                    complainCount += 1
                } else {
                    sentCount += 1

                }
            })
        }
        setComplain(complainCount)
        console.log("🚀 ~ file: OrderScreen.js ~ line 62 ~ useEffect ~ complainCount", complainCount)
        setSent(sentCount)
        console.log("🚀 ~ file: OrderScreen.js ~ line 64 ~ useEffect ~ sentCount", sentCount)
    }, [reduxOrder])

    return (
        <SafeAreaView style={styles.container}>
            <Appbar title="Pesanan" trolley={true} notif={true} />
            <TabView
                indicatorStyle={{ backgroundColor: 'white' }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                        bounces={true}
                        scrollEnabled={true}
                        style={{ backgroundColor: colors.White }}
                        tabStyle={{ minHeight: 50, flex: 0, width: 120, borderBottomColor: colors.BlueJaja, borderRightColor: 'grey', justifyContent: 'center', alignSelf: 'center' }} // here
                        renderLabel={({ route, focused, color }) => {
                            return (
                                <View style={[styles.row_center, { width: 100, height: '100%' }]}>
                                    {reduxOrder && reduxOrder.length ?
                                        <View style={[styles.row_center, { width: '100%', textAlign: 'center' }]}>
                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 12, textAlign: 'center', alignSelf: 'center' }}>{route.title} </Text>
                                            {route.title === "Belum dibayar" && Object.keys(reduxOrder[0]).length && reduxOrder[0].total ?
                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>({reduxOrder[0].total > 9 ? "9+" : reduxOrder[0].total})</Text>
                                                : route.title === "Diproses" && Object.keys(reduxOrder[1]).length && Object.keys(reduxOrder[0]).length && reduxOrder[1].total || reduxOrder[2].total ?
                                                    <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[1].total + reduxOrder[2].total > 9 ? "9+" : reduxOrder[1].total + reduxOrder[2].total})</Text>
                                                    : route.title === "Dikirim" && sent ?
                                                        <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({sent > 9 ? "9+" : sent})</Text>
                                                        : route.title == "Selesai" && Object.keys(reduxOrder[4]).length && reduxOrder[4].total ?
                                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[4].total > 9 ? "9+" : reduxOrder[4].total})</Text>
                                                            : route.title === "Dibatalkan" && Object.keys(reduxOrder[5]).length && reduxOrder[5].total ?
                                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[5].total > 9 ? "9+" : reduxOrder[5].total})</Text>
                                                                : route.title === "Pengembalian" && complain ?
                                                                    <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({complain > 9 ? "9+" : complain})</Text>
                                                                    : null
                                            }
                                        </View>
                                        :
                                        <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: '80%', textAlign: 'center' }}>{route.title}</Text>
                                    }
                                </View>
                            )
                        }}
                    />
                )}
            />
        </SafeAreaView>
    )
}


