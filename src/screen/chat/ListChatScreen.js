import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Paragraph } from 'react-native-paper'
import database from "@react-native-firebase/database";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { colors, useNavigation, styles as style, Appbar } from "../../export";
import { useSelector, useDispatch } from 'react-redux'
export default function ListChat() {
    const navigation = useNavigation();
    const reduxUser = useSelector(state => state.user.user)
    const [phone, setPhone] = useState("");
    const [users, setUsers] = useState([]);
    const [dataProfile, setDataProfile] = useState({});

    useEffect(() => {
        // Storage.getUID().then(res => {
        //     loadList(res)
        // }).catch(err => alert(err))
        loadList()
    }, []);

    const convertTimes = (timestamp) => {
        const d = new Date(timestamp);
        var date = d.getHours() + ":" + d.getMinutes() + " " + d.getDate()
        return date
    }

    const renderItem = ({ item }) => {
        console.log("🚀 ~ file: ListChatScreen.js ~ line 29 ~ renderItem ~ item", item)
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("IsiChat", { data: item, newData: null })}
                style={{
                    paddingHorizontal: '1%',
                    paddingVertical: '4%',
                    marginVertical: 3,
                    borderBottomColor: colors.Silver,
                    borderBottomWidth: 0.5,
                    width: '95%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'flex-start'

                }}
            >
                <View style={[style.row_between_center, { width: '100%' }]}>
                    <View style={style.column}>
                        <Text style={{ fontSize: 14, color: colors.BlackGrayScale, marginBottom: '1%' }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: item.amount && item.amount > 0 ? colors.BlackGrayScale : colors.Silver }}>{item.message}</Text>
                    </View>
                    {item && item.amount ?
                        <View style={{ padding: '1%', backgroundColor: colors.YellowJaja, borderRadius: 100, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, backgroundColor: colors.YellowJaja, color: colors.BlackGrayScale }}>{item.amount}</Text>
                        </View>
                        : null
                    }
                </View>
            </TouchableOpacity>
        );
    };

    function loadList(val) {
        database().ref("/friend/" + reduxUser.uid).on("value", function (snapshot) {
            var returnArray = [];
            snapshot.forEach(function (snap) {
                var item = snap.val();
                item.id = snap.key;
                if (item.id !== val && item.id !== "null") {
                    returnArray.push(item);
                    let sortedObj = returnArray.sort(function (a, b) {
                        return new Date(b.time) - new Date(a.time);
                    });
                    setUsers(sortedObj);
                }
            });
            return returnArray;
        });
    }

    return (
        <SafeAreaView style={style.container}>
            <Appbar title="Chat" />
            {
                users.length != 0 ?
                    <View style={{ flex: 1, backgroundColor: colors.White }}>
                        <FlatList
                            data={users}
                            renderItem={renderItem}
                            keyExtractor={(item, idx) => String(idx) + "D"}
                        />
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White }}>
                        <Image
                            style={styles.iconMarket}
                            source={require('../../assets/ilustrations/empty.png')}
                        />
                        <Paragraph style={styles.textJajakan}>Ups..<Text style={styles.textCenter}> kamu belum chat siapapun</Text></Paragraph>
                    </View>

            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.BlueJaja, fontFamily: 'notoserif', marginVertical: hp('2%') },
    iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
})