import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Platform, Dimensions, LogBox, Animated } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { BasedOnSearch, Trending, Category, Flashsale, Language, RecomandedHobby, Wp, Hp, colors, useNavigation, styles, ServiceCart, ServiceUser, useFocusEffect } from '../../export'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
LogBox.ignoreAllLogs()
// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'RNDeviceInfo', 'Warning: An update']);

export default function HomeScreen() {
    const dispatch = useDispatch()
    const reduxUser = useSelector(state => state.user)
    const navigation = useNavigation()
    const [auth, setAuth] = useState("")
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [refreshing, setRefreshing] = useState(false);
    const reduxDashboard = useSelector(state => state.dashboard.recommanded)

    const images = [
        {
            title: "Sport & Outdoor",
            image: require("../../assets/images/splashscreen/splash_musics.jpg"),
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriSport",
            color: "#68b0c8"
        },
        {
            title: "Sport & Outdoor",
            image: require("../../assets/images/splashscreen/splash_localpride.jpg"),
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriSport",
            color: "#fdb94c"
        },
        {
            title: "Toys",
            image: require("../../assets/images/splashscreen/splash_toys.jpg"),
            loading: require("../../assets/gifs/splashscreen/loading_page.gif"),
            router: "KategoriBuku",
            color: "#68b0c8"
        }
    ]

    useFocusEffect(
        useCallback(() => {
            getBadges()
            getToken()
            try {
                EncryptedStorage.getItem('historySearching').then(res => {
                    if (!res) {
                        let data = []
                        EncryptedStorage.setItem("historySearching", JSON.stringify(data))
                    }
                })
            } catch (error) {

            }
        }, []),
    );

    const getToken = () => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.parse(res))
            }
        })
    }
    const getBadges = () => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                ServiceUser.getBadges(JSON.parse(res)).then(result => {
                    if (result) {
                        dispatch({ type: "SET_BADGES", payload: result })
                    }
                })
            } else {

            }
        })
    }
    const handleGetCart = () => {
        if (auth) {
            ServiceCart.getCart(auth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_CART', payload: res })
                }
            })
            navigation.navigate("Trolley")
        } else {
            navigation.navigate("Login")
        }

    }

    const renderNavBar = (text) => (
        <View style={style.navContainer}>
            <View style={style.navBar}>
                <TouchableOpacity style={style.searchBar} onPress={() => navigation.navigate("Search")}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <Text style={styles.font_14}>{text}..</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.touchIcon} onPress={() => handleGetCart()}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 24, height: 24, marginRight: '3%', tintColor: colors.White }} />
                    {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                        <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalProductInCart}</Text></View>
                        : null
                    }
                </TouchableOpacity>
                <TouchableOpacity style={style.touchIcon}>
                    <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, marginRight: '3%', tintColor: colors.White }} />
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
                            resizeMode={item["image"] == '' ? "center" : "cover"}
                            source={item["image"]}
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
                <Flashsale />
                <Trending />
                {/* <BasedOnSearch /> */}
                {/* <HobbyAverage /> */}
                <RecomandedHobby />


            </View>
        );
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    const loadMoreData = () => {
        dispatch({ 'type': 'SET_LOADMORE', payload: true })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);

    }, []);

    // Refresh

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
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
                onMomentumScrollEnd={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        loadMoreData()
                    }
                }}
            >
                <ReactNativeParallaxHeader
                    headerMaxHeight={Hp('33%')}
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
                        nestedScrollEnabled: true,
                    }
                    }
                >
                </ReactNativeParallaxHeader>
            </ScrollView>

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
    swiperBanner: { width: "100%", height: Hp('33%'), resizeMode: 'contain' },
    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 10, height: NAV_BAR_HEIGHT / 1.9, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});