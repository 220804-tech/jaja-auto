import React, { useEffect, useState } from 'react'
import { View, Image, SafeAreaView, StatusBar, ToastAndroid, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper'
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'
import { ServiceOrder, colors, styles, useNavigation } from '../../export';
import database from '@react-native-firebase/database';

export default function SplashScreen() {
    const reduxDashboard = useSelector(state => state.dashboard)

    const dispatch = useDispatch()

    let navigation = useNavigation()
    const [loading, setloading] = useState(false)
    const [sbColor, setsbColor] = useState(colors.BlueJaja)
    const images = [
        {
            title: "Sport & Outdoor",
            image: require("../../assets/images/splashscreen/splash_musics.jpg"),
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriSport",
            color: "#68b0c8"
        },
        {
            title: "Toys",
            image: require("../../assets/images/splashscreen/splash_toys.jpg"),
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriBuku",
            color: "#68b0c8"
        }
    ]

    useEffect(() => {
        try {
            EncryptedStorage.getItem('token').then(resp => {
                getItem(resp)
                getData()
                getOrders(resp)
                dispatch({ type: 'SET_AUTH', payload: JSON.parse(resp) })

            })
            EncryptedStorage.getItem('user').then(res => {
                if (res) {
                    dispatch({ type: 'SET_VERIFIKASI', payload: JSON.parse(res).isVerified })
                    dispatch({ type: 'SET_USER', payload: JSON.parse(res) })
                    getFirebase(JSON.parse(res))
                }
            })
        } catch (error) {
            // return ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.TOP)
        }

        setTimeout(() => {
            navigation.replace('Beranda')
        }, 4000);
    }, [])


    const getFirebase = (user) => {
        EncryptedStorage.getItem('deviceToken').then(res => {
            if (res) {
                let token = JSON.parse(res)
                database().ref("/people/" + user.uid).once('value').then(snapshot => {
                    let item = snapshot.val();
                    if (!item || !item.notif) {
                        console.log("🚀 ~ file: index.js ~ line 101 ~ firebase ~ else")
                        database().ref(`/people/${user.uid}/`).set({ name: user.name, photo: user.image, token: token, notif: { home: 0, chat: 0, orders: 0 } })
                        database().ref(`/friend/${user.uid}/null`).set({ chat: 'null' })
                    } else {
                        database().ref(`/people/${user.uid}/`).update({ name: user.name, photo: user.image, token: token })
                    }
                });
            }
        })
    }

    const getItem = async (token) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", token ? JSON.parse(token) : "");
            myHeaders.append("Cookie", "ci_session=gpkr7eq1528c92su0vj0rokdjutlsl2r");

            var raw = "";

            var requestOptions = {
                method: 'GET',
                headers: token ? myHeaders : "",
                body: raw,
                redirect: 'follow'
            };
            let hasil = null;
            fetch("https://jaja.id/backend/home", requestOptions)
                .then(response => response.json())
                .then(resp => {
                    hasil = true;
                    if (resp.status.code == 200 || resp.status.code == 204) {
                        if (resp.data.categoryChoice) {
                            dispatch({ type: 'SET_DASHCATEGORY', payload: resp.data.categoryChoice })
                            EncryptedStorage.setItem('dashcategory', JSON.stringify(resp.data.categoryChoice))
                        }
                        if (resp.data.flashSale) {
                            dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.data.flashSale })
                            EncryptedStorage.setItem('dashflashsale', JSON.stringify(resp.data.flashSale))
                        }
                        if (resp.data.trending) {
                            dispatch({ type: 'SET_DASHTRENDING', payload: resp.data.trending })
                            EncryptedStorage.setItem('dashtrending', JSON.stringify(resp.data.trending))
                        }
                        if (resp.data.basedOnSearch) {
                            dispatch({ type: 'SET_DASHPOPULAR', payload: resp.data.basedOnSearch })
                            EncryptedStorage.setItem('dashpopular', JSON.stringify(resp.data.basedOnSearch))
                        }
                    } else {
                        handleError(resp.status.message + " => " + resp.status.code)
                    }
                })
                .catch(error => {
                    handleError(error)
                })
            setTimeout(() => {
                if (!hasil) {
                    return ToastAndroid.show("Tidak dapat tehubung, periksa kembali koneksi anda", ToastAndroid.LONG, ToastAndroid.TOP)
                }
            }, 15000);
        } catch (error) {
            ToastAndroid.show("Error Get Item" + String(err), ToastAndroid.LONG, ToastAndroid.TOP)
            handleError(error)
        }
    }

    const handleError = (error) => {
        try {
            EncryptedStorage.getItem('dashcategory').then(result => {
                if (result) {
                    dispatch({ type: 'SET_DASHCATEGORY', payload: JSON.parse(result) })
                }
            })
            // EncryptedStorage.getItem('dashflashsale').then(result => {
            //     if (result) {
            //         dispatch({ type: 'SET_DASHFLASHSALE', payload: JSON.parse(result) })
            //     }
            // })
            EncryptedStorage.getItem('dashtrending').then(result => {
                if (result) {
                    dispatch({ type: 'SET_DASHTRENDING', payload: JSON.parse(result) })
                }
            })
            EncryptedStorage.getItem('dashhobyaverage').then(result => {
                if (result) {
                    dispatch({ type: 'SET_DASHHOBYAVERAGE', payload: JSON.parse(result) })
                }
            })
            if (String(error).slice(11, String(error).length) === "Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                Alert.alert(
                    "Error with status 12001",
                    JSON.stringify(error)
                    [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
        } catch (err) {
            return ToastAndroid.show("Handle Error " + String(err), ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }
    const getData = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/product/recommendation?page=1&limit=10", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code == 200 || result.status.code == 204) {
                    dispatch({ type: 'SET_DASHRECOMMANDED', payload: result.data.items })
                    EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                } else {
                    EncryptedStorage.getItem('dashrecommanded').then(res => {
                        if (res) {
                            dispatch({ type: 'SET_DASHRECOMMANDED', payload: JSON.parse(res) })
                        }
                        ToastAndroid.show(result.status.message + " : " + result.status.code, ToastAndroid.LONG, ToastAndroid.CENTER)
                    })

                }
            })
            .catch(error => {
                EncryptedStorage.getItem('dashrecommanded').then(store => {
                    if (store) {
                        dispatch({ type: 'SET_DASHRECOMMANDED', payload: JSON.parse(store) })
                    }
                })
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 12002",
                        JSON.stringify(error)
                        [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );

                }
            });
    }

    const getOrders = (token) => {
        try {
            if (token) {
                let auth = JSON.stringify(token)
                ServiceOrder.getUnpaid(auth).then(resUnpaid => {
                    if (resUnpaid) {
                        dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                        dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                    } else {
                        handleUnpaid()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12003",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                    handleUnpaid()
                })

                ServiceOrder.getWaitConfirm(auth).then(reswaitConfirm => {
                    if (reswaitConfirm) {
                        dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                    } else {
                        handleWaitConfirm()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12004",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                    handleWaitConfirm()
                })

                ServiceOrder.getProcess(auth).then(resProcess => {
                    if (resProcess) {
                        dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                    } else {
                        handleProcess()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12005",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );

                    } handleProcess()
                })

                ServiceOrder.getSent(auth).then(resSent => {
                    if (resSent) {
                        dispatch({ type: 'SET_SENT', payload: resSent.items })
                    } else {
                        handleSent()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12006",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );

                    } handleSent()
                })

                ServiceOrder.getCompleted(auth).then(resCompleted => {
                    if (resCompleted) {
                        dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                    } else {
                        handleCompleted()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12007",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );

                    }
                    handleCompleted()
                })

                ServiceOrder.getFailed(auth).then(resFailed => {
                    if (resFailed) {
                        dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                    } else {
                        handleFailed()
                    }
                }).catch(error => {
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Tidak dapat terhubung, periksa koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 12008",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );

                    }
                    handleFailed()
                })
            }
        } catch (error) {
            return ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }

    const handleUnpaid = () => {
        EncryptedStorage.getItem('unpaid').then(store => {
            if (store) {
                dispatch({ type: 'SET_UNPAID', payload: JSON.parse(store) })
            }
        })
    }
    const handleWaitConfirm = () => {
        EncryptedStorage.getItem('waitConfirm').then(store => {
            if (store) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: JSON.parse(store) })
            }
        })
    }
    const handleProcess = () => {
        EncryptedStorage.getItem('process').then(store => {
            if (store) {
                dispatch({ type: 'SET_PROCESS', payload: JSON.parse(store) })
            }
        })
    }
    const handleSent = () => {
        EncryptedStorage.getItem('sent').then(store => {
            if (store) {
                dispatch({ type: 'SET_SENT', payload: JSON.parse(store) })
            }
        })
    }
    const handleCompleted = () => {
        EncryptedStorage.getItem('completed').then(store => {
            if (store) {
                dispatch({ type: 'SET_COMPLETED', payload: JSON.parse(store) })
            }
        })
    }
    const handleFailed = () => {
        EncryptedStorage.getItem('failed').then(store => {
            if (store) {
                dispatch({ type: 'SET_FAILED', payload: JSON.parse(store) })
            }
        })
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Swiper
                autoplayTimeout={1.5}
                pagingEnabled={false}
                showsPagination={false}
                horizontal={true}
                loop={false}
                dotColor={colors.BlackGrayScale}
                activeDotColor={colors.BlackGrayScale}
                paginationStyle={{ bottom: 10 }}
                autoplay={true}

            >
                {images.map((item, key) => {
                    return (
                        <View
                            key={String(key)}
                            style={{
                                width: wp("100%"),
                                height: hp("100%"),
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: hp("10%"),
                                backgroundColor: item["color"],
                            }}
                        >
                            <Image
                                style={{
                                    borderRadius: 15,
                                    width: wp("100%"),
                                    height: wp("100%"),
                                }}
                                resizeMode={item["image"] == '' ? "center" : "cover"}
                                source={item["image"]}
                            />
                            <View style={{ marginTop: 30, bottom: 0 }}>
                                <Image
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: wp("40%"),
                                        height: hp("15%"),
                                    }}
                                    resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={item["loading"]}
                                />

                            </View>
                        </View>
                    );
                })}
            </Swiper>
        </SafeAreaView>
    )
}
