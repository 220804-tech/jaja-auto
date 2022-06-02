import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, ToastAndroid, Image, TouchableOpacity, StyleSheet, RefreshControl, Platform, ScrollView, Dimensions, LogBox, Animated, StatusBar } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { BasedOnSearch, Trending, Category, Flashsale, Loading, RecomandedHobby, Wp, Hp, colors, useNavigation, styles, ServiceCart, ServiceUser, useFocusEffect, NearestStore, ServiceCore, Utils, ServiceProduct, ServiceStore } from '../../export'
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import dynamicLinks from '@react-native-firebase/dynamic-links';
const { height: hg } = Dimensions.get('screen')
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { TouchableRipple } from 'react-native-paper';
import queryString from 'query-string';
import FastImage from 'react-native-fast-image'


LogBox.ignoreAllLogs()

export default function HomeScreen() {
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxProfile = useSelector(state => state.user.user)
    const reduxShowFlashsale = useSelector(state => state.dashboard.flashsaleLive)
    const reduxShowNearest = useSelector(state => state.dashboard.showNearestStore)
    const reduxBadges = useSelector(state => state.user.badges)
    const reduxLoad = useSelector(state => state.product.productLoad)
    const [translucent, settranslucent] = useState(false)
    const reduxBanner = useSelector(state => state.dashboard.banner)
    const reduxUpdate = useSelector(state => state.dashboard.count)
    const firstLoading = useSelector(state => state.dashboard.firstLoading)

    const [showBanner, setshowBanner] = useState(false)

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
            <View style={style.navContainer} >
                <View style={style.statusBar} />
                {/* <View style={style.navBar}> */}

                <TouchableOpacity style={[style.searchBar, styles.row_start_center]} onPress={() => navigation.navigate("Search")}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.YellowJaja }} />
                    <Text style={styles.font_14}>{text}..</Text>
                </TouchableOpacity>
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
                {/* </View> */}
            </View >
        )
    }

    const title = () => {
        return (
            <Swiper
                autoplayTimeout={3}
                horizontal={true}
                dotColor={colors.White}
                activeDotColor={colors.YellowJaja}
                paginationStyle={{ bottom: 10 }}
                autoplay={true}
                loop={true}
                style={{ backgroundColor: colors.BlueJaja, flex: 0, justifyContent: 'center', alignItems: 'center' }}
            >
                {
                    showBanner ?
                        reduxBanner.map((item, key) => {
                            console.log("🚀 ~ file: HomeScreen.js ~ line 312 ~ reduxBanner.map ~ item", item)
                            return (
                                // <Image key={String(key)} style={style.swiperBanner}
                                //     resizeMode={item.image ? "contain" : "cover"}
                                //     source={{ uri: item.image }}
                                // />
                                <FastImage
                                    key={String(key)}
                                    style={style.swiperBanner}
                                    source={{ uri: item.image }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />


                            );
                        })
                        :
                        images.map((item, key) => {
                            return (
                                <FastImage
                                    key={String(key)}
                                    style={style.swiperBanner}
                                    source={item.image}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            );
                        })
                }
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

    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: colors.White, alignSelf: 'center', justifyContent: 'center', width: Wp('100%') }]}>

                {/* <ScrollView
                    refreshControl={
                        <RefreshControl
                            style={{ zIndex: 9999 }}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }> */}
                <Category />
                {/* <TouchableRipple onPress={handleShowGift} rippleColor={colors.BlueJaja} style={[styles.row_center, styles.px, styles.py_2, styles.my_2, {
                    backgroundColor: colors.White, borderRadius: 7, alignSelf: 'center', width: '95%', shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                }]} >
                    <View style={[styles.row_center, { width: '100%' }]}>
                        <Image source={require('../../assets/icons/gift/jajaGift.png')} style={[{ height: Hp('4%'), width: Hp('15%'), alignSelf: 'flex-start', marginBottom: '-1%', marginLeft: '-2.5%' }]} />
                    </View>
                </TouchableRipple> */}
                {reduxShowFlashsale ? <Flashsale /> : null}
                <Trending />
                <View style={[styles.column_center, styles.py_5, { backgroundColor: colors.BlueJaja }]}>
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
                </View>
                {nearestProduct ? <NearestStore /> : null}

                {/* <BasedOnSearch /> */}
                {/* <HobbyAverage /> */}
                <RecomandedHobby />
                {/* </ScrollView> */}


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
            //  else {
            //     Alert.alert(
            //         "Error with status 12001",
            //         String(error),
            //         [
            //             { text: "OK", onPress: () => console.log("OK Pressed") }
            //         ],
            //         { cancelable: false }
            //     );
            // }
        } catch (err) {
            return ToastAndroid.show("Handle Error " + String(err), ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            {loading || firstLoading ? <Loading /> : null}
            {/* <ScrollViews
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        listener: event => {
                            if (isCloseToBottom(event.nativeEvent)) {
                                loadMoreData()
                            }
                        }
                    }
                )}
            > */}
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
            {/* <ParallaxScrollView

                windowHeight={SCREEN_HEIGHT * 0.4}
                backgroundSource={title()}
                // navBarTitle='John Oliver'
                // userName='John Oliver'
                // userTitle='Comedian'
                headerView={(
                    <View style={styles.headerView}>
                        <View style={styles.headerTextView}>
                            <Text style={styles.headerTextViewTitle}>My App</Text>
                            <Text style={styles.headerTextViewSubtitle}>
                                Custom Header View
                            </Text>
                        </View>
                    </View>
                )}
                // userImage='http://i.imgur.com/RQ1iLOs.jpg'
                leftIcon={{ name: 'rocket', color: 'rgba(193, 193, 193, 1)', size: 30, type: 'font-awesome' }}
                rightIcon={{ name: 'user', color: 'rgba(193, 193, 193, 1)', size: 30, type: 'font-awesome' }}
            >
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    style={{ flex: 1, backgroundColor: 'rgba(228, 117, 125, 1)' }}>
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, color: 'white' }}>Custom view</Text>
                    </View>
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, color: 'white' }}>keep going.</Text>
                    </View>
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, color: 'white' }}>keep going..</Text>
                    </View>
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, color: 'white' }}>keep going...</Text>
                    </View>
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, color: 'white' }}>the end! :)</Text>
                    </View>
                </ScrollView>
            </ParallaxScrollView> */}

            {/* </ScrollView> */}
        </SafeAreaView >

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
    swiperBanner: { width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: 'transparent' },
    searchBar: { flex: 0, backgroundColor: colors.White, borderRadius: 11, height: NAV_BAR_HEIGHT / (Platform.OS === 'android' ? 1.8 : 1.2), width: "77.5%", paddingHorizontal: '4.5%', marginRight: '3%' }
})