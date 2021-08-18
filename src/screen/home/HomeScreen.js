import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, ToastAndroid, Image, TouchableOpacity, StyleSheet, RefreshControl, Platform, Dimensions, LogBox, Animated } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { BasedOnSearch, Trending, Category, Flashsale, Language, RecomandedHobby, Wp, Hp, colors, useNavigation, styles, ServiceCart, ServiceUser, useFocusEffect, NearestStore, } from '../../export'
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info';

const { height: hg } = Dimensions.get('screen')
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useAndroidBackHandler } from "react-navigation-backhandler";
LogBox.ignoreAllLogs()

export default function HomeScreen() {
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxProfile = useSelector(state => state.user.user)
    const reduxShowFlashsale = useSelector(state => state.dashboard.showFlashsale)
    console.log("🚀 ~ file: HomeScreen.js ~ line 23 ~ HomeScreen ~ reduxShowFlashsale", reduxShowFlashsale)
    const reduxShowNearest = useSelector(state => state.dashboard.showNearestStore)

    useAndroidBackHandler(() => {
        if (out) {
            return false;
        } else {
            ToastAndroid.show("Tekan sekali lagi untuk keluar aplikasi", ToastAndroid.LONG, ToastAndroid.TOP)
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
    const reduxOut = useSelector(state => state.dashboard.out)

    const images = [
        {
            title: "Sport & Outdoor",
            image: "https://nimda.jaja.id/asset/front/images/file/aee601e2b447abd891ae9c74f1bd5021.jpg",
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriSport",
            color: "#68b0c8"
        },
        {
            title: "Sport & Outdoor",
            image: "https://nimda.jaja.id/asset/front/images/file/835df82b3973315acf6cbbfc42773558.png",
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriSport",
            color: "#fdb94c"
        },
        {
            title: "Toys",
            image: "https://nimda.jaja.id/asset/front/images/file/5e177ef22d9e286155e8a3c2cd9e00aa.png",
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriBuku",
            color: "#68b0c8"
        }
    ]

    useFocusEffect(
        useCallback(() => {
            try {
                setOut(false)
                if (reduxAuth) {
                    getBadges()
                }
            } catch (error) {

            }
        }, [reduxAuth]),
    );

    useEffect(() => {
        console.log("🚀 ~ file: HomeScreen.js ~ line 202 ~ renderContent ~ reduxShowFlashsale", reduxShowFlashsale)

        try {
            dispatch({ 'type': 'SET_LOADMORE', payload: false })
            EncryptedStorage.getItem('token').then(res => {
                if (res) {
                    setAuth(JSON.parse(res))
                }
            })
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
    }, [])

    const getBadges = () => {
        ServiceUser.getBadges(reduxAuth ? reduxAuth : auth).then(result => {
            if (result) {
                dispatch({ type: "SET_BADGES", payload: result })
            } else {
                dispatch({ type: "SET_BADGES", payload: {} })
            }
        })
    }
    const handleGetCart = () => {
        try {
            if (reduxAuth ? reduxAuth : auth) {
                ServiceCart.getCart(reduxAuth ? reduxAuth : auth).then(res => {
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

    const renderNavBar = (text) => (
        <View style={style.navContainer}>
            <View style={style.navBar}>
                <TouchableOpacity style={style.searchBar} onPress={() => navigation.navigate("Search")}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <Text style={styles.font_14}>{text}..</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.column, styles.mx_3]} onPress={handleGetCart}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                    {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                        <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalProductInCart}</Text></View>
                        : null
                    }
                </TouchableOpacity>
                <TouchableOpacity style={[styles.column, styles.mx_2]} onPress={() => reduxAuth || auth ? navigation.navigate('Notification') : navigation.navigate('Login')}>
                    <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, tintColor: colors.White }} />
                    {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                        <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalNotifUnread}</Text></View>
                        : null
                    }
                </TouchableOpacity>
            </View>
        </View >
    );

    const title = () => {
        return (
            <Swiper
                autoplayTimeout={3}
                horizontal={true}
                loop={false}
                dotColor={colors.White}
                activeDotColor={colors.BlueJaja}
                paginationStyle={{ bottom: 10 }}
                autoplay={true}
                loop={true}
            >
                {images.map((item, key) => {
                    return (
                        <Image key={String(key)} style={style.swiperBanner}
                            resizeMode={item.image ? "contain" : "cover"}
                            source={{ uri: item.image }}
                        />
                    );
                })}
            </Swiper>
        );
    };

    const renderContent = () => {
        return (
            <View style={styles.column}>
                <Category />
                <Trending />
                {nearestProduct ? <NearestStore /> : null}
                {reduxShowFlashsale ? <Flashsale /> : null}

                {/* <BasedOnSearch /> */}
                {/* <HobbyAverage /> */}
                <RecomandedHobby />


            </View>
        );
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.70) || layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.05)
    }

    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            // console.log("masuk as")
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* <ScrollView
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
            <ReactNativeParallaxHeader
                headerMaxHeight={Hp('30%')}
                extraScrollHeight={20}
                navbarColor={colors.BlueJaja}
                titleStyle={style.titleStyle}
                title={title()}
                renderNavBar={() => renderNavBar('Cari hobimu sekarang')}
                renderContent={renderContent}
                containerStyle={style.container}
                contentContainerStyle={style.contentContainer}
                innerContainerStyle={style.container}
                headerFixedBackgroundColor={colors.BlueJajaa}
                alwaysShowTitle={false}
                scrollViewProps={{
                    onScroll: Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        Platform.OS === "android" ?
                            {
                                listener: event => {
                                    if (isCloseToBottom(event.nativeEvent)) {
                                        console.log("oNSCROLL ");
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
                    },
                    refreshControl: (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    )
                }}
            >
            </ReactNativeParallaxHeader>
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
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        backgroundColor: 'transparent',
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
        paddingHorizontal: '1%'
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    touchIcon: { width: '14%', justifyContent: 'center', alignItems: 'center' },
    swiperBanner: { width: "100%", height: Hp('30%'), resizeMode: 'contain', backgroundColor: colors.BlueJaja },
    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 10, height: NAV_BAR_HEIGHT / 1.9, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});