import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import { Button } from 'react-native-paper'
import { styles, colors, Wp, Appbar, useFocusEffect, ServiceCore, useNavigation, Countdown } from '../../export'
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FlashsaleFirstComponent from '../../components/Flashsale/FlashsaleFirstComponent';
import FlashsaleSecondComponent from '../../components/Flashsale/FlashsaleSecondComponent';
import { useDispatch, useSelector } from 'react-redux';
export default function FlashsaleScreen() {
    const navigation = useNavigation()
    const reduxFlashsale = useSelector(state => state.dashboard.flashsale)
    const dispatch = useDispatch()
    const [index, setIndex] = useState(0)


    const [date, setDate] = useState({
        first: '',
        second: ''
    })

    const [routes, setRoutes] = useState([
        { key: 'first', title: '09.00', message: "" },
        { key: 'second', title: '18.00', message: "" },
    ]);

    const renderScene = SceneMap({
        first: FlashsaleFirstComponent,
        second: FlashsaleSecondComponent,
    });




    useFocusEffect(
        useCallback(() => {

            ServiceCore.getDateTime().then(res => {
                if (res) {
                    let date = new Date()
                    if (date.toJSON().toString().slice(0, 10) !== res.dateNow) {
                        Alert.alert(
                            "Peringatan!",
                            `Sepertinya tanggal tidak sesuai!`,
                            [
                                { text: "OK", onPress: () => navigation.goBack() }
                            ],
                            { cancelable: false }
                        );
                    } else {
                        ServiceCore.getFlashsale().then(resp => {
                            if (resp) {
                                dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                                // handleDate(res)
                            }
                        })

                    }
                }
            })
        }, []),
    );



    const handleDate = (valDate) => {
        let newdate = []
        if (String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") < "180000" && String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") <= "240000") {
            newdate[0].message = "Sedang Berlangsung"
            newdate[1].message = "Akan Datang"
        } else if (String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") >= "180000" && String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") <= "240000") {
            newdate[9].first = "Telah Berakhir"
            newdate[1].second = "Sedang Berlangsung"
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Flashsale" />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                        {...props}
                        bounces={true}
                        scrollEnabled={true}
                        style={{ backgroundColor: 'white' }}
                        tabStyle={{ minHeight: 50, flex: 0, width: Wp('50%') }} // here
                        renderLabel={({ route, focused, color }) => {
                            return (
                                <View style={[styles.column_center, { width: '100%' }]}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>{route.title}</Text>
                                    <Text style={[styles.font_12, { color: colors.BlueJaja }]}>{route.message}</Text>
                                </View>
                            )
                        }}
                    />
                )}
            />
            <Countdown />
        </SafeAreaView >
    )
}