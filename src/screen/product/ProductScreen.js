import React, { useEffect, useState, useCallback, useRef } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, RFValue, Modal } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { Button, Colors } from 'react-native-paper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { FilterLocation, styles, colors, useNavigation, Hp, Wp, Ps, Loading, ServiceCart, ServiceUser, useFocusEffect, ServiceStore, ServiceProduct, FastImage, RecomandedHobby, Countdown, Utils, HeaderTitleHome } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useDispatch, useSelector } from "react-redux";
import StarRating from 'react-native-star-rating';
import ImgToBase64 from 'react-native-image-base64';
import ViewShot from "react-native-view-shot";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
LogBox.ignoreAllLogs()

export default function ProductScreen(props) {
    const navigation = useNavigation()
    const viewShotRef = useRef(null);
    const reduxSearch = useSelector(state => state.search)
    const reduxProduct = useSelector(state => state.product.productDetail)
    const reduxLoad = useSelector(state => state.product.productLoad)
    const reduxTemporary = useSelector(state => state.product.productTemporary)
    const filterLocation = useSelector(state => state.product.filterLocation)
    const loadStore = useSelector(state => state.store.loadStore)



    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxStore = useSelector(state => state.store.store)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const showFlashsale = useSelector(state => state.product.flashsale)

    const slug = useSelector(state => state.search.slug)

    const dispatch = useDispatch()

    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [modal, setmodal] = useState(false)

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [like, setLike] = useState(false)
    const [alert, setalert] = useState("")
    const [idProduct, setidProduct] = useState("")
    const [translucent, settranslucent] = useState(true)
    const [bgBar, setbgBar] = useState('transparent')


    const [deskripsiLenght, setdeskripsiLenght] = useState(200)

    const [variasiSelected, setvariasiSelected] = useState({})
    const [variasiPressed, setvariasiPressed] = useState("")

    const [productId, setproductId] = useState("")
    const [flashsale, setFlashsale] = useState(false)
    const [flashsaleData, setFlashsaleData] = useState({})
    const [variantId, setvariantId] = useState("")
    const [lelangId, setlelangId] = useState("")
    const [qty, setqty] = useState(1)
    const [seller, setSeller] = useState("")
    const [disableCart, setdisableCart] = useState(false)
    const [link, setlink] = useState('')
    useAndroidBackHandler(() => {
        settranslucent(false)
        setbgBar(colors.BlueJaja)
        return false;
    });

    const onRefresh = useCallback(() => {
        if (!reduxLoad && !reduxProduct?.id) {
            getItem(reduxProduct.slug)
            Utils.alertPopUp('Refreshing..')
        }

    }, []);


    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }, []),
    );

    useEffect(() => {
        if (reduxProduct?.slug) {
            dynamicLink()
        }
    }, [reduxProduct?.slug])

    useEffect(() => {
        return () => {
            setmodal(false)
            if (props?.route?.params && reduxProduct?.slug) {
                if (showFlashsale) {
                    setFlashsale(true)
                } else {
                    setFlashsale(false)
                }
            }
        }
    }, [])


    const dynamicLink = async () => {
        try {
            const link_URL = await dynamicLinks().buildShortLink({
                link: `https://jajaid.page.link/product?slug=${reduxProduct.slug}`,
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
            setlink(link_URL)
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 138 ~ dynamicLink ~ error", error)

        }
    }
    const handleProduct = () => {
        try {
            if (!!reduxProduct?.id) {
                handleVariasi(reduxProduct.variant)
                setRefreshing(false)
                handleFlashsale(reduxProduct.flashsaleData, reduxProduct.statusProduk)
                setLike(reduxProduct.isWishlist)
                setidProduct(reduxProduct.id)
                if (!reduxProduct.stock && reduxProduct.stock === '0') {
                    setdisableCart(true)
                }
                let dataSeller = reduxProduct.store
                dataSeller.chat = reduxUser.user.uid + dataSeller.uid
                dataSeller.id = dataSeller.uid
                setSeller(dataSeller)
                setLike(reduxProduct.isWishlist)
            }

        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 159 ~ useCallback ~ error", error)
        }
    }
    useEffect(() => {
        handleProduct()
    }, [reduxProduct?.id])

    useEffect(() => {
        try {
            if (filterLocation) {
                if (reduxAuth && reduxProduct?.sellerTerdekat?.length && reduxUser?.user?.id && reduxProduct?.category?.slug) {
                    FilterLocation(reduxProduct.sellerTerdekat, reduxUser.user.location, reduxProduct.category.slug, reduxAuth, dispatch)
                }

            }
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 177 ~ useEffect ~ error", error)
        }
    }, [filterLocation]);


    const getItem = (slg) => {
        try {
            let response;
            ServiceProduct.productDetail(reduxAuth, slg).then(res => {
                response = "clear"
                if (res?.status?.code === 400) {
                    Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                    navigation.goBack()
                } else if (res) {
                    dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res })
                    handleVariasi(res.variant)
                    setRefreshing(false)
                    handleFlashsale(res.flashsaleData, res.statusProduk)
                    setLike(res.isWishlist)
                    setidProduct(res.id)
                    if (!res.stock && res.stock == '0') {
                        setdisableCart(true)
                    }


                } else {
                    setRefreshing(false)
                }

            }).catch(err => {
                Utils.alertPopUp(String(err), "Error with status code: 121222")
                setRefreshing(false)
                response = "clear"

            })
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 209 ~ getItem ~ error", error)
        }
        // setTimeout(() => {
        //     if (response !== 'clear') {
        //         return Utils.alertPopUp("Sedang memuat..")
        //     }
        // }, 10000);

    }

    const handleVariasi = (variant) => {
        try {
            if (variant.length) {
                setvariasiPressed(variant[0].id)
                setvariasiSelected(variant[0])
            }
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 222 ~ handleVariasi ~ error", error)
            // alert('890' + String(error))
        }
    }

    const handleFlashsale = (flashsale, status) => {
        try {
            if (flashsale && Object.keys(flashsale).length) {
                setFlashsale(true)
                setFlashsaleData(flashsale)
                if (flashsale.stokFlash <= 0) {
                    setdisableCart(true)
                } else {
                    setdisableCart(false)
                }
            } else if (status != 'live') {
                setFlashsale(false)
                setdisableCart(true)
            }
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 241 ~ handleFlashsale ~ error", error)
            // alert('880' + 680)
        }
    }

    const getBadges = () => {
        try {
            ServiceUser.getBadges(reduxAuth).then(res => {
                if (res) {
                    dispatch({ type: "SET_BADGES", payload: res })
                } else {
                    dispatch({ type: "SET_BADGES", payload: {} })
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 255 ~ getBadges ~ error", error)
        }
    }

    const handleAddCart = (name) => {
        console.log("🚀 ~ file: ProductScreen.js ~ line 267 ~ handleAddCart ~ name", name)
        try {
            setdisableCart(true)
            if (reduxAuth) {
                if (!reduxProduct.store?.closed_store) {
                    if (reduxProduct.variant && reduxProduct.variant.length) {
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
                    Utils.alertPopUp('Saat ini toko sedang offline!')
                }
            } else {
                handleLogin()
            }
            setTimeout(() => {
                setdisableCart(false)
            }, 2000);
        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 276 ~ handleAddCart ~ error", error)
        }
    }

    const handleApiCart = async (name) => {
        console.log("🚀 ~ file: ProductScreen.js ~ line 297 ~ handleApiCart ~ name", name)
        try {
            var credentials = { "productId": idProduct, "flashSaleId": flashsale ? flashsaleData.id_flashsale : "", "lelangId": "", "variantId": variasiPressed, "qty": qty };
            let result = await ServiceProduct.addCart(reduxAuth, credentials)
            console.log("🚀 ~ file: ProductScreen.js ~ line 301 ~ handleApiCart ~ result", result)
            if (result && result.status.code === 200) {
                Utils.alertPopUp('Produk berhasil ditambahkann!')
                if (name === "buyNow") {
                    if (reduxProduct.isNonPhysical) {
                        navigation.navigate('Checkout', { isNonPhysical: true })
                        try {
                            var myHeaders = new Headers();
                            myHeaders.append("Authorization", reduxAuth);
                            myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
                            var requestOptions = {
                                method: 'GET',
                                headers: myHeaders,
                                redirect: 'follow'
                            };
                            fetch(`https://jaja.id/backend/checkout?isCoin=0&fromCart=1&is_gift=0&is_non_physical=1`, requestOptions)
                                .then(response => response.text())
                                .then(res => {
                                    try {
                                        let result = JSON.parse(res)
                                        if (result.status.code === 200) {
                                            dispatch({ type: 'SET_CHECKOUT', payload: result.data })

                                        } else if (result.status.code == 404 && String(result.status.message).includes('Alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu')) {
                                            Utils.alertPopUp('Silahkan tambah alamat terlebih dahulu!')
                                            navigation.navigate('Address', { data: "checkout" })
                                        } else {
                                            Utils.handleErrorResponse(result, 'Error with status code : 12156')
                                            return null
                                        }
                                    } catch (error) {
                                        console.log("🚀 ~ file: ProductScreen.js ~ line 311 ~ handleApiCart ~ error", error)
                                        Utils.alertPopUp(JSON.stringify(res) + ' : 12157\n\n' + res)
                                    }
                                })
                                .catch(error => {
                                    console.log("🚀 ~ file: ProductScreen.js ~ line 316 ~ handleApiCart ~ error", error)
                                    Utils.handleError(error, 'Error with status code : 12158')
                                });
                        } catch (error) {
                            console.log("🚀 ~ file: ProductScreen.js ~ line 321 ~ handleApiCart ~ error", error)

                        }
                        // ServiceCart.getCart(reduxAuth).then(res => {
                        //     res.items.map(item => {
                        //         item.products.map(product => {
                        //             if (product.slug === reduxProduct.slug) {
                        //                 handleCheckoutOnline(product.cartId, item.store.id)
                        //             }
                        //         })
                        //     })
                        // })
                    } else {
                        handleTrolley()
                    }
                } else {
                    handleGetCart()
                }
            } else if (result.status.code === 400 && result.status.message === 'quantity cannot more than stock') {
                Utils.alertPopUp("Stok produk tidak tersedia")
            } else {
                Utils.handleErrorResponse(result, 'Error with status code : 12023')
            }
        } catch (error) {

        }
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", reduxAuth);
        // myHeaders.append("Content-Type", "application/json");
        // var credentials = qs.stringify({
        //     "productId": idProduct,
        //     "flashSaleId": flashsale ? flashsaleData.id_flashsale : "",
        //     "lelangId": "",
        //     "variantId": variasiPressed,
        //     "qty": qty
        // });
        // var requestOptions = {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: raw,
        //     redirect: 'follow'
        // };
        // fetch("https://jaja.id/backend/cart", requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         if (result.status.code === 200) {
        //             Utils.alertPopUp('Produk berhasil ditambahkan!')
        //             if (name === "buyNow") {
        //                 handleTrolley()
        //             } else {
        //                 handleGetCart()
        //             }
        //         } else if (result.status.code === 400 && result.status.message === 'quantity cannot more than stock') {
        //             Utils.alertPopUp("Stok produk tidak tersedia")
        //         } else {
        //             Utils.handleErrorResponse(result, 'Error with status code : 12023')
        //         }
        //     })
        //     .catch(error => {
        //         Utils.handleError(String(error), 'Error with status code : 12024')
        //     });
    }

    const handleCheckoutOnline = (cartId, storeId) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=sdvfphg27d6fhhbhh4ruftor53ppbcko");
        var raw = JSON.stringify({ 'cartId': cartId, 'storeId': "" })

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/cart/selected?is_gift=0`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: ProductScreen.js ~ line 361 ~ handleCheckoutOnline ~ result", result)
                if (result.status.code === 200) {
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", reduxAuth);
                    myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch(`https://jaja.id/backend/checkout?isCoin=0&fromCart=1&is_gift=0`, requestOptions)
                        .then(response => response.text())
                        .then(res => {
                            try {
                                let result = JSON.parse(res)
                                if (result.status.code === 200) {
                                    dispatch({ type: 'SET_CHECKOUT', payload: result.data })
                                    navigation.navigate('Checkout', {
                                        data: {
                                            online: true,
                                            cartId: cartId
                                        }
                                    })
                                } else if (result.status.code == 404 && String(result.status.message).includes('Alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu')) {
                                    Utils.alertPopUp('Silahkan tambah alamat terlebih dahulu!')
                                    navigation.navigate('Address', { data: "checkout" })
                                } else {
                                    Utils.handleErrorResponse(result, 'Error with status code : 12156')
                                    return null
                                }
                            } catch (error) {
                                Utils.alertPopUp(JSON.stringify(res) + ' : 12157\n\n' + res)
                            }
                        })
                        .catch(error => Utils.handleError(error, 'Error with status code : 12158'));
                } else {
                    Utils.alertPopUp(String(result.status.message))
                }

            })
            .catch(error => {
                Utils.handleError(error, 'Error with status code : 12027')
            })

    }

    const handleGetCart = () => {
        try {
            getBadges()
            ServiceCart.getCart(reduxAuth).then(res => {
                console.log("🚀 ~ file: ProductScreen.js ~ line 471 ~ ServiceCart.getCart ~ res", res)
                if (res) {
                    dispatch({ type: 'SET_CART', payload: res })
                }
            })

        } catch (error) {

        }

    }

    const handleStore = () => {
        try {
            if (!loadStore) {
                navigation.push('Store', { slug: reduxProduct.store.slug })
                dispatch({ "type": 'SET_STORE_LOAD', payload: true })

                dispatch({ "type": 'SET_NEW_PRODUCT_LOAD', payload: true })
                dispatch({ "type": 'SET_STORE', payload: {} })

                let slg = reduxProduct.store.slug
                ServiceStore.getStore(slg, reduxAuth).then(res => {
                    if (res) {
                        dispatch({ "type": 'SET_STORE', payload: res })
                    }
                    dispatch({ "type": 'SET_STORE_LOAD', payload: false })
                }).catch(err => [
                    dispatch({ "type": 'SET_STORE_LOAD', payload: false })
                ])
            }
        } catch (error) {
            dispatch({ "type": 'SET_NEW_PRODUCT_LOAD', payload: false })
            dispatch({ "type": 'SET_STORE_LOAD', payload: false })
            Utils.handleError(error, 'Error with status code : 31001')
        }
        dispatch({ type: 'SET_KEYWORD', payload: '' })
    }

    const handleTrolley = () => {
        if (reduxAuth) {
            if (Platform.OS === 'ios') {
                sethidden(false)
            }
            handleGetCart()
            navigation.push("Trolley")
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

    const handleLogin = () => navigation.navigate('Login', { navigate: "Product" })

    const renderNavBar = () => (
        <View style={style.navContainer}>
            {Platform.OS === 'ios' ? null : <View style={styles.statusBar} />}

            <View style={[style.navBar, { paddingTop: Platform.OS === 'ios' ? '0%' : '5%' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/arrow.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: colors.White }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTrolley} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.White }} />
                    {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                        <View style={[styles.countNotif, { right: 3, top: 3 }]}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalProductInCart}</Text></View>
                        : null
                    }
                </TouchableOpacity>
            </View>
        </View >
    );

    const title = () => {
        return (
            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White, marginTop: Platform.OS === 'ios' ? '-11%' : 0 }}>
                <Swiper
                    horizontal={true}
                    dotColor={colors.White}
                    activeDotColor={colors.BlueJaja}
                    style={{ backgroundColor: colors.WhiteBack }}>
                    {
                        reduxLoad || !reduxProduct?.image?.[0] ?
                            <View style={{ width: Wp('100%'), height: Wp('100%'), justifyContent: 'center', alignItems: 'center' }}  >
                                <FastImage
                                    style={{ width: Wp('75%'), height: Wp('75%') }}
                                    source={require('../../assets/images/JajaId.png')}
                                    tintColor={colors.Silver}
                                    resizeMode={FastImage.resizeMode.center}
                                />
                            </View> :
                            reduxProduct.image.map((item, key) => {
                                return (
                                    <FastImage
                                        key={String(key + 'GK')}
                                        style={{ width: Wp('100%'), height: Wp('100%'), resizeMode: 'contain' }}
                                        source={{ uri: item }}

                                        resizeMode={FastImage.resizeMode.contain}
                                    />

                                );
                            })
                    }
                </Swiper>
            </View>
        );
    };

    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
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
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 3)

    }

    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
        }
    }

    const handleShare = () => {
        setmodal(true)
        setTimeout(async () => {

            try {
                // await setmodal(false)

                let img64 = ''
                await viewShotRef.current.capture().then(async uri => {
                    await ImgToBase64.getBase64String(uri)
                        .then(base64String => {
                            let urlString = 'data:image/jpeg;base64,' + base64String;
                            img64 = urlString
                        })
                        .catch(err => console.log("cok"));
                    setmodal(false)
                });
                console.log("🚀 ~ file: ProductScreen.js ~ line 561 ~ setTimeout ~ link", link)
                const shareOptions = {
                    title: 'Jaja',
                    message: `Dapatkan ${reduxProduct.name} di Jaja.id \nDownload sekarang ${link}`,
                    url: img64,
                };
                Share.open(shareOptions)
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        err && console.log(err);
                    });
                setmodal(false)

            } catch (error) {
                setmodal(false)
            }
        }, 1500);

    }

    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: '#e8e8e8', paddingBottom: Hp('6%') }]}>

                {!reduxLoad ?
                    <View style={styles.column}>
                        {flashsale ?
                            <View style={[styles.row_between_center, { backgroundColor: colors.RedFlashsale, width: Wp('100%'), paddingHorizontal: '3%', paddingVertical: '2%' }]}>
                                <View style={[styles.column_center_start, { width: '60%' }]}>
                                    <View style={[styles.row_center, { height: Wp('6%') }]}>
                                        <Text style={[styles.flashsale, { marginRight: '-1%', height: '100%', fontSize: 20 }]}>
                                            F
                                        </Text>
                                        <Image style={[styles.icon_21, { tintColor: colors.White, marginRight: '-1%' }]} source={require('../../assets/icons/flash.png')} />
                                        <Text style={[[styles.flashsale, { height: '100%', fontSize: 20 }]]}>
                                            ashsale
                                        </Text>
                                    </View>
                                    <Text style={[styles.font_12, { color: colors.White, }]}>Sedang Berlangsung..</Text>

                                </View>
                                <View style={[styles.row_center_end, { width: '40%' }]}>
                                    <Countdown size={12} wrap={7} home={true} />
                                </View>
                            </View>
                            : null
                        }

                        <View style={[styles.shadow_5, styles.p_3, styles.mb, { shadowColor: colors.BlueJaja, flex: 0, flexDirection: 'column', backgroundColor: colors.White, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }]}>
                            <Text style={[styles.font_18, styles.T_bold, styles.mb_2, { color: colors.BlueJaja }]}>{reduxProduct.name}</Text>
                            {Object.keys(variasiSelected).length ?
                                <View style={[styles.row_start_center,]}>
                                    <View style={[styles.row, { width: '87%', height: '100%' }]}>
                                        {variasiSelected.isDiscount ?
                                            <View style={styles.row}>
                                                <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                    <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { marginBottom: Platform.OS === 'ios' ? '-1%' : 0, color: colors.White }]}>{reduxProduct.discount}%</Text>
                                                </View>
                                                <View style={styles.column}>
                                                    <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{variasiSelected.priceDiscount}</Text>
                                                </View>
                                            </View>
                                            :
                                            <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{variasiSelected.price}</Text>
                                        }
                                    </View>
                                    <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                        <TouchableOpacity onPress={handleShare}>
                                            <Image source={require('../../assets/icons/share.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: colors.Silver }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                flashsale ?
                                    <View style={[styles.row_start_center,]}>
                                        <View style={[styles.row_center, { width: '87%', height: '100%' }]}>
                                            <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5 }]}>
                                                <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{flashsaleData.discountFlash}%</Text>
                                            </View>
                                            <View style={[styles.column, { height: Wp('11.5%'), }]}>
                                                <Text style={Ps.priceBefore}>{reduxProduct.price}</Text>
                                                <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.price}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                            <TouchableOpacity onPress={handleShare}>
                                                <Image source={require('../../assets/icons/share.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: colors.Silver }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={[styles.row_start_center,]}>
                                        <View style={[styles.row_start_center, { width: '87%', }]}>
                                            {reduxProduct.isDiscount ?
                                                <View style={[styles.row_start_center]}>
                                                    {reduxProduct.discount == 0 ?
                                                        null :
                                                        <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                            <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { marginBottom: Platform.OS === 'ios' ? '-1%' : 0, color: colors.White }]}>{reduxProduct.discount}%</Text>
                                                        </View>
                                                    }
                                                    <View style={[styles.column]}>
                                                        <Text style={Ps.priceBefore}>{reduxProduct.price}</Text>
                                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.priceDiscount}</Text>
                                                    </View>
                                                </View>
                                                :
                                                <View style={[styles.row_between_center, { width: '100%' }]}>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.price}</Text>
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
                                <Text style={[styles.font_14, { width: '87%' }]}>{reduxProduct.amountSold ? reduxProduct.amountSold + " Terjual" : ""}</Text>
                                <View style={[styles.row_center, { width: '13%', height: '100%' }]}>
                                    <TouchableOpacity onPress={handleWishlist}>
                                        <Image source={require('../../assets/icons/love.png')} style={{ width: Wp('6%'), height: Wp('6%'), marginRight: '3%', tintColor: like ? flashsale ? colors.RedFlashsale : colors.RedMaroon : colors.Silver }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {reduxProduct.variant && reduxProduct.variant.length ?
                            <View style={[styles.column_between_center, styles.p_3, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, alignItems: 'flex-start' }]}>
                                <View style={[styles.row_center, styles.mb_3]}>
                                    <Text style={[styles.font_16, styles.T_bold, { color: colors.BlueJaja }]}>Variasi Produk</Text>
                                    <Text style={[styles.font_12, { marginLeft: '3%', fontStyle: 'italic', color: colors.RedNotif, fontFamily: 'SignikaNegative-Regular' }]}>{alert}</Text>
                                </View>
                                {/* <View style={[styles.column, { width: Wp('100%') }]}> */}
                                <FlatList
                                    data={reduxProduct.variant}
                                    horizontal={true}
                                    // contentContainerStyle={{ flex: 0, flexDirection: 'row' }}
                                    keyExtractor={(item, ind) => String(ind + "LV")}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <Button disabled={item.stock ? false : true} color={colors.YellowJaja} onPress={() => {
                                                setvariasiPressed(item.id)
                                                setvariasiSelected(item)
                                                setalert("")
                                            }}
                                                mode="outlined"
                                                style={{ backgroundColor: item.stock ? variasiPressed === item.id ? colors.YellowJaja : colors.White : colors.White, borderColor: item.stock ? variasiPressed === item.id ? colors.YellowJaja : colors.YellowJaja : colors.Silver, marginRight: 15, borderWidth: 0.5, borderRadius: 7 }}
                                                labelStyle={[styles.font_10, styles.T_medium, { color: item.stock ? variasiPressed === item.id ? colors.White : colors.BlackGrayScale : colors.Silver, }]} uppercase={false}>
                                                {item.name}
                                            </Button>
                                        )
                                    }}
                                />
                                {/* </View> */}
                                <Text style={[styles.font_11, styles.T_medium, styles.mt_3, styles.plx]}>Stok tersisa {variasiSelected.stock}</Text>
                            </View>
                            : null
                        }

                        {reduxProduct.store ?
                            <View style={[styles.row_between_center, styles.p_3, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White }]}>
                                <View style={[styles.row, { width: '67%' }]}>
                                    <TouchableOpacity onPress={handleStore} style={{
                                        height: Wp('15%'), width: Wp('15%'), borderRadius: 100, marginRight: '3%', backgroundColor: colors.White,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.22,
                                        shadowRadius: 2.22,
                                        elevation: 3,
                                    }}>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 100 }} source={Object.keys(reduxProduct).length && reduxProduct.store.image ? { uri: reduxProduct.store.image } : require('../../assets/images/JajaId.png')} />
                                    </TouchableOpacity>
                                    <View style={[styles.column_between_center, { width: '77%', alignItems: 'flex-start' }]}>
                                        <Text numberOfLines={1} onPress={handleStore} style={[styles.font_14, styles.T_medium, { width: '100%' }]}>{reduxProduct.store.name}</Text>
                                        {reduxProduct.store.location ?
                                            <View style={[Ps.location, { position: 'relative', width: '100%', marginLeft: '-1%', padding: 0 }]}>
                                                <Image style={[styles.icon_14, { marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                                                <Text style={[Ps.locarionName, { marginBottom: '-1%' }]}>{reduxProduct.store.location}</Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.row_center, styles.py_2, styles.px_3, {
                                    borderRadius: 7, backgroundColor: flashsale ? colors.RedFlashsale : colors.YellowJaja, shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.22,
                                    shadowRadius: 2.22,
                                    elevation: 3,
                                }]} onPress={handleStore}>
                                    <Text style={[styles.font_10, styles.T_semi_bold, { color: flashsale ? colors.RedFlashsale : colors.White }]}>Kunjungi Toko</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        <View style={[styles.column, styles.p_4, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingBottom: '5%' }]}>
                            <Text style={[styles.font_16, styles.T_semi_bold, styles.mr_3, styles.mb_2, { textDecorationLine: 'underline', color: colors.BlueJaja }]}>Informasi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_5, { alignSelf: 'flex-start' }]}>
                                <View style={[styles.column, { width: '40%' }]}>
                                    <Text style={[styles.font_14, styles.mb_3]}>Berat</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Brand</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kondisi</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kategori</Text>
                                    {reduxProduct.preOrder ?
                                        <Text style={[styles.font_14, styles.mb_3]}>Pre Order</Text>
                                        : null
                                    }
                                    <Text style={[styles.font_14, styles.mb_3]}>Stok</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.weight} gram</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.brand ? reduxProduct.brand : ""}</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.condition}</Text>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.category && Object.keys(reduxProduct.category).length ? reduxProduct.category.name : ""}</Text>
                                    {reduxProduct.preOrder ?
                                        <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.masaPengemasan} Hari</Text>
                                        : null
                                    }
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_light]}>{reduxProduct.stock && reduxProduct.stock > 0 ? reduxProduct.stock : 0}</Text>
                                </View>
                            </View>
                            <Text style={[styles.font_16, styles.T_semi_bold, styles.mr_3, styles.mb_2, { textDecorationLine: 'underline', color: colors.BlueJaja }]}>Deskripsi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_3, { alignSelf: 'flex-start' }]}>
                                {reduxProduct.description ?
                                    <>
                                        {/* <Text style={[styles.font_14, styles.T_light]}>{reduxProduct.description.slice(0, deskripsiLenght)}</Text> */}
                                        <View style={[styles.column, { width: '100%' }]}>
                                            <Text numberOfLines={deskripsiLenght == 200 ? 10 : 60} style={[styles.font_14]}>{reduxProduct.description}</Text>
                                            {deskripsiLenght == 200 && reduxProduct.description.length >= 200 ?
                                                <TouchableOpacity onPress={() => setdeskripsiLenght(reduxProduct.description.length + 50)}>
                                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca selengkapnya..</Text>
                                                </TouchableOpacity>
                                                : reduxProduct.description.length <= 200 ? null :
                                                    <TouchableOpacity onPress={() => setdeskripsiLenght(200)}>
                                                        <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca lebih sedikit..</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </>
                                    : null}
                            </View>
                        </View>

                        {reduxProduct.review && reduxProduct.review.length ?
                            <View style={[styles.column, styles.shadow_5, styles.my, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, paddingBottom: Hp('7%') }]}>
                                {/* <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontFamily: 'SignikaNegative-SemiBold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Penilaian Produk</Text> */}
                                <HeaderTitleHome title='Penilaian Produk' handlePress={() => navigation.navigate('Review', { data: reduxProduct.slug })} />
                                <View style={[styles.column, styles.p_4,]}>
                                    {reduxProduct.review.map((item, index) => {
                                        return (
                                            <View key={String(index + 'QA')} style={[styles.column, styles.mb_3, styles.px_2, { backgroundColor: colors.White, }]}>
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
                                                    {item.image.map((itm, idx) => {
                                                        return (
                                                            <TouchableOpacity key={String(idx + 'JO')} onPress={() => navigation.navigate('ZoomReview', { data: index })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
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
                                            //                 <TouchableOpacity key={String(idx) + "i"} onPress={() => navigation.navigate('Review', { data: reduxProduct.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                            //                     <Image source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                            //                 </TouchableOpacity>
                                            //             )
                                            //         })}
                                            //         {item.video ?
                                            //             <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxProduct.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale }}>
                                            //                 <Image source={require('../../assets/icons/play.png')} style={{ width: Wp('5%'), height: Wp('5%'), marginRight: '2%', tintColor: colors.White }} />
                                            //             </TouchableOpacity>
                                            //             : null
                                            //         }
                                            //     </View>
                                            // </View>
                                        )
                                    })}
                                    {/* <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxProduct.slug })} style={{ width: Wp('90%'), justifyContent: 'center', alignItems: 'center', padding: '3%', backgroundColor: colors.White, elevation: 0.5 }}>
                                        <Text style={[styles.font_14, { color: colors.BlueJaja, }]}>Tampilkan semua</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            : null}
                        {reduxProduct.otherProduct && reduxProduct.otherProduct.length ?
                            <View style={[styles.column, styles.py_4, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, paddingBottom: '5%' }]}>
                                {/* <Text style={[styles.font_14, styles.T_medium]}>Produk Lainnya Di {reduxProduct.store.name}</Text> */}
                                <HeaderTitleHome title={`Produk Lainnya Di ${reduxProduct.store.name}`} />

                                <FlatList
                                    horizontal={true}
                                    removeClippedSubviews={true} // Unmount components when outside of window 
                                    maxToRenderPerBatch={1} // Reduce number in each render batch
                                    updateCellsBatchingPeriod={100} // Increase time between renders
                                    windowSize={7}
                                    data={reduxProduct.otherProduct}
                                    scrollEnabled={true}
                                    style={styles.px_3}
                                    nestedScrollEnabled={true}
                                    keyExtractor={(item, index) => String(index + 'HR')}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ flex: 0, justifyContent: 'flex-start' }}
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
                                            // <TouchableOpacity
                                            //     style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center', elevation: 2 }]}
                                            //     onPress={() => handleShowDetail(item)} >
                                            //     <View style={[styles.column, { height: Wp('33%'), width: '100%' }]}>
                                            //         <FastImage
                                            //             style={[Ps.imageProduct, { height: '100%', width: '100%' }]}
                                            //             source={{
                                            //                 uri: item.image,
                                            //                 headers: { Authorization: 'someAuthToken' },
                                            //                 priority: FastImage.priority.normal,
                                            //             }}
                                            //             resizeMode={FastImage.resizeMode.contain}
                                            //         />
                                            //         {/* <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.BlueJaja, borderTopRightRadius: 11, alignItems: 'center', justifyContent: 'center' }]}>
                                            //             <Text style={[styles.font_8, { marginBottom: '-2%', color: colors.White }]}>Seller Terdekat</Text>
                                            //         </View> */}
                                            //     </View>
                                            //     <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                            //         <Text numberOfLines={1} style={[Ps.nameProductSmall,]}>{item.name}</Text>
                                            //         {item.isDiscount ?
                                            //             <>
                                            //                 <View style={styles.row}>
                                            //                     <Text style={[Ps.priceBefore, styles.mr_3,]}>{item.price}</Text>
                                            //                     <Text style={[styles.font_12, styles.T_medium, { zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '1%', paddingHorizontal: '3%', borderRadius: 3 }]}>{item.discount}1</Text>
                                            //                 </View>
                                            //                 <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                            //             </>
                                            //             :
                                            //             <Text style={[Ps.price, { color: colors.BlueJaja }]}>{item.price}</Text>
                                            //         }
                                            //     </View>
                                            //     <View style={[Ps.location, { width: '94%' }]}>
                                            //         <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                            //         <Text numberOfLines={1} style={[Ps.locarionName, { fontSize: 10, width: '85%' }]}>{item.location}</Text>
                                            //     </View>
                                            // </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[Ps.cardProduct, { marginLeft: 1, marginRight: 7, width: Wp('33%'), height: Wp('57%'), alignItems: 'center', elevation: 2 }]}
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
                                                </View>
                                                <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                                    <Text numberOfLines={1} style={[Ps.nameProductSmall]}>{item.name}</Text>
                                                    {item.isDiscount && item.discount != '0' ?
                                                        <>
                                                            <View style={styles.row_center}>
                                                                <Text style={[Ps.priceBeforeSmall, styles.mr_3,]}>{item.price}</Text>
                                                                <View style={{ zIndex: 1, backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginBottom: '1%' }}>
                                                                    <Text style={[styles.font_6, { textAlignVertical: 'center', textAlign: 'center', marginBottom: Platform.OS === 'android' ? '-1%' : 0, color: colors.White, }]}>{item.discount}%</Text>
                                                                </View>
                                                            </View>
                                                            <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.priceDiscount}</Text>
                                                        </>
                                                        :
                                                        <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.BlueJaja }]}>{item.price}</Text>
                                                    }
                                                </View>
                                                <View style={[Ps.location, { width: '94%' }]}>
                                                    <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                                    <Text numberOfLines={1} style={[Ps.locarionNameSmall, { width: '85%' }]}>{item.location}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            : null}
                        <View style={[styles.column, styles.pt_3, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White }]}>
                            <RecomandedHobby refresh={true} color={colors.BlackGrayScale} />
                        </View>
                    </View>
                    :
                    <View style={[styles.column]}>
                        <View style={[styles.column_around_center, styles.px_3, styles.py_4, styles.mb_2, { alignItems: 'flex-start', width: Wp('100%'), height: Wp('33%'), backgroundColor: colors.White }]}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('85%')}
                                height={Wp("4.5%")}
                                style={{ borderRadius: 1 }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('30%')}
                                height={Wp("4%")}
                                style={{ borderRadius: 1, marginTop: '1%' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                        <View style={[styles.row_start_center, styles.px_3, styles.py_4, styles.mb_2, { width: Wp('100%'), height: Wp('23%'), backgroundColor: colors.White }]}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('15%')}
                                height={Wp("15%")}
                                style={{ borderRadius: 100, marginRight: "4%" }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <View style={[styles.column_around_center, { alignItems: "flex-start", height: Wp('15%') }]}>
                                <ShimmerPlaceholder
                                    LinearGradient={LinearGradient}
                                    width={Wp('50%')}
                                    height={Wp("3.5%")}
                                    style={{ borderRadius: 1 }}
                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                                <ShimmerPlaceholder
                                    LinearGradient={LinearGradient}
                                    width={Wp('20%')}
                                    height={Wp("3%")}
                                    style={{ borderRadius: 1 }}
                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                            </View>
                        </View>
                        <View style={[styles.column_start, styles.px_3, styles.py_4, { width: Wp('100%'), height: Wp('45%'), backgroundColor: colors.White, borderTopRightRadius: 20, borderTopLeftRadius: 20, }]}>
                            <ShimmerPlaceholder
                                LinearGradient={LinearGradient}
                                width={Wp('31%')}
                                height={Wp("3.5%")}
                                style={{ borderRadius: 1 }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />

                            <View style={[styles.row_start, styles.mt_5, { alignItems: "flex-start" }]}>
                                <View style={[styles.column, styles.mt_2, styles.mb_5, { marginRight: '11%' }]}>
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3.5%")}
                                        style={{ borderRadius: 1, marginBottom: '25%', marginTop: '11%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    {/* <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    /> */}
                                </View>
                                <View style={[styles.column, styles.mt_2, styles.mb_5, styles.ml_5]}>
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3.5%")}
                                        style={{ borderRadius: 1, marginBottom: '25%', marginTop: '11%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    {/* <ShimmerPlaceholder
                                        LinearGradient={LinearGradient}
                                        width={Wp('19%')}
                                        height={Wp("3%")}
                                        style={{ borderRadius: 1, marginBottom: '25%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    /> */}
                                </View>
                            </View>
                        </View>
                    </View>
                }



            </View >
        );
    };

    const handleChat = () => {
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: seller, product: reduxProduct })
        } else {
            handleLogin()
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            {loading ? <Loading /> : null}
            <StatusBar translucent={Platform.OS === 'ios' ? true : translucent} backgroundColor={Platform.OS === 'ios' ? colors.BlueJaja : bgBar} barStyle="light-content" />

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
                                        console.log('fetchhhhh')
                                        // loadMoreData()
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
                <TouchableOpacity disabled={Object.keys(seller).length ? false : true} onPress={handleChat} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/chats.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.RedFlashsale }} />
                </TouchableOpacity>
                {reduxProduct?.category?.name != 'Digital Voucher' ?
                    <TouchableOpacity disabled={disableCart} onPress={() => handleAddCart("trolley")} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: flashsale ? colors.RedFlashsale : colors.BlueJaja }} />
                    </TouchableOpacity>
                    : null}
                <Button disabled={disableCart} onPress={() => handleAddCart("buyNow")} style={{ borderRadius: 0, width: reduxProduct?.category?.name != 'Digital Voucher' ? '50%' : '75%', height: '100%', backgroundColor: disableCart ? colors.BlackGrey : flashsale ? colors.RedFlashsale : colors.BlueJaja }} contentStyle={{ width: '100%', height: '100%' }} color={disableCart ? colors.BlackGrayScale : flashsale ? colors.RedFlashsale : colors.BlueJaja} labelStyle={[styles.font_14, styles.T_semi_bold, { color: colors.White }]} mode="contained">
                    {reduxProduct?.statusProduk ?
                        reduxProduct.stock == '0' ? 'Stok Habis' : reduxProduct.statusProduk != 'live' ? 'Diarsipkan' : 'Beli Sekarang' :
                        'Beli Sekarang'
                    }
                </Button>
            </View>
            {Object.keys(reduxProduct).length ?
                <Modal statusBarTranslucent={true} animationType="fade" transparent={true} visible={modal} onRequestClose={() => setmodal(!modal)}>
                    <View style={{ height: Hp('50%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 9999, elevation: 11 }}>
                        <ViewShot ref={viewShotRef} options={{ format: "jpg" }}>
                            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White }}>
                                <Image style={style.swiperProduct}
                                    source={{ uri: reduxProduct.image[0] }}
                                />
                            </View>
                            <View style={{ flex: 0, flexDirection: 'column', backgroundColor: colors.White, padding: '3%', marginBottom: '1%' }}>
                                <Text style={[styles.font_18, styles.mb_2]}>{reduxProduct.name}</Text>
                                {Object.keys(variasiSelected).length ?
                                    <View style={[styles.row_start_center,]}>
                                        <View style={[styles.row, { width: '87%', height: '100%' }]}>
                                            {variasiSelected.isDiscount ?
                                                <View style={styles.row}>
                                                    <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                        <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { marginBottom: Platform.OS === 'ios' ? '-1%' : 0, color: colors.White }]}>{reduxProduct.discount}%</Text>
                                                    </View>
                                                    <View style={styles.column}>
                                                        <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{variasiSelected.priceDiscount}</Text>
                                                    </View>
                                                </View>
                                                :
                                                <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{variasiSelected.price}</Text>
                                            }
                                        </View>
                                    </View>
                                    :
                                    flashsale ?
                                        <View style={[styles.row_start_center,]}>
                                            <View style={[styles.row_center, { width: '87%', height: '100%' }]}>
                                                <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5 }]}>
                                                    <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{flashsaleData.discountFlash}%</Text>
                                                </View>
                                                <View style={[styles.column, { height: Wp('11.5%'), }]}>
                                                    <Text style={Ps.priceBefore}>{reduxProduct.price}</Text>
                                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.price}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={[styles.row_start_center,]}>
                                            <View style={[styles.row_start_center, { width: '87%', }]}>
                                                {reduxProduct.isDiscount ?
                                                    <View style={[styles.row_start_center]}>
                                                        <View style={[styles.row_center, styles.mr_3, { width: Wp('11.5%'), height: Wp('11.5%'), backgroundColor: colors.RedFlashsale, padding: '1%', borderRadius: 5 }]}>
                                                            <Text numberOfLines={1} style={[styles.font_12, styles.T_semi_bold, { marginBottom: Platform.OS === 'ios' ? '-1%' : 0, color: colors.White }]}>{reduxProduct.discount}%</Text>
                                                        </View>
                                                        <View style={[styles.column]}>
                                                            <Text style={Ps.priceBefore}>{reduxProduct.price}</Text>
                                                            <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.priceDiscount}</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={[styles.row_between_center, { width: '100%' }]}>
                                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.YellowJaja }]}>{reduxProduct.price}</Text>
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
    // navContainer: {
    //     height: Hp('9%'),
    //     justifyContent: 'flex-end',
    //     marginHorizontal: 10,
    //     backgroundColor: 'transparent',
    // },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    // navBar: {
    //     height: '100%',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     paddingTop: '5%',
    //     flexDirection: 'row',
    //     backgroundColor: 'transparent',
    //     paddingHorizontal: '1%'
    // },

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
    loadingProduct: { width: '75%', height: '100%', resizeMode: 'contain', backgroundColor: colors.White, alignSelf: 'center', tintColor: colors.Silver },

    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 12, height: NAV_BAR_HEIGHT / 1.7, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});