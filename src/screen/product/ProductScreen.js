import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
import { Button } from 'react-native-paper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { FilterLocation, CheckSignal, styles, colors, useNavigation, Hp, Wp, Ps, Loading, ServiceCart, ServiceUser, useFocusEffect, ServiceStore, ServiceProduct, FastImage, RecomandedHobby, Countdown } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useDispatch, useSelector } from "react-redux";
import ActionSheet from "react-native-actions-sheet";
import StarRating from 'react-native-star-rating';
import { getDistance, getPreciseDistance } from 'geolib';

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
    const [flashsale, setFlashsale] = useState(false)
    const [flashsaleData, setFlashsaleData] = useState({})
    const [variantId, setvariantId] = useState("")
    const [lelangId, setlelangId] = useState("")
    const [qty, setqty] = useState(1)
    const [seller, setSeller] = useState("")
    const [disableCart, setdisableCart] = useState(false)

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
                if (res.sellerTerdekat.length) {
                    console.log("masyk sini")
                    FilterLocation(res.sellerTerdekat)
                }
                if (res.flashsale && Object.keys(res.flashsale).length) {
                    setFlashsale(true)
                    setFlashsaleData(res.flashsale)
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

    const filterDistance = (citys) => {
        try {
            let array = [];
            citys.map(city => {
                if (String(city.city_name)) {
                    fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + city.city_name + "&key=AIzaSyC_O0-LKyAboQn0O5_clZnePHSpQQ5slQU")
                        .then((response) => response.json())
                        .then((responseJson) => {
                            fetch("https://maps.googleapis.com/maps/api/geocode/json?place_id=" + responseJson.predictions[0].place_id + "&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
                                .then(response => response.json())
                                .then(response => {
                                    if (reduxUser.user.location[0].latitude && reduxUser.user.location[0].longitude) {
                                        let point = response.results[0].geometry.location;
                                        var pdis = getDistance(
                                            { latitude: reduxUser.user.location[0].latitude, longitude: reduxUser.user.location[0].longitude },
                                            { latitude: point.lat, longitude: point.lng },
                                        );
                                        console.log("file: ProductScreen.js ~ line 143 ~ filterDistance ~ city.city_name", city.city_name)

                                        console.log("fil-6.321471630175809, 106.87048599579524e: ProductScreen.js ~ line 154 ~ .then ~ pdis KM ", pdis + " => " + pdis / 1000 + "KM")
                                        //     , console.log("file: ProductScreen.js ~ line 143 ~ filterDistance ~ city.city_name", city.city_name)

                                    }
                                })
                                .catch((error) => console.log("error 117", error));
                            // var pdis = getPreciseDistance(
                            //     { latitude: -6.321586109862249, longitude: 106.87017515272444 },
                            //     { latitude: -6.168069464610844, longitude: 107.00333140704073 },
                            // );
                            // alert(
                            //     `Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`
                            // );


                        })
                        .catch((error) => console.log("error", error));
                }
            })
        } catch (error) {
            console.log("file: AddAddressScreen.js ~ line 103 ~ handleSearchKecamatan ~ error", error)
        }
    }
    const handleSearchLatLong = (item) => {
        var value = item['place_id'];
        console.log("_cariLatlon: " + value);
        if (value) {
            fetch("https://maps.googleapis.com/maps/api/geocode/json?place_id=" + value + "&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
                .then((response) => response.json())
                .then(responseJson => {
                    let point = responseJson.results[0].geometry;
                    const northeastLat = point.bounds.northeast.lat, southwestLat = point.bounds.southwest.lat;
                    const northeastLng = point.bounds.northeast.lng, southwestLng = point.bounds.southwest.lng;
                    setRegion({
                        latitude: (northeastLat + southwestLat) / 2, // 2D middle point
                        longitude: (northeastLng + southwestLng) / 2, // 2D middle point
                        latitudeDelta: Math.max(northeastLat, southwestLat) - Math.min(northeastLat, southwestLat),
                        longitudeDelta: (Math.max(northeastLng, southwestLng) - Math.min(northeastLng, southwestLng)) * height / width,
                    })
                    console.log("file: Maps.js ~ line 106 ~ .then ~ responseJson.results[0].geometry.location.lng", responseJson.results[0].geometry.location.lng)
                    console.log("file: Maps.js ~ line 106 ~ .then ~ responseJson.results[0].geometry.location.lat", responseJson.results[0].geometry.location.lat)
                    console.log("file: AddAddressScreen.js ~ line 96 ~ .then ~ responseJson.results[0].geometry.", responseJson.results[0].geometry)
                })
                .catch((error) => console.log("error 117", error));
        }

    }
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

        var raw = JSON.stringify({
            "productId": idProduct,
            "flashSaleId": flashsale ? flashSaleId : "",
            "lelangId": "",
            "variantId": variasiPressed,
            "qty": qty
        });
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
                console.log("🚀 ~ file: ProductScreen.js ~ line 177 ~ handleApiCart ~ result", result)
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
                    Alert.alert(
                        "Error with status code 17001",
                        String(result.status.message) + " => " + String(result.status.code),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                if (String(error) == "TypeError: Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
                } else {
                    Alert.alert(
                        "Error with status code 17001",
                        JSON.stringify(error),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
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
                .catch(error => console.log('error', error));
        } else {
            handleLogin()
        }
    }
    const handleLogin = () => navigation.navigate('Login', { navigate: "Product" })

    const renderNavBar = (text) => (
        <View style={style.navContainer}>
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
                                reduxSearch.productDetail.isDiscount ?
                                    <View style={styles.row}>
                                        <View style={[styles.row_center, { width: Wp('11%'), height: Wp('11%'), backgroundColor: colors.RedFlashsale, padding: '1.5%', borderRadius: 5, marginRight: '2%' }]}>
                                            <Text style={{ fontSize: 14, color: colors.White, fontWeight: 'bold' }}>50%</Text>
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
                                <TouchableOpacity style={{ padding: '2%', borderWidth: 1, borderColor: flashsale ? colors.RedFlashsale : colors.BlueJaja, borderRadius: 100 }} onPress={handleStore}>
                                    <Text style={[styles.font_14, { color: flashsale ? colors.RedFlashsale : colors.BlueJaja, fontWeight: 'bold' }]}>Kunjungi Toko</Text>
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
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.BlueJaja, marginBottom: '3%' }}>Produk Lainnya Di {reduxSearch.productDetail.store.name}</Text>
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
                <TouchableOpacity onPress={handleChat} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/chats.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: flashsale ? colors.RedFlashsale : colors.BlueJaja }} />
                </TouchableOpacity>
                <TouchableOpacity disabled={disableCart} onPress={() => handleAddCart("trolley")} style={{ width: '25%', height: '100%', padding: '3%', backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 23, height: 23, marginRight: '3%', tintColor: flashsale ? colors.RedFlashsale : colors.BlueJaja }} />
                </TouchableOpacity>
                <Button disabled={disableCart} onPress={() => handleAddCart("buyNow")} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={flashsale ? colors.RedFlashsale : colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained">
                    {reduxSearch.productDetail.stock == '0' ? 'Stok Habis' : 'Beli Sekarang'}
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