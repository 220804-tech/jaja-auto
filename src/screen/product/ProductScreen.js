import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, ScrollView } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { Button } from 'react-native-paper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { FilterLocation, CheckSignal, styles, colors, useNavigation, Hp, Wp, Ps, Loading, ServiceCart, ServiceUser, useFocusEffect, ServiceStore, ServiceProduct, FastImage, RecomandedHobby, Countdown, Utils } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')

import { useDispatch, useSelector } from "react-redux";
import StarRating from 'react-native-star-rating';
LogBox.ignoreAllLogs()


export default function ProductScreen(props) {
    const navigation = useNavigation()
    const reduxSearch = useSelector(state => state.search)
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxStore = useSelector(state => state.store.store)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)

    const dispatch = useDispatch()

    const [scrollY, setscrollY] = useState(new Animated.Value(0))

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [like, setLike] = useState(false)
    const [alert, setalert] = useState("")
    const [idProduct, setidProduct] = useState("")

    const [deskripsiLenght, setdeskripsiLenght] = useState(200)

    const [variasiSelected, setvariasiSelected] = useState({})
    const [variasiPressed, setvariasiPressed] = useState("")

    const [productId, setproductId] = useState("")
    const [flashsale, setFlashsale] = useState(false)
    const [flashsaleData, setFlashsaleData] = useState({})
    console.log("🚀 ~ file: ProductScreen.js ~ line 44 ~ ProductScreen ~ flashsaleData", flashsaleData)
    const [variantId, setvariantId] = useState("")
    const [lelangId, setlelangId] = useState("")
    const [qty, setqty] = useState(1)
    const [seller, setSeller] = useState("")
    const [disableCart, setdisableCart] = useState(false)

    const onRefresh = React.useCallback(() => {
        // setLoading(true);
        if (props.route.params) {
            if (props.route.params.slug) {
                getItem(props.route.params.slug)
                ToastAndroid.show("Refreshing..", ToastAndroid.LONG, ToastAndroid.CENTER)

                // setFlashsale(false)
            } else if (props.route.params.flashsale) {
                // setFlashsale(true)
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true)
        if (props.route.params) {
            if (props.route.params.slug) {
                getItem(props.route.params.slug)
                // setFlashsale(false)
            } else if (props.route.params.flashsale) {
                // setFlashsale(true)
            }
        }
    }, [props.route.params])

    const getItem = (slug) => {
        let response;
        ServiceProduct.productDetail(reduxAuth, slug).then(res => {
            if (res) {
                if (reduxAuth && res.sellerTerdekat.length && reduxUser.user && Object.keys(reduxUser.user).length && Object.keys(res.category).length && res.category.slug) {
                    FilterLocation(res.sellerTerdekat, reduxUser.user.location, res.category.slug, reduxAuth)
                }
                if (res.flashsale && Object.keys(res.flashsale).length) {
                    setFlashsale(true)
                    setFlashsaleData(res.flashsale)
                    if (res.flashsale.stokFlash <= 0) {
                        setdisableCart(true)
                    } else {
                        setdisableCart(false)
                    }
                } else {
                    setFlashsale(false)
                }
                setLike(res.isWishlist)
                setidProduct(res.id)
                response = "success"
                if (res.stock == '0') {
                    setdisableCart(true)
                }
                dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res })
                let dataSeller = res.store
                dataSeller.chat = reduxUser.user.uid + dataSeller.uid
                dataSeller.id = dataSeller.uid
                setSeller(dataSeller)
                setLike(res.productDetail.isWishlist)
                setTimeout(() => {
                    setLoading(false)
                    setRefreshing(false)
                }, 1000);
            } else {
                setLoading(false)
                setRefreshing(false)
            }
        }).catch(err => {
            setLoading(false)
            setRefreshing(false)
        })
        setTimeout(() => {
            if (!response) {
                return ToastAndroid.show("Tidak dapat terhubung, periksa koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        }, 5000);
    }

    useFocusEffect(
        useCallback(() => {
            try {
                CheckSignal().then(res => {
                    // console.log("file: ProductScreen.js ~ line 115 ~ CheckSignal ~ res", res)
                })
                if (reduxAuth) {
                    // CheckSignal().then(res => {
                    //     if (res.connect) {
                    handleGetCart()
                    //     }

                    // })

                }
            } catch (error) {

            }

        }, []),
    );

    const getBadges = () => {
        ServiceUser.getBadges(reduxAuth).then(res => {
            if (res) {
                dispatch({ type: "SET_BADGES", payload: res })
            } else {
                dispatch({ type: "SET_BADGES", payload: {} })
            }
        })
    }

    const handleAddCart = (name) => {
        setdisableCart(true)
        if (reduxAuth) {
            if (reduxSearch.productDetail.variant && reduxSearch.productDetail.variant.length) {
                if (Object.keys(variasiSelected).length) {
                    handleApiCart(name)
                    console.log("masuk iff")
                } else {
                    console.log("masuk else")
                    setalert('Pilih salah satu variasi!')
                    ToastAndroid.show('Anda belum memilih variasi produk ini!', ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            } else {
                console.log("keluar")
                handleApiCart(name)
            }
        } else {
            handleLogin()
        }
        setTimeout(() => {
            setdisableCart(false)
        }, 2000);
    }

    const handleApiCart = (name) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        console.log("🚀 ~ file: ProductScreen.js ~ line 215 ~ handleApiCart ~ flashsaleData", flashsaleData.id_flashsale)
        var raw = JSON.stringify({
            "productId": idProduct,
            "flashSaleId": flashsale ? flashsaleData.id_flashsale : "",
            "lelangId": "",
            "variantId": variasiPressed,
            "qty": qty
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://jaja.id/backend/cart", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    ToastAndroid.show('Produk berhasil ditambahkan', ToastAndroid.LONG, ToastAndroid.TOP)
                    if (name === "buyNow") {
                        handleTrolley()
                    } else {
                        handleGetCart()
                    }
                } else if (result.status.code === 400 && result.status.message == 'quantity cannot more than stock') {
                    ToastAndroid.show("Stok produk tidak tersedia", ToastAndroid.LONG, ToastAndroid.CENTER)

                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 12023')
                }
            })
            .catch(error => {
                Utils.handleError(error, 'Error with status code : 12024')
            });
    }

    const handleGetCart = () => {
        getBadges()
        ServiceCart.getCart(reduxAuth).then(res => {
            if (res) {
                dispatch({ type: 'SET_CART', payload: res })
            }
        })

    }

    const handleStore = () => {
        if (reduxStore && Object.keys(reduxStore).length) {
            if (reduxStore.name != seller.name) {
                dispatch({ "type": 'SET_STORE', payload: {} })
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
            }
        }
        let slug = reduxSearch.productDetail.store.slug
        ServiceStore.getStore(slug).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE', payload: res })
            }
        })
        ServiceStore.getStoreProduct(slug, "", "", "", "", "", "").then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
            }
        })
        navigation.navigate('Store')
    }

    const handleTrolley = () => {
        handleGetCart()
        navigation.navigate("Trolley")
    }

    const handleWishlist = () => {
        console.log("file: ProductScreen.js ~ line 252 ~ handleWishlist ~ reduxAuth", reduxAuth)
        if (reduxAuth) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=t3uc2fb7opug4n91n18e70tcpjvdb12u");

            var raw = JSON.stringify({
                "id_produk": reduxSearch.productDetail.id
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/addWishlist", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("file: ProductScreen.js ~ line 271 ~ handleWishlist ~ result", result)
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
            <View style={style.statusBar} />

            <View style={style.navBar}>
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
            <>
                {reduxSearch.productDetail.image ?
                    <Swiper
                        horizontal={true}
                        dotColor={colors.White}
                        activeDotColor={colors.BlueJaja}
                        style={{ backgroundColor: colors.White }}>
                        {
                            reduxSearch.productDetail.image.map((item, key) => {
                                return (
                                    <View key={String(key)} style={{ width: Wp('100%'), height: Wp('100%') }}>
                                        <Image style={style.swiperProduct}
                                            source={{ uri: item }}
                                        />
                                    </View>
                                );
                            })
                        }
                    </Swiper>
                    :
                    <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White }}>
                        <Image style={style.swiperProduct}
                            source={{ uri: props.route.params.image }}
                        />
                    </View>
                }
            </>
        );
    };
    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.80) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 0.05)
    }
    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            // console.log("masuk as")
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
        }
    }
    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: '#e8e8e8', paddingBottom: Hp('6%') }]}>
                {reduxSearch.productDetail && Object.keys(reduxSearch.productDetail).length ?
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
                        <View style={{ flex: 0, flexDirection: 'column', backgroundColor: colors.White, padding: '3%', marginBottom: '1%' }}>
                            <Text style={{ fontSize: 18, color: colors.BlackGrayScale, fontWeight: 'bold', marginBottom: '2%' }}>{reduxSearch.productDetail.name}</Text>
                            {Object.keys(variasiSelected).length ?
                                variasiSelected.isDiscount ?
                                    <View style={styles.row}>
                                        <Text style={{ fontSize: 14, color: colors.White, fontWeight: 'bold', backgroundColor: colors.YellowJaja, padding: '2%', borderRadius: 5, marginRight: '2%' }}>{reduxSearch.productDetail.discount}%</Text>
                                        <View style={styles.column}>
                                            <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                            <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.priceDiscount}</Text>
                                        </View>
                                    </View>
                                    :
                                    <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{variasiSelected.price}</Text>
                                :
                                flashsale ?
                                    <View style={styles.row}>
                                        <View style={[styles.row_center, { width: Wp('11%'), height: Wp('11%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5, marginRight: '2%' }]}>
                                            <Text style={[styles.font_14, styles.T_semi_bold, { marginBottom: '-1%', color: colors.White }]}>{flashsaleData.discountFlash}%</Text>
                                        </View>
                                        <View style={styles.column}>
                                            <Text style={Ps.priceBefore}>{reduxSearch.productDetail.price}</Text>
                                            <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{reduxSearch.productDetail.priceDiscount}</Text>
                                        </View>
                                    </View>
                                    :
                                    reduxSearch.productDetail.isDiscount ?
                                        <View style={styles.row}>
                                            <View style={[styles.row_center, { width: Wp('11%'), height: Wp('11%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5, marginRight: '2%' }]}>
                                                <Text style={{ fontSize: 14, color: colors.White, fontWeight: 'bold' }}>{reduxSearch.productDetail.discount}%</Text>
                                            </View>
                                            <View style={styles.column}>
                                                <Text style={Ps.priceBefore}>{reduxSearch.productDetail.price}</Text>
                                                <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{reduxSearch.productDetail.priceDiscount}</Text>
                                            </View>
                                        </View>
                                        :
                                        <Text style={[Ps.priceAfter, { fontSize: 20, color: flashsale ? colors.RedFlashsale : colors.BlueJaja }]}>{reduxSearch.productDetail.price}</Text>
                            }

                            <View style={[styles.row_between_center, styles.mt_3]}>
                                <Text style={styles.font_14}>{reduxSearch.productDetail.amountSold ? reduxSearch.productDetail.amountSold + " Terjual" : ""}</Text>
                                <View style={styles.row_around_center}>
                                    <TouchableOpacity onPress={handleWishlist}>
                                        <Image source={require('../../assets/icons/love.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: like ? flashsale ? colors.RedFlashsale : colors.RedMaroon : colors.Silver }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {reduxSearch.productDetail.variant && reduxSearch.productDetail.variant.length ?
                            <View style={[styles.column_between_center, styles.p_3, styles.mb, { backgroundColor: colors.White, alignItems: 'flex-start' }]}>
                                <View style={[styles.row_center, styles.mb_3]}>
                                    <Text style={[styles.font_14]}>Variasi Produk</Text>
                                    <Text style={[styles.font_12, { marginLeft: '3%', fontStyle: 'italic', color: colors.RedNotif, fontFamily: 'serif' }]}>{alert}</Text>
                                </View>
                                {/* <View style={[styles.column, { width: Wp('100%') }]}> */}
                                <FlatList
                                    data={reduxSearch.productDetail.variant}
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
                        {reduxSearch.productDetail.store ?
                            <View style={[styles.row_between_center, styles.p_3, styles.mb_3, { backgroundColor: colors.White }]}>
                                <View style={[styles.row, { width: '67%' }]}>
                                    <TouchableOpacity onPress={handleStore} style={{ height: Wp('15%'), width: Wp('15%'), borderRadius: 5, marginRight: '3%', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.Silver }}>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 5 }} source={Object.keys(reduxSearch.productDetail).length && reduxSearch.productDetail.store.image ? { uri: reduxSearch.productDetail.store.image } : require('../../assets/images/JajaId.png')} />
                                    </TouchableOpacity>
                                    <View style={[styles.column_between_center, { width: '77%', alignItems: 'flex-start' }]}>
                                        <Text numberOfLines={1} onPress={handleStore} style={[styles.font_14, { width: '100%' }]}>{reduxSearch.productDetail.store.name}</Text>
                                        {reduxSearch.productDetail.store.location ?
                                            <View style={[Ps.location, { position: 'relative', width: '100%', marginLeft: '-3%', padding: 0 }]}>
                                                <Image style={[styles.icon_14, { marginRight: '2%', tintColor: colors.BlackGrayScale }]} source={require('../../assets/icons/google-maps.png')} />
                                                <Text style={Ps.locarionName}>{reduxSearch.productDetail.store.location}</Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.row_center, { padding: '2%', borderWidth: 1, borderColor: flashsale ? colors.RedFlashsale : colors.BlueJaja, borderRadius: 100 }]} onPress={handleStore}>
                                    <Text style={[styles.font_12, { color: flashsale ? colors.RedFlashsale : colors.BlueJaja, fontWeight: 'bold' }]}>Kunjungi Toko</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        <View style={[styles.column, styles.p_4, styles.mb_2, { backgroundColor: colors.White, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingBottom: '5%' }]}>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 'bold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Informasi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_5, { alignSelf: 'flex-start' }]}>
                                <View style={[styles.column, { width: '40%' }]}>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kondisi</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Berat</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Stok</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>Kategori</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={[styles.font_14, styles.mb_3]}>{reduxSearch.productDetail.condition}</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>{reduxSearch.productDetail.weight} gram</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>{reduxSearch.productDetail.stock}</Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>{reduxSearch.productDetail.category && Object.keys(reduxSearch.productDetail.category).length ? reduxSearch.productDetail.category.name : ""}</Text>

                                </View>
                            </View>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 'bold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Deskripsi Produk</Text>
                            <View style={[styles.row_around_center, styles.mb_3, { alignSelf: 'flex-start' }]}>
                                {reduxSearch.productDetail.description ?
                                    <View style={[styles.column, { width: '100%' }]}>
                                        <Text numberOfLines={deskripsiLenght == 200 ? 4 : 25} style={[styles.font_14]}>{reduxSearch.productDetail.description.slice(0, deskripsiLenght)}</Text>
                                        {deskripsiLenght == 200 && reduxSearch.productDetail.description.length >= 200 ?
                                            <TouchableOpacity onPress={() => setdeskripsiLenght(reduxSearch.productDetail.description.length + 50)}>
                                                <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca selengkapnya..</Text>
                                            </TouchableOpacity>
                                            : reduxSearch.productDetail.description.length <= 200 ? null :
                                                <TouchableOpacity onPress={() => setdeskripsiLenght(200)}>
                                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Baca lebih sedikit</Text>
                                                </TouchableOpacity>
                                        }
                                    </View> : null}
                            </View>
                        </View>

                        {reduxSearch.productDetail.review && reduxSearch.productDetail.review.length ?
                            <View style={[styles.column, styles.p_4, { backgroundColor: colors.White, paddingBottom: Hp('7%') }]}>
                                <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 'bold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Penilaian Produk</Text>
                                {reduxSearch.productDetail.review ?
                                    reduxSearch.productDetail.review.map((item, index) => {
                                        return (
                                            <View key={String(index)} style={[styles.column, styles.mb_5, styles.mt_2]}>
                                                {index === 0 ? null :
                                                    <>
                                                        <View style={styles.row}>
                                                            <Image style={[styles.icon_23, styles.mr_2, { borderRadius: 100 }]} source={{ uri: 'https://jaja.id/asset/uplod/ulasan/dd3d4d73-9507-4a59-84ac-ef1b33a52908.jpg' }} />
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
                                                    </>}
                                                <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                                    {item.image.map((itm, idx) => {
                                                        return (
                                                            <TouchableOpacity key={String(idx) + "i"} onPress={() => navigation.navigate('Review', { data: reduxSearch.productDetail.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                                                <Image source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                    {item.video ?
                                                        <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxSearch.productDetail.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale }}>
                                                            <Image source={require('../../assets/icons/play.png')} style={{ width: Wp('5%'), height: Wp('5%'), marginRight: '2%', tintColor: colors.White }} />
                                                        </TouchableOpacity>
                                                        : null
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                    : null}
                                <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxSearch.productDetail.slug })} style={{ width: Wp('90%'), justifyContent: 'center', alignItems: 'center', padding: '3%', backgroundColor: colors.White, elevation: 0.5 }}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja, }]}>Tampilkan semua</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        {reduxSearch.productDetail.otherProduct && reduxSearch.productDetail.otherProduct.length ?
                            <View style={[styles.column, styles.p_4, styles.mb_2, { backgroundColor: colors.White, paddingBottom: '5%' }]}>
                                <Text style={[styles.font_16, styles.T_medium, { color: colors.BlueJaja }]}>Produk Lainnya Di {reduxSearch.productDetail.store.name}</Text>
                                <FlatList
                                    horizontal={true}
                                    removeClippedSubviews={true} // Unmount components when outside of window 
                                    maxToRenderPerBatch={1} // Reduce number in each render batch
                                    updateCellsBatchingPeriod={100} // Increase time between renders
                                    windowSize={7}
                                    data={reduxSearch.productDetail.otherProduct}
                                    scrollEnabled={true}
                                    keyExtractor={(item, index) => String(index)}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleShowDetail(item)}
                                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('55%') }]}
                                                key={index}>
                                                {item.isDiscount ? <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                                <FastImage
                                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%' }]}
                                                    source={{
                                                        uri: item.image,
                                                        headers: { Authorization: 'someAuthToken' },
                                                        priority: FastImage.priority.normal,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                                <View style={Ps.bottomCard}>
                                                    <Text
                                                        numberOfLines={2}
                                                        style={Ps.nameProduct}>
                                                        {item.name}
                                                    </Text>
                                                    {item.isDiscount ?
                                                        <>
                                                            <Text style={Ps.priceBefore}>{item.price}</Text>
                                                            <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                                        </>
                                                        :
                                                        <Text style={Ps.price}>{item.price}</Text>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            : null}
                        <View style={[styles.column, { backgroundColor: colors.White }]}>
                            <RecomandedHobby />
                        </View>
                    </View>
                    : null
                }
            </View >
        );
    };

    const handleChat = () => {
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: seller, product: reduxSearch.productDetail })
        } else {
            handleLogin()
        }
    }




    return (
        <SafeAreaView style={styles.container}>
            {loading ? <Loading /> : null}
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ReactNativeParallaxHeader
                headerMinHeight={Hp('10%')}
                headerMaxHeight={Wp('100%')}
                extraScrollHeight={20}
                statusBarColor='transparent'
                navbarColor={colors.BlueJaja}

                titleStyle={{ height: Wp('100%') }}
                title={title()}
                backgroundImageScale={1.2}
                renderNavBar={renderNavBar}
                renderContent={renderContent}
                headerFixedBackgroundColor={colors.BlueJaja}
                alwaysShowTitle={false}
                scrollViewProps={{
                    nestedScrollEnabled: true,
                    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
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
                    }
                }}
            />

            <View style={{ position: 'absolute', bottom: 0, height: Hp('6%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleChat} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/chats.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: flashsale ? colors.RedFlashsale : colors.BlueJaja }} />
                </TouchableOpacity>
                <TouchableOpacity disabled={disableCart} onPress={() => handleAddCart("trolley")} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: flashsale ? colors.RedFlashsale : colors.BlueJaja }} />
                </TouchableOpacity>
                <Button disabled={disableCart} onPress={() => handleAddCart("buyNow")} style={{ width: '50%', height: '100%', backgroundColor: disableCart ? colors.BlackGrayScale : flashsale ? colors.RedFlashsale : colors.BlueJaja }} contentStyle={{ width: '100%', height: '100%' }} color={disableCart ? colors.BlackGrayScale : flashsale ? colors.RedFlashsale : colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained">
                    {reduxSearch.productDetail.stock == '0' ? 'Stok Habis' : 'Beli Sekarang'}
                </Button>
            </View>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    navContainer: {
        height: Hp('10%'),
        justifyContent: 'flex-end',
        marginHorizontal: 10,
        backgroundColor: 'transparent'
    },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    navBar: {
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '5%',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingHorizontal: '1%'
    },
    swiperProduct: { width: '100%', height: '100%', resizeMode: 'contain' },
    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 11, height: NAV_BAR_HEIGHT / 1.7, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});