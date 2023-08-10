import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, ToastAndroid, Image, TouchableOpacity, StyleSheet, RefreshControl, Platform, ScrollView, Dimensions, LogBox, Animated, StatusBar, Alert, Button, ActivityIndicator } from 'react-native'
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { BasedOnSearch, Trending, Category, Flashsale, Loading, RecomandedHobby, Wp, Hp, colors, useNavigation, styles, ServiceCart, ServiceUser, useFocusEffect, NearestStore, ServiceCore, Utils, ServiceProduct, ServiceStore } from '../../export'
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
import dynamicLinks from '@react-native-firebase/dynamic-links';
const { height: hg } = Dimensions.get('screen')
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { Modal, TouchableRipple, TextInput, Provider, Portal } from 'react-native-paper';
import queryString from 'query-string';
import FastImage from 'react-native-fast-image'
import Modals from 'react-native-modal';
import { RFValue } from "react-native-responsive-fontsize";
import { color } from 'react-native-reanimated';


export default function HomeScreen() {
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxProfile = useSelector(state => state.user.user)
    const reduxShowFlashsale = useSelector(state => state.dashboard.flashsaleLive)
    const reduxShowNearest = useSelector(state => state.dashboard.showNearestStore)
    const reduxBadges = useSelector(state => state.user.badges)
    const reduxLoad = useSelector(state => state.product.productLoad)
    const [translucent, settranslucent] = useState(false)
    const reduxBanner = useSelector(state => state.dashboard.banner)
    console.log('woiii', reduxBanner)
    const reduxUpdate = useSelector(state => state.dashboard.count)
    const firstLoading = useSelector(state => state.dashboard.firstLoading)

    const [showBanner, setshowBanner] = useState(false)
    const [showLoader, setShowLoader] = useState(false);

    useAndroidBackHandler(() => {
        if (out) {
            return false;
        } else {
            Utils.alertPopUp("Tekan sekali lagi untuk keluar aplikasi")
            setTimeout(() => {
                setOut(false)
            }, 4500);
            setOut(true)
            return true
        }
    });

    const dispatch = useDispatch()
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const navigation = useNavigation()
    const [auth, setAuth] = useState("")
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [out, setOut] = useState(false)
    const [nearestProduct, setnearestProduct] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setphoneNumber] = useState('');
    const containerStyle = { backgroundColor: 'white', width: Wp('95%'), height: Wp('55%'), alignSelf: 'center', borderRadius: 4, };
    const [modalPhoneNumber, setmodalPhoneNumber] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null); // New state for marking the selected option

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleModal();
    }

    const images = [
        {
            image: require('../../assets/icons/gift/bannerGif.jpeg'),
            router: "GiftScreen",
        },
        {
            image: require('../../assets/banner/home/banner1.png'),
            router: "KategoriSport",
        },
        // {
        //     image: require('../../assets/banner/home/banner1540x520-01.jpg'),
        //     router: "KategoriBuku",
        // }
    ]

    const handleDynamicLink = link => {
        try {
            const parsed = queryString.parseUrl(link.url);
            setLoading(true)
            let slug = Object.values(parsed.query)
            if (String(link.url).includes('product')) {
                handleShowDetail('product', false, slug[0])
            } else if (String(link.url).includes('store')) {
                handleOpenStore(slug[0])
            } else {
                handleShowDetail('gift', false, slug[0])
            }
        } catch (error) {
            setLoading(false)
        }
    };

    const handleShowDetail = (open, status, slug) => {
        let error = true;
        try {
            if (!reduxLoad) {
                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                    !status ? navigation.push(open === 'product' ? "Product" : "GiftDetails") : null
                }, 2000);
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                ServiceProduct.getProduct(reduxAuth, slug).then(res => {
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
                }).catch(err => {
                    dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                    setLoading(false)
                    error = false
                })
            } else {
                setLoading(false)
                error = false
            }
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
            error = false
            setLoading(false)

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

        try {
            if (reduxAuth) {
                getBadges()
            }
        } catch (error) {

        }
    }
    const handleOpenStore = (storeSlug) => {
        try {
            navigation.push("Store", { slug: storeSlug });
            dispatch({ type: "SET_STORE_LOAD", payload: true });
            dispatch({ type: "SET_NEW_PRODUCT_LOAD", payload: true });
            dispatch({ type: "SET_STORE", payload: {} });

            ServiceStore.getStore(storeSlug, reduxAuth)
                .then((res) => {
                    if (res) {
                        dispatch({ type: "SET_STORE", payload: res });
                    }
                    dispatch({ type: "SET_STORE_LOAD", payload: false });
                })
                .catch((err) => [
                    dispatch({ type: "SET_STORE_LOAD", payload: false }),
                ]);

        } catch (error) {
            dispatch({ type: "SET_NEW_PRODUCT_LOAD", payload: false });
            dispatch({ type: "SET_STORE_LOAD", payload: false });
            Utils.handleError(error, "Error with status code : 31001");
        }
        dispatch({ type: "SET_KEYWORD", payload: "" });
    }
    useFocusEffect(
        useCallback(() => {
            return () => {
                try {
                    settranslucent(false)
                    if (Platform.OS === 'ios') {
                        StatusBar.setBarStyle('light-content', true);	//<<--- add this
                        StatusBar.setBackgroundColor(colors.BlueJaja, true)
                    }
                    dispatch({ type: 'SET_CART_STATUS', payload: '' })
                    setOut(false)

                } catch (error) {

                }
            }
        }, [reduxAuth]),
    );

    useEffect(() => {
        handleContent()
        setTimeout(() => {
            setshowBanner(true)
        }, 20000);
    }, [reduxUpdate])

    useEffect(() => {
        dynamicLinks().getInitialLink().then(link => {
            handleDynamicLink(link)
        })
        const linkingListener = dynamicLinks().onLink(handleDynamicLink)
        return () => {
            linkingListener()
        }
    }, [])


    useEffect(() => {
        if (reduxProfile?.id && !reduxProfile?.phoneNumber) {
            setmodalPhoneNumber(true)
        } else {
            setmodalPhoneNumber(false)
        }
        return () => {
        }
    }, [reduxProfile?.id])

    useEffect(() => {
        if (reduxAuth) {
            getBadges()
        }
        handleFirstLoading()
    }, [reduxAuth])

    const handleFirstLoading = () => {
        if (firstLoading) {
            setTimeout(() => {
                dispatch({ type: 'SET_FIRST_LOADING', payload: false })
            }, 1000);
        }
    }

    const handleContent = () => {
        setLoading(true)
        try {
            dispatch({ 'type': 'SET_LOADMORE', payload: false })

            EncryptedStorage.getItem('nearestProduct').then(res => {
                if (res && res.length) {
                    setnearestProduct(true)
                    dispatch({ type: 'SET_DASHNEAREST', payload: JSON.parse(res) })
                }
            })
            EncryptedStorage.getItem('historySearching').then(res => {
                if (!res) {
                    let data = []
                    EncryptedStorage.setItem("historySearching", JSON.stringify(data))
                }
            })
        } catch (error) {

        }
        setTimeout(() => setLoading(false), 3000);
    }
    const getBadges = () => {
        ServiceUser.getBadges(reduxAuth).then(result => {
            if (result) {
                dispatch({ type: "SET_BADGES", payload: result })
            } else {
                dispatch({ type: "SET_BADGES", payload: {} })
            }
        })
    }
    const handleGetCart = () => {
        try {
            if (reduxAuth) {
                ServiceCart.getCart(reduxAuth).then(res => {
                    if (res) {
                        dispatch({ type: 'SET_CART', payload: res })
                    }
                })
                navigation.navigate("Trolley")
            } else {
                navigation.navigate("Login")
            }
        } catch (error) {

        }
    }

    const renderNavBar = (text) => {
        return (
            <View style={{ marginTop: '2%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4.5%' }}>
                    <View style={[styles.row_between_center]}>
                        <TouchableOpacity style={[styles.column, styles.mx]} onPress={toggleModal}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/images/JajaIcon.png')} style={{ width: 85, height: 30, tintColor: colors.White, marginRight: 9 }} />
                                <Image source={require('../../assets/gifs/Chevron.gif')} style={{ width: 20, height: 15, tintColor: colors.White }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modals
                        isVisible={isModalVisible}
                        onSwipeComplete={toggleModal}
                        style={{ justifyContent: 'flex-start', margin: 0 }}
                        animationIn="slideInDown"
                        animationOut="slideOutUp"
                        backdropToClose={false}
                        swipeToClose={false}
                    >
                        <View style={{ backgroundColor: 'white', height: 160, borderBottomLeftRadius: 20, padding: 18, borderBottomRightRadius: 20, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View>
                                    <Text style={{ fontSize: RFValue(14), fontFamily: 'Poppins-SemiBold' }}>Pilih Kategori</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <Text style={{ fontSize: 20, fontFamily: 'Poppins-SemiBold', color: '#818B8C' }}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{
                                        width: 175,
                                        height: 80,
                                        borderWidth: 1,
                                        borderColor: '#64B0C9',
                                        borderRadius: 15,
                                        padding: 10,
                                    }}
                                    onPress={() => selectOption('jajaid')}
                                >
                                    <Image source={require('../../assets/images/modal/jajaid.png')} style={{ width: 90, height: 35, marginBottom: 7 }} />
                                    <Text style={{ fontSize: RFValue(7), fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Penuhi kebutuhan hobby mu di sini</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        width: 175,
                                        height: 80,
                                        borderWidth: 1,
                                        borderColor: '#64B0C9',
                                        borderRadius: 15,
                                        padding: 17,
                                        paddingTop: 20,
                                    }}
                                    onPress={async () => {
                                        selectOption('jajaauto');
                                        setShowLoader(true);
                                        navigation.navigate('Car'); // add this line to navigate
                                        setShowLoader(false);
                                    }}
                                >
                                    <Image source={require('../../assets/images/modal/JajaAutoNew.png')} style={{ width: 140, height: 23, marginBottom: 7 }} />
                                    <Text style={{ fontSize: RFValue(7), fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Temukan Mobil impian mu di sini</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modals>

                    <View style={[styles.row_between_center]}>

                        <TouchableOpacity style={[styles.column, styles.mx]} onPress={handleGetCart}>
                            <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                            {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalProductInCart}</Text></View>
                                : null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.column, styles.mx_2]} onPress={() => reduxAuth ? navigation.navigate('Notification') : navigation.navigate('Login')}>
                            <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, tintColor: colors.White }} />
                            {Object.keys(reduxBadges).length && reduxBadges.totalNotifUnread ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalNotifUnread >= 100 ? "99+" : reduxBadges.totalNotifUnread}</Text></View>

                                // <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalNotifUnread >= 100 ? "99+" : reduxBadges.totalNotifUnread + ''}</Text></View>
                                : null
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[style.navContainer]} >
                    <View style={style.statusBar} />
                    <TouchableOpacity style={[style.searchBar, styles.row_start_center]} onPress={() => navigation.navigate("Search")}>
                        <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.YellowJaja }} />
                        <Text style={styles.font_14}>{text}..</Text>
                    </TouchableOpacity>
                </View >
            </View>
        )
    }



    const title = () => {
        return (
            <Swiper
                autoplayTimeout={5}
                horizontal={true}
                autoplay={true}
                loop={true}
                showsPagination={false}
                style={{
                    backgroundColor: colors.BlueJaja,
                    flex: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '20%',
                }}
            >
                {showBanner
                    ? reduxBanner.map((item, key) => {
                        console.log(
                            '🚀 ~ file: HomeScreen.js ~ line 312 ~ reduxBanner.map ~ item',
                            item
                        );
                        return (
                            <FastImage
                                key={String(key)}
                                style={style.swiperBanner}
                                source={{ uri: item.image }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        );
                    })
                    : images.map((item, key) => {
                        return (
                            <FastImage
                                key={String(key)}
                                style={style.swiperBanner}
                                source={item.image}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        );
                    })}
            </Swiper>

        );
    };

    const handleShowGift = () => {
        navigation.navigate('Gift')
        ServiceProduct.getStoreProduct({ gift: 1 }).then(res => {
            dispatch({ type: "SET_PRODUCT_GIFT_HOME", payload: res?.data?.items })
            dispatch({ type: "SET_FILTER_GIFT", payload: res?.data?.filters })
            dispatch({ type: "SET_SORT_GIFT", payload: res?.data?.sorts })
        })
    }

    const [modalVisibles, setModalVisibles] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setModalVisibles(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setModalVisibles(false);
    };


    const renderContent = () => {

        return (
            <View style={[styles.column, { backgroundColor: colors.White, alignSelf: 'center', justifyContent: 'center', width: Wp('100%') }]}>
                <Category />

                {reduxShowFlashsale ? <Flashsale /> : null}
                {/* <Trending /> */}


                <Trending />

                {/* INI JAJAGIFT */}
                {/* <View style={[styles.column_center, styles.py_5, { backgroundColor: colors.BlueJaja }]}>
                    <TouchableRipple onPress={handleShowGift} rippleColor={colors.White} style={[styles.row_center, styles.py_2, {
                        backgroundColor: colors.PinkLight, alignSelf: 'center', width: '100%',
                        shadowColor: colors.BlueJaja,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }]} >
                        <View style={[styles.row_between_center, styles.px_5, { width: '100%' }]}>
                            <Text style={[styles.font_14, styles.T_bold, { alignSelf: 'flex-start', color: colors.White }]}>Berikan hadiah untuk teman spesial kamu disini!</Text>
                            <Image source={require('../../assets/icons/heart.png')} style={[{ position: 'absolute', right: 7, width: Wp('15%'), height: Wp('14%') }]} />
                        </View>
                    </TouchableRipple>
                </View> */}


                {nearestProduct ? <NearestStore /> : null}




                {/* <BasedOnSearch /> */}
                {/* <HobbyAverage /> */}
                <RecomandedHobby />
                {/* </ScrollView> */}

                <Modals
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibles}
                    onRequestClose={handleClose}
                >
                    <View style={style.centeredView}>
                        <View style={style.modalView}>
                            <TouchableOpacity onPress={() => navigation.navigate('Car')}>
                                <Image source={require('../../assets/banner/home/modal.jpg')} style={style.modalImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={style.closeButton} onPress={handleClose}>
                                <Text style={style.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modals>

            </View >
        );
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.80) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 3)
    }

    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        getData()
        getFlashsale()
        getBadges()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);

    const getItem = async (token) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=gpkr7eq1528c92su0vj0rokdjutlsl2r");

            var raw = "";

            var requestOptions = {
                method: 'GET',
                headers: token ? myHeaders : "",
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/home", requestOptions)
                .then(response => response.json())
                .then(resp => {
                    if (resp.status.code === 200 || resp.status.code == 204) {
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
                    } else {
                        handleError(resp.status.message + " => " + resp.status.code)
                    }
                })
                .catch(error => {
                    handleError(error)
                })
        } catch (error) {
            handleError(error)
        }
    }
    const getData = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/product/recommendation?page=1&limit=20", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_DASHRECOMMANDED', payload: result.data.items })
                    EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                } else {
                    EncryptedStorage.getItem('dashrecommanded').then(res => {
                        if (res) {
                            dispatch({ type: 'SET_DASHRECOMMANDED', payload: JSON.parse(res) })
                        }
                        Utils.alertPopUp(String(result.status.message + " : " + result.status.code))
                    })

                }
            })
            .catch(error => {
                EncryptedStorage.getItem('dashrecommanded').then(store => {
                    if (store) {
                        dispatch({ type: 'SET_DASHRECOMMANDED', payload: JSON.parse(store) })
                    }
                })
                // Utils.handleError(error, 'Error with status code : 12002')
            });
    }
    const getFlashsale = () => {
        ServiceCore.getDateTime().then(res => {
            if (res) {
                let date = new Date()

                ServiceCore.getFlashsale().then(resp => {
                    if (resp && resp.flashsale && resp.flashsale.length) {
                        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: true })
                        dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                    } else {
                        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
                    }
                })
                // }
            }
        })
    }

    const handleError = (error) => {
        try {
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

        } catch (err) {
            return ToastAndroid.show("Handle Error " + String(err), ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }

    const handlePhoneNumber = () => {
        if (phoneNumber.length > 9) {
            let res = Utils.regex('number', phoneNumber)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=6r791k9ainrf0grr1nns27gosmdt75i5");
            var raw = JSON.stringify({
                "name": reduxProfile.name,
                "phoneNumber": phoneNumber ? res : reduxProfile.phoneNumber,
                "email": reduxProfile.email,
                "gender": reduxProfile?.gender ? reduxProfile?.gender : 'pria',
                "birthDate": reduxProfile.birthDate,
                "photo": reduxProfile?.imageFile
            })
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            setmodalPhoneNumber(false)
            fetch("https://jaja.id/backend/user/profile", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        getUser()
                        Utils.alertPopUp('Nomor telephone berhasil ditambahkan!')
                    } else {
                        setmodalPhoneNumber(false)
                        Utils.handleErrorResponse(result, "Error with status code: 23028")
                    }
                })
                .catch(error => {
                    setmodalPhoneNumber(false)
                    Utils.handleError(error, "Error with status code : 23029")
                });
        }
    }

    const getUser = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=6jh2d2a8uvcvitvneaa2t81phf3lrs3c");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/user/profile", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result?.status?.code === 200) {
                        dispatch({ type: 'SET_USER', payload: result?.data })
                        EncryptedStorage.setItem('user', JSON.stringify(result?.data))
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 42044')
                    }
                })
                .catch(error => {
                    Utils.handleError(error, "Error with status code : 42045")
                });
        } catch (error) {
            console.log("🚀 ~ file: HomeScreen.js ~ line 701 ~ getUser ~ error", error)
        }
    }

    return (
        <Provider>

            <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
                {loading || firstLoading ? <Loading /> : null}
                <StatusBar translucent={translucent} backgroundColor={colors.BlueJaja} barStyle="light-content" />
                <ReactNativeParallaxHeader
                    headerMinHeight={Platform.OS === 'ios' ? Hp('5.5%') : Hp('7%')}
                    headerMaxHeight={Wp('60%')}
                    extraScrollHeight={20}
                    // statusBarColor='transparent'
                    backgroundColor='#fcfcfc'
                    navbarColor={colors.BlueJaja}
                    titleStyle={style.titleStyle}
                    title={title()}

                    renderNavBar={() => renderNavBar('Cari hobimu sekarang')}
                    renderContent={renderContent}
                    containerStyle={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.WhiteBack : null }]}
                    contentContainerStyle={style.contentContainer}
                    innerContainerStyle={style.container}
                    headerFixedBackgroundColor='transparent'
                    alwaysShowTitle={false}

                    scrollViewProps={{
                        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
                        onScroll: Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            Platform.OS === "android" ?
                                {
                                    useNativeDriver: false,
                                    listener: event => {
                                        if (isCloseToBottom(event.nativeEvent)) {
                                            loadMoreData()
                                        }
                                    }
                                }
                                : null
                        ),
                        onMomentumScrollEnd: ({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                loadMoreData()
                            }
                        }

                    }}
                >
                </ReactNativeParallaxHeader>

                <Portal>
                    <Modal dismissable={true} visible={modalPhoneNumber} onDismiss={() => setmodalPhoneNumber(false)} contentContainerStyle={containerStyle} >
                        <View style={[styles.column_between_center, styles.p_5, { alignItems: 'flex-start', width: '100%', height: '100%' }]}>
                            <Text style={[styles.font_15, styles.T_semi_bold, { color: colors.BlueJaja }]} >Masukkan nomor telephone</Text>
                            <TextInput maxLength={13} keyboardType='number-pad' outlineColor={colors.BlueJaja} selectionColor={colors.YellowJaja} underlineColor={colors.BlueJaja} underlineColorAndroid={colors.BlueJaja} theme={{ colors: { primary: colors.BlueJaja, }, roundness: 5 }} mode='flat' style={[styles.font_13, { padding: 0, width: '98%', alignSelf: 'center', borderWidth: 0, backgroundColor: colors.WhiteGrey }]} value={phoneNumber} onChangeText={text => setphoneNumber(Utils.regex('number', text))} placeholder="Masukkan nomor telephone" />
                            <View style={[styles.row_end, { width: '100%' }]}>
                                <TouchableRipple onPress={handlePhoneNumber} style={[styles.px_5, styles.py_3, styles.ml_2, { borderRadius: 5, backgroundColor: colors.YellowJaja, width: 105 }]}>
                                    <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White, alignSelf: 'center' }]}>Simpan</Text>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Modal>
                </Portal>


            </SafeAreaView >
        </Provider>

    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,

    },
    navContainer: {
        // height: Platform.OS === 'ios' ? Hp('5.7%') : Hp('7%'),
        // justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
        zIndex: 1000, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#64B0C9', height: Platform.OS === 'ios' ? Hp('5.5%') : Hp('7%'), width: Wp('100%'), color: colors.siplahDefault, paddingHorizontal: '4%',
        // paddingBottom: '2.5%',
        // paddingTop: '2.2%',
        backgroundColor: Platform.OS === 'android' ? 'transparent' : colors.BlueJaja,
    },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        // paddingHorizontal: '1%'
    },


    titleStyle: {
        color: 'white',
        fontFamily: 'SignikaNegative-SemiBold',
        fontSize: 18,
        backgroundColor: colors.BlueJaja,
        // width: Wp('100%'), height: Wp('75%'),
    },


    touchIcon: { width: '14%', justifyContent: 'center', alignItems: 'center' },
    swiperBanner: { width: '95%', height: '100%', resizeMode: 'contain', backgroundColor: 'transparent', alignSelf: 'center', borderRadius: 15 },
    searchBar: { flex: 0, backgroundColor: colors.White, borderRadius: 11, height: NAV_BAR_HEIGHT / (Platform.OS === 'android' ? 1.8 : 1.2), width: "100%", paddingHorizontal: '4.5%' },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",

    },
    modalImage: {
        width: 290, // Adjust as needed
        height: 330,
        borderRadius: 15 // Adjust as needed
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10
    },
    closeButtonText: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'Poppins-Bold'
    }
})