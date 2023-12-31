import React, { useEffect, useState } from 'react'
import { View, Image, SafeAreaView, StatusBar, ToastAndroid, StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'
import { ServiceOrder, colors, styles, useNavigation, ServiceCore, Utils, ServiceProduct, Wp, Hp } from '../../export';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            loading: require("../../assets/gifs/splashscreen/splashscreen.gif"),
            router: "KategoriSport",
            color: "#68b0c8"
        },
        {
            title: "Toys",
            image: require("../../assets/images/splashscreen/splash_toys.jpg"),
            loading: require("../../assets/gifs/splashscreen/splashscreen.gif"),
            router: "KategoriBuku",
            color: "#68b0c8"
        },
        {
            title: "Musics",
            image: require("../../assets/images/splashscreen/splash_musics.jpg"),
            loading: require("../../assets/gifs/splashscreen/splashscreen.gif"),
            router: "KategoriBuku",
            color: "#68b0c8"
        }
    ]

    useEffect(() => {
        try {
            AsyncStorage.getItem('token').then(auth => {
                getItem(auth)
                getData()
                getFlashsale()
                getOrders(auth)
                dispatch({ type: 'SET_AUTH', payload: JSON.parse(auth) })
                EncryptedStorage.getItem('user').then(res => {
                    if (res) {
                        dispatch({ type: 'SET_VERIFIKASI', payload: JSON.parse(res).isVerified })
                        dispatch({ type: 'SET_USER', payload: JSON.parse(res) })
                        getFirebase(JSON.parse(res))
                    }
                })
            })

        } catch (error) {
            // return ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.TOP)
            console.log(error.message)

        }
        setTimeout(() => {
            navigation.replace('Beranda')
        }, 3000);

    }, [])


    const getFlashsale = () => {
        ServiceCore.getDateTime().then(res => {
            if (res) {
                let date = new Date()
                // if (date.toJSON().toString().slice(0, 10) !== res.dateNow) {
                //     Alert.alert(
                //         "Peringatan!",
                //         `Sepertinya tanggal tidak sesuai!`,
                //         [
                //             { text: "OK", onPress: () => navigation.goBack() }
                //         ],
                //         { cancelable: false }
                //     );
                // } else {
                ServiceCore.getFlashsale().then(resp => {
                    if (resp && resp.flashsale && resp.flashsale.length) {
                        dispatch({ type: 'SET_LIVE_FLASHSALE', payload: true })
                        dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                    } else {
                        dispatch({ type: 'SET_LIVE_FLASHSALE', payload: false })
                    }
                })

                // }
            }
        })
    }

    const getFirebase = (user) => {
        EncryptedStorage.getItem('deviceToken').then(res => {
            if (res) {
                let token = JSON.parse(res)
                dispatch({ type: 'SET_DEVICE_TOKEN', payload: token })
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

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            let hasil = null;
            fetch("https://jaja.id/backend/home", requestOptions)
                .then(response => response.text())
                .then(respp => {
                    hasil = true;
                    try {
                        let resp = JSON.parse(respp)
                        if (resp?.status?.code == 200 || resp?.status?.code == 204) {
                            if (resp.data.banner) {
                                dispatch({ type: 'SET_DASH_BANNER', payload: resp.data.banner })
                                EncryptedStorage.setItem('dashbanner', JSON.stringify(resp.data.banner))
                            }
                            if (resp.data.categoryChoice) {
                                dispatch({ type: 'SET_DASHCATEGORY', payload: resp.data.categoryChoice })
                                EncryptedStorage.setItem('dashcategory', JSON.stringify(resp.data.categoryChoice))
                            }
                            if (resp.data.trending) {
                                dispatch({ type: 'SET_DASHTRENDING', payload: resp.data.trending })
                                EncryptedStorage.setItem('dashtrending', JSON.stringify(resp.data.trending))
                            }
                            if (resp.data.basedOnSearch) {
                                dispatch({ type: 'SET_DASHPOPULAR', payload: resp.data.basedOnSearch })
                                EncryptedStorage.setItem('dashpopular', JSON.stringify(resp.data.basedOnSearch))
                            }
                            dispatch({ type: 'SET_COUNT', payload: 21 })
                        } else {
                            handleError(resp.status.message + " => " + resp.status.code)
                            dispatch({ type: 'SET_COUNT', payload: 23 })
                        }
                    } catch (error) {
                        hasil = true;
                        Utils.alertPopUp(JSON.stringify(respp))
                        dispatch({ type: 'SET_COUNT', payload: 25 })
                    }
                })
                .catch(error => {
                    hasil = true;
                    Utils.handleError(String(error), 'Error with status code : 19021')
                    handleError(error)
                    dispatch({ type: 'SET_COUNT', payload: 39 })
                })
            setTimeout(() => {
                if (!hasil) {
                    Utils.handleSignal()
                }
            }, 20000);
        } catch (error) {
            handleError(error)
        }
    }

    const handleError = (error) => {
        try {
            EncryptedStorage.getItem('dashbanner').then(result => {
                if (result) {
                    dispatch({ type: 'SET_DASH_BANNER', payload: JSON.parse(result) })
                }
            })
            EncryptedStorage.getItem('dashcategory').then(result => {
                if (result) {
                    dispatch({ type: 'SET_DASHCATEGORY', payload: JSON.parse(result) })
                }
            })
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

        } catch (error) {
            // return Utils.alertPopUp(String(err))
        }
    }

    const getData = () => {
        try {
            ServiceProduct.getRecommendation(dispatch);
        } catch (error) {

        }

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
                })

                ServiceOrder.getWaitConfirm(auth).then(reswaitConfirm => {
                    if (reswaitConfirm) {
                        dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                    } else {
                        handleWaitConfirm()
                    }
                })
                ServiceOrder.getProcess(auth).then(resProcess => {
                    if (resProcess) {
                        dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                    } else {
                        handleProcess()
                    }
                })
                ServiceOrder.getSent(auth).then(resSent => {
                    if (resSent) {
                        dispatch({ type: 'SET_SENT', payload: resSent.items })
                    } else {
                        handleSent()
                    }
                })
                ServiceOrder.getCompleted(auth).then(resCompleted => {
                    if (resCompleted) {
                        dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                    } else {
                        handleCompleted()
                    }
                })
                ServiceOrder.getFailed(auth).then(resFailed => {
                    if (resFailed) {
                        dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                    } else {
                        handleFailed()
                    }
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BlueJaja }]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <View style={[styles.column_center, { backgroundColor: colors.BlueJaja, width: Wp('100%'), height: Hp('100%') }]}>
                {/* <View style={[styles.column_center, { backgroundColor: colors.YellowJaja, width: Wp('100%'), height: Hp('50%') }]}> */}

                <Swiper
                    style={{}}
                    autoplayTimeout={2}
                    pagingEnabled={false}
                    showsPagination={false}
                    horizontal={true}
                    loop={false}
                    dotColor={colors.BlackGrayScale}
                    activeDotColor={colors.BlackGrayScale}
                    paginationStyle={{ bottom: 10 }}
                    autoplay={true}
                >
                    
                    <View style={localStyle.slide}>
                        <Image
                            style={{
                                width: Wp("100%"),
                                height: Wp("100%"),
                            }}
                            resizeMode="cover"
                            source={images[0].image}
                        />

                        {/* {images.map((item, key) => {
                            return (
                                <Image
                                    key={String(key + 'JD')}
                                    style={{
                                        width: Wp("100%"),
                                        height: Wp("100%"),
                                    }}
                                    resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={item["image"]}
                                />

                            );
                        })} */}
                    </View>
                    <View style={localStyle.slide}>
                        <Image
                            style={{
                                width: Wp("100%"),
                                height: Wp("100%"),
                            }}
                            resizeMode="cover"
                            source={images[1].image}
                        />
                    </View>
                    <View style={localStyle.slide}>
                        <Image
                            style={{
                                width: Wp("100%"),
                                height: Wp("100%"),
                            }}
                            resizeMode="cover"
                            source={images[2].image}
                        />
                    </View>
                </Swiper>
                {/* </View> */}
                {/* <Text style={styles.font_12}>Sedang memuat..</Text> */}

                {/* <Image
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: Wp("35%"),
                        height: hp("10%"),
                    }}
                    source={require("../../assets/gifs/splashscreen/splashscreen.gif")}
                /> */}

            </View >
        </SafeAreaView >
    )
}
const localStyle = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BlueJaja
    }
})
