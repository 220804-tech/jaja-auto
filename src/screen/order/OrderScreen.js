import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Unpaid from '../../components/Orders/OrdersUnpaid'
import Process from '../../components/Orders/OrdersProcess'
import Sent from '../../components/Orders/OrdersSent'
import Completed from '../../components/Orders/OrdersCompleted'
import Failed from '../../components/Orders/OrdersFailed'
import { colors, styles, Appbar, useNavigation } from '../../export';
const initialLayout = { width: Dimensions.get('window').width };
import { useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import AuthLogin from '../login/LoginScreen'

export default function OrderScreen() {
    const navigation = useNavigation();
    const reduxAuth = useSelector(state => state.auth.auth)

    const reduxOrder = useSelector(state => state.order.filter)
    const [auth, setAuth] = useState('')
    const [index, setIndex] = useState(0)

    const [navigate, setNavigate] = useState("Pesanan")

    const [routes] = useState([
        { key: 'first', title: 'Belum dibayar' },
        // { key: 'sixth', title: 'Menunggu Konfirmasi' },
        { key: 'second', title: 'Diproses' },
        { key: 'third', title: 'Dikirim' },
        { key: 'fourth', title: 'Selesai' },
        { key: 'fifth', title: 'Dibatalkan' },
    ]);

    const renderScene = SceneMap({
        first: Unpaid,
        second: Process,
        third: Sent,
        fourth: Completed,
        fifth: Failed,
        // sixth: Failed,
    });

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            console.log("🚀 ~ file: OrderScreen.js ~ line 44 ~ EncryptedStorage.getItem ~ res", res)
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
        console.log("🚀 ~ file: OrderScreen.js ~ line 107 ~ OrderScreen ~ reduxAuth", reduxAuth)

    }, [])

    return (
        <>
            {reduxAuth || auth ?
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
                                style={{ backgroundColor: colors.White, paddingLeft: '2%' }}
                                tabStyle={{ minHeight: 50, flex: 0, width: 120, borderBottomColor: colors.BlueJaja, borderRightColor: 'grey' }} // here
                                renderLabel={({ route, focused, color }) => {
                                    console.log("🚀 ~ file: OrderScreen.js ~ line 74 ~ OrderScreen ~ route", reduxOrder[0])
                                    return (
                                        <>
                                            {reduxAuth && reduxOrder && reduxOrder.lenght ?
                                                <View style={[styles.row_center, { width: '100%' }]}>
                                                    <Text style={{ color: colors.BlackGrayScale, fontSize: 12, textAlign: 'center', alignSelf: 'center' }}>{route.title} </Text>
                                                    {route.title === "Belum dibayar" && Object.keys(reduxOrder[0].lenght) && reduxOrder[0].total ?
                                                        <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>({reduxOrder[0].total > 9 ? "9+" : reduxOrder[0].total})</Text>
                                                        : route.title === "Diproses" && Object.keys(reduxOrder[1].lenght) && Object.keys(reduxOrder[0].lenght) && reduxOrder[1].total || reduxOrder[2].total ?
                                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[1].total + reduxOrder[2].total > 9 ? "9+" : reduxOrder[1].total + reduxOrder[2].total})</Text>
                                                            : route.title === "Dikirim" && Object.keys(reduxOrder[3].lenght) && reduxOrder[3].total ?
                                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[3].total > 9 ? "9+" : reduxOrder[3].total})</Text>
                                                                : route.title == "Selesai" && Object.keys(reduxOrder[4].lenght) && reduxOrder[4].total ?
                                                                    <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[4].total > 9 ? "9+" : reduxOrder[4].total})</Text>
                                                                    : route.title === "Dibatalkan" && Object.keys(reduxOrder[5].lenght) && reduxOrder[5].total ?
                                                                        <Text style={{ color: colors.BlackGrayScale, fontSize: 10, textAlign: 'center', alignSelf: 'center' }}> ({reduxOrder[5].total > 9 ? "9+" : reduxOrder[5].total})</Text>
                                                                        : null
                                                    }
                                                </View>
                                                :
                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: '80%', textAlign: 'center' }}>{route.title}</Text>}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </SafeAreaView>
                :
                <AuthLogin navigate={navigate ? navigate : null} />

            }
        </>
    )
}


