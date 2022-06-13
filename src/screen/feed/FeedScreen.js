import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, FlatList, SafeAreaView, RefreshControl, Animated, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { useDispatch, useSelector } from 'react-redux'
import { colors, styles, Utils, Wp, FastImage, useNavigation, ServiceProduct, Appbar, ServiceUser } from '../../export'
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
    const [israndom, setisRandom] = useState(true)

    const [selectedShare, setselectedShare] = useState('')



    const [shimmerloading, setshimmerLoading] = useState(false)
    const [shimmerdata, setshimmerData] = useState([{ loading: true }, { loading: true }])



    useEffect(() => {
        handleFirstData()
        return () => {

        }
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



    const onRefresh = useCallback(() => {
        setrefreshing(true);
        updateData()
        setrefreshing(false);
    }, []);

    const handleFirstData = async () => {
        let result = await getData();
        setdata(result)
        setcount(count + 1)

    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.80) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 3)
    }

    // const getData = async (categoryName) => {
    //     try {
    //         // setrefreshing(true)
    //         let errorResponse = true
    //         var myHeaders = new Headers();
    //         myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
    //         var requestOptions = {
    //             method: 'GET',
    //             headers: myHeaders,
    //             redirect: 'follow'
    //         };

    //         setTimeout(() => {
    //             if (errorResponse) {
    //                 Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
    //             }
    //         }, 22000);

    //         return await fetch(`https://jaja.id/backend/product/category/crafting?page=1&limit=100&keyword=&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
    //             .then(response => response.text())
    //             .then(json => {
    //                 errorResponse = false
    //                 let result = JSON.parse(json)
    //                 if (result?.status?.code === 200) {
    //                     return result.data.items
    //                 } else if (!result?.data?.items?.length) {
    //                     return []
    //                 } else {
    //                     Utils.alertPopUp(result?.status?.message)
    //                     return []
    //                 }
    //                 // setrefreshing(false)
    //             })
    //             .catch(error => {
    //                 // setrefreshing(false)
    //                 Utils.handleError(String(error), 'Error with status code : 51001')
    //                 errorResponse = false
    //                 return []
    //             });


    //     } catch (error) {
    //         // setrefreshing(false)
    //         Utils.alertPopUp(String(error), 'Error with status code : 51002')
    //     }
    // }

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

            return await fetch(`${reduxUrl}/jaja/get-feeds?page=${page}&limit=5&categories=["toys","books"]&isRandom=${israndom}`, requestOptions)
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
        } catch (error) {
            console.log("🚀 ~ file: FeedScreen.js ~ line 187 ~ updateData ~ error", error)
        }
    }

    const handleDetail = (item) => {
        console.log("🚀 ~ file: FeedScreen.js ~ line 100 ~ handleShowDetail ~ item", item)
        let error = true;
        try {
            if (!reduxLoad) {
                if (!props.gift) {
                    navigation.push("Product")
                } else {
                    navigation.push("GiftDetails")
                }
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
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
                    error = false
                })
            } else {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                error = false
            }
            setTimeout(() => {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            }, 11000);
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
        }, 15000);
    }

    const handleShowDetail = async (item) => {
        try {
            navigation.navigate('Product')
            let result = await ServiceProduct.newGetProduct();
            if (result === 404) {
                Utils.alertPopUp('Data tidak ditemukan!')
                navigation.goBack()
            } else if (!result) {

            } else {

            }
            console.log("🚀 ~ file: FeedScreen.js ~ line 156 ~ handleDetail ~ result", result)

        } catch (error) {

        }
    }

    const handleWishlist = async (item, index) => {
        try {
            if (!!item?.wishlist) {
                data[index].wishlist = false
            } else {
                data[index].wishlist = true
            }
            setcount(count + 1)
            ServiceUser.handleWishlist(reduxAuth, item.id)
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
        console.log("🚀 ~ file: FeedScreen.js ~ line 299 ~ awaitviewShotRef.current.capture ~ selectedShare", selectedShare.slug)
        console.log('masuk sini nggk')

        try {
            let img64 = ''
            await viewShotRef.current.capture().then(async uri => {
                console.log("🚀 ~ file: FeedScreen.js ~ line 399 ~ awaitviewShotRef.current.capture ~ selectedShare", selectedShare.slug)

                setshimmerLoading(true)
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
            });
        } catch (error) {
            setselectedShare('')

        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                {item?.loading ?
                    <View style={[styles.column_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: Wp('95%'), height: Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                        <View style={styles.column_center}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('95%')}
                                height={Wp("95%")}
                                style={[styles.mb_2, { borderRadius: 3 }]}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('30%')}
                                height={Wp("5%")}
                                style={[styles.mb, { borderRadius: 2, alignSelf: 'flex-end' }]}
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
                                width={Wp('75%')}
                                height={Wp("5%")}
                                style={{ borderRadius: 2, alignSelf: 'flex-start' }}
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
                                        {item.product.images.map(image => {
                                            return (
                                                <View style={styles.row_center}>
                                                    <FastImage
                                                        source={{ uri: image }}
                                                        style={{ width: Wp('95%'), height: Wp('95%') }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                </View>

                                            )
                                        })}
                                    </Swiper>

                                </View>
                                <View style={[styles.row_between_center, styles.p_2, { width: '100%', height: Wp('25%'), }]}>
                                    <View style={[styles.column_between_center, { alignItems: 'flex-start', width: '58%', height: '100%' }]}>
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
                                    <View style={[styles.row_end, { width: '40%', height: '100%', }]}>
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
                                                tintColor={colors.BlueJaja}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </TouchableOpacity>

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
                                    setpage(page + 1)
                                }
                            }
                        }
                        : null
                )}
                style={styles.p_2}
                data={data?.concat(shimmerdata)}
                keyExtractor={(item, index) => String(index + 'SJ')}
                renderItem={renderItem}
            />

        </SafeAreaView>
    )
}
