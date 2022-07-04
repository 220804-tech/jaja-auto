import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, FlatList, SafeAreaView, RefreshControl, Animated, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { useDispatch, useSelector } from 'react-redux'
import { colors, styles, Utils, Wp, FastImage, useNavigation, ServiceProduct, Appbar, ServiceUser, Loading } from '../../export'
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



    const [shimmerloading, setshimmerLoading] = useState(false)
    const [shimmerdata, setshimmerData] = useState([{ loading: true }, { loading: true }])



    useEffect(() => {
        handleFirstData()
    }, [])

    useEffect(() => {

        if (selectedShare?.name) {
            console.log("🚀 ~ file: FeedScreen.js ~ line 51 ~ useEffect ~ selectedShare", selectedShare)
            setselectedShare(selectedShare)
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
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.80) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 3)
    }


    const getData = async (categoryName) => {
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

            return await fetch(`${reduxUrl}/jaja/get-feeds?page=${israndom ? 1 : page}&limit=5&categories=["toys","books","art"]&isRandom=${israndom}`, requestOptions)
                .then(response => response.text())
                .then(json => {
                    setisRandom(false)
                    // setpage(page + 1)
                    errorResponse = false
                    let result = JSON.parse(json)
                    if (result?.status?.code === 200) {
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

    const dynamicLink = async () => {
        try {
            const link_URL = await dynamicLinks().buildShortLink({
                link: `https://jajaid.page.link/gift?slug=${giftDetails.slug}`,
                domainUriPrefix: 'https://jajaid.page.link',
                ios: {
                    bundleId: 'com.jaja.customer',
                    appStoreId: '1547981332',
                    fallbackUrl: 'https://apps.apple.com/id/app/jaja-id-marketplace-hobbies/id1547981332?l=id',
                },
                android: {
                    packageName: 'com.jajaidbuyer',
                    fallbackUrl: 'https://play.google.com/store/apps/details?id=com.jajaidbuyer',
                },
                navigation: {
                    forcedRedirectEnabled: true,
                }
            });
            console.log("🚀 ~ file: ProductScreen.js ~ line 127 ~ constlink_URL=awaitdynamicLinks ~ link_URL", link_URL)
            setlink(link_URL)
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 138 ~ dynamicLink ~ error", error)

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
                        console.log("🚀 ~ file: FeedScreen.js ~ line 312 ~ .then ~ selectedShare", selectedShare)
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
                        console.log("🚀 ~ file: FeedScreen.js ~ line 239 ~ awaitviewShotRef.current.capture ~ err", err)
                    });
                setloading(false)

            });
        } catch (error) {
            setselectedShare('')

        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                {item?.loading ?
                    <View style={[styles.column_start_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: Wp('95%'), height: Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={Wp('95%')}
                            height={Wp("95%")}
                            style={[styles.mb_2, { borderTopRightRadius: 3, borderTopLeftRadius: 3, }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <View style={[styles.column, styles.p_2, { width: '100%' }]}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('65%')}
                                height={Wp("5%")}
                                style={[styles.mb_2, { borderRadius: 2, alignSelf: 'flex-start' }]}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('35%')}
                                height={Wp("5%")}
                                style={[styles.mb_2, { borderRadius: 2, alignSelf: 'flex-start' }]}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('30%')}
                                height={Wp("5%")}
                                style={{ borderRadius: 2, alignSelf: 'flex-end' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                    :
                    <ViewShot ref={selectedShare?.slug == item.product.slug ? viewShotRef : null} options={{ format: "jpg" }}>
                        <View style={[styles.column_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: Wp('95%'), height: Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                            <View style={[[styles.column_center, { width: Wp('95%'), height: Wp('95%') }]]}>
                                <View style={{ height: Wp('95%'), width: Wp('95%'), borderRadius: 3 }}>
                                    <Swiper
                                        style={{}}
                                        autoplayTimeout={2}
                                        pagingEnabled={true}
                                        showsPagination={true}
                                        horizontal={true}
                                        dotColor={colors.BlueJaja}
                                        activeDotColor={colors.YellowJaja}
                                        paginationStyle={{ bottom: 10 }}>
                                        {item.product.images.map((image, index) => {
                                            return (
                                                <View key={index + 'YG'} style={styles.row_center}>
                                                    <FastImage
                                                        source={{ uri: image }}
                                                        style={{ width: Wp('95%'), height: Wp('95%') }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <View style={[styles.row_center, { position: 'absolute', height: Wp('5%'), width: Wp('25%'), top: 0, left: 0, borderTopRightRadiusL: 3 }]}>
                                                        <ShimmerPlaceholder
                                                            LinearGradient={LinearGradient}
                                                            width={Wp('25%')}
                                                            height={Wp("5%")}
                                                            style={{ borderRadius: 0, alignSelf: 'flex-start', borderTopRightRadiusL: 3 }}
                                                            shimmerColors={[colors.BlueJaja, colors.White, colors.BlueJaja]}
                                                        />
                                                        <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White, position: 'absolute', top: 0, bottom: 0 }]}>New Product</Text>
                                                    </View>
                                                </View>

                                            )
                                        })}
                                    </Swiper>

                                </View>
                                <View style={[styles.row_between_center, styles.p_2, { width: '100%', height: Wp('25%'), }]}>
                                    <View style={[styles.column_between_center, { alignItems: 'flex-start', width: '80%', height: '100%' }]}>
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
                                    </View>
                                    <View style={[styles.column_end, { width: '20%', height: '100%' }]}>
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
                                    </View>
                                </View>

                            </View >
                        </View>
                    </ViewShot>

                }
            </>
        )

    }
    return (
        <SafeAreaView style={[styles.container]}>
            <Appbar title="Feed" trolley={true} notif={true} />
            {loading ? <Loading /> : null}
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
                                        // console.log('wait')
                                    }
                                }
                            }
                        }
                        : null
                )}
                onMomentumScrollEnd={({ nativeEvent }) => {
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
                data={data?.concat(shimmerdata)}
                keyExtractor={(item, index) => String(index + 'SJ')}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}
