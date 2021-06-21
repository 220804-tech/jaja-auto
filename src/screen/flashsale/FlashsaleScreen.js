import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import { styles, colors, Wp, Appbar, useFocusEffect } from '../../export'
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FlashsaleFirstComponent from '../../components/Flashsale/FlashsaleFirstComponent';
import FlashsaleSecondComponent from '../../components/Flashsale/FlashsaleSecondComponent';

export default function FlashsaleScreen() {
    const [index, setIndex] = useState(0)


    const [routes] = useState([
        { key: 'first', title: '09.00' },
        { key: 'second', title: '18.00' },

    ]);

    const renderScene = SceneMap({
        first: FlashsaleFirstComponent,
        second: FlashsaleSecondComponent,
    });

    useFocusEffect(
        useCallback(() => {
        }, []),
    );

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
                        // tabStyle={{ minHeight: 50, flex: 0, width: Wp('33.3%'), borderRightColor: 'grey' }} // here
                        renderLabel={({ route, focused, color }) => {
                            return (
                                <View style={styles.column}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>{route.title}</Text>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>{route.title}</Text>
                                </View>
                            )
                        }}
                    />
                )}
            />
        </SafeAreaView>
    )
}
