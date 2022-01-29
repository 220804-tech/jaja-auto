import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ImageBackground, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, StatusBar, Dimensions } from "react-native";
import React, { useState, useEffect, createRef } from "react";
import { IconButton, TouchableRipple } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import firebaseDatabase from '@react-native-firebase/database';
import ActionSheet from 'react-native-actions-sheet';
import { colors, Hp, Wp, Appbar, ServiceFirebase as Firebase, styles as style, Loading, Utils, useNavigation, ServiceProduct } from "../../export";
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { utils } from "@react-native-firebase/app";
import { useAndroidBackHandler } from "react-navigation-backhandler";
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function ChatScreen({ route }) {
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const galeryRef = createRef()
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

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
    const [target, setTarget] = useState(null)
    const [keyboardFocus, setkeyboardFocus] = useState(5)

    const [nameChat, setnameChat] = useState("")
    const [dataFriend, setdataFriend] = useState("")
    const [messageList, setMessageList] = useState('');
    const [gambar, setGambar] = useState("");
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedOrder, setselectedOrder] = useState('')
    const [targetRead, settargetRead] = useState(false)
    const [amountNow, setamountNow] = useState(0)

    const { data, product, order } = route.params;

    const dispatch = useDispatch()
    const listChat = [{ id: '1SX', text: 'Halo!' }, { id: '1SX', text: 'Halo, apakah barang ini ready?' }, { id: '2SX', text: 'Halo, apakah bisa dikirim hari ini?' }, { id: '3SX', text: 'Terima kasih!' }, { id: '4SX', text: 'Sama-sama!' },]
    const reduxLoad = useSelector(state => state.product.productLoad)
    const [keyboardStatus, setKeyboardStatus] = useState(24);
    console.log("🚀 ~ file: ChatScreen.js ~ line 53 ~ ChatScreen ~ keyboardStatus", keyboardStatus)
    useEffect(() => {
        handleFirebase()
        return () => {
            setnameChat(data.name);

        }
    }, [data?.name]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
            setKeyboardStatus(44);
        });
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardStatus(24);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    const handleFirebase = () => {
        try {
            firebaseDatabase().ref('/messages/' + data.chat).on('value', function (snapshoot) {
                if (snapshoot.val() !== null) {
                    let key = snapshoot.val()
                    const values = Object.values(snapshoot.val());
                    let arr = [];
                    for (const key of values) {
                        arr.push(key)
                    }
                    setLoading(false)
                    setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
                    firebaseDatabase().ref("/people/" + data.id).once("value", function (snap) {
                        var item = snap.val();
                        if (item != null && item.photo != null) {
                            setesellerImage(item.photo)
                        }
                    })
                    Object.entries(key).forEach(([key, value]) => {
                        if (value.from !== reduxUser.uid) {
                            firebaseDatabase().ref(`/messages/${data.chat}/${key}`).update({ read: true })
                        }

                    })
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: ChatScreen.js ~ line 86 ~ handleFirebase ~ error", error)
        }
    }

    useEffect(() => {
        handleFirebase2()
        return () => {
            setLoading(true)
        }
    }, [selectedOrder])

    const handleFirebase2 = () => {
        try {
            if (product && Object.keys(product).length && selectedProduct !== null) {
                setSelectedProduct(product)
            }
            if (order && Object.keys(order).length && selectedOrder !== null) {
                setselectedOrder(order)
            }
            firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid + '/amount').on('value', snapshot => {
                if (snapshot.val()) {
                    settargetRead(false)
                } else {
                    settargetRead(true)
                }
            })

            firebaseDatabase()
                .ref("/people/" + data.id + "/token")
                .once('value')
                .then(snapshot => setTarget(String(snapshot.val())))
            setTimeout(() => setLoading(false), 1000);
        } catch (error) {
            console.log("🚀 ~ file: ChatScreen.js ~ line 119 ~ handleFirebase2 ~ error", error)
        }

    }

    const handleSend = async (image) => {
        try {
            let imageUrl = ''
            if (image) {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", reduxAuth);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");
                var raw = JSON.stringify({
                    "image": image
                });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://jaja.id/backend/chat/image", requestOptions)
                    .then(response => response.text())
                    .then(res => {
                        try {
                            let result = JSON.parse(res)
                            if (result.status.code === 200) {
                                imageUrl = result.data.url
                                console.log('result kamera')

                            } else {
                                imageUrl = false
                            }
                        } catch (error) {
                            imageUrl = false
                        }
                    })
                    .catch(error => {
                        imageUrl = false
                        Utils.handleError(error, 'Error with status code : 12044')
                    });
            }

            if (isiChat.length > 0 || image || selectedOrder || selectedProduct) {
                let chat = isiChat.length > 0 ? isiChat : imageUrl ? 'Mengirim gambar' : selectedOrder && Object.keys(selectedOrder).length ? 'Pesanan No. ' + selectedOrder.invoice : selectedProduct.name
                var message = {
                    message: isiChat,
                    read: false,
                    time: firebaseDatabase.ServerValue.TIMESTAMP,
                    date: new Date().toString(),
                    from: reduxUser.uid,
                    image: imageUrl,
                    order: null
                }
                console.log("🚀 ~ file: ChatScreen.js ~ line 155 ~ handleSend ~ message", message)
                if (data && reduxAuth) {
                    try {
                        setLoading(false)
                        if (selectedOrder) {
                            message.order = selectedOrder
                        }
                        if (selectedProduct && Object.keys(selectedProduct).length) {
                            handleSendProduct(isiChat)
                        } else {
                            setTimeout(() => {
                                setselectedOrder(null)
                                var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                                firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                                firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: chat, time: new Date().toString() } });
                                firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: chat, time: new Date().toString() }, amount: amountNow ? amountNow + 1 : 1 });
                                if (target) {
                                    console.log("🚀 ~ file: ChatScreen.js ~ line 170 ~ setTimeout ~ target", typeof target)
                                    try {
                                        Firebase.notifChat(target, { body: chat, title: reduxUser.name })
                                        // await Firebase.buyerNotifications('chat', data.id)
                                    } catch (error) {
                                        console.log("🚀 ~ file: ChatScreen.js ~ line 182 ~ setTimeout ~ error", error)
                                    }
                                }
                            }, selectedProduct && Object.keys(selectedProduct).length ? 100 : 0);
                        }

                    } catch (error) {

                        // alert(error)
                        setLoading(false)


                    }
                } else {
                    setLoading(false)
                }
                setIsiChat('')
                setGambar("")
            }
        } catch (error) {
            setLoading(false)
        }
    }

    const handleSendProduct = (msg) => {
        try {
            if (selectedProduct && Object.keys(selectedProduct).length) {
                var message = {
                    message: msg ? msg : '',
                    read: false,
                    time: firebaseDatabase.ServerValue.TIMESTAMP,
                    from: reduxUser.uid,
                    priceDiscount: selectedProduct.discount,
                    priceFirst: selectedProduct.price,
                    priceLast: selectedProduct.isDiscount ? selectedProduct.priceDiscount : selectedProduct.price,
                    productImage: selectedProduct.image[0],
                    productTitle: selectedProduct.name,
                    productSlug: selectedProduct.slug,

                }
                setSelectedProduct(null)
                if (data) {
                    try {
                        var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                        firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                        firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: selectedProduct.name, time: new Date().toString() } });

                        firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid + '/amount').once('value').then(snapshot => {
                            let amountNow = snapshot.val()
                            firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: selectedProduct.name, time: new Date().toString() }, amount: amountNow ? amountNow + 1 : 1 });
                        });
                    } catch (error) {
                        console.log("data error", error)
                    }
                }
                setIsiChat('')
                setGambar("")
            }
        } catch (error) {

        }
    }
    const handleOrderDetails = (item) => {
        dispatch({ type: 'SET_INVOICE', payload: item.invoice })
        dispatch({ type: 'SET_ORDER_STATUS', payload: item.status })
        navigation.navigate('OrderDetails', { data: item.invoice, status: "Pengiriman" })
    }

    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                !status ? await navigation.push("Product") : null
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                ServiceProduct.getProduct(reduxAuth, item.productSlug).then(res => {
                    error = false
                    if (res === 404) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        navigation.goBack()
                    } else if (res?.data) {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        setTimeout(() => dispatch({ type: 'SET_FILTER_LOCATION', payload: true }), 7000);
                    }
                })
            } else {
                error = false
            }
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
            error = false
        }
        setTimeout(() => {
            if (error) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                Utils.handleSignal()
                setTimeout(() => Utils.alertPopUp('Sedang memuat ulang..'), 2000);
                error = false
                handleShowDetail(item, true)
            }
        }, 20000);
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
                        item.image ?
                            // <View style={[style.row_center, { width: Wp('65%'), height: Wp('65%'), backgroundColor: colors.BlueJaja, alignSelf: 'flex-end', paddingRight: '5%', borderRadius: 5 }]}>
                            //     <Image source={{ uri: item.image }} style={{ width: '96%', height: '96%', resizeMode: 'cover', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }} />
                            // </View>
                            <View style={[{ width: Wp('70%'), height: Wp('70%'), alignSelf: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', paddingHorizontal: '0.5%', marginRight: '-3%' }]}>
                                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center', borderWidth: 0.5, borderColor: colors.Silver }} />
                            </View>
                            :
                            <>
                                {item.order && Object.keys(item.order).length ?
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

                                            <Text onPress={() => handleOrderDetails(item.order)} style={[style.font_13, { textAlign: "right", color: colors.White }]}>
                                                No. {item.order.invoice}
                                            </Text>
                                            <Text onPress={() => handleOrderDetails(item.order)} style={[style.font_11, style.mb_5, { textAlign: "right", color: colors.White }]}>
                                                {item.order.status}
                                            </Text>
                                            <View style={[style.column_end_center, { width: Wp('25%'), height: Wp('25%'), alignSelf: 'flex-end', backgroundColor: colors.BlueLight }]}>
                                                <Image source={{ uri: item.order.imageOrder }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            </View>
                                        </View>
                                    </View>
                                    : null}
                                {item.productTitle ?
                                    <TouchableRipple style={{
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
                                        rippleColor={colors.BlueJaja}
                                        onPress={() => handleShowDetail(item, false)}>
                                        <>
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
                                                <Text numberOfLines={1} style={[style.font_12, { width: '90%' }]}>{item.productTitle}</Text>
                                                {item.priceDiscount && parseInt(item.priceDiscount) > 0 ?
                                                    <View style={{ flex: 0, flexDirection: 'column' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text adjustsFontSizeToFit style={[style.font_7, style.mr_2, { textDecorationLine: 'line-through' }]}>{item.priceFirst}</Text>
                                                            <View style={{ backgroundColor: colors.RedFlashsale, justifyContent: 'center', alignItems: 'center', borderRadius: 3, paddingHorizontal: '1.5%' }}>
                                                                <Text adjustsFontSizeToFit style={[style.font_8, style.T_semi_bold, { color: 'white' }]}>{item.priceDiscount + "%"}</Text>
                                                            </View>
                                                        </View>
                                                        <Text adjustsFontSizeToFit style={[style.font_12, style.mr_3, style.mt]}>{item.priceLast}</Text>
                                                    </View>

                                                    :
                                                    <Text style={style.font_12}>
                                                        {item.priceLast}
                                                    </Text>
                                                }
                                            </View>
                                        </>
                                    </TouchableRipple>
                                    : null
                                }
                                {item.message ?
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

                                            {item.message ?
                                                <>
                                                    <Text style={[style.font_12, { color: colors.White }]}>
                                                        {item.message}
                                                    </Text>
                                                    {item.date ?
                                                        <View style={style.row_end_center}>
                                                            <Text style={[style.font_11, style.mt_2, { color: colors.White, alignSelf: 'flex-end' }]}>{item.date.slice(16, 21)}  </Text>
                                                            <Image source={require('../../assets/icons/check.png')} style={[style.icon_12, {
                                                                marginBottom: '-0.2%',
                                                                tintColor: item.read ? colors.YellowJaja : colors.WhiteSilver
                                                            }]} />
                                                        </View>
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
                                    : null}

                            </>

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
                                {item.image ?
                                    <View
                                        style={{
                                            width: Wp('100%'),
                                            justifyContent: "flex-start",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View style={[{ width: Wp('70%'), height: Wp('70%'), alignSelf: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                                            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'flex-end', padding: "0.2%", borderWidth: 0.5, borderColor: colors.Silver }} />
                                        </View>
                                    </View>
                                    : null}
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
                                            <Text style={[style.font_12, { color: colors.White }]}>
                                                {item.message}
                                            </Text>
                                        </>
                                        : null}
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

    function setChat(value) {
        setIsiChat(value)
    }

    const handleOpenCamera = () => {
        launchCamera({
            durationLimit: 61,
            quality: 0.9,
            includeBase64: true
        }).then(res => {
            console.log("🚀 ~ file: ChatScreen.js ~ line 593 ~ handleOpenCamera ~ res",)
            galeryRef.current?.setModalVisible(false)
            setLoading(true)
            handleSend(res?.assets?.[0]?.base64)
            res?.errorCode ? setLoading(false) : null
        }).catch(err => {
            console.log("🚀 ~ file: ChatScreen.js ~ line 595 ~ handleOpenCamera ~ err", err)
            setLoading(false)
        })
    }


    const handlePickImage = () => {

        launchImageLibrary({
            durationLimit: 61,
            quality: 0.9,
            includeBase64: true,
        }).then(res => {
            galeryRef.current?.setModalVisible(false)
            setLoading(true)
            handleSend(res?.assets?.[0]?.base64)
            res?.errorCode ? setLoading(false) : null
        }).catch(err => {
            console.log("🚀 ~ file: ChatScreen.js ~ line 629 ~ handlePickImage ~ err", err)
            setLoading(false)
        })

    }

    const handlePickVideo = (indx) => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            compressVideoPreset: '640x480',
            compressImageQuality: 1,
            maxFiles: 1,
            includeBase64: true,
        }).then(async video => {
            try {
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
    return (
        <SafeAreaProvider style={[style.container, { paddingTop: STATUS_BAR_HEIGHT, backgroundColor: colors.BlueJaja }]}>
            {loading ? <Loading /> : null}
            <ImageBackground source={require('../../assets/images/bgChat3.jpg')} style={[style.column, { flex: 1 }]}>
                <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
                <Appbar back={true} title={data && data.name ? data.name : ''} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={style.container}
                >


                    <View style={[styles.inner, { paddingBottom: keyboardStatus }]}>
                        {selectedProduct && Object.keys(selectedProduct).length ?
                            <TouchableRipple style={{
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
                                rippleColor={colors.BlueJaja}>
                                <>
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
                                            source={{ uri: product.image[0] ? product.image[0] : null }}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={style.row}>
                                            <Text numberOfLines={1} style={[style.font_12, style.mr_2, { width: '90%' }]}>{product.name}</Text>
                                            <Image style={{
                                                alignSelf: "center",
                                                width: Wp("3.5%"),
                                                height: Wp("3.5%"),
                                                borderRadius: 2,
                                                tintColor: colors.RedDanger
                                            }}
                                                resizeMethod={"scale"}
                                                resizeMode={"cover"}
                                                source={require('../../assets/icons/close.png')}
                                            />
                                        </View>
                                        {product.isDiscount ?
                                            <View style={{ flex: 0, flexDirection: 'column' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text adjustsFontSizeToFit style={[style.font_9, { textDecorationLine: 'line-through', marginRight: '3%' }]}>{product.price}</Text>
                                                    <View style={{ backgroundColor: colors.RedFlashsale, justifyContent: 'center', alignItems: 'center', borderRadius: 3, paddingHorizontal: '2%' }}>
                                                        <Text adjustsFontSizeToFit style={[style.font_10, style.T_medium, { color: 'white' }]}>{product.discount + "%"}</Text>
                                                    </View>
                                                </View>
                                                <Text adjustsFontSizeToFit style={[style.font_12, { marginRight: '3%' }]}>{product.priceDiscount}</Text>
                                            </View>

                                            :
                                            <Text style={{ color: colors.RedFlashsale, fontFamily: 'Poppins-SemiBold', fontSize: Wp("4%") }}>
                                                {product.price}
                                            </Text>
                                        }
                                    </View>
                                </>
                            </TouchableRipple>
                            : null
                        }
                        <FlatList
                            scrollEnabled={true}
                            inverted={-1}
                            ref={flatlist}
                            style={[style.pt_2, style.px_2]}
                            data={messageList}
                            renderItem={renderRow}
                            keyExtractor={(item, index) => String(index)}
                        />


                        <View style={{ width: Wp('100%'), }}>
                            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {listChat.map((item, index) => {
                        return (
                            <TouchableRipple borderless={true} rippleColor={colors.BlueJaja} key={item.id} onPress={() => setChat(item.text)} style={[style.py, { backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.BlueJaja, borderRadius: 11, marginRight: 5, paddingHorizontal: '1%' }]}>
                                <Text style={[style.font_11, { color: colors.BlueJaja }]}>{item.text}</Text>
                            </TouchableRipple>
                        )
                    })}
                </ScrollView> */}
                            <FlatList
                                horizontal={true}
                                style={[{ width: Wp('100%'), backgroundColor: 'transparent', height: Hp('3.5%') }]}
                                data={listChat}
                                contentContainerStyle={[style.px_4]}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity key={item.id} onPress={() => setChat(item.text)} style={[style.py, { flex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.Blackk, borderRadius: 9, marginHorizontal: 3, paddingHorizontal: 11 }]}>
                                            <Text style={[style.font_11, { color: colors.BlackGrayScale, textAlign: 'center', textAlignVertical: 'center' }]}>{item.text}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={(item, index) => String(index)}
                            />
                        </View>

                        <View style={[style.row_around_center, style.px_2, { backgroundColor: 'transparent' }]}>
                            <View style={[style.row_start_center, {
                                width: "80%", height: '77%', borderRadius: 100, backgroundColor: colors.White
                            }]}>
                                <TextInput
                                    // onFocus={() => setkeyboardFocus(300)}
                                    // onBlur={() => setkeyboardFocus(5)}
                                    // onPressOut={() => setkeyboardFocus(5)}
                                    // onBlur={() => setkeyboardFocus(5)}
                                    // onTouchCancel={() => setkeyboardFocus(5)}
                                    style={[style.font_12, { width: isiChat.length ? '90%' : '82%', borderColor: "gray", borderBottomLeftRadius: 100, borderTopLeftRadius: 100, paddingHorizontal: 20, paddingVertical: 0 }]}
                                    // underlineColorAndroid="transparent"
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
                                style={{ margin: 0, backgroundColor: colors.White, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100, }}
                                color={colors.BlueJaja}
                                onPress={() => handleSend(null)}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
            <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White, marginBottom: '10%' }} ref={galeryRef}>
                <View style={[style.column, style.pb_5, { backgroundColor: '#ededed' }]}>
                    <TouchableOpacity onPress={handleOpenCamera} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '0.5%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '0.5%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                    </TouchableOpacity>
                </View >
            </ActionSheet>
        </SafeAreaProvider >
        // <SafeAreaView style={[style.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
        //     {/* <SafeAreaProvider style={[style.container, { backgroundColor: Platform.OS === 'ios' ? colors.White : null }]}> */}
        //     {/* <View style={[style.column, { flex: 1, backgroundColor: Platform.OS === 'ios' ? colors.WhiteBack : null }]}> */}
        //     <ImageBackground source={require('../../assets/images/bgChat3.jpg')} style={[style.column, { flex: 1 }]}>

        //         <View style={{ backgroundColor: 'transparent', width: Wp('100%') }}>
        //             {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        //                 {listChat.map((item, index) => {
        //                     return (
        //                         <TouchableRipple borderless={true} rippleColor={colors.BlueJaja} key={item.id} onPress={() => setChat(item.text)} style={[style.py, { backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.BlueJaja, borderRadius: 11, marginRight: 5, paddingHorizontal: '1%' }]}>
        //                             <Text style={[style.font_11, { color: colors.BlueJaja }]}>{item.text}</Text>
        //                         </TouchableRipple>
        //                     )
        //                 })}
        //             </ScrollView> */}
        //             <FlatList
        //                 horizontal={true}
        //                 style={[{ width: Wp('100%'), backgroundColor: 'transparent', height: Hp('3.5%') }]}
        //                 data={listChat}
        //                 contentContainerStyle={[style.px_4]}
        //                 showsHorizontalScrollIndicator={false}
        //                 renderItem={({ item }) => {
        //                     return (
        //                         <TouchableOpacity key={item.id} onPress={() => setChat(item.text)} style={[style.py, { flex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.Blackk, borderRadius: 9, marginHorizontal: 3, paddingHorizontal: 11 }]}>
        //                             <Text style={[style.font_11, { color: colors.BlackGrayScale, textAlign: 'center', textAlignVertical: 'center' }]}>{item.text}</Text>
        //                         </TouchableOpacity>
        //                     )
        //                 }}
        //                 keyExtractor={(item, index) => String(index)}
        //             />
        //         </View>

        //         {/* <View style={[style.row_around_center, style.px_2, { backgroundColor: 'transparent' }]}>
        //                 <View style={[style.row_start_center, {
        //                     width: "80%", height: '77%', borderRadius: 100, backgroundColor: colors.White
        //                 }]}>
        //                     <TextInput
        //                         // onFocus={() => setkeyboardFocus(300)}
        //                         // onBlur={() => setkeyboardFocus(5)}
        //                         // onPressOut={() => setkeyboardFocus(5)}
        //                         // onBlur={() => setkeyboardFocus(5)}
        //                         // onTouchCancel={() => setkeyboardFocus(5)}
        //                         style={[style.font_12, { width: isiChat.length ? '90%' : '82%', borderColor: "gray", borderBottomLeftRadius: 100, borderTopLeftRadius: 100, paddingHorizontal: 20, paddingVertical: 0 }]}
        //                         // underlineColorAndroid="transparent"
        //                         onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
        //                         value={isiChat}
        //                     />
        //                     {!isiChat.length ?
        //                         <IconButton

        //                             icon={require('../../assets/icons/camera.png')}
        //                             style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
        //                             color={colors.BlueJaja}
        //                             onPress={() => galeryRef.current?.setModalVisible(true)}
        //                         /> : null}
        //                 </View>
        //                 <IconButton
        //                     icon={require('../../assets/icons/send.png')}
        //                     style={{ margin: 0, backgroundColor: colors.White, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100, }}
        //                     color={colors.BlueJaja}
        //                     onPress={() => handleSend(null)}
        //                 />
        //             </View> */}
        //         {/* </ScrollView> */}
        //         <KeyboardAvoidingComponent />

        //     </ImageBackground>
        //     {/* </View> */}

        //     {/* </SafeAreaProvider > */}
        // </SafeAreaView >
    );
}

const styles = StyleSheet.create({
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
    inner: {

        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }
})
