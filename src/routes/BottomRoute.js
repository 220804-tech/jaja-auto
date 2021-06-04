import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Feed, Orders, ListChat, Profile } from './Screen'
import { styles as style } from '../assets/styles/styles'
import colors from '../assets/colors';
import Language from '../utils/language/Language';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';

import { useDispatch, useSelector } from 'react-redux';
// import { Language } from '../utils/language/Language' 
const Tab = createBottomTabNavigator();
export default function BottomRoute() {
    const [notif, setNotif] = useState({})
    const uid = useSelector(state => state.user.user.uid)

    useEffect(() => {
        const onValueChange = database()
            .ref('/people/' + uid)
            .on('value', snapshot => {
                let result = snapshot.val()
                console.log('User data: ', result.notif);
            });
        return () => database().ref(`/people/${uid}`).off('value', onValueChange);

    }, [])

    return (
        <Tab.Navigator initialRouteName="Home" backBehavior='Home' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Beranda")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="rocket" size={20} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            {/* <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View> */}
                        </View>
                    )
                }}
            />
            {/* <Tab.Screen name="Feed" component={Feed}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Feed")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="stack-exchange" size={20} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View>
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name="Chat" component={ListChat}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Chat")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="comment-dots" size={20} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            {notif.chat ?
                                <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View> : null}
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Pesanan" component={Orders}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Transaksi")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="exchange-alt" size={20} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            {/* <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View> */}
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Akun" component={Profile}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Akun")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View>
                                <FAIcon name="user" size={20} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                                {/* <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View> */}
                            </View>
                        )
                    }
                }}
            />
        </Tab.Navigator>
    );
}
