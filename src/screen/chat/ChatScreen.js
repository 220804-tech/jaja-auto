import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ImageBackground, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, StatusBar, Dimensions, PermissionsAndroid, Alert } from "react-native";
import React, { useState, useEffect, createRef } from "react";
import { Divider, IconButton, Menu, TouchableRipple, Provider } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import firebaseDatabase from '@react-native-firebase/database';
import ActionSheet from 'react-native-actions-sheet';
import { colors, Hp, Wp, ServiceFirebase as Firebase, styles as style, Loading, Utils, useNavigation, ServiceProduct, Fa, FastImage } from "../../export";
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
    const [visible, setVisible] = React.useState(false);

    const { data, product, order } = route.params;

    const dispatch = useDispatch()
    const listChat = [{ id: '1SX', text: 'Halo!' }, { id: '1SX', text: 'Halo, apakah barang ini ready?' }, { id: '2SX', text: 'Halo, apakah bisa mengirim hari ini?' }, { id: '3SX', text: 'Terima kasih!' }, { id: '4SX', text: 'Sama-sama!' },]
    const reduxLoad = useSelector(state => state.product.productLoad)
    const [keyboardStatus, setKeyboardStatus] = useState(24)

    useEffect(() => {
        handleFirebase()
        console.log('test masuk sini')
        return () => {
            // if (data.name) {
            //     setnameChat(data.name);
            // }
        }
    }, []);

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
        console.log('test kesini test')
        return () => {
            // if (selectedOrder.invoice) {
            //     setLoading(true)
            // }
        }
    }, [])

    const handleFirebase2 = () => {
        try {
            if (product && Object.keys(product).length && selectedProduct != null) {
                setSelectedProduct(product)
            }

            if (order && Object.keys(order).length && selectedOrder !== null) {
                setselectedOrder(order)
            }

            firebaseDatabase()
                .ref("/friend/" + data.id + reduxUser.uid + '/amount')
                .once('value')
                .then(snapshot => {
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

                await fetch("https://jaja.id/backend/chat/image", requestOptions)
                    .then(response => response.text())
                    .then(res => {
                        try {
                            let result = JSON.parse(res)
                            if (result.status.code === 200) {
                                imageUrl = result.data.url
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
                        setLoading(false)
                    });
            }
            if (isiChat.length > 0 || image || selectedOrder || selectedProduct) {
                setLoading(false)
                let chat = isiChat.length > 0 ? isiChat : imageUrl ? 'Mengirim gambar' : selectedOrder.invoice ? 'Pesanan No. ' + selectedOrder.invoice : selectedProduct.name
                var message = {
                    message: isiChat,
                    read: false,
                    time: firebaseDatabase.ServerValue.TIMESTAMP,
                    date: new Date().toString(),
                    from: reduxUser.uid,
                    image: imageUrl,
                    order: null
                }
                if (data && reduxAuth) {
                    try {
                        setLoading(false)
                        if (selectedOrder) {
                            message.order = selectedOrder
                        }
                        if (selectedProduct?.name) {
                            console.log("🚀 ~ file: ChatScreen.js ~ line 201 ~ handleSend ~ selectedProduct?.name", selectedProduct?.name)
                            handleSendProduct(isiChat)
                        } else {
                            try {
                                setTimeout(() => {
                                    setselectedOrder(null)
                                    var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
                                    firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message); //pengirimnya
                                    firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: chat, time: new Date().toString() } });
                                    firebaseDatabase().ref('friend/' + data.id + "/" + reduxUser.uid).update({ chat: data.chat, name: reduxUser.name, message: { text: chat, time: new Date().toString() }, amount: amountNow ? amountNow + 1 : 1 });
                                    if (target) {
                                        try {
                                            Firebase.notifChat(target, { body: chat, title: reduxUser.name })
                                            Firebase.buyerNotifications('chat', data.id)
                                            // await Firebase.sellerNotifications('chat', data.id)

                                        } catch (error) {
                                            console.log("🚀 ~ file: ChatScreen.js ~ line 182 ~ setTimeout ~ error", error)
                                        }
                                    }
                                }, selectedProduct && selectedProduct.name ? 100 : 0);
                            } catch (error) {
                                console.log("🚀 ~ file: ChatScreen.js ~ line 229 ~ handleSend ~ error", error)
                            }
                        }

                    } catch (error) {
                        console.log("🚀 ~ file: ChatScreen.js ~ line 234 ~ handleSend ~ error", error)
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
            if (selectedProduct?.name) {
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
                console.log("🚀 ~ file: ChatScreen.js ~ line 244 ~ handleSendProduct ~ selectedProduct?.name", selectedProduct?.name)
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
            <View style={{ width: Wp("100%"), padding: "3%" }}>
                {item.date && index && String(messageList[index].date) !== "undefined" > 0 && !item.productTitle ?
                    String(messageList[index].date).slice(6, 10) !== String(messageList[index - 1].date).slice(6, 10) ?
                        <View style={{ alignSelf: 'center', marginVertical: '3%' }}>
                            <Text style={[style.font_16, { color: colors.BlackGrey }]}>{dateNow === 'Mon' ? "Senin " + dateRight : dateNow == 'Tue' ? 'Selasa ' + dateRight : dateNow == 'Wed' ? 'Rabu ' + dateRight : dateNow == 'Thu' ? 'Kamis ' + dateRight : dateNow === 'Fri' ? 'Jumat ' + dateRight : dateNow == 'Sat' ? 'Sabtu ' + dateRight : 'Minggu ' + dateRight}</Text>
                        </View> : null
                    : null
                }
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
                {
                    item.from === reduxUser.uid ?
                        <View style={{ flex: 0, flexDirection: "row", width: '100%' }}>
                            <View style={{
                                width: "100%",
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: "flex-end",
                                alignSelf: "flex-end",
                            }}>

                                {item.image ?
                                    <View style={[{ width: Wp('50%'), height: Wp('50%'), alignItems: 'flex-start', justifyContent: 'flex-start', marginRight: '3%', backgroundColor: colors.WhiteGrey, borderRadius: 3, opacity: 0.9 }]}>
                                        {/* <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} /> */}
                                        <FastImage
                                            style={[{ height: '100%', width: '100%', alignSelf: 'flex-start', justifyContent: 'flex-start' }]}
                                            source={{ uri: item.image }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    : item.order && Object.keys(item.order).length ?
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
                                        :
                                        <View
                                            style={{
                                                maxWidth: "80%",
                                                borderWidth: 0.2,
                                                borderRadius: 15,
                                                borderColor: colors.YellowChat,
                                                borderTopRightRadius: 0,
                                                marginVertical: 5,
                                                // marginHorizontal: 10,
                                                backgroundColor: colors.YellowChat,
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
                                }
                            </View>
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{
                                width: "100%",
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: "flex-start",
                                alignSelf: "flex-start",
                            }}>
                                {item.image ?
                                    <View style={[{ width: Wp('45%'), height: Wp('50%'), alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginLeft: 1, backgroundColor: colors.WhiteGrey, borderRadius: 3 }]}>
                                        {/* <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} /> */}
                                        <FastImage
                                            style={[{ height: '95%', width: '95%', alignSelf: 'center', borderRadius: 3 }]}
                                            source={{ uri: item.image }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    :
                                    <View
                                        style={{
                                            maxWidth: "80%",
                                            borderWidth: 0.2,
                                            borderRadius: 15,
                                            borderColor: colors.Silver,
                                            borderTopRightRadius: 0,
                                            marginVertical: 5,
                                            backgroundColor: colors.Silver,
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

                                    </View>}

                            </View>
                        </View>
                }

            </View >
        );
    }

    function setChat(value) {
        setIsiChat(value)
    }

    const requestCameraPermission = async (open) => {

        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    if (open === 'camera') {
                        handleOpenCamera()
                    } else {
                        handlePickImage()
                    }
                } else {
                    console.log("Camera permission denied");
                }
            } else { }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleOpenCamera = () => {
        try {
            launchCamera({
                durationLimit: 61,
                quality: 0.9,
                includeBase64: true
            }).then(res => {
                galeryRef.current?.setModalVisible(false)
                if (!res?.didCancel) {
                    setLoading(true)
                    handleSend(res?.assets?.[0]?.base64)
                    res?.errorCode ? setLoading(false) : null
                }
            }).catch(err => {
                galeryRef.current?.setModalVisible(false)
                console.log("🚀 ~ file: ChatScreen.js ~ line 595 ~ handleOpenCamera ~ err", err)
                setLoading(false)
            })
        } catch (error) {
            galeryRef.current?.setModalVisible(false)
            setLoading(false)
            console.log("🚀 ~ file: ChatScreen.js ~ line 603 ~ handleOpenCamera ~ error", error)

        }
    }

    const handlePickImage = () => {
        try {
            launchImageLibrary({
                durationLimit: 61,
                compressVideoPreset: '640x480',
                quality: 0.9,
                includeBase64: true,
            }).then(res => {
                if (!res?.didCancel) {
                    galeryRef.current?.setModalVisible(false)
                    setLoading(true)
                    handleSend(res?.assets?.[0]?.base64)
                    res?.errorCode ? setLoading(false) : null
                }

            }).catch(err => {
                console.log("🚀 ~ file: ChatScreen.js ~ line 629 ~ handlePickImage ~ err", err)
                setLoading(false)
            })
        } catch (error) {
            console.log("🚀 ~ file: ChatScreen.js ~ line 658 ~ handlePickImage ~ error", error)
            setLoading(false)
        }
    }

    const handlePickVideo = (indx) => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            compressVideoPreset: '640x480',
            // compressImageQuality: 1,
            maxFiles: 1,
            includeBase64: true,
        }).then(async video => {
            try {
                let base64data = await RNFS.readFile(video.path, 'base64').then();
                let newData = JSON.parse(JSON.stringify(data))
                newData[indx].videoShow = video.path;
                newData[indx].video = base64data;
                setData(newData)
                // setIdx(null)
            } catch (error) {
                console.log("🚀 ~ file: AddReview.js ~ line ss100 ~ handlePickVideo ~ error", error)
            }
        });
    }

    const handleRemove = async () => {
        // ini fungsi hapus chat
        try {
            setVisible(false)
            Alert.alert(
                Platform.OS == 'android' ? "Hapus Pesan" : 'Blokir',
                Platform.OS == 'android' ? `Semua pesan anda dengan ${String(data.name)} akan dihapus!` : `Blokir ${String(data.name)}!`,
                [
                    {
                        text: "Batal",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: Platform.OS == 'android' ? "Hapus" : 'Blokir', onPress: async () => {
                            setLoading(true)
                            firebaseDatabase().ref('/messages/' + data.chat).set(null);
                            firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).set(null);
                            let newArr = [];
                            setMessageList(newArr)
                            setTimeout(() => {
                                setLoading(false)
                                navigation.goBack()
                            }, 500);
                        }
                    }],
                { cancelable: false }
            );
        } catch (error) {
            console.log("🚀 ~ file: ChatScreen.js ~ line 707 ~ handleRemove ~ error", error)
        }
    }


    const handleBlock = () => {
        // fungsi ini gadipake dulu jadi nggk ad feature blok seller (permintaan ios) cukup pake fungsi diatas ini
        try {
            setVisible(false)
            Alert.alert(
                "Blokir Penjual",
                `Penjual yang diblokir tidak akan bisa chat kamu lagi!`,
                [
                    {
                        text: "Batal",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Blokir", onPress: async () => {
                            setLoading(true)
                            await firebaseDatabase().ref('friend/' + reduxUser.uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: 'anda memblokir penjual ini.', time: new Date().toString() }, blocked: true });
                            navigation.goBack()
                            setTimeout(() => {
                                setLoading(false)
                            }, 200);
                        }
                    }],
                { cancelable: false }
            );
        } catch (error) {
            console.log("🚀 ~ file: ChatScreen.js ~ line 707 ~ handleRemove ~ error", error)
            setLoading(false)
        }
    }
    return (
        <Provider>
            <SafeAreaProvider style={[style.containerFix]}>
                <StatusBar translucent={false} backgroundColor={colors.jaja} barStyle="light-content" />
                {/* <Appbar chat={true} back={true} title={data && data.name ? data.name : ''} /> */}
                <View style={[style.appBar, { elevation: 0 }]}>
                    <View style={[style.row_start_center, { width: '75%' }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                style={[style.icon_27, style.mr_3, { tintColor: colors.White }]}
                                source={require("../../assets/icons/arrow.png")}
                            />
                        </TouchableOpacity>
                        <Text adjustsFontSizeToFit style={[style.font_13, style.T_bold, { color: colors.White }]}>
                            {data && data.name ? data.name : ''}
                        </Text>
                    </View>
                    <Menu
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        anchor={<TouchableOpacity onPress={() => setVisible(true)}><Image
                            style={[style.appBarButton, style.mr]}
                            source={require("../../assets/icons/options.png")}
                        /></TouchableOpacity>}>
                        <Menu.Item onPress={handleRemove} title={Platform.OS == 'android' ? "Hapus Chat" : "Blokir Penjual"} />

                        {/* <Menu.Item onPress={handleRemove} title="Hapus Pesan" />
                        <Menu.Item onPress={handleBlock} title="Blokir Seller" /> */}
                        <Divider />
                    </Menu>
                </View>



                <ImageBackground source={require('../../assets/images/bgChat3.jpg')} style={{ width: '100%', height: '100%', paddingBottom: Math.max(insets.bottom, 50) }}>
                    {loading ? <Loading /> : null}
                    <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />

                    <View style={[styles.inner, { paddingBottom: keyboardStatus }]}>
                        {selectedProduct?.name ?
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
                                            <Text style={{ color: colors.RedFlashsale, fontFamily: 'SignikaNegative-SemiBold', fontSize: Wp("4%") }}>
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
                            style={[style.pt_2, { height: '92%', }]}
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
                                    if (item.text != 'Halo, apakah barang ini ready?' || selectedProduct?.name) {
                                        return (
                                            <TouchableOpacity key={item.id} onPress={() => setChat(item.text)} style={[style.py, {
                                                flex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White, borderRadius: 7, marginHorizontal: 3, paddingHorizontal: 11, shadowColor: colors.BlueJaja,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 1,
                                                },
                                                shadowOpacity: 0.18,
                                                shadowRadius: 1.00,

                                                elevation: 1,
                                            }]}>
                                                <Text style={[style.font_10, { color: colors.BlackGrayScale, textAlign: 'center', textAlignVertical: 'center' }]}>{item.text}</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                }}
                                keyExtractor={(item, index) => String(index)}
                            />

                        </View>

                        <View style={[style.row_around_center, style.px_2, style.mb_2, { height: '7%', backgroundColor: 'transparent', }]}>
                            <View style={[style.row_start_center, {
                                width: "80%", height: '77%', borderRadius: 100, backgroundColor: colors.White, opacity: 0.9, shadowColor: colors.Silver,
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,
                            }]}>

                                <TextInput
                                    // onFocus={() => setkeyboardFocus(300)}
                                    // onBlur={() => setkeyboardFocus(5)}
                                    // onPressOut={() => setkeyboardFocus(5)}
                                    // onBlur={() => setkeyboardFocus(5)}
                                    // onTouchCancel={() => setkeyboardFocus(5)}
                                    style={[style.font_14, { width: "82%", borderColor: "gray", borderBottomLeftRadius: 100, borderTopLeftRadius: 100, paddingHorizontal: 20, marginBottom: '-1%' }]}
                                    // underlineColorAndroid="transparent"
                                    onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
                                    value={isiChat}
                                />
                                {!isiChat.length ?
                                    <IconButton
                                        icon={require('../../assets/icons/camera.png')}
                                        style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100, }}
                                        color={colors.YellowChat}
                                        onPress={() => galeryRef.current?.setModalVisible(true)}
                                    /> : null}
                            </View>
                            <IconButton
                                icon={require('../../assets/icons/send.png')}
                                style={{
                                    margin: 0, backgroundColor: colors.White, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100,
                                    opacity: 0.9,
                                    shadowColor: colors.Silver,
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,

                                    elevation: 2,
                                }}
                                color={colors.YellowChat}
                                onPress={() => handleSend(null)}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White, marginBottom: '10%' }} ref={galeryRef}>
                    <View style={[style.column, style.pb_5, { backgroundColor: '#ededed' }]}>
                        <TouchableOpacity onPress={() => requestCameraPermission('camera')} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '0.5%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => requestCameraPermission('gallery')} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '0.5%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                        </TouchableOpacity>
                    </View >
                </ActionSheet>
            </SafeAreaProvider >
        </Provider>
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