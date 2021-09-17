import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, StatusBar, Alert, ToastAndroid } from 'react-native'
import { Button } from 'react-native-paper'
import { styles, colors, Wp, Appbar, useFocusEffect, ServiceCore, useNavigation, Hp, Countdown } from '../../export'
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
            console.log("testing")
            ServiceCore.getDateTime().then(res => {
                console.log("file: FlashsaleScreen.js ~ line 30 ~ ServiceCore.getDateTime ~ res", res)

                if (res) {
                    let date = new Date()
                    handleDate(res)
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
                        console.log("masuk sini")
                        ServiceCore.getFlashsale().then(resp => {

                            console.log("🚀 ~ file: FlashsaleScreen.js ~ line 51 ~ ServiceCore.getFlashsale ~ resp.flashsale", resp.flashsale)
                            if (resp && resp.flashsale && resp.flashsale.length) {
                                dispatch({ type: 'SET_SHOW_FLASHSALE', payload: true })
                                dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                            } else {
                                dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
                            }
                        })

                    }
                }
            })
        }, [routes]),
    );



    const handleDate = (valDate) => {
        let newdate = routes
        if (String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") < "180000" && String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") <= "240000") {
            newdate[0].message = "Sedang Berlangsung"
            newdate[1].message = "Akan Datang"
        } else if (String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") >= "180000" && String(valDate.timeNow).replace(/:/g, "") >= "090000" && String(valDate.timeNow).replace(/:/g, "") <= "240000") {
            newdate[0].first = "Telah Berakhir"
            newdate[1].second = "Sedang Berlangsung"
        } else {
            newdate[0].first = "Akan Datang"
            newdate[1].second = "Akan Datang"
        }
        
        setRoutes(newdate)
        setIndex(0)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={false} backgroundColor={colors.RedFlashsale} barStyle="light-content" />

            <Appbar back={true} title="Flashsale" Bg={colors.RedFlashsale} />

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        indicatorStyle={{ backgroundColor: colors.RedFlashsale }}
                        {...props}
                        bounces={true}
                        scrollEnabled={true}
                        style={{ backgroundColor: 'white' }}
                        tabStyle={{ minHeight: 50, flex: 0, width: Wp('50%') }} // here
                        renderLabel={({ route, focused, color }) => {
                            return (
                                <View style={[styles.column_center, { width: '100%' }]}>
                                    <Text style={[styles.font_14, { color: colors.RedFlashsale }]}>{route.title}</Text>
                                    <Text style={[styles.font_12, { color: colors.RedFlashsale }]}>{route.message}</Text>
                                </View>
                            )
                        }}
                    />
                )}
            />
            <View style={[styles.row_center, {
                position: 'absolute', bottom: 0, width: Wp('100%'), height: Wp('15%'), backgroundColor: colors.White,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,

                elevation: 20,
            }]}>
                <Text style={[styles.font_14, { color: colors.RedFlashsale }]}>Sedang Berlangsung..</Text>
                <Countdown size={14} wrap={9} />
            </View>
        </SafeAreaView >
    )
}