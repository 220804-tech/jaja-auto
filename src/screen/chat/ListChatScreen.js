import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, StyleSheet, RefreshControl } from "react-native";
import { Paragraph } from 'react-native-paper'
import database from "@react-native-firebase/database";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { colors, useNavigation, styles as style, Appbar, DefaultNotFound } from "../../export";
import { useSelector, useDispatch } from 'react-redux'
import { Platform } from "react-native";

export default function ListChat() {
    const navigation = useNavigation();
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)

    const [phone, setPhone] = useState("");
    const [users, setUsers] = useState([]);
    const [dataProfile, setDataProfile] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const reduxnotifCount = useSelector(state => state.notification.notifCount)
    const dispatch = useDispatch()

    useEffect(() => {
        loadList()
        readChat()
        return () => {
            setRefreshing(false)
        }
    }, [reduxUser]);


    const convertTimes = (timestamp) => {
        const d = new Date(timestamp);
        var date = d.getHours() + ":" + d.getMinutes() + " " + d.getDate()
        return date
    }

    const loadList = () => {
        if (reduxUser && Object.keys(reduxUser).length) {
            database().ref("/friend/" + reduxUser.uid).on("value", function (snapshot) {
                var returnArray = [];
                snapshot.forEach(function (snap) {
                    var item = snap.val();
                    if (snap?.key) {
                        item.id = snap.key;
                        if (item.id !== reduxUser.uid && item.id !== "null") {
                            returnArray.push(item);
                            let sortedObj = []
                            try {
                                sortedObj = returnArray.sort(function (a, b) {
                                    return new Date(b.message.time) - new Date(a.message.time);
                                });
                            } catch (error) {
                                console.log("🚀 ~ file: ListChatScreen.js ~ line 52 ~ error", error)
                            }
                            let countChat = 0
                            sortedObj.map(item => countChat += item.amount)
                            dispatch({ type: 'SET_NOTIF_COUNT', payload: { home: reduxnotifCount.home, chat: countChat, orders: reduxnotifCount.orders } })
                            setUsers(sortedObj);
                        }
                    }
                });
            });
        }
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadList()
        readChat()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);

    }, []);


    const readChat = () => {
        database().ref(`/people/${reduxUser.uid}/notif/`).update({ chat: 0 }).then("value", function (snap) {
            var item = snap.val();
            error = false

            if (item != null && item.photo != null) {
                setesellerImage(item.photo)
            }
        })
    }

    const renderItem = ({ item }) => {
        return (
            <>
                {item.message && Object.keys(item.message).length && item.message.text && item.name ?
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("IsiChat", { data: item, newData: null })
                            try {
                                let newItem = item
                                newItem.amount = 0
                                database().ref('friend/' + reduxUser.uid + "/" + item.id).set(newItem);
                            } catch (error) {
                            }
                            try {
                                database().ref(`/people/` + reduxUser?.uid + `/`).set({ notif: { home: reduxnotifCount?.home ? reduxnotifCount.home : 0, chat: reduxnotifCount?.chat ? reduxnotifCount.chat : 0 - item?.amount ? item?.amount : 0, orders: reduxnotifCount?.orders ? reduxnotifCount.orders : 0 } })
                            } catch (error) {
                                console.log("🚀 ~ file: ListChatScreen.js ~ line 102 ~ setTimeout ~ error", error)
                            }
                        }}
                        style={[style.px_2, style.py_4, style.mb_3, style.column_center_start, { width: '100%', backgroundColor: item && item.amount ? colors.BlueLight : colors.White }]}>
                        <View style={[style.row_between_center, { width: '100%' }]}>
                            <View style={style.column}>
                                <Text style={{ fontSize: 14, color: colors.BlackGrayScale, marginBottom: '1%' }}>{item.name}</Text>
                                <Text style={{ fontSize: 12, color: item.amount && item.amount > 0 ? colors.BlackGrayScale : colors.Silver }}>{item.message.text}</Text>
                            </View>
                            {item && item.amount ?
                                <View style={{ padding: '1%', backgroundColor: colors.BlueJaja, borderRadius: 100, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[style.font_11, { textAlign: 'center', textAlignVertical: 'center', color: colors.White }]}>{item.amount > 9 ? '9+' : item.amount}</Text>
                                </View>
                                : null
                            }
                        </View>
                    </TouchableOpacity>
                    : null
                }
            </>
        );
    };



    return (
        <SafeAreaView style={[style.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
            <Appbar title="Chats" trolley={true} notif={true} />
            {
                users.length ?
                    <View style={{ flex: 1, backgroundColor: colors.White }}>
                        <FlatList
                            data={users}
                            renderItem={renderItem}
                            keyExtractor={(item, idx) => String(idx) + "D"}
                            refreshControl={<RefreshControl
                                onRefresh={onRefresh}
                                refreshing={refreshing}
                            />}
                        />
                    </View>
                    :
                    <DefaultNotFound textHead="Ups.." textBody={reduxAuth ? "kamu belum chat siapapun.." : "sepertinya kamu belum login.."} ilustration={require('../../assets/ilustrations/empty.png')} />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'SignikaNegative-SemiBold', color: colors.BlueJaja, fontFamily: 'SignikaNegative-Regular', marginVertical: hp('2%') },
    iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
})