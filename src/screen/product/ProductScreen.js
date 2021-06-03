import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { Button } from 'react-native-paper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { styles, colors, useNavigation, Hp, Wp, Ps, Loading, ServiceCart, ServiceUser, useFocusEffect, ServiceStore, ServiceProduct, FastImage } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useDispatch, useSelector } from "react-redux";
import ActionSheet from "react-native-actions-sheet";
import StarRating from 'react-native-star-rating';
import VideoPlayer from 'react-native-video-player';
LogBox.ignoreAllLogs()

export default function ProductScreen(props) {
    const navigation = useNavigation()
    const actionSheetTrolley = createRef();
    const [productDetail, setproductDetail] = useState({})
    const reduxSearch = useSelector(state => state.search)
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [auth, setauth] = useState("")
    const [like, setLike] = useState(false)
    const [alert, setalert] = useState("")
    const [idProduct, setidProduct] = useState("")

    const [deskripsiLenght, setdeskripsiLenght] = useState(200)

    const [variasiSelected, setvariasiSelected] = useState({})
    const [variasiPressed, setvariasiPressed] = useState("")

    const [productId, setproductId] = useState("")
    const [flashSaleId, setflashSaleId] = useState("")
    const [flashsale, setFlashsale] = useState(false)

    const [variantId, setvariantId] = useState("")
    const [lelangId, setlelangId] = useState("")
    const [qty, setqty] = useState(1)
    const [count, setcount] = useState(0)
    const [seller, setSeller] = useState("")

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        if (props.route.params && props.route.params.slug) {
            getItem(props.route.params.slug)
        }
    }, []);

    useEffect(() => {

        setLoading(true)
        if (props.route.params) {
            if (props.route.params.slug) {
                getItem(props.route.params.slug)
                setFlashsale(false)
                console.log("🚀 ~ file: ProductScreen.js ~ line cokk ~ onRefresh ~ onRefresh", props.route.params.flashsale)

            } else if (props.route.params.flashsale) {
                console.log("🚀 ~ file: ProductScreen.js ~ line cokk ~ onRefresh ~ onRefresh", props.route.params.flashsale)
                setFlashsale(true)
            }
        }
    }, [props.route.params])

    const getItem = (slug) => {
        let response;
        ServiceProduct.productDetail(reduxAuth, slug).then(res => {
            if (String(res) === "TypeError: Network request failed") {
                ToastAndroid.show("Tidak dapat terhubung, periksa koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
                setLoading(false)
                setRefreshing(false)
            } else if (res.id) {
                setidProduct(res.id)
                response = "success"
                dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res })
                let dataSeller = res.store
                dataSeller.chat = reduxUser.user.uid + dataSeller.uid
                console.log("🚀 ~ file: ProductScreen.js ~ line 1000 ~ ServiceProduct.productDetail ~ dataSeller", dataSeller)
                console.log("🚀 ~ file: ProductScreen.js ~ line 87 ~ ServiceProduct.productDetail ~ reduxUser.user.uid", reduxUser.user.uid)
                dataSeller.id = dataSeller.uid
                setSeller(dataSeller)
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
            console.log("🚀 ~ file: ProductScreen.js ~ line 87 ~ setTimeout ~ response", response)
            if (!response) {
                return ToastAndroid.show("Tidak dapat terhubung, periksa koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        }, 5000);

    }

    useFocusEffect(
        useCallback(() => {
            try {
                if (reduxAuth) {
                    setauth(reduxAuth)
                    handleGetCart(reduxAuth)
                    getBadges(reduxAuth)
                }
            } catch (error) {

            }

        }, []),
    );

    const getBadges = (token) => {
        ServiceUser.getBadges(token).then(res => {
            if (res) {
                dispatch({ type: "SET_BADGES", payload: res })
            }
        })
    }

    const handleAddCart = (name) => {
        console.log("🚀 ~ file: ProductScreen.js ~ line 72 ~ handleAddCart ~ auth", auth)
        if (auth) {
            if (reduxSearch.productDetail.variant && reduxSearch.productDetail.variant.length) {
                if (Object.keys(variasiSelected).length) {
                    handleApiCart(name)
                    console.log("masuk iff")
                } else {
                    console.log("masuk else")
                    setalert('Pilih salah satu variasi!')
                    ToastAndroid.show('Anda belum memilih variasi produk ini!', ToastAndroid.LONG, ToastAndroid.CENTER)
                }
                console.log("masuk sini")
            } else {
                console.log("keluar")
                handleApiCart(name)
            }
        } else {
            navigation.navigate('Login')
        }
    }


    const handleApiCart = (name) => {
        console.log("🚀 ~ file: ProductScreen.js ~ line 141 ~ handleApiCart ~ name", name)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "productId": idProduct,
            "flashSaleId": flashsale ? flashSaleId : "",
            "lelangId": "",
            "variantId": variasiPressed,
            "qty": qty
        });
        console.log("🚀 ~ file: ProductScreen.js ~ line 169 ~ handleApiCart ~ variasiPressed", variasiPressed)
        console.log("🚀 ~ file: ProductScreen.js ~ line 153 ~ handleApiCart ~  reduxSearch.productDetail.id", idProduct)
        console.log("🚀 ~ file: ProductScreen.js ~ line 106 ~ handleApiCart ~ raw", raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/cart", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: ProductScreen.js ~ line 165 ~ handleApiCart ~ result", result)
                if (result.status.code === 200) {
                    ToastAndroid.show('Produk berhasil ditambahkan', ToastAndroid.LONG, ToastAndroid.TOP)
                    getBadges(auth)
                    if (name === "buyNow") {
                        handleGetCart(auth)
                        navigation.navigate("Trolley")
                    } else {
                        ToastAndroid.show("Produk berhasil ditambahkan", ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                } else {
                    ToastAndroid.show(String(result.status.message) + " => " + String(result.status.code), ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            })
            .catch(error => {
                if (String(error) === "TypeError: Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            });
    }

    const handleGetCart = (token) => {
        ServiceCart.getCart(token).then(res => {
            if (res) {
                dispatch({ type: 'SET_CART', payload: res })
            }
        })

    }

    const handleStore = () => {
        let slug = reduxSearch.productDetail.store.slug
        console.log("🚀 ~ file: ProductScreen.js ~ line 139 ~ handleStore ~ slug", slug)
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
        setTimeout(() => {
            navigation.navigate('Store')
        }, 500);
    }
    const renderNavBar = (text) => (
        <View style={style.navContainer}>
            {/* <View style={style.statusBar} /> */}
            <View style={style.navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/arrow.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: colors.White }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Trolley") & handleGetCart(auth)} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
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
                                    <View style={{ width: Wp('100%'), height: Wp('100%') }}>
                                        <Image key={String(key)} style={style.swiperProduct}
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
    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: '#e8e8e8', paddingBottom: Hp('6%') }]}>
                {reduxSearch.productDetail && Object.keys(reduxSearch.productDetail).length ?
                    <View style={styles.column}>
                        <View style={{ flex: 0, flexDirection: 'column', backgroundColor: colors.White, padding: '3%', marginBottom: '1%' }}>
                            <Text style={{ fontSize: 18, color: colors.BlueJaja, fontWeight: 'bold', marginBottom: '2%' }}>{reduxSearch.productDetail.name}</Text>
                            {Object.keys(variasiSelected).length ?
                                variasiSelected.isDiscount ?
                                    <View style={styles.row}>
                                        <Text style={{ fontSize: 14, color: colors.White, fontWeight: 'bold', backgroundColor: colors.YellowJaja, padding: '2%', borderRadius: 5, marginRight: '2%' }}>{reduxSearch.productDetail.discount}%</Text>
                                        <View style={styles.column}>
                                            <Text style={Ps.priceBefore}>{variasiSelected.price}</Text>
                                            <Text style={Ps.priceAfter}>{variasiSelected.priceDiscount}</Text>
                                        </View>
                                    </View>
                                    :
                                    <Text style={Ps.priceAfter}>{variasiSelected.price}</Text>
                                :

                                reduxSearch.productDetail.isDiscount ?
                                    <View style={styles.row}>
                                        <Text style={{ fontSize: 14, color: colors.White, fontWeight: 'bold', backgroundColor: colors.RedFlashsale, padding: '2%', borderRadius: 5, marginRight: '2%' }}>{reduxSearch.productDetail.discount}%</Text>
                                        <View style={styles.column}>
                                            <Text style={Ps.priceBefore}>{reduxSearch.productDetail.price}</Text>
                                            <Text style={Ps.priceAfter}>{reduxSearch.productDetail.priceDiscount}</Text>
                                        </View>
                                    </View>
                                    :
                                    <Text style={Ps.priceAfter}>{reduxSearch.productDetail.price}</Text>
                            }

                            <View style={[styles.row_between_center, styles.mt_3]}>
                                <Text style={styles.font_14}>{reduxSearch.productDetail.amountSold ? reduxSearch.productDetail.amountSold + " Terjual" : ""}</Text>
                                <View style={styles.row_around_center}>
                                    <TouchableOpacity onPress={() => setLike(!like)}>
                                        <Image source={require('../../assets/icons/love.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: like ? colors.RedMaroon : colors.Silver }} />
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
                                <View style={{ flex: 0, width: '100%' }}>
                                    <FlatList
                                        data={reduxSearch.productDetail.variant}
                                        horizontal={true}
                                        contentContainerStyle={{ flex: 0, flexDirection: 'row' }}
                                        keyExtractor={(item, ind) => String(ind)}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => {
                                            console.log("🚀 ~ file: ProductScreen.js ~ line 367 ~ renderContent ~ item", item)
                                            return (
                                                <Button disabled={item.stock ? false : true} contentStyle={{ marginRight: '2%' }} color={colors.BlueJaja} onPress={() => {
                                                    console.log("🚀 ~ file: ProductScreen.js ~ line 367 ~ renderContent ~ item", item)
                                                    setvariasiPressed(item.id)
                                                    setvariasiSelected(item)
                                                    setalert("")
                                                }} style={{ borderColor: item.stock ? variasiPressed === item.id ? colors.BlueJaja : colors.BlackGrayScale : colors.Silver }} mode="outlined" labelStyle={{ color: item.stock ? variasiPressed === item.id ? colors.BlueJaja : colors.BlackGrayScale : colors.Silver, fontSize: 12 }} uppercase={false}>
                                                    {item.name}
                                                </Button>
                                            )
                                        }}
                                    />
                                    <Text style={[styles.font_12, styles.mt_3]}>Stok tersisa {variasiSelected.stock}</Text>
                                </View>
                            </View>
                            : null
                        }
                        {reduxSearch.productDetail.store ?
                            <View style={[styles.row_between_center, styles.p_3, styles.mb_3, { backgroundColor: colors.White }]}>
                                <View style={styles.row}>
                                    <View style={{ height: Wp('15%'), width: Wp('15%'), borderRadius: 5, marginRight: '3%', backgroundColor: colors.White, borderWidth: 0.5, borderColor: colors.Silver }}>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 5 }} source={Object.keys(reduxSearch.productDetail).length && reduxSearch.productDetail.store.image ? { uri: reduxSearch.productDetail.store.image } : require('../../assets/images/JajaId.png')} />
                                    </View>
                                    {/* <Text style={{ fontSize: 16, color: colors.White, fontWeight: 'bold', backgroundColor: colors.BlueJaja, padding: '3%', borderRadius: 5, marginRight: '5%', textAlign: 'center', textAlignVertical: 'center' }}>{reduxSearch.productDetail.name.slice(0, 1).toUpperCase()}</Text> */}

                                    <View style={styles.column}>
                                        <Text style={[styles.font_14]}>{reduxSearch.productDetail.store.name}</Text>
                                        {reduxSearch.productDetail.store.location ?
                                            <View style={Ps.location}>
                                                <Image style={[Ps.locationIcon, { marginRight: '2%' }]} source={require('../../assets/icons/google-maps.png')} />
                                                <Text style={Ps.locarionName}>{reduxSearch.productDetail.store.location}</Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                                <TouchableOpacity style={{ padding: '2%', borderWidth: 1, borderColor: colors.BlueJaja, borderRadius: 100 }} onPress={handleStore}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja, fontWeight: 'bold' }]}>Kunjungi Toko</Text>
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
                                    reduxSearch.productDetail.review.concat(reduxSearch.productDetail.review).map((item, index) => {
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

                                                                // selectedStar={(rating) => this.onStarRatingPress(rating)}
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
                                                    {item.image.concat(item.image).map((itm, idx) => {
                                                        return (
                                                            <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxSearch.productDetail.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                                                <Image key={String(idx) + "i"} source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                    {item.video ?
                                                        <TouchableOpacity onPress={() => navigation.navigate('Review', { data: reduxSearch.productDetail.slug })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale }}>
                                                            <Image source={require('../../assets/icons/play.png')} style={{ width: Wp('5%'), height: Wp('5%'), marginRight: '2%', tintColor: colors.White }} />
                                                        </TouchableOpacity>

                                                        // <VideoPlayer
                                                        //     fullScreenOnLongPress={true}
                                                        //     video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                                                        //     videoWidth={Wp('18%')}
                                                        //     videoHeight={Wp('18%')}
                                                        // />
                                                        // <Image source={{ uri: item.video }} style={{ width: Wp('18%'), height: Wp('18%'), marginRight: '2%' }} />
                                                        : null}
                                                </View>
                                            </View>
                                        )
                                    })
                                    : null}
                                <TouchableOpacity style={{ width: Wp('90%'), justifyContent: 'center', alignItems: 'center', padding: '3%', backgroundColor: colors.White, elevation: 0.5 }}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja, }]}>Tampilkan semua</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        {reduxSearch.productDetail.otherProduct && reduxSearch.productDetail.otherProduct.length ?

                            <View style={[styles.column, styles.p_4, styles.mb_2, { backgroundColor: colors.White, paddingBottom: '5%' }]}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.BlackGrayScale, marginBottom: '3%' }}>Produk Lainnya Di {reduxSearch.productDetail.store.name}</Text>
                                {/* <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ height: 500 }}> */}
                                <FlatList
                                    horizontal={true}
                                    removeClippedSubviews={true} // Unmount components when outside of window 
                                    // Reduce initial render amount
                                    maxToRenderPerBatch={1} // Reduce number in each render batch
                                    updateCellsBatchingPeriod={100} // Increase time between renders
                                    windowSize={7}
                                    // getItemLayout={(data, index) => getItemLayout(data, index)}
                                    data={reduxSearch.productDetail.otherProduct}
                                    scrollEnabled={true}
                                    keyExtractor={(item, index) => String(index)}
                                    // style={{ flexDirection: 'row' }}
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={(e) => console.log("event ", e)}
                                    // contentContainerStyle={{ marginRight: '2%' }}
                                    // contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleShowDetail(item)}
                                                style={[Ps.cardProduct, { marginRight: 15 }]}
                                                key={index}>
                                                {item.isDiscount ? <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                                <FastImage
                                                    style={Ps.imageProduct}
                                                    source={{
                                                        uri: item.image,
                                                        headers: { Authorization: 'someAuthToken' },
                                                        priority: FastImage.priority.normal,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.contain}
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
                                                    <View style={Ps.location}>
                                                        <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                                        <Text style={Ps.locarionName}>{item.location}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            : null}
                    </View>
                    : null
                }
            </View >
        );
    };




    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar translucent backgroundColor='transparent' barStyle="dark-content" /> */}
            <StatusBar
                animated={true}

                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            />
            {loading ? <Loading /> : null}

            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ReactNativeParallaxHeader
                    headerMinHeight={Hp('7%')}
                    headerMaxHeight={Wp('100%')}
                    extraScrollHeight={20}
                    navbarColor={colors.BlueJaja}
                    titleStyle={style.titleStyle}
                    title={title()}
                    backgroundImageScale={1.2}
                    renderNavBar={() => renderNavBar('Cari hobimu sekarang')}
                    renderContent={renderContent}
                    headerFixedBackgroundColor={colors.BlueJaja}
                    alwaysShowTitle={false}
                    scrollViewProps={{ nestedScrollEnabled: true }}
                />
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, height: Hp('6%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate("IsiChat", { data: seller, product: reduxSearch.productDetail })} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/chats.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.BlueJaja }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAddCart("trolley")} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: colors.BlueJaja }} />
                </TouchableOpacity>
                <Button onPress={() => handleAddCart("buyNow")} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained">
                    Beli Sekarang
                </Button>
            </View>


            <ActionSheet ref={actionSheetTrolley} delayActionSheetDraw={false} containerStyle={{ height: Hp('60%'), padding: '4%' }}>
                <View style={[styles.row_between_center, styles.py_2, styles.mb_3]}>
                    <Text style={[styles.font_16, { color: colors.BlueJaja, fontWeight: 'bold' }]}>Tambah ke trolley</Text>
                    <TouchableOpacity onPressIn={() => actionSheetTrolley.current?.setModalVisible()}>
                        <Image style={[styles.icon_16, { tintColor: colors.BlueJaja }]} source={require('../../assets/icons/close.png')} />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>

                </ScrollView>
            </ActionSheet>
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
        marginHorizontal: 10,
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
        height: Hp('50%')
    },
    touchIcon: { width: '14%', justifyContent: 'center', alignItems: 'center' },
    swiperBanner: { width: "100%", height: 250, resizeMode: 'contain' },
    swiperProduct: { width: '100%', height: '100%', resizeMode: 'contain' },

    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 10, height: NAV_BAR_HEIGHT / 1.9, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});