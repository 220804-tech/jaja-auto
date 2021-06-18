import React, { useState, useEffect, createRef } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ImageBackground } from "react-native";
import { IconButton } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import firebaseDatabase from '@react-native-firebase/database';
import ActionSheet from 'react-native-actions-sheet';
import { colors, Hp, Wp, Appbar, ServiceFirebase as Firebase } from "../../export";
import { useSelector } from 'react-redux'

export default function ChatScreen({ route }) {
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)

    const pictureRef = createRef();
    const flatlist = createRef();
    const [isiChat, setIsiChat] = useState("");
    const [Phone, setPhone] = useState("");
    const [uid, setUid] = useState("");
    const [namaToko, setnamaToko] = useState(false)
    const [newFriend, setnewFriend] = useState(false)
    const [loadChat, setloadChat] = useState(true)
    const [sellerImage, setesellerImage] = useState(null)

    const [nameChat, setnameChat] = useState("")
    const [dataFriend, setdataFriend] = useState("")
    const [messageList, setMessageList] = useState([]);
    const [gambar, setGambar] = useState("");
    const [token, setToken] = useState("")
    const { data, product } = route.params;

    useEffect(() => {
        setnameChat(data.name);
        const onValueChange = firebaseDatabase().ref('/messages/' + data.chat).on('value', function (snapshoot) {
            if (snapshoot.val() !== null) {
                const values = Object.values(snapshoot.val());
                let arr = [];
                for (const key of values) {
                    arr.push(key)
                }
                setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())

                firebaseDatabase().ref("/people/" + data.id).once("value", function (snap) {
                    var item = snap.val();
                    if (item != null && item.photo != null) {
                        setesellerImage(item.photo)
                    }
                })

            }
        })
        return () => firebaseDatabase().ref('/messages/' + data.chat).off('value', onValueChange);
    }, [data, product]);

    const handleSend = () => {
        if (isiChat.length > 0 || gambar !== "") {
            var message = {
                message: isiChat,
                time: firebaseDatabase.ServerValue.TIMESTAMP,
                date: new Date().toString(),
                from: reduxUser.uid,
                image: gambar
            }
            if (data && reduxAuth) {
                console.log("🚀 ~ file: ChatScreen.js ~ line 72 ~ handleSend ~ firebaseDatabase.ServerValue.increment", firebaseDatabase.ServerValue.increment)
                try {
                    var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                    console.log("🚀 ~ file: ChatScreen.js ~ line 135 ~ handleSendProduct ~ msgId", msgId)
                    firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                    firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: isiChat, time: new Date().toString() } });
                    firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: isiChat, time: new Date().toString() }, amount: 1, time: new Date().toString() });
                    let fire = firebaseDatabase().ref("/people/" + data.id).limitToLast(20).on("value", async function (snapshot) {
                        let item = await snapshot.val();
                        if (item.token) {
                            await Firebase.notifChat(item.token, { body: isiChat, title: reduxUser.name })
                        }
                        firebaseDatabase().ref(`/people/${data.id}`).off('value', fire)
                    })
                } catch (error) {
                    console.log("data error", error)
                }
            }
            setIsiChat('')
            setGambar("")
        }
    }
    const handleSendProduct = () => {
        if (product && Object.keys(product).length) {
            var message = {
                message: "",
                time: firebaseDatabase.ServerValue.TIMESTAMP,
                from: reduxUser.uid,
                priceDiscount: product.discount,
                priceFirst: product.price,
                priceLast: product.isDiscount ? product.priceDiscount : product.price,
                productImage: product.image[0],
                productTitle: product.name,
            }
            if (data) {
                console.log("🚀 ~ file: ChatScreen.js ~ line 132 ~ handleSendProduct ~ data", data)
                try {
                    var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                    console.log("🚀 ~ file: ChatScreen.js ~ line 135 ~ handleSendProduct ~ msgId", msgId)
                    firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                    firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: product.name, time: new Date().toString() } });
                    firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: product.name, time: new Date().toString() }, amount: 1 });
                    let fire = firebaseDatabase().ref("/people/" + data.id).limitToLast(20).on("value", async function (snapshot) {
                        let item = await snapshot.val();
                        if (item.token) {
                            await Firebase.notifChat(item.token, { body: product.name, title: reduxUser.name })
                        }
                        firebaseDatabase().ref(`/people/${data.id}`).off('value', fire)
                    })
                } catch (error) {
                    console.log("data error", error)
                }
            }
            setIsiChat('')
            setGambar("")
        }
    }
    const getItem = async () => {
        // try {
        //     let res = await Storage.getToko()
        //     setFotoSeller(res.foto)
        //     firebaseDatabase().ref("/people/" + data.id).on("value", function (snap) {
        //         var item = snap.val();
        //         if (item != null && item.photo != null) {
        //             setesellerImage(item.photo)
        //         }
        //     })
        // } catch (error) {
        //     ToastAndroid.show(error, ToastAndroid.LONG, ToastAndroid.CENTER)
        // }
    }

    const renderRow = ({ item, index }) => {
        return (
            <View style={{ width: Wp("100%"), paddingTop: "2%" }}>
                {item.date && index && String(messageList[index].date) !== "undefined" > 0 && !item.productTitle ?
                    String(messageList[index].date).slice(6, 10) !== String(messageList[index - 1].date).slice(6, 10) ?
                        <View style={{ alignSelf: 'center', marginVertical: '3%' }}>
                            <Text style={{ fontSize: 18, color: colors.White, fontWeight: '900' }}>{String(messageList[index].date).slice(0, 10)}</Text>
                        </View> : null
                    : null
                }
                {item.from === reduxUser.uid ?
                    !item.productTitle ?
                        <View style={{
                            width: "100%",
                            justifyContent: "flex-end",
                            alignSelf: "center",
                            flexDirection: "row",
                            paddingHorizontal: Wp("5%"),
                        }}>
                            <View
                                style={{
                                    maxWidth: "80%",
                                    borderWidth: 0.2,
                                    borderRadius: 15,
                                    borderColor: colors.BlueJaja,
                                    borderTopRightRadius: 0,
                                    marginVertical: 5,
                                    marginHorizontal: 10,
                                    backgroundColor: colors.BlueJaja,
                                    padding: 10,
                                }}>
                                <Text
                                    adjustsFontSizeToFit
                                    style={{
                                        fontSize: 14,
                                        color: "#FFF", textAlign: "right"
                                    }}>
                                    {item.message}
                                </Text>
                                {item.date ?
                                    <Text
                                        style={{
                                            fontSize: Hp("1.1"),
                                            color: "#FFF", textAlign: "right"
                                        }}>
                                        {item.date.slice(16, 21)}
                                    </Text>
                                    : null
                                }
                            </View>
                            <View style={{
                                borderRadius: 50,
                                width: Hp("6%"),
                                height: Hp("6%"),
                                backgroundColor: colors.BlackGrayScale,
                                overflow: "hidden"
                            }}>
                                <Image
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: Hp("6%"),
                                        height: Hp("6%"),
                                        borderRadius: 50,
                                        // backgroundColor: colors.BlackGrayScale,
                                        overflow: "hidden"
                                    }}
                                    resizeMethod={"scale"}
                                    // resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={{ uri: reduxUser.image }}
                                />
                            </View>
                        </View>
                        :
                        <View style={{
                            flex: 1,
                            width: '100%',
                            padding: '3%',
                            borderRadius: 7,
                            borderTopRightRadius: 0,
                            flexDirection: "row",
                            alignSelf: 'center',
                            backgroundColor: colors.White,
                            elevation: 1,
                            marginBottom: '2%'
                        }}
                        >
                            <View style={{ flex: 0 }}>
                                <Image style={{
                                    alignSelf: "center",
                                    width: Wp("15%"),
                                    height: Wp("15%"),
                                    marginRight: 10,
                                    borderRadius: 2
                                }}
                                    resizeMethod={"scale"}
                                    resizeMode={"cover"}
                                    source={{ uri: item.productImage ? item.productImage : null }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>{item.productTitle}</Text>
                                {item.priceDiscount > 0 ?
                                    <View style={{ flex: 0, flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text adjustsFontSizeToFit style={{ textDecorationLine: 'line-through', marginRight: '3%', fontSize: 12 }}>{item.priceFirst}</Text>
                                            <View style={{ backgroundColor: colors.RedFlashsale, justifyContent: 'center', alignItems: 'center', borderRadius: 3, paddingHorizontal: '1%' }}>
                                                <Text adjustsFontSizeToFit style={{ color: 'white', fontWeight: 'bold', fontSize: 12, }}>{item.priceDiscount + "%"}</Text>
                                            </View>
                                        </View>
                                        <Text adjustsFontSizeToFit style={{ marginRight: '3%', fontSize: 12 }}>{item.priceLast}</Text>
                                    </View>

                                    :
                                    <Text style={{ color: colors.RedFlashsale, fontWeight: 'bold', fontSize: Wp("4%") }}>
                                        {item.priceLast}
                                    </Text>
                                }
                            </View>
                        </View>

                    :
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{
                            width: "100%",
                            justifyContent: "flex-start",
                            alignSelf: "center",
                            flexDirection: "row",
                        }}>
                            <View style={{
                                borderRadius: 50,
                                width: Hp("6%"),
                                height: Hp("6%"),
                                backgroundColor: colors.BlueJaja,
                            }}>
                                <Image
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: Hp("6%"),
                                        height: Hp("6%"),
                                        borderRadius: 50,
                                        overflow: "hidden"
                                    }}
                                    resizeMethod={"scale"}
                                    resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={{ uri: sellerImage }}
                                />
                            </View>
                            <View
                                style={{
                                    maxWidth: "80%",
                                    borderWidth: 0.2,
                                    borderRadius: 15,
                                    borderColor: colors.BlueJaja,
                                    borderTopRightRadius: 0,
                                    marginVertical: 5,
                                    marginHorizontal: 10,
                                    backgroundColor: colors.BlueJaja,
                                    padding: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Hp("2%"),
                                        color: "#FFF"
                                    }}
                                >
                                    {item.message}
                                </Text>
                                {item.date ?
                                    <Text
                                        style={{
                                            fontSize: Hp("1.2%"),
                                            color: "#FFF"
                                        }}
                                    >
                                        {item.date.slice(16, 20)}
                                    </Text>
                                    : null
                                }
                            </View>
                        </View>
                    </View>
                }
            </View >
        );
    }

    function statePertamax() {
        // AsyncStorage.getItem('token').then((result) => {
        //     setToken(result)
        // });
        // AsyncStorage.getItem("xxTwo").then(toko => {
        //     setPhone(JSON.parse(toko).telepon)
        //     setUid(JSON.parse(toko).uid)
        //     if (data != null) {
        //         firebaseDatabase().ref('friend/' + JSON.parse(toko).uid + "/" + data.id + "/status").set({ amount: 0, read: true })
        //     }
        // });
        // AsyncStorage.getItem("xxTwo").then(toko => {
        //     setnamaToko(JSON.parse(toko).nama_toko);
        // });
    }

    function setChat(value) {
        setIsiChat(value)
    }



    function LoadMessages(val) {
        if (data !== null) {
            try {
                firebaseDatabase().ref('/messages').child(data.chat).on('value', function (snapshoot) {
                    if (snapshoot.val() !== null) {
                        const values = Object.values(snapshoot.val())
                        // let result = Object.keys(snapshoot.val()).map((key) => [Number(key), obj[key]]);
                        // setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
                    }
                })
            } catch (error) {
                console.log("🚀 ~ file: ChatScreen.js ~ line 372 ~ LoadMessages ~ error", error)
            }
        } else {
            // try {
            //     if (dataFriend !== "") {
            //         firebaseDatabase().ref('/messages').child(dataFriend).on('value', snapshoot => {
            //             if (snapshoot.val() !== null) {
            //                 const values = Object.values(snapshoot.val())
            //                 let arr = []
            //                 for (const key of values) {
            //                     arr.push(key)
            //                 }
            //                 setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
            //             }
            //         })
            //     } else {
            //         firebaseDatabase().ref('/messages').child(val).on('value', snapshoot => {
            //             if (snapshoot.val() !== null) {
            //                 const values = Object.values(snapshoot.val())
            //                 let arr = []
            //                 for (const key of values) {
            //                     arr.push(key)
            //                 }
            //                 setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
            //             }
            //         })
            //     }
            // } catch (error) {
            // }
        }
    }

    function ImageChoose(side) {
        if (side === "camera") {
            ImagePicker.openCamera({
                width: 200,
                height: 200,
            }).then(image => {
                setGambar(image.path)
            });
        } else {
            ImagePicker.openPicker({
                width: 200,
                height: 200,
                cropping: true,
                includeBase64: true,
                compressImageQuality: 1,
            }).then(image => {
                setGambar(image.path)
            });
        }
        pictureRef.current.hide()

    }
    return (

        <SafeAreaView style={{ flex: 1, height: Hp('100%') }}>
            <Appbar back={true} title={data && data.name ? data.name : ''} />
            <ImageBackground source={require('../../assets/images/bgChat.jpg')} style={{ width: '100%', height: '100%' }}>
                {product && Object.keys(product).length ?
                    <View style={{
                        flex: 0,
                        position: 'relative',
                        width: Wp("100%"),
                        height: Hp('11%'),
                        paddingHorizontal: '3%',
                        justifyContent: "center",
                        alignItems: 'center',
                        alignSelf: "center",
                        flexDirection: "row",
                        backgroundColor: colors.White,
                        // top: 0
                    }}>
                        <View style={{ flex: 0 }}>
                            <Image
                                style={{
                                    alignSelf: "center",
                                    width: Wp("15%"),
                                    height: Hp("7.5%"),
                                    marginRight: 10,
                                    borderRadius: 2
                                }}
                                resizeMethod={"scale"}
                                resizeMode={"cover"}
                                source={{ uri: product.image[0] ? product.image[0] : null }}
                            />
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column', height: Hp('7.5%') }}>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>{product.name}</Text>
                            {product.isDiscount ?
                                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                    <Text adjustsFontSizeToFit style={{ textDecorationLine: 'line-through', marginRight: '3%', fontSize: 12 }}>{product.price}</Text>
                                    <Text adjustsFontSizeToFit style={{ color: colors.RedFlashsale, fontWeight: 'bold', fontSize: 14 }}>{product.priceDiscount}</Text>
                                </View>
                                :
                                <Text adjustsFontSizeToFit style={{ color: colors.RedFlashsale, fontWeight: 'bold', fontSize: 14 }}>{product.price}</Text>
                            }
                        </View>

                        <TouchableOpacity onPress={handleSendProduct} style={{ paddingVertical: '1%', paddingHorizontal: '2%', borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 4 }}>
                            <Text style={{ color: colors.RedFlashsale, fontSize: 12 }}>Kirim</Text>
                        </TouchableOpacity>

                    </View> : null
                }
                <View style={{ height: product ? '77%' : '87%', backgroundColor: 'transparent' }}>
                    {messageList && messageList.length ?
                        <FlatList
                            inverted={-1}
                            ref={flatlist}
                            style={{ paddingHorizontal: 10, paddingTop: '0.2%' }}
                            data={messageList}
                            renderItem={renderRow}
                            keyExtractor={(item, index) => String(index)}
                        /> : null
                    }
                </View>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        flex: 0,
                        width: Wp("100%"),
                        height: Hp('6%'),
                        marginBottom: Hp('7.7%'),
                        paddingHorizontal: '2%',
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: 'space-around',
                        backgroundColor: 'transparent',
                    }}>
                    <TextInput
                        style={{
                            width: "80%",
                            fontSize: Wp("4%"),
                            height: Hp('5.5%'),
                            borderColor: "gray",
                            borderRadius: 100,
                            paddingHorizontal: 20,
                            backgroundColor: colors.White,
                            opacity: 0.8
                        }}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend()}
                        value={isiChat}
                    />

                    <IconButton
                        icon={require('../../assets/icons/send.png')}
                        style={{ margin: 0, backgroundColor: colors.BlueJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                        color={colors.White}
                        onPress={() => handleSend()}
                    />
                </View>

            </ImageBackground>
            <ActionSheet ref={pictureRef}
                title={"Select a Photo"}
                options={["Take Photo", "Choose Photo Library", "Cancel"]}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={index => {
                    if (index == 0) {
                        ImageChoose("camera");
                    } else if (index == 1) {
                        ImageChoose("galery");
                    } else {
                        null;
                    }
                }} />

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'pink'
    },
    inputbox: {
        width: Wp('90%'),
        backgroundColor: 'transparent',
        color: 'black'
    },
})
