import React, { useState, useEffect, createRef } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ImageBackground, StatusBar } from "react-native";
import { IconButton } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import firebaseDatabase from '@react-native-firebase/database';
import ActionSheet from 'react-native-actions-sheet';
import { colors, Hp, Wp, Appbar, ServiceFirebase as Firebase, styles as style, Loading } from "../../export";
import { useSelector } from 'react-redux'

export default function ChatScreen({ route }) {
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const galeryRef = createRef()

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
    }, [data]);

    useEffect(() => {
        if (product && Object.keys(product).length) {
            setSelectedProduct(product)
        }
    }, [])
    useEffect(() => {
        setLoading(true)
        if (messageList) {
            setLoading(false)
        }
    }, [messageList])

    const handleSend = (image) => {
        console.log("file: ChatScreen.js ~ line 56 ~ handleSend ~ image", image)
        if (isiChat.length > 0 || image) {
            let chat = isiChat.length > 0 ? isiChat : 'Mengirim gambar'
            var message = {
                message: isiChat,
                time: firebaseDatabase.ServerValue.TIMESTAMP,
                date: new Date().toString(),
                from: reduxUser.uid,
                image: image
            }
            if (data && reduxAuth) {
                console.log("🚀 ~ file: ChatScreen.js ~ line 72 ~ handleSend ~ firebaseDatabase.ServerValue.increment", firebaseDatabase.ServerValue.increment)
                try {
                    if (selectedProduct && Object.keys(selectedProduct).length) {
                        handleSendProduct()
                    }
                    setTimeout(() => {
                        var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                        console.log("🚀 ~ file: ChatScreen.js ~ line 135 ~ handleSendProduct ~ msgId", msgId)
                        firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                        firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: chat, time: new Date().toString() } });
                        firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: chat, time: new Date().toString() }, amount: 1, time: new Date().toString() });
                        let fire = firebaseDatabase().ref("/people/" + data.id).limitToLast(20).on("value", async function (snapshot) {
                            let item = await snapshot.val();
                            if (item.token) {
                                await Firebase.notifChat(item.token, { body: chat, title: reduxUser.name })
                            }
                            firebaseDatabase().ref(`/people/${data.id}`).off('value', fire)
                        })
                    }, selectedProduct && Object.keys(selectedProduct).length ? 10 : 0);
                } catch (error) {
                    console.log("data error", error)
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
                            setSelectedProduct('')
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
        return (
            <View style={{ width: Wp("100%"), paddingTop: "2%" }}>
                {item.date && index && String(messageList[index].date) !== "undefined" > 0 && !item.productTitle ?
                    String(messageList[index].date).slice(6, 10) !== String(messageList[index - 1].date).slice(6, 10) ?
                        <View style={{ alignSelf: 'center', marginVertical: '3%' }}>
                            <Text style={{ fontSize: 18, color: colors.White, fontFamily: 'Poppins-Regular' }}>{String(messageList[index].date).slice(0, 10)}</Text>
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

        <SafeAreaView style={{ flex: 1, height: Hp('100%'), backgroundColor: colors.BlueJaja }}>
            {loading ? <Loading /> : null}
            <Appbar back={true} title={data && data.name ? data.name : ''} />
            <ImageBackground source={require('../../assets/images/bgChat3.jpg')} style={{ width: '100%', height: '100%' }}>
                {selectedProduct && Object.keys(selectedProduct).length ?
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
                                source={{ uri: selectedProduct.image[0] ? selectedProduct.image[0] : null }}
                            />
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column', height: Hp('7.5%') }}>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'Poppins-SemiBold', color: 'black' }}>{selectedProduct.name}</Text>
                            {selectedProduct.isDiscount ?
                                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                    <Text adjustsFontSizeToFit style={{ textDecorationLine: 'line-through', marginRight: '3%', fontSize: 12 }}>{selectedProduct.price}</Text>
                                    <Text adjustsFontSizeToFit style={{ color: colors.RedFlashsale, fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>{selectedProduct.priceDiscount}</Text>
                                </View>
                                :
                                <Text adjustsFontSizeToFit style={{ color: colors.RedFlashsale, fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>{selectedProduct.price}</Text>
                            }
                        </View>

                        {/* <TouchableOpacity onPress={handleSendProduct} style={{ paddingVertical: '1%', paddingHorizontal: '2%', borderColor: colors.RedFlashsale, borderWidth: 1, borderRadius: 4 }}>
                            <Text style={{ color: colors.RedFlashsale, fontSize: 12 }}>Kirim</Text>
                        </TouchableOpacity> */}

                    </View> : null
                }
                <View style={{ flex: 1, backgroundColor: 'transparent', marginBottom: Hp('13.7%') }}>
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
                    <View style={[style.row_start_center, { width: "80%", height: Hp('5.5%'), borderRadius: 100, backgroundColor: colors.White, opacity: 0.8 }]}>
                        <TextInput
                            style={{
                                width: "85%",
                                fontSize: Wp("4%"),
                                borderColor: "gray",
                                borderBottomLeftRadius: 100,
                                borderTopLeftRadius: 100,
                                paddingHorizontal: 20,
                            }}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
                            value={isiChat}
                        />
                        {!isiChat.length ?
                            <IconButton
                                icon={require('../../assets/icons/camera.png')}
                                style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                                color={colors.BlueJaja}
                                onPress={() => galeryRef.current?.setModalVisible(true)}
                            /> : null}
                    </View>

                    <IconButton
                        icon={require('../../assets/icons/send.png')}
                        style={{ margin: 0, backgroundColor: colors.BlueJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                        color={colors.White}
                        onPress={() => handleSend(null)}
                    />
                </View>

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
