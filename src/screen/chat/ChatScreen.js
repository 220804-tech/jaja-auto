import React, { useState, useEffect, createRef } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ImageBackground, Platform, ScrollView, AlertIOS, ToastAndroid } from "react-native";
import { IconButton, TouchableRipple } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import firebaseDatabase from '@react-native-firebase/database';
import ActionSheet from 'react-native-actions-sheet';
import { colors, Hp, Wp, Appbar, ServiceFirebase as Firebase, styles as style, Loading, Utils } from "../../export";
import { useSelector } from 'react-redux'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckSignal } from "../../utils/Form";

export default function ChatScreen({ route }) {
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const galeryRef = createRef()
    const insets = useSafeAreaInsets();

    const pictureRef = createRef();
    const flatlist = createRef();
    const [loading, setLoading] = useState(false)

    const [isiChat, setIsiChat] = useState("");
    const [Phone, setPhone] = useState("");
    const [uid, setUid] = useState("");
    const [namaToko, setnamaToko] = useState(false)
    const [newFriend, setnewFriend] = useState(false)
    const [loadChat, setloadChat] = useState(true)
    const [sellerImage, setesellerImage] = useState(null)

    const [nameChat, setnameChat] = useState("")
    const [dataFriend, setdataFriend] = useState("")
    const [messageList, setMessageList] = useState('');
    const [gambar, setGambar] = useState("");
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedOrder, setselectedOrder] = useState('')

    const { data, product, order } = route.params;


    const listChat = [{ id: '1SX', text: 'Halo, apakah barang ini ready?' }, { id: '2SX', text: 'Halo, apakah bisa dikirim hari ini?' }, { id: '3SX', text: 'Terima kasih!' }, { id: '4SX', text: 'Sama-sama!' },]
    useEffect(() => {
        setnameChat(data.name);
        let error = true
        let refresh = true
        console.log("🚀 ~ file: ChatScreen.js ~ line 44 ~ onValueChange ~  data.chat", data.chat)
        const onValueChange = firebaseDatabase().ref('/messages/' + data.chat).on('value', function (snapshoot) {
            if (snapshoot.val() !== null) {
                const values = Object.values(snapshoot.val());
                console.log("🚀 ~ file: ChatScreen.js ~ line 46 ~ onValueChange ~ values", values)
                let arr = [];
                for (const key of values) {
                    arr.push(key)
                }
                setLoading(false)
                setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
                error = false
                firebaseDatabase().ref("/people/" + data.id).once("value", function (snap) {
                    var item = snap.val();
                    error = false

                    if (item != null && item.photo != null) {
                        setesellerImage(item.photo)
                    }
                })


            }
        })
        // setTimeout(() => {
        //     if (error) {
        //         Utils.CheckSignal().then(res => {
        //             let string = 'Tidak dapat terhubung, periksa kembali koneksi internet anda!'
        //             if (res.connet) {
        //                 if (Platform.OS === 'android') {
        //                     ToastAndroid.show('Sedang memuat..', ToastAndroid.LONG, ToastAndroid.TOP)
        //                 } else {
        //                     AlertIOS.alert('Sedang memuat..');
        //                 }
        //                 setTimeout(() => {
        //                     if (error) {
        //                         if (Platform.OS === 'android') {
        //                             ToastAndroid.show(string, ToastAndroid.LONG, ToastAndroid.TOP)
        //                         } else {
        //                             AlertIOS.alert(string);
        //                         }
        //                     }
        //                 }, 5000);
        //             } else {
        //                 setLoading(false)
        //                 if (Platform.OS === 'android') {
        //                     ToastAndroid.show(string, ToastAndroid.LONG, ToastAndroid.TOP)
        //                 } else {
        //                     AlertIOS.alert(string);
        //                 }
        //             }
        //         })

        //     }
        // }, 5000);
        return () => firebaseDatabase().ref('/messages/' + data.chat).off('value', onValueChange);
    }, [data]);

    useEffect(() => {
        if (product && Object.keys(product).length && selectedProduct !== null) {
            setSelectedProduct(product)
        }
        if (order && Object.keys(order).length && selectedOrder !== null) {
            setselectedOrder(order)
        }

    }, [selectedProduct, selectedOrder])
    useEffect(() => {
        // setLoading(true)
        if (messageList) {
            // setLoading(false)
        }

    }, [messageList])

    const handleSend = (image) => {
        if (isiChat.length > 0 || image || selectedOrder || selectedProduct) {
            let chat = isiChat.length > 0 ? isiChat : image ? 'Mengirim gambar' : selectedOrder && Object.keys(selectedOrder).length ? 'Pesanan No. ' + selectedOrder.invoice : selectedProduct.name
            var message = {
                message: isiChat,
                time: firebaseDatabase.ServerValue.TIMESTAMP,
                date: new Date().toString(),
                from: reduxUser.uid,
                image: image,
                order: null
            }
            if (data && reduxAuth) {
                try {
                    if (selectedProduct && Object.keys(selectedProduct).length) {
                        handleSendProduct()
                    }
                    if (selectedOrder) {
                        message.order = selectedOrder
                    }
                    setTimeout(() => {
                        var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                        console.log("🚀 ~ file: ChatScreen.js ~ line 135 ~ handleSendProduct ~ msgId", msgId)
                        firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                        firebaseDatabase().ref('people/' + data.id + '/notif').set(message); //pengirimnya

                        firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: chat, time: new Date().toString() } });
                        firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: chat, time: new Date().toString() }, amount: 1, time: new Date().toString() });
                        let fire = firebaseDatabase().ref("/people/" + data.id).limitToLast(20).on("value", async function (snapshot) {
                            let item = await snapshot.val();
                            setselectedOrder(null)
                            if (item.token) {
                                await Firebase.buyerNotifications('chat', data.id)
                                Firebase.notifChat(item.token, { body: chat, title: reduxUser.name })
                            }
                            firebaseDatabase().ref(`/people/${data.id}`).off('value', fire)
                        })
                    }, selectedProduct && Object.keys(selectedProduct).length ? 100 : 0);
                } catch (error) {

                }
            }
            setIsiChat('')
            setGambar("")
        }
    }
    const handleSendProduct = () => {
        if (selectedProduct && Object.keys(selectedProduct).length) {
            var message = {
                message: "",
                time: firebaseDatabase.ServerValue.TIMESTAMP,
                from: reduxUser.uid,
                priceDiscount: selectedProduct.discount,
                priceFirst: selectedProduct.price,
                priceLast: selectedProduct.isDiscount ? selectedProduct.priceDiscount : selectedProduct.price,
                productImage: selectedProduct.image[0],
                productTitle: selectedProduct.name,
            }
            if (data) {
                console.log("🚀 ~ file: ChatScreen.js ~ line 132 ~ handleSendProduct ~ data", data)
                try {
                    var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                    console.log("🚀 ~ file: ChatScreen.js ~ line 135 ~ handleSendProduct ~ msgId", msgId)
                    firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                    firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: selectedProduct.name, time: new Date().toString() } });
                    firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: selectedProduct.name, time: new Date().toString() }, amount: 1 });
                    let fire = firebaseDatabase().ref("/people/" + data.id).limitToLast(20).on("value", async function (snapshot) {
                        let item = await snapshot.val();
                        if (item.token) {
                            await Firebase.notifChat(item.token, { body: selectedProduct.name, title: reduxUser.name })
                            setSelectedProduct(null)
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


    const renderRow = ({ item, index }) => {
        let dateNow = String(item.date).slice(0, 3);
        let dateRight = String(item.date).slice(4, 15)
        return (
            <View style={{ width: Wp("100%"), paddingTop: "2%" }}>
                {item.date && index && String(messageList[index].date) !== "undefined" > 0 && !item.productTitle ?
                    String(messageList[index].date).slice(6, 10) !== String(messageList[index - 1].date).slice(6, 10) ?
                        <View style={{ alignSelf: 'center', marginVertical: '3%' }}>
                            <Text style={[style.font_16, { color: colors.BlackGrey }]}>{dateNow === 'Mon' ? "Senin " + dateRight : dateNow == 'Tue' ? 'Selasa ' + dateRight : dateNow == 'Wed' ? 'Rabu ' + dateRight : dateNow == 'Thu' ? 'Kamis ' + dateRight : dateNow === 'Fri' ? 'Jumat ' + dateRight : dateNow == 'Sat' ? 'Sabtu ' + dateRight : 'Minggu ' + dateRight}</Text>
                        </View> : null
                    : null
                }
                {
                    item.from === reduxUser.uid ?
                        !item.productTitle ?
                            item.image ?
                                <View style={[style.row_center, { width: Wp('65%'), height: Wp('65%'), backgroundColor: colors.BlueJaja, alignSelf: 'flex-end', paddingRight: '5%', borderRadius: 5 }]}>
                                    <Image source={{ uri: item.image }} style={{ width: '96%', height: '96%', resizeMode: 'cover', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }} />
                                </View>
                                :
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
                                        {item.order && Object.keys(item.order).length ?
                                            <>
                                                <Text style={[style.font_13, { textAlign: "right", color: colors.White }]}>
                                                    No. {item.order.invoice}
                                                </Text>
                                                <Text style={[style.font_11, style.mb_5, { textAlign: "right", color: colors.White }]}>
                                                    {item.order.status}
                                                </Text>
                                                <View style={[style.column_end_center, { width: Wp('25%'), height: Wp('25%'), alignSelf: 'flex-end', backgroundColor: colors.BlueLight }]}>
                                                    <Image source={{ uri: item.order.imageOrder }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                                </View>
                                            </>
                                            : null}
                                        {item.message ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#FFF", textAlign: "right"
                                                    }}>
                                                    {item.message}
                                                </Text>
                                                {item.date ?
                                                    <Text style={[style.font_11, style.mt_2, { color: colors.White, alignSelf: 'flex-end' }]}>
                                                        {item.date.slice(16, 21)}
                                                    </Text>
                                                    : null
                                                }
                                            </>

                                            : null}


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
                                borderRadius: 3,
                                borderTopRightRadius: 0,
                                flexDirection: "row",
                                alignSelf: 'center',
                                backgroundColor: colors.White,
                                elevation: 0,
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
                                    <Text numberOfLines={1} style={[style.font_13, { width: '90%' }]}>{item.productTitle}</Text>
                                    {item.priceDiscount > 0 ?
                                        <View style={{ flex: 0, flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text adjustsFontSizeToFit style={{ textDecorationLine: 'line-through', marginRight: '3%', fontSize: 12 }}>{item.priceFirst}</Text>
                                                <View style={{ backgroundColor: colors.RedFlashsale, justifyContent: 'center', alignItems: 'center', borderRadius: 3, paddingHorizontal: '2%' }}>
                                                    <Text adjustsFontSizeToFit style={[style.font_10, style.T_medium, { color: 'white' }]}>{item.priceDiscount + "%"}</Text>
                                                </View>
                                            </View>
                                            <Text adjustsFontSizeToFit style={{ marginRight: '3%', fontSize: 12 }}>{item.priceLast}</Text>
                                        </View>

                                        :
                                        <Text style={{ color: colors.RedFlashsale, fontFamily: 'Poppins-SemiBold', fontSize: Wp("4%") }}>
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
                                        borderColor: colors.BlackSilver,
                                        borderTopRightRadius: 0,
                                        marginVertical: 5,
                                        marginHorizontal: 10,
                                        backgroundColor: colors.BlackSilver,
                                        padding: 10,
                                    }}
                                >
                                    {item.message ?
                                        <>
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
                                        </>
                                        : null}

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

    const handleOpenCamera = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
            // includeBase64: true
        }).then(image => {
            handleSend(image.path)
        });
    }

    const handlePickVideo = (indx) => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            compressVideoPreset: '640x480',
            compressImageQuality: 0.8,
            maxFiles: 1,
            includeBase64: true,
        }).then(async video => {
            try {
                console.log("🚀 ~ file: AddReview.js ~ line 105 ~ handlePickVideo ~ video", video)
                let base64data = await RNFS.readFile(video.path, 'base64').then();
                let newData = JSON.parse(JSON.stringify(data))
                newData[indx].videoShow = video.path;
                newData[indx].video = base64data;
                setData(newData)
                setIdx(null)
            } catch (error) {
                console.log("🚀 ~ file: AddReview.js ~ line ss100 ~ handlePickVideo ~ error", error)
            }
        });
    }
    const handlePickImage = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
            includeBase64: true
        }).then(image => {
            handleSend(image.path)
        });
    }

    return (
        <SafeAreaView style={style.container}>
            <Appbar back={true} title={data && data.name ? data.name : ''} />
            <SafeAreaProvider style={[style.container]}>
                {loading ? <Loading /> : null}
                <ImageBackground source={require('../../assets/images/bgChat3.jpg')} style={{ width: '100%', height: '100%', paddingBottom: Math.max(insets.bottom, 0) }}>
                    <FlatList
                        inverted={-1}
                        ref={flatlist}
                        style={[style.pt_2, style.px_2, { height: '92%', }]}
                        data={messageList}
                        renderItem={renderRow}
                        keyExtractor={(item, index) => String(index)}
                    />

                    {/* <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                > */}

                    {selectedOrder && Object.keys(selectedOrder).length ?
                        <View style={[style.row_around_center, style.mr_5, style.mb_2, style.p, { borderRadius: 7, backgroundColor: colors.White, width: '55%', alignSelf: 'flex-end' }]}>
                            <Text style={[style.font_13, { marginBottom: '-1%', alignSelf: 'center', textAlignVertical: 'center', color: colors.BlueJaja }]}>
                                No. {selectedOrder.invoice}
                            </Text>
                            <TouchableRipple style={[style.p_3]} onPress={() => setselectedOrder(null)}>
                                <Image source={require('../../assets/icons/close.png')} style={[style.icon_13, { tintColor: colors.BlackGrey }]} />
                            </TouchableRipple>
                        </View>
                        : null}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '170%', paddingHorizontal: '4%' }}>
                        {listChat.map(item => {
                            return (
                                <TouchableRipple borderless={true} rippleColor={colors.BlueJaja} key={item.id} onPress={() => setChat(item.text)} style={[style.px_2, style.py, { backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.BlueJaja, borderRadius: 11, marginRight: 5 }]}>
                                    <Text style={[style.font_11, { color: colors.BlueJaja }]}>{item.text}</Text>
                                </TouchableRipple>
                            )
                        })}
                    </ScrollView>
                    <View style={[style.row_around_center, style.px_2, style.mb_2, { height: Hp('7%'), backgroundColor: 'transparent', }]}>

                        <View style={[style.row_start_center, {
                            width: "80%", height: '77%', borderRadius: 100, backgroundColor: colors.White, opacity: 0.9, borderWidth: 0.2,
                            borderColor: colors.BlueJaja,
                        }]}>
                            <TextInput
                                style={[style.font_14, { width: isiChat.length ? '90%' : '82%', borderColor: "gray", borderBottomLeftRadius: 100, borderTopLeftRadius: 100, paddingHorizontal: 20, marginBottom: '-1%' }]}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
                                value={isiChat}
                            />
                            {/* {!isiChat.length ?
                                <IconButton
                                    icon={require('../../assets/icons/camera.png')}
                                    style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                                    color={colors.BlueJaja}
                                    onPress={() => galeryRef.current?.setModalVisible(true)}
                                /> : null} */}
                        </View>

                        <IconButton
                            icon={require('../../assets/icons/send.png')}
                            style={{ margin: 0, backgroundColor: colors.BlueJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                            color={colors.White}
                            onPress={() => handleSend(null)}
                        />

                    </View>
                    {/* </KeyboardAvoidingView> */}
                </ImageBackground>


                <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White }} ref={galeryRef}>
                    <View style={[style.column, style.pb, { backgroundColor: '#ededed' }]}>
                        <TouchableOpacity onPress={handleOpenCamera} style={{ borderBottomWidth: 0.5, borderBottomColor: colors.Silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '2%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                        </TouchableOpacity>
                    </View >
                </ActionSheet >


            </SafeAreaProvider >
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
