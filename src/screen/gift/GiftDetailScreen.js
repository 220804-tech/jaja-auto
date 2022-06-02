import React, { useEffect, useState, useCallback, useRef } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, TextInput, Modal } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { Button, TouchableRipple, Checkbox, IconButton } from 'react-native-paper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { styles, colors, useNavigation, Hp, Wp, Ps, useFocusEffect, FastImage, RecomandedHobby, Utils, ServiceProduct, ServiceCart, ServiceUser, CardProduct, Loading, } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useDispatch, useSelector } from "react-redux";
import StarRating from 'react-native-star-rating';
LogBox.ignoreAllLogs()
import ImgToBase64 from 'react-native-image-base64';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ViewShot from "react-native-view-shot";


export default function GiftDetailScreen(props) {
    const viewShotRef = useRef(null);

    const navigation = useNavigation()
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const slug = useSelector(state => state.search.slug)
    const giftDetails = useSelector(state => state.product.productDetail)
    const reduxStore = useSelector(state => state.store.store)

    const prod = useSelector(state => state.gift.details)
    const reduxLoad = useSelector(state => state.product.productLoad)
    const reduxTemporary = useSelector(state => state.product.productTemporary)
    const dispatch = useDispatch()
    const productGiftHome = useSelector(state => state.gift.productGiftHome)

    const [scrollY, setscrollY] = useState(new Animated.Value(0))

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setloading] = useState(false)
    const [like, setLike] = useState(false)
    const [alert, setalert] = useState("")
    const [image, setImage] = useState('')

    const [deskripsiLenght, setdeskripsiLenght] = useState(200)

    const [variasiSelected, setvariasiSelected] = useState({})
    const [variasiPressed, setvariasiPressed] = useState("")

    const [flashsale, setFlashsale] = useState(false)
    const [flashsaleData, setFlashsaleData] = useState({})
    const [seller, setSeller] = useState("")
    const [disableCart, setdisableCart] = useState(false)
    const [boxUse, setboxUse] = useState(false)
    const [cardUse, setcardUse] = useState(false)

    const [catatan, setcatatan] = useState('')
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateSelected, setdateSelected] = useState(null)
    const [dateSelect, setdateSelect] = useState(null)
    const [modal, setmodal] = useState(false)
    const [link, setlink] = useState('')


    const [dateMin, setdateMin] = useState({
        year: 0,
        month: 0,
        date: 0,
    });

    const [dateMax, setdateMax] = useState({
        year: 0,
        month: 0,
        date: 0,
    });

    const [count, setcount] = useState(0)

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)        // setLoading(true);
        if (slug) {
            Utils.alertPopUp('Refreshing..')
        }
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    useFocusEffect(
        useCallback(() => {
            try {
                ImgToBase64.getBase64String(giftDetails.image[0])
                    .then(async base64String => {
                        let urlString = 'data:image/jpeg;base64,' + base64String;
                        setImage(urlString)
                        console.log('masuk sini')
                    })
                    .catch(err => console.log("cok"));
            } catch (error) {

            }


        }, [Object.keys(giftDetails)]),
    );

    useFocusEffect(
        useCallback(() => {

            let dataSeller = {
                chat: reduxUser.user.uid + '5ff7b38436b51seller113'
            }
            dataSeller.id = dataSeller.uid
            var future = new Date();
            future.setDate(future.getDate() + 3);
            setdateMin({
                year: future.getFullYear(),
                month: future.getMonth(),
                date: future.getDate()
            })
            future.setMonth(future.getMonth() + 4);
            setdateMax({
                year: future.getFullYear(),
                month: future.getMonth(),
                date: future.getDate()
            })
        }, []),
    );


    useEffect(() => {
        if (giftDetails?.slug) {
            dynamicLink()
        }
    }, [giftDetails?.slug])


    function currencyFormat(num) {
        return 'Rp' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '.')
    }

    const handleTrolley = () => {
        if (reduxAuth) {
            navigation.navigate("Trolley")
            ServiceCart.getTrolley(reduxAuth, 1, dispatch)
            dispatch({ type: 'SET_CART_STATUS', payload: 1 })
        } else {
            handleLogin()
        }
    }

    const handleWishlist = () => {
        if (reduxAuth) {
            setLike(!like)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=t3uc2fb7opug4n91n18e70tcpjvdb12u");
            var raw = JSON.stringify({ "id_produk": reduxProduct.id });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/user/addWishlist", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setLike(!like)
                    }
                })
                .catch(error => Utils.handleError(error, "Error with status code : 12025"));
        } else {
            handleLogin()
        }
    }

    const handleLogin = () => navigation.navigate('Login', { navigate: "GiftDetails" })

    const renderNavBar = () => (
        <View style={style.navContainer}>
            {Platform.OS === 'ios' ? null : <View style={styles.statusBar} />}

            <View style={[style.navBar, { paddingTop: Platform.OS === 'ios' ? '0%' : '5%' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/arrow.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: colors.White }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTrolley} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.White }} />
                    {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductGiftInCart ?
                        <View style={[styles.countNotif, { right: 3, top: 3 }]}><Text style={styles.textNotif}>{reduxUser.badges.totalProductGiftInCart >= 100 ? "99+" : reduxUser.badges.totalProductGiftInCart}</Text></View>
                        : null
                    }
                </TouchableOpacity>
            </View>
        </View >
    );

    const title = () => {
        let arrImage = [require('../../assets/images/JajaId.png')]
        return (
            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White, marginTop: Platform.OS === 'ios' ? '-11%' : 0 }}>
                {
                    Platform.OS === 'ios' ?
                        <View style={{
                            width: '100%', height: '100%', backgroundColor: colors.White, marginTop: -STATUS_BAR_HEIGHT, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Swiper
                                // autoplayTimeout={4}
                                horizontal={true}
                                loop={false}
                                dotColor={colors.White}
                                activeDotColor={colors.BlueJaja}
                                paginationStyle={{ bottom: 10 }}
                            // style={{ backgroundColor: colors.BlueJaja, flex: 0, justifyContent: 'center', alignItems: 'center' }}
                            >
                                {
                                    reduxLoad === false && giftDetails?.image?.length > 0 ?
                                        giftDetails.image.map((item, key) => {
                                            return (
                                                <Image key={String(key)} style={[style.swiperProduct, { alignSelf: 'center' }]}
                                                    source={{ uri: item }}
                                                />
                                            );
                                        })
                                        :
                                        arrImage.map((item, key) => {
                                            return (
                                                <Image key={String(key)} style={style.loadingProduct}
                                                    source={require('../../assets/images/JajaId.png')}
                                                />
                                            );
                                        })
                                }
                            </Swiper>
                        </View >
                        :
                        <Swiper
                            horizontal={true}
                            dotColor={colors.White}
                            activeDotColor={colors.BlueJaja}
                            style={{ backgroundColor: colors.WhiteBack }}>
                            {
                                reduxLoad || !giftDetails?.image?.[0] ?
                                    arrImage.map((item, key) => {
                                        return (
                                            <View key={String(key)} style={{ width: Wp('100%'), height: Wp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                                                {console.log('masuk satu')}
                                                <Image style={[style.swiperProduct, { width: "70%", height: "70%", tintColor: colors.Silver }]}
                                                    source={item}
                                                />
                                            </View>
                                        );
                                    })
                                    :
                                    giftDetails.image.map((item, key) => {
                                        return (
                                            <Image style={{ width: Wp('100%'), height: Wp('100%'), resizeMode: 'contain' }}
                                                source={{ uri: item }
                                                }
                                            />
                                        );
                                    })
                            }
                        </Swiper>
                }
            </View >
            // <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White, marginTop: Platform.OS === 'ios' ? '-11%' : 0 }}>
            //     {
            //         Platform.OS === 'ios' ?
            //                 width: '100%', height: '100%', backgroundColor: colors.White, marginTop: -STATUS_BAR_HEIGHT, justifyContent: 'center', alignItems: 'center'
            //                 <Swiper
            //                     autoplayTimeout={4}
            //                     horizontal={true}
            //                     dotColor={colors.White}
            //                     activeDotColor={colors.BlueJaja}
            //                     paginationStyle={{ bottom: 10 }}
            //                     autoplay={true}
            //                     loop={true}
            //                     >
            //                     {
            //                         reduxLoad || !giftDetails?.image?.[0] ?
            //                             arrImage.map((item, key) => {
            //                                 return (
            //                                     <Image key={String(key)} style={[style.swiperProduct, { tintColor: colors.Silver }]}
            //                                         source={item}
            //                                     />
            //                                 );
            //                             })

            //                             :

            //                             giftDetails.image.map((item, key) => {
            //                                 return (
            //                                     <Image key={String(key)} style={style.swiperProduct}
            //                                         source={{ uri: item }}
            //                                     />
            //                                 );
            //                             })}

            //                 </Swiper>
            //             </View>
            //             :
            //             <Swiper
            //                 horizontal={true}
            //                 dotColor={colors.White}
            //                 activeDotColor={colors.BlueJaja}
            //                 style={{ backgroundColor: colors.WhiteBack }}>
            //                 {
            //                     reduxLoad || !giftDetails?.image?.[0] ?
            //                         arrImage.map((item, key) => {
            //                             return (
            //                                 <View key={String(key)} style={{ width: Wp('100%'), height: Wp('100%'), }}>
            //                                     <Image style={[style.swiperProduct, { tintColor: colors.Silver }]}
            //                                         source={item}
            //                                     />
            //                                 </View>
            //                             );
            //                         })
            //                         :
            //                         giftDetails.image.map((item, key) => {
            //                             return (
            //                                 <View key={String(key)} style={{ width: Wp('100%'), height: Wp('100%') }}>
            //                                     <Image style={style.swiperProduct}
            //                                         source={{ uri: item }}
            //                                     />
            //                                 </View>
            //                             );
            //                         })
            //                 }
            //             </Swiper>
            //     }
            // </View>
        );
    };


    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                !status ? await navigation.push("GiftDetails") : null
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



    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 1.1) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 0.05)
    }

    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            // console.log("masuk as")
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
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


    const handleShare = () => {
        setmodal(true)
        setTimeout(async () => {
            try {
                let img64 = ''
                await viewShotRef.current.capture().then(async uri => {
                    await ImgToBase64.getBase64String(uri)
                        .then(base64String => {
                            let urlString = 'data:image/jpeg;base64,' + base64String;
                            img64 = urlString
                        })
                        .catch(err => console.log("cok"));
                });
                setmodal(false)
                const shareOptions = {
                    title: 'Jaja',
                    message: `Dapatkan ${giftDetails.name} di Jaja.id \nDownload sekarang ${link}`,
                    url: img64,
                };
                Share.open(shareOptions)
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        err && console.log(err);
                    });
            } catch (error) {

            }
        }, 1500);

    }

    const handleStore = () => {
        navigation.navigate('Gift')
        ServiceProduct.getStoreProduct({ gift: 1 }).then(res => {
            dispatch({ type: "SET_PRODUCT_GIFT_HOME", payload: res?.data?.items })
            dispatch({ type: "SET_FILTER_GIFT", payload: res?.data?.filters })
            dispatch({ type: "SET_SORT_GIFT", payload: res?.data?.sorts })
        })

    }

    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: reduxLoad ? colors.White : colors.BlackGround, paddingBottom: Hp('6%') }]}>
                {giftDetails && Object.keys(giftDetails).length ?
                    <View style={styles.column}>
                        <View style={{ flex: 0, flexDirection: 'column', backgroundColor: colors.White, padding: '3%', marginBottom: '1%' }}>
                            <Text style={[styles.font_18, styles.mb_2]}>{giftDetails.name}</Text>
                            {Object.keys(variasiSelected).length ?
                                <View style={[styles.row_start_center,]}>
                                    <View style={[styles.row, { width: '87%', height: '100%' }]}>
                                        {variasiSelected.isDiscount ?
                                            <View style={styles.row}>
                                                <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                    <Text style={[styles.font_16, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{giftDetails.discount}%</Text>
                                                </View>
                                                <View style={styles.column}>
                                                    <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.priceDiscount}</Text>
                                                </View>
                                            </View>
                                            :
                                            <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.price}</Text>
                                        }
                                    </View>
                                    <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                        <TouchableOpacity onPress={handleShare}>
                                            <Image source={require('../../assets/icons/share.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: colors.Silver }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <View style={[styles.row_start_center]}>
                                    <View style={[styles.row_start_center, { width: '87%', }]}>
                                        {giftDetails.isDiscount ?
                                            <View style={[styles.row_start_center]}>
                                                <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5 }]}>
                                                    <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{giftDetails.discount}%</Text>
                                                </View>
                                                <View style={[styles.column]}>
                                                    <Text style={Ps.priceBefore}>{giftDetails.price}</Text>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{giftDetails.priceDiscount}</Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={[styles.row_between_center, { width: '100%' }]}>
                                                <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{boxUse ? giftDetails.priceBox : giftDetails.price}</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                        <TouchableOpacity onPress={handleShare}>
                                            <Image source={require('../../assets/icons/share.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: colors.Silver }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            <View style={[styles.row_between_center, styles.mt_3]}>
                                <Text style={[styles.font_14, { width: '87%' }]}>{giftDetails.amountSold ? giftDetails.amountSold + " Terjual" : ""}</Text>
                                <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                    <TouchableOpacity onPress={handleWishlist}>
                                        <Image source={require('../../assets/icons/love.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: like ? flashsale ? colors.RedFlashsale : colors.RedMaroon : colors.Silver }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {giftDetails.variant && giftDetails.variant.length ?
                            <View style={[styles.column_between_center, styles.p_3, styles.mb, { backgroundColor: colors.White, alignItems: 'flex-start' }]}>
                                <View style={[styles.row_center, styles.mb_3]}>
                                    <Text style={[styles.font_14]}>Variasi Produk</Text>
                                    <Text style={[styles.font_12, { marginLeft: '3%', fontStyle: 'italic', color: colors.RedNotif, fontFamily: 'SignikaNegative-Regular' }]}>{alert}</Text>
                                </View>
                                {/* <View style={[styles.column, { width: Wp('100%') }]}> */}
                                <FlatList
                                    data={giftDetails.variant}
                                    horizontal={true}
                                    // contentContainerStyle={{ flex: 0, flexDirection: 'row' }}
                                    keyExtractor={(item, ind) => String(ind)}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <Button disabled={item.stock ? false : true} color={colors.BlueJaja} onPress={() => {
                                                setvariasiPressed(item.id)
                                                setvariasiSelected(item)
                                                setalert("")
                                            }} style={{ backgroundColor: item.stock ? variasiPressed === item.id ? colors.BlueJaja : colors.White : colors.White, borderColor: item.stock ? variasiPressed === item.id ? colors.BlueJaja : colors.BlueJaja : colors.Silver, marginRight: 10 }} mode="outlined" labelStyle={{ color: item.stock ? variasiPressed === item.id ? colors.White : colors.BlackGrayScale : colors.Silver, fontSize: 12 }} uppercase={false}>
                                                {item.name}
                                            </Button>
                                        )
                                    }}
                                />
                                {/* </View> */}
                                <Text style={[styles.font_12, styles.mt_3]}>Stok tersisa {variasiSelected.stock}</Text>
                            </View>
                            : null
                        }

                        {giftDetails.store ?
                            <View style={[styles.row_between_center, styles.p_3, styles.mb_2, { backgroundColor: colors.White }]}>
                                <View style={[styles.row, { width: '67%' }]}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Gift')} style={{ height: Wp('15%'), width: Wp('15%'), borderRadius: 5, marginRight: '3%', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.Silver }}>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 5 }} source={Object.keys(giftDetails).length && giftDetails.store.image ? { uri: giftDetails.store.image } : require('../../assets/images/JajaId.png')} />
                                    </TouchableOpacity>
                                    <View style={[styles.column_between_center, { width: '77%', alignItems: 'flex-start' }]}>
                                        <Text numberOfLines={1} onPress={() => navigation.navigate('Gift')} style={[styles.font_14, styles.T_medium, { width: '100%' }]}>{giftDetails.store.name}</Text>
                                        {giftDetails.store.location ?
                                            <View style={[Ps.location, { position: 'relative', width: '100%', marginLeft: '-1%', padding: 0 }]}>
                                                <Image style={[styles.icon_14, { marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                                                <Text style={[Ps.locarionName, { marginBottom: '-1%' }]}>{giftDetails.store.location}</Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.row_center, styles.py_2, styles.px_3, { borderWidth: 1, borderColor: flashsale ? colors.RedFlashsale : colors.BlueJaja, borderRadius: 100 }]} onPress={handleStore}>
                                    <Text style={[styles.font_10, styles.T_semi_bold, { color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>Cari Hadiah</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                        <View style={[styles.column]}>
                            <View style={[styles.row_start_center, styles.mx_2]}>
                                <TouchableRipple onPress={() => console.log('pressed')} style={[styles.column_start_center, styles.p_2, styles.mr, { width: Wp('30%'), height: Wp('35%'), backgroundColor: colors.White }]}>
                                    <>
                                        <Image style={{ width: Wp('16%'), height: Wp('16%'), marginBottom: '3%' }} source={require('../../assets/icons/giftBox.png')} />
                                        <Text style={[styles.font_11, styles.T_medium, { alignSelf: 'center' }]}>Bungkus Kado</Text>
                                        <View style={[styles.row_between_center]}>
                                            <View>
                                                <Text style={[styles.font_11, styles.T_medium, { alignSelf: 'center' }]}>Rp7.000</Text>
                                            </View>
                                            <Checkbox
                                                disabled={true}
                                                color={colors.BlueJaja}
                                                status='checked'
                                            // onPress={() => setboxUse(!boxUse)}
                                            />
                                        </View>
                                    </>
                                </TouchableRipple>
                                <TouchableRipple onPress={() => setcardUse(!cardUse)} style={[styles.column_start_center, styles.p_2, { width: Wp('30%'), height: Wp('35%'), backgroundColor: colors.White }]}>
                                    <>
                                        <Image style={{ width: Wp('16%'), height: Wp('16%'), marginBottom: '3%' }} source={require('../../assets/icons/letter.png')} />
                                        <Text style={[styles.font_11, styles.T_medium, { alignSelf: 'center' }]}>Kartu Ucapan</Text>
                                        <View style={[styles.row_between_center]}>
                                            <View>
                                                <Text style={[styles.font_11, styles.T_medium, { alignSelf: 'center', alignItems: 'center' }]}>Rp0</Text>
                                            </View>
                                            <Checkbox
                                                color={colors.BlueJaja}
                                                status={cardUse ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                    </>
                                </TouchableRipple>
                            </View>

                            <View style={[styles.column, styles.p_2, styles.mt_2, styles.mb, { width: '100%', backgroundColor: colors.White }]}>
                                {cardUse ?
                                    <View style={[styles.mt_2, styles.p_2, { width: '100%', backgroundColor: colors.White }]}>
                                        <Text style={styles.font_13}>Masukkan catatan untuk kartu ucapanmu disini :</Text>
                                        <TextInput
                                            value={catatan}
                                            numberOfLines={3}
                                            multiline={true}
                                            maxLength={200}
                                            style={[styles.font_12, { width: '100%', backgroundColor: colors.White }]}
                                            placeholder='Pesan untuk kartu ucapan'
                                            onChangeText={(e) => setcatatan(e)}
                                        />
                                    </View>
                                    : null
                                }
                                {dateSelected ?
                                    <View style={[styles.column, styles.p_2, styles.mb, { backgroundColor: colors.White, paddingBottom: '5%' }]}>
                                        <View style={styles.row_between_center}>
                                            <Text style={styles.font_13}>Masukkan tanggal pengiriman :</Text>

                                            {/* <Text style={{ textDecorationLine: 'underline', fontSize: 14, fontFamily: 'SignikaNegative-Medium', color: colors.BlackGrayScale, marginBottom: '3%' }}>Tanggal Pengiriman</Text> */}
                                            <IconButton
                                                icon="calendar-text-outline"
                                                style={{ padding: 0, margin: 0, backgroundColor: colors.White }}
                                                color={colors.BlueJaja}
                                                size={17}
                                                onPress={() => setDatePickerVisibility(true)}
                                            />
                                            {/* <TouchableRipple onPress={() => setDatePickerVisibility(true)} style={[styles.px_2, styles.mb_3]}>
                                                <Text style={{ fontSize: 14, fontFamily: 'SignikaNegative-Medium', color: colors.BlueJaja }}>Ubah</Text>
                                            </TouchableRipple> */}

                                        </View>
                                        <Text style={[styles.font_14, styles.mb_3]}>Paket akan dikirim tanggal {String(dateSelected)}</Text>
                                    </View>
                                    :
                                    <TouchableRipple rippleColor={colors.RedFlashsale} style={[styles.row_center, styles.p_2, { borderWidth: 0.7, borderColor: colors.RedFlashsale, borderRadius: 7 }]} onPress={() => setDatePickerVisibility(true)}>
                                        <View style={[styles.row_center, { width: '100%' }]}>
                                            <Text style={[styles.font_13, { color: colors.RedFlashsale, width: '90%', alignSelf: 'center', textAlign: 'center' }]}>Tentukan kapan barang akan dikirim</Text>
                                            <Image style={[styles.icon_16, { tintColor: colors.RedFlashsale }]} source={require('../../assets/icons/right-arrow.png')} />
                                        </View>
                                    </TouchableRipple>
                                }
                            </View>


                        </View>
                        <View style={[styles.column, styles.p_4, styles.mb, { backgroundColor: colors.White, paddingBottom: '5%' }]}>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 14, fontFamily: 'SignikaNegative-Medium', color: colors.BlackGrayScale, marginBottom: '3%' }}>Informasi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_5, { alignSelf: 'flex-start' }]}>
                                <View style={[styles.column, { width: '40%' }]}>
                                    <Text style={[styles.font_14, styles.mb_3]}>Berat</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Brand</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kondisi</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kategori</Text>
                                    {giftDetails.preOrder ?
                                        <Text style={[styles.font_14, styles.mb_3]}>Pre Order</Text>
                                        : null
                                    }
                                    <Text style={[styles.font_14, styles.mb_3]}>Stok</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.weight} gram</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.brand ? giftDetails.brand : ""}</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.condition}</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.category && Object.keys(giftDetails.category).length ? giftDetails.category.name : ""}</Text>
                                    {giftDetails.preOrder ?
                                        <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.masaPengemasan} Hari</Text>
                                        : null
                                    }
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{giftDetails.stock && giftDetails.stock > 0 ? giftDetails.stock : 0}</Text>
                                </View>
                            </View>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 13, fontFamily: 'SignikaNegative-Medium', color: colors.BlackGrayScale, marginBottom: '3%' }}>Deskripsi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_3, { alignSelf: 'flex-start' }]}>
                                {giftDetails.description ?
                                    <>
                                        {/* <Text style={[styles.font_14, styles.T_light]}>{giftDetails.description.slice(0, deskripsiLenght)}</Text> */}

                                        <View style={[styles.column, { width: '100%' }]}>
                                            <Text numberOfLines={deskripsiLenght == 200 ? 10 : 25} style={[styles.font_14]}>{giftDetails.description.slice(0, deskripsiLenght)}</Text>
                                            {deskripsiLenght == 200 && giftDetails.description.length >= 200 ?
                                                <TouchableOpacity onPress={() => setdeskripsiLenght(giftDetails.description.length + 50)}>
                                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca selengkapnya..</Text>
                                                </TouchableOpacity>
                                                : giftDetails.description.length <= 200 ? null :
                                                    <TouchableOpacity onPress={() => setdeskripsiLenght(200)}>
                                                        <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca lebih sedikit</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </>
                                    : null}
                            </View>
                        </View>

                        {giftDetails.review && giftDetails.review.length ?
                            <View style={[styles.column, styles.p_4, { backgroundColor: colors.White, paddingBottom: Hp('7%') }]}>
                                <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontFamily: 'SignikaNegative-SemiBold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Penilaian Produk</Text>
                                {giftDetails.review.map((item, index) => {
                                    return (
                                        <View key={String(index)} style={[styles.column, styles.mb_3, styles.px_2, { backgroundColor: colors.White, }]}>
                                            <View style={styles.row_start_center}>
                                                <View style={[styles.row_center, { borderWidth: 0.2, borderRadius: 100, borderColor: colors.BlackGrey, marginRight: '2%', width: 24, height: 24 }]}>
                                                    {item.customerImage ?
                                                        <Image style={[styles.icon_24, styles.mr_2, { borderRadius: 100 }]} source={{ uri: item.customerImage }} />
                                                        :
                                                        <Text style={[styles.font_12, styles.T_semi_bold, { marginBottom: '-2%' }]}>{String(item.customerName).slice(0, 1)}</Text>
                                                    }
                                                </View>
                                                <View style={[styles.column_between_center, { alignItems: 'flex-start', marginTop: '-1%' }]}>
                                                    <Text style={[styles.font_12]}>{item.customerName}</Text>
                                                    <StarRating
                                                        disabled={false}
                                                        maxStars={5}
                                                        rating={parseInt(item.rate)}
                                                        starSize={14}
                                                        fullStarColor={colors.YellowJaja}
                                                        emptyStarColor={colors.YellowJaja}
                                                    />
                                                </View>
                                            </View>
                                            {item.comment ?
                                                <Text style={[styles.font_12, styles.mt, styles.mb_2]}>
                                                    {item.comment}
                                                </Text> : null
                                            }
                                            <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                                {item.image.concat(item.image).map((itm, idx) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => navigation.navigate('ZoomReview', { data: index })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                                            <Image key={String(idx) + "i"} source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                                {/* {item.video ?
                                                    <TouchableOpacity onPress={() => navigation.navigate('ZoomReview', { data: index })} style={[styles.mt_5, { width: Wp('92%'), height: Wp('50%') }]}>
                                                        <VideoPlayer
                                                            video={{ uri: item.video }}
                                                            videoWidth={Wp('100%')}
                                                            videoHeight={Wp('50%')}
                                                            disableFullscreen={false}
                                                            fullScreenOnLongPress={true}
                                                        />
                                                    </TouchableOpacity>
                                                    : null
                                                } */}
                                            </View>
                                        </View>
                                        // <View key={String(index)} style={[styles.column, styles.mb_5, styles.mt_2]}>
                                        //     {index === 0 ? null :
                                        //         <>
                                        //             <View style={styles.row}>
                                        //                 <Image style={[styles.icon_23, styles.mr_2, { borderRadius: 100 }]} source={{ uri: 'https://jaja.id/asset/uplod/ulasan/dd3d4d73-9507-4a59-84ac-ef1b33a52908.jpg' }} />
                                        //                 <View style={[styles.column_between_center, { alignItems: 'flex-start', marginTop: '-1%' }]}>
                                        //                     <Text style={[styles.font_12]}>{item.customerName}</Text>
                                        //                     <StarRating
                                        //                         disabled={false}
                                        //                         maxStars={5}
                                        //                         rating={parseInt(item.rate)}
                                        //                         starSize={14}
                                        //                         fullStarColor={colors.YellowJaja}
                                        //                         emptyStarColor={colors.YellowJaja}
                                        //                     />
                                        //                 </View>
                                        //             </View>
                                        //             {item.comment ?
                                        //                 <Text style={[styles.font_12, styles.mt, styles.mb_2]}>
                                        //                     {item.comment}
                                        //                 </Text> : null
                                        //             }
                                        //         </>}
                                        //     <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                        //         {item.image.map((itm, idx) => {
                                        //             return (
                                        //                 <TouchableOpacity key={String(idx) + "i"} onPress={() => navigation.navigate('Review', { data: giftDetails.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                        //                     <Image source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                        //                 </TouchableOpacity>
                                        //             )
                                        //         })}
                                        //         {item.video ?
                                        //             <TouchableOpacity onPress={() => navigation.navigate('Review', { data: giftDetails.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale }}>
                                        //                 <Image source={require('../../assets/icons/play.png')} style={{ width: Wp('5%'), height: Wp('5%'), marginRight: '2%', tintColor: colors.White }} />
                                        //             </TouchableOpacity>
                                        //             : null
                                        //         }
                                        //     </View>
                                        // </View>
                                    )
                                })}
                                <TouchableOpacity onPress={() => navigation.navigate('Review', { data: giftDetails.slug })} style={{ width: Wp('90%'), justifyContent: 'center', alignItems: 'center', padding: '3%', backgroundColor: colors.White, elevation: 0.5 }}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja, }]}>Tampilkan semua</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                        {giftDetails.otherProduct && giftDetails.otherProduct.length ?
                            <View style={[styles.column, styles.p_4, styles.mb_2, { backgroundColor: colors.White, paddingBottom: '5%' }]}>
                                <Text style={[styles.font_14, styles.T_medium]}>Produk Lainnya Di {giftDetails.store.name}</Text>
                                <FlatList
                                    horizontal={true}
                                    removeClippedSubviews={true} // Unmount components when outside of window 
                                    maxToRenderPerBatch={1} // Reduce number in each render batch
                                    updateCellsBatchingPeriod={100} // Increase time between renders
                                    windowSize={7}
                                    data={giftDetails.otherProduct}
                                    scrollEnabled={true}
                                    keyExtractor={(item, index) => String(index)}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            // <TouchableOpacity
                                            //     onPress={() => handleShowDetail(item)}
                                            //     style={[Ps.cardProduct, { marginRight: 12, width: Wp('33%'), height: Wp('55%') }]}
                                            //     key={index}>
                                            //     {item.isDiscount ? <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                            //     <FastImage
                                            //         style={[Ps.imageProduct, { height: Wp('33%'), width: '100%' }]}
                                            //         source={{
                                            //             uri: item.image,
                                            //             headers: { Authorization: 'someAuthToken' },
                                            //             priority: FastImage.priority.normal,
                                            //         }}
                                            //         resizeMode={FastImage.resizeMode.cover}
                                            //     />
                                            //     <View style={Ps.bottomCard}>
                                            //         <Text
                                            //             numberOfLines={2}
                                            //             style={[Ps.nameProduct, { fontSize: 12 }]}>
                                            //             {item.name}
                                            //         </Text>
                                            //         {item.isDiscount ?
                                            //             <>
                                            //                 <Text style={[Ps.priceBefore, { fontSize: 10 }]}>{item.price}</Text>
                                            //                 <Text style={[Ps.priceAfter, { fontSize: 14 }]}>{item.priceDiscount}</Text>
                                            //             </>
                                            //             :
                                            //             <Text style={Ps.price}>{item.price}</Text>
                                            //         }
                                            //     </View>
                                            // </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center', elevation: 2 }]}
                                                onPress={() => handleShowDetail(item, false)} >
                                                <View style={[styles.column, { height: Wp('33%'), width: '100%' }]}>
                                                    <FastImage
                                                        style={[Ps.imageProduct, { height: '100%', width: '100%' }]}
                                                        source={{
                                                            uri: item.image,
                                                            headers: { Authorization: 'someAuthToken' },
                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.BlueJaja, borderTopRightRadius: 11, alignItems: 'center', justifyContent: 'center' }]}>
                                                        <Text style={[styles.font_8, { marginBottom: '-2%', color: colors.White }]}>Seller Terdekat</Text>
                                                    </View>
                                                </View>
                                                <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                                    <Text numberOfLines={1} style={[Ps.nameProductSmall,]}>{item.name}</Text>
                                                    {item.isDiscount ?
                                                        <>
                                                            <View style={styles.row}>
                                                                <Text style={[Ps.priceBefore, styles.mr_3,]}>{item.price}</Text>
                                                                <Text style={[styles.font_10, styles.T_medium, { zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '1%', paddingHorizontal: '3%', borderRadius: 3 }]}>{item.discount}%</Text>
                                                            </View>
                                                            <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                                        </>
                                                        :
                                                        <Text style={[Ps.price, { color: colors.BlueJaja }]}>{item.price}</Text>
                                                    }
                                                </View>
                                                <View style={[Ps.location, { width: '94%' }]}>
                                                    <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                                    <Text numberOfLines={1} style={[Ps.locarionName, { fontSize: 10, width: '85%' }]}>{item.location}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            : null}
                        <View style={[styles.column, { backgroundColor: colors.White }]}>
                            <CardProduct gift={true} data={productGiftHome} />
                        </View>
                    </View>
                    : null
                }
            </View >
        );
    };

    const handleChat = () => {
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: seller, product: giftDetails })
        } else {
            handleLogin()
        }
    }

    const handleConfirmDate = (res) => {
        try {
            let date = res
            let monthUpdate = date.getMonth() + 1
            let month = monthUpdate === 1 ? 'Januari' : monthUpdate === 2 ? 'Februari' : monthUpdate === 3 ? 'Maret' : monthUpdate === 4 ? 'April' : monthUpdate === 5 ? 'Mei' : monthUpdate === 6 ? 'Juni' : monthUpdate === 7 ? 'Juli' : monthUpdate === 8 ? 'Agustus' : monthUpdate === 9 ? 'September' : monthUpdate === 10 ? 'Oktober' : monthUpdate === 11 ? 'November' : 'Desember'
            let result = String(date.getDate()) + ' ' + String(month) + ' ' + String(date.getFullYear())
            let dateNumber = String(date.getDate()) + '-' + monthUpdate + '-' + String(date.getFullYear())

            console.log("🚀 ~ file: GiftDetailScreen.js ~ line 923 ~ handleConfirmDate ~ result", result)
            console.log("🚀 ~ file: GiftDetailScreen.js ~ line 924 ~ handleConfirmDate ~ result", dateNumber)

            setdateSelected(result)
            setdateSelect(dateNumber)
            setDatePickerVisibility(false)
        } catch (error) {

        }
    }

    const handleAddCart = (name) => {
        setdisableCart(true)
        if (reduxAuth && !disableCart) {
            if (giftDetails.variant && giftDetails.variant.length) {
                if (Object.keys(variasiSelected).length) {
                    handleApiCart(name)
                } else {
                    setalert('Pilih salah satu variasi!')
                    Utils.alertPopUp('Anda belum memilih variasi produk ini!')
                }
            } else {
                handleApiCart(name)
            }
        } else {
            handleLogin()
        }
        setTimeout(() => {
            setdisableCart(false)
        }, 2000);
    }

    const handleGetCart = () => {
        try {
            if (reduxAuth) {
                ServiceUser.getBadge()
                ServiceCart.getTrolley(reduxAuth, 1, dispatch)
            }

        } catch (error) {

        }

    }

    const handleApiCart = async (name) => {
        try {
            var credentials = {
                "productId": giftDetails.id,
                "flashSaleId": flashsale ? flashsaleData.id_flashsale : "",
                "lelangId": "",
                "variantId": variasiPressed,
                "qty": 1,
                "dateSendTime": dateSelect,
                "greetingCardGift": catatan
            };
            console.log("🚀 ~ file: GiftDetailScreen.js ~ line 856 ~ handleApiCart ~ credentials", credentials)
            let result = await ServiceProduct.addCart(reduxAuth, credentials)
            if (result && result.status.code === 200) {
                Utils.alertPopUp('Produk berhasil ditambahkan!')
                if (name === "buyNow") {
                    handleTrolley()
                } else {
                    handleGetCart()
                }
            } else if (result.status.code === 400 && result.status.message === 'quantity cannot more than stock') {
                Utils.alertPopUp("Stok produk tidak tersedia")
            } else {
                Utils.handleErrorResponse(result, 'Error with status code : 12023')
            }
            dispatch({ type: 'SET_TEXT_GIFT', payload: catatan })
        } catch (error) {
            console.log("🚀 ~ file: GiftDetailScreen.js ~ line 834 ~ handleApiCart ~ error", error)
        }
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            {loading ? <Loading /> : null}
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <ReactNativeParallaxHeader
                headerMinHeight={Platform.OS === 'ios' ? Hp('4%') : Hp('9%')}
                headerMaxHeight={Platform.OS === 'ios' ? Hp('45%') : Wp('100%')}
                extraScrollHeight={20}
                statusBarColor='transparent'
                backgroundColor='#FFFF'
                navbarColor={colors.BlueJaja}
                titleStyle={style.titleStyle}
                title={title()}
                backgroundImageScale={1.2}

                renderNavBar={renderNavBar}
                renderContent={renderContent}
                containerStyle={[styles.container, { backgroundColor: colors.WhiteGrey }]}
                innerContainerStyle={{ backgroundColor: colors.WhiteGrey }}
                headerFixedBackgroundColor={colors.BlueJaja}
                alwaysShowTitle={false}
                scrollViewProps={{
                    nestedScrollEnabled: true,
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
            />

            <View style={{ position: 'absolute', bottom: 0, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row', elevation: 3 }}>
                <TouchableOpacity onPress={handleChat} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/chats.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.RedFlashsale }} />
                </TouchableOpacity>
                <TouchableOpacity disabled={disableCart} onPress={() => handleAddCart("trolley")} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center', }}>
                    <Image source={require('../../assets/icons/gift.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.RedFlashsale }} />
                </TouchableOpacity>
                <Button disabled={disableCart} onPress={() => handleAddCart("buyNow")} style={{ width: '50%', height: '100%', backgroundColor: disableCart ? colors.BlackGrey : flashsale ? colors.RedFlashsale : colors.BlueJaja }} contentStyle={{ width: '100%', height: '100%' }} color={disableCart ? colors.BlackGrayScale : flashsale ? colors.RedFlashsale : colors.BlueJaja} labelStyle={[styles.font_14, styles.T_semi_bold, { color: colors.White }]} mode="contained">
                    {giftDetails.stock == '0' ? 'Stok Habis' : 'Beli Sekarang'}
                </Button>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                minimumDate={new Date(dateMin.year, dateMin.month, dateMin.date)}
                maximumDate={new Date(dateMax.year, dateMax.month, dateMax.date)}
                onDateChange={() => setDatePickerVisibility(false)}
                onConfirm={(text) => {
                    setTimeout(() => {
                        handleConfirmDate(text)
                    }, 200);
                }}
                onCancel={() => setDatePickerVisibility(false)}
            />
            {Object.keys(giftDetails).length ?
                <Modal animationType="fade" transparent={true} visible={modal} onRequestClose={() => setmodal(!modal)}>
                    <View style={{ height: Hp('50%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 9999, elevation: 11 }}>
                        <ViewShot ref={viewShotRef} options={{ format: "jpg" }}>
                            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White }}>
                                <Image style={style.swiperProduct}
                                    source={{ uri: giftDetails.image[0] }}
                                />
                            </View>
                            <View style={{ flex: 0, flexDirection: 'column', backgroundColor: colors.White, padding: '3%', marginBottom: '1%' }}>
                                <Text style={[styles.font_18, styles.mb_2]}>{giftDetails.name}</Text>
                                {Object.keys(variasiSelected).length ?
                                    <View style={[styles.row_start_center,]}>
                                        <View style={[styles.row, { width: '87%', height: '100%' }]}>
                                            {variasiSelected.isDiscount ?
                                                <View style={styles.row}>
                                                    <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                        <Text style={[styles.font_16, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{giftDetails.discount}%</Text>
                                                        \                                     </View>
                                                    <View style={styles.column}>
                                                        <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.priceDiscount}</Text>
                                                    </View>
                                                </View>
                                                :
                                                <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.price}</Text>
                                            }
                                        </View>
                                    </View>
                                    :
                                    <View style={[styles.row_start_center,]}>
                                        <View style={[styles.row_start_center, { width: '87%', }]}>
                                            {giftDetails.isDiscount ?
                                                <View style={[styles.row_start_center]}>
                                                    <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5 }]}>
                                                        <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{giftDetails.discount}%</Text>
                                                    </View>
                                                    <View style={[styles.column]}>
                                                        <Text style={Ps.priceBefore}>{giftDetails.price}</Text>
                                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{giftDetails.priceDiscount}</Text>
                                                    </View>
                                                </View>
                                                :
                                                <View style={[styles.row_between_center, { width: '100%' }]}>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{giftDetails.price}</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                        </ViewShot>
                    </View>
                </Modal > : null
            }
        </SafeAreaView >
    )
}

const style = StyleSheet.create({

    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    navContainer: {
        height: Platform.OS === 'ios' ? Hp('5.6%') : Hp('10%'),
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: '4%',
        paddingBottom: Platform.OS === "ios" ? '3.5%' : '2.5%',
        // paddingTop: '3.5%',
        backgroundColor: 'transparent',
    },
    // statusBar: {
    //     height: STATUS_BAR_HEIGHT,
    //     backgroundColor: 'transparent',
    // },
    navBar: {
        height: NAV_BAR_HEIGHT,
        width: '100%',
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
        backgroundColor: colors.BlueJaja
    },
    swiperProduct: { width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: colors.White },
    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 12, height: NAV_BAR_HEIGHT / 1.7, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});