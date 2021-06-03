import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Unpaid from '../../components/Orders/OrdersUnpaid'
import Process from '../../components/Orders/OrdersProcess'
import WaitConfirm from '../../components/Orders/OrdersWaitConfim'
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
    const reduxAuth = useSelector(state => state.auth)

    const reduxOrder = useSelector(state => state.order.filter)
    const [index, setIndex] = useState(0)
    const [auth, setAuth] = useState('')
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
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
    }, [])

    return (
        <>
            {!reduxAuth.auth ?
                <AuthLogin navigate={navigate ? navigate : null} />
                :
                <SafeAreaView style={styles.container}>
                    <Appbar title="Pesanan" />
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
                                tabStyle={{ minHeight: 50, flex: 0, width: 100, borderBottomColor: colors.BlueJaja, borderRightColor: 'grey' }} // here
                                renderLabel={({ route, focused, color }) => {
                                    return (
                                        <>
                                            {reduxAuth.auth && reduxOrder.lenght !== 0 ?
                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 12, width: 100, textAlign: 'center' }}> {route.title}
                                                    {route.title === "Belum dibayar" && reduxOrder[0].total ?
                                                        <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}> ({reduxOrder[0].total})</Text>
                                                        : route.title === "Diproses" && reduxOrder[1].total || reduxOrder[2].total ?
                                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}> ({reduxOrder[1].total + reduxOrder[2].total})</Text>
                                                            : route.title === "Dikirim" && reduxOrder[3].total ?
                                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}> ({reduxOrder[3].total})</Text>
                                                                : route.title == "Selesai" && reduxOrder[4].total ?
                                                                    <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}> ({reduxOrder[4].total})</Text>
                                                                    : route.title === "Dibatalkan" && reduxOrder[5].total ? <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}> ({reduxOrder[5].total})</Text>
                                                                        : null
                                                    }
                                                </Text>
                                                :
                                                <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 80, textAlign: 'center' }}>{route.title}</Text>}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </SafeAreaView>

            }
        </>
    )
}

