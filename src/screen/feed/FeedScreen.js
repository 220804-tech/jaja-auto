import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, FlatList, SafeAreaView, RefreshControl, Animated, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { useDispatch, useSelector } from 'react-redux'
import { colors, styles, Utils, Wp, FastImage, useNavigation, ServiceProduct, Appbar, ServiceUser, Loading, AppleType } from '../../export'
import ViewShot from "react-native-view-shot";
import ImgToBase64 from 'react-native-image-base64';
import Share from 'react-native-share';
import Swiper from 'react-native-swiper'
const { height: hg } = Dimensions.get('screen')

export default function FeedScreen(props) {

    const navigation = useNavigation()
    const viewShotRef = useRef(null);
    const dispatch = useDispatch()
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoad = useSelector(state => state.product.productLoad)
    const reduxUrl = useSelector(state => state.baseUrl.urlElib)


    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [refreshing, setrefreshing] = useState(false)
    const [data, setdata] = useState([])
    const [count, setcount] = useState(0)
    const [page, setpage] = useState(1)
    const [israndom, setisRandom] = useState(false)
    const [loadmore, setloadmore] = useState(true)
    const [loading, setloading] = useState(false)

    const [selectedShare, setselectedShare] = useState('')



    const [maxscroll, setmaxscroll] = useState(false)
    const [shimmerdata, setshimmerData] = useState([{ loading: true }])






    useEffect(() => {
        setloading(false)
        handleFirstData()

    }, [])

    useEffect(() => {

        if (selectedShare?.name) {
            // setselectedShare(selectedShare)
            handleShare()
        }
    }, [selectedShare?.name])


    useEffect(() => {
        if (page > 1) {
            updateData()
        }
    }, [page])

    useEffect(() => {
        if (israndom) {
            updateData()
        }
    }, [israndom])


    const onRefresh = useCallback(() => {
        setrefreshing(true);
        setisRandom(true)
        handleFirstData()
        setrefreshing(false);
    }, []);

    const handleFirstData = async () => {
        let result = await getData();
        setdata(result)
        setcount(count + 1)
        setloadmore(false)
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        if (!maxscroll) {
            return layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 1)
        } else {
            return false
        }
    }


    const getData = async () => {
        try {
            // setrefreshing(true)
            let errorResponse = true
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            setTimeout(() => {
                if (errorResponse) {
                    Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
                }
            }, 22000);

            return await fetch(`${reduxUrl}/jaja/get-feeds?page=${israndom ? 1 : page}&limit=10&categories=["toys","books","art-shop","sports", "photography","automotive","fashion","gaming","pets"]&isRandom=${israndom}`, requestOptions)
                .then(response => response.text())
                .then(json => {
                    console.log("🚀 ~ file: FeedScreen.js ~ line 114 ~ getData ~ json", json)
                    setisRandom(false)
                    // setpage(page + 1)
                    errorResponse = false
                    let result = JSON.parse(json)
                    if (result?.status?.code === 200) {
                        if (data?.length >= 100) {
                            setmaxscroll(true)
                        } else {
                            setmaxscroll(false)
                        }
                        return result.data
                    } else if (!result?.data?.length) {
                        return []
                    } else {
                        Utils.alertPopUp(result?.status?.message)
                        return []
                    }
                    // setrefreshing(false)
                })
                .catch(error => {
                    console.log("🚀 ~ file: FeedScreen.js ~ line 132 ~ getData ~ error", error)
                    // setrefreshing(false)
                    Utils.handleError(String(error), 'Error with status code : 51001')
                    errorResponse = false
                    return []
                });


        } catch (error) {
            // setrefreshing(false)
            Utils.alertPopUp(String(error), 'Error with status code : 51002')
        }
    }


    const updateData = async () => {
        try {
            let result = await getData();
            setdata(data.concat(result))
            setcount(count + 1)
            setloadmore(false)
        } catch (error) {
            setloadmore(false)
            console.log("🚀 ~ file: FeedScreen.js ~ line 187 ~ updateData ~ error", error)
        }
    }


    const handleShowDetail = async (item) => {
        try {
            if (!reduxLoad) {
                navigation.navigate('Product')
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                let result = await ServiceProduct.newGetProduct(reduxAuth, item.product.slug);
                if (result === 404) {
                    Utils.alertPopUp('Data tidak ditemukan!')
                    navigation.goBack()
                } else if (!result) {
                    navigation.goBack()
                    console.log('err')
                } else {
                    dispatch({ type: 'SET_DETAIL_PRODUCT', payload: result })
                    setTimeout(() => dispatch({ type: 'SET_FILTER_LOCATION', payload: true }), 7000);
                }
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            } else {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            }
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
        }
    }

    const handleWishlist = async (item, index) => {
        try {
            if (reduxAuth) {
                if (!!item?.wishlist) {
                    data[index].wishlist = false
                } else {
                    data[index].wishlist = true
                }
                setcount(count + 1)
                ServiceUser.handleWishlist(reduxAuth, item.id)
            } else {
                navigation.navigate('Login')
            }
        } catch (error) {
            console.log("🚀 ~ file: FeedScreen.js ~ line 165 ~ handleWishlist ~ error", error)
        }
    }

    const handleShare = async () => {
        setloading(true)
        try {
            let img64 = ''
            await viewShotRef.current.capture().then(async uri => {
                let link = await ServiceUser.handleCreateLink(selectedShare.slug)
                ImgToBase64.getBase64String(uri)
                    .then(base64String => {

                        let urlString = 'data:image/jpeg;base64,' + base64String;
                        img64 = urlString
                        const shareOptions = {
                            title: 'Jaja',
                            message: `Dapatkan ${selectedShare.name} di Jaja.id \nDownload sekarang ${link}`,
                            url: img64,
                        };
                        setloading(false)
                        Share.open(shareOptions)
                            .then((res) => {
                                setselectedShare('')
                                console.log(res);
                            })
                            .catch((err) => {
                                setselectedShare('')
                                err && console.log(err);
                            });
                    })
                    .catch(err => {
                        setselectedShare('')
                        setloading(false)
                        console.log("🚀 ~ file: FeedScreen.js ~ line 239 ~ awaitviewShotRef.current.capture ~ err", err)
                    });
                setloading(false)
            });
        } catch (error) {
            console.log("🚀 ~ file: FeedScreen.js ~ line 259 ~ handleShare ~ error", error)
            setselectedShare('')
            setloading(false)

        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                {item?.loading ?
                    <View key={index + 'RD'} style={[styles.column_start_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: AppleType === 'ipad' ? Wp('90%') : Wp('95%'), height: AppleType === 'ipad' ? Wp('110%') : Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={AppleType === 'ipad' ? Wp('90%') : Wp('95%')}
                            height={AppleType === 'ipad' ? Wp('90%') : Wp('95%')}
                            style={[styles.mb_2, { borderTopRightRadius: 3, borderTopLeftRadius: 3, }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <View style={[styles.column, styles.p_2, { width: '100%' }]}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={AppleType === 'ipad' ? Wp('45%') : Wp('65%')}
                                height={AppleType === 'ipad' ? Wp('3.5%') : Wp("5%")}
                                style={[styles.mb_2, { borderRadius: 2, alignSelf: 'flex-start' }]}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={AppleType === 'ipad' ? Wp('20%') : Wp('35%')}
                                height={AppleType === 'ipad' ? Wp('3.5%') : Wp("5%")}
                                style={[styles.mb_2, { borderRadius: 2, alignSelf: 'flex-start' }]}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={AppleType === 'ipad' ? Wp('25%') : Wp('30%')}
                                height={AppleType === 'ipad' ? Wp('3.5%') : Wp("5%")}
                                style={{ borderRadius: 2, alignSelf: 'flex-end' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                    :
                    <ViewShot key={index + 'FD'} ref={selectedShare?.slug == item.product.slug ? viewShotRef : null} options={{ format: "jpg" }}>
                        <View style={[styles.column_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: AppleType === 'ipad' ? Wp('90%') : Wp('95%'), height: AppleType === 'ipad' ? Wp('110%') : Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                            <View style={{ height: AppleType === 'ipad' ? Wp('90%') : Wp('95%'), width: AppleType === 'ipad' ? Wp('90%') : Wp('95%'), borderRadius: 3 }}>
                                <Swiper
                                    style={{}}
                                    autoplayTimeout={2}
                                    pagingEnabled={true}
                                    showsPagination={true}
                                    horizontal={true}
                                    dotColor={colors.BlueJaja}
                                    activeDotColor={colors.YellowJaja}
                                    paginationStyle={{ bottom: 10 }}>
                                    {item.product.images.map(image => {
                                        return (
                                            <View style={styles.row_center}>
                                                <FastImage
                                                    source={{ uri: image }}
                                                    style={{ width: AppleType === 'ipad' ? Wp('90%') : Wp('95%'), height: AppleType === 'ipad' ? Wp('90%') : Wp('95%') }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                                {selectedShare?.slug !== item.product.slug ?
                                                    <View style={[styles.row_center, { position: 'absolute', height: AppleType === 'ipad' ? Wp("4%") : Wp('5%'), width: Wp('25%'), top: 0, left: 0, borderTopRightRadiusL: 3, }]}>
                                                        <ShimmerPlaceholder
                                                            LinearGradient={LinearGradient}
                                                            width={Wp('25%')}
                                                            height={AppleType === 'ipad' ? Wp("4%") : Wp("5%")}
                                                            style={{ borderRadius: 0, alignSelf: 'flex-start', borderTopRightRadiusL: 3 }}
                                                            shimmerColors={[colors.BlueJaja, colors.White, colors.BlueJaja]}
                                                        />
                                                        <View style={[styles.row_center, {
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            width: '100%', height: AppleType === 'ipad' ? Wp("4%") : Wp("5%"),
                                                        }]}>
                                                            <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White, textAlignVertical: 'center', textAlign: 'center', }]}>New Product</Text>
                                                        </View>
                                                    </View>
                                                    : null}
                                            </View>

                                        )
                                    })}
                                </Swiper>

                            </View>
                            <View style={[styles.column_between_center, styles.p_2, { width: '100%', height: AppleType === 'ipad' ? Wp('20%') : Wp('25%') }]}>
                                <Text onPress={() => handleShowDetail(item)} numberOfLines={2} style={[styles.font_13, styles.T_medium, styles.mb_3, { alignSelf: 'flex-start', width: '85%' }]}>{item.product.name}</Text>
                                <View style={[styles.row_between_center, { alignItems: 'center', width: '100%' }]}>
                                    <View style={[styles.row_start_center]}>
                                        <FastImage
                                            source={require('../../assets/icons/google-maps.png')}
                                            style={styles.icon_14}
                                            tintColor={colors.YellowJaja}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.font_9, styles.ml_2]}>{item.seller.location}</Text>

                                    </View>
                                    <View style={[styles.row_around_center]}>
                                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => handleShowDetail(item)}>
                                            <FastImage
                                                source={require('../../assets/icons/gift.png')}
                                                style={[styles.icon_21, styles.ml_5]}
                                                tintColor={colors.BlueJaja}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.row_center, styles.mr_5]}
                                            onPress={() => handleWishlist(item, index)}>
                                            <FastImage
                                                source={require('../../assets/icons/love.png')}
                                                style={styles.icon_21}
                                                tintColor={item?.wishlist ? colors.RedFlashsale : colors.Silver}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setselectedShare(item.product)}>
                                            <FastImage
                                                source={require('../../assets/icons/share.png')}
                                                style={[styles.icon_23, styles.ml_5]}
                                                tintColor={colors.YellowJaja}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* <View style={[styles.column_between_center, { width: '100%', height: '100%' }]}>
                                        
                                        <Text onPress={() => handleShowDetail(item)} numberOfLines={2} style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{item.product.name}</Text>
                                        <View style={styles.row_start_center}>
                                            <FastImage
                                                source={require('../../assets/icons/google-maps.png')}
                                                style={styles.icon_14}
                                                tintColor={colors.YellowJaja}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.font_9, styles.ml_2]}>{item.seller.location}</Text>

                                        </View>
                                    </View> */}
                                {/* <View style={[styles.column_end, { width: '20%', height: '100%' }]}>
                                        <TouchableOpacity onPress={() => handleShowDetail(item)}>
                                            <FastImage
                                                source={require('../../assets/icons/gift.png')}
                                                style={[styles.icon_23, styles.ml_5]}
                                                tintColor={colors.BlueJaja}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </TouchableOpacity>


                                        <View style={[styles.row_between_center, { alignItems: 'flex-end', width: '100%', height: '50%', }]}>
                                            <TouchableOpacity
                                                style={[styles.row_center, styles.mr_5]}
                                                onPress={() => handleWishlist(item, index)}>
                                                <FastImage
                                                    source={require('../../assets/icons/love.png')}
                                                    style={styles.icon_21}
                                                    tintColor={item?.wishlist ? colors.RedFlashsale : colors.Silver}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setselectedShare(item.product)}>
                                                <FastImage
                                                    source={require('../../assets/icons/share.png')}
                                                    style={[styles.icon_23, styles.ml_5]}
                                                    tintColor={colors.YellowJaja}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                            </TouchableOpacity>

                                        </View>
                                    </View> */}
                            </View>

                        </View>
                    </ViewShot >

                }
            </>
        )

    }
    return (
        <SafeAreaView style={[styles.containerFix]}>
            <Appbar title="Feed" trolley={true} notif={true} />
            {loading ? <Loading /> : null}
            <View style={styles.containerIn}>
                <FlatList
                    contentContainerStyle={[styles.column_center, { alignSelf: 'center' }]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        Platform.OS === "android" ?
                            {
                                useNativeDriver: false,
                                listener: event => {
                                    if (isCloseToBottom(event.nativeEvent)) {
                                        if (!loadmore) {
                                            setloadmore(true)
                                            setpage(page + 1)
                                        } else {
                                            console.log('wait')
                                        }
                                    }
                                }
                            }
                            : null
                    )}

                    onMomentumScrollEnd={({ nativeEvent }) => {
                        console.log("🚀 ~ file: FeedScreen.js ~ line 486 ~ FeedScreen ~ nativeEvent", nativeEvent)
                        if (isCloseToBottom(nativeEvent)) {
                            if (!loadmore) {
                                setloadmore(true)
                                setpage(page + 1)
                            } else {
                                // console.log('wait')
                            }
                        }
                    }}
                    style={styles.p_2}
                    data={maxscroll && loadmore ? data : data?.concat(shimmerdata)}
                    keyExtractor={(item, index) => String(index + 'SJ')}
                    renderItem={renderItem}
                />
            </View>

        </SafeAreaView>
    )
}
