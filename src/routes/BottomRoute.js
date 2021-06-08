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
import { Hp } from '../export';
// import { Language } from '../utils/language/Language' 
const Tab = createBottomTabNavigator();
export default function BottomRoute() {
    const [notif, setNotif] = useState("")
    const uid = useSelector(state => state.user.user.uid)

    useEffect(() => {
        const onValueChange = database()
            .ref('/people/' + uid)
            .on('value', snapshot => {
                let result = snapshot.val()
                console.log("🚀 ~ file: BottomRoute.js ~ line 23 ~ useEffect ~ result", result)
                if (result) {
                    setNotif(result.notif)
                }
            });
        return () => database().ref(`/people/${uid}`).off('value', onValueChange);

    }, [])

    return (
        <Tab.Navigator  backBehavior='firstRoute' screenOptions={{
            headerShown: false, tabBarStyle: {
                height: Hp('7.5%')
            },



        }}>
            <Tab.Screen name="Home" component={Home}

                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Beranda")}</Text>
                    ),

                    tabBarIcon: ({ size, focused }) => (
                        <View style={style.column}>
                            <FAIcon name="rocket" size={size} color={focused ? colors.YellowJaja : colors.BlueJaja} style={{ marginBottom: '-2%' }} />
                            {/* <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View> */}
                        </View>
                    )
                }}
            />
            {/* <Tab.Screen name="Feed" component={Feed}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: size, color: focused ? colors.BlueJaja : colors.BlackGrayScale }}>{Language("Feed")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View>
                            <FAIcon name="stack-exchange" size={size} color={focused ? colors.BlueJaja : "#a1a1a1"} style={{ alignSelf: 'center' }} />
                            <View style={style.countNotif}><Text style={style.textNotif}>99+</Text></View>
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name="Chat" component={ListChat}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Chat")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={style.column}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/chat.png`)} />
                                {notif && notif.chat ?
                                    <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(notif.chat) > 99 ? "99+" : notif.chat}</Text></View> : null
                                }
                            </View>
                        )
                    }
                }}
            />
            <Tab.Screen name="Pesanan" component={Orders}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Transaksi")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => (
                        <View style={style.column}>
                            <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/traffic-blue.png`)} />
                            {notif && notif.chat ?
                                <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(notif.chat) > 99 ? "99+" : notif.chat}</Text></View> : null
                            }
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Akun" component={Profile}
                options={{
                    tabBarLabel: ({ size, focused }) => (
                        <Text style={{ fontSize: 12, color: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '3%' }}>{Language("Akun")}</Text>
                    ),
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <View style={style.column}>
                                <Image style={{ width: size, height: size, tintColor: focused ? colors.YellowJaja : colors.BlueJaja, marginBottom: '-2%' }} source={require(`../assets/icons/user-active.png`)} />
                                {notif && notif.chat ?
                                    <View style={style.countNotif}><Text style={style.textNotif}>{parseInt(notif.chat) > 99 ? "99+" : notif.chat}</Text></View> : null
                                }
                            </View>
                        )
                    }
                }}
            />
        </Tab.Navigator >
    );
}
