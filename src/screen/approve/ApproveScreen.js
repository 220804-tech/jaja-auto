import React, { useEffect, useState, useCallback, useRef } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, RFValue, Modal, Share, TextInput } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { styles, colors, useNavigation, Hp, Wp, Ps, Loading, useFocusEffect, ServiceProduct, FastImage, RecomandedCar, Countdown, Utils, HeaderTitleHome } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useDispatch, useSelector } from "react-redux";
import ViewShot from "react-native-view-shot";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import ToggleSwitch from 'toggle-switch-react-native'

LogBox.ignoreAllLogs()

export default function ApproveScreen({ props, route }) {
    const { selectedType, selectedDrivingOption, selectedDuration, selectedPackageId, selectedPrice, selectedTenor, selectedDp, } = route.params;

    const navigation = useNavigation()
    const viewShotRef = useRef(null);
    const reduxProduct = useSelector(state => state.product.productDetailAuto)
    const reduxLoad = useSelector(state => state.product.productLoad)

    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const showFlashsale = useSelector(state => state.product.flashsale)


    const slug = useSelector(state => state.search.slug)

    const dispatch = useDispatch()
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [modal, setmodal] = useState(false)

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [alert, setalert] = useState("")
    const [idProduct, setidProduct] = useState("")
    const [translucent, settranslucent] = useState(true)
    const [bgBar, setbgBar] = useState('transparent')
    const [variasiSelected, setvariasiSelected] = useState({})
    const [flashsale, setFlashsale] = useState(false)
    const [flashsaleData, setFlashsaleData] = useState({})

    const [namaLengkap, setNamaLengkap] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [domisili, setDomisili] = useState('');
    const [metode, setMetode] = useState('');

    console.log(metode)
    const [isToggleOn, setIsToggleOn] = useState(false);

    function formatRupiah(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const totalPrice = selectedPrice ? formatRupiah(selectedPrice) : "";


    useEffect(() => {
        if (reduxUser && reduxUser.user && isToggleOn) {
            setNamaLengkap(reduxUser.user.name || '');
            setWhatsapp(reduxUser.user.phoneNumber || '');
            setEmail(reduxUser.user.email || '');
            // asumsi bahwa "domisili" adalah properti dalam objek pengguna
            setDomisili(reduxUser.user.domisili || '');
        }
        else {
            setNamaLengkap('');
            setWhatsapp('');
            setEmail('');
            setDomisili('');
        }
    }, [reduxUser, isToggleOn]);


    const handleApprove = () => {
        // Cek apakah semua field sudah terisi
        if (!namaLengkap || !whatsapp || !email || !domisili) {
            // Jika ada field yang kosong, tampilkan peringatan
            Alert.alert(
                'Peringatan',
                'Harap lengkapi form pengajuan',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
        } else {
            // Validasi alamat email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert(
                    'Peringatan',
                    'Alamat email tidak valid',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
                return; // Menghentikan eksekusi lebih lanjut jika email tidak valid
            }

            // Jika semua field sudah terisi dan email valid, lakukan aksi yang sesuai
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify({
                packageId: selectedPackageId,
                name: namaLengkap,
                contactNumber: whatsapp,
                email: email,
                domisili: domisili,
                rentOrCredit: 'rent',
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch('https://api.jaja.id/order/submit', requestOptions)
                .then(response => response.json()) // Assuming response is in JSON format
                .then(result => {
                    console.log(result);

                    // Check if the response message is success
                    if (result.message === 'Berhasil') {
                        // Navigate to the SuccessApprove page

                        navigation.navigate('SuccessApprove', {
                            selectedType,
                        });

                        // Reset the state
                        setNamaLengkap('');
                        setWhatsapp('');
                        setEmail('');
                        setDomisili('');
                    }
                })
                .catch(error => console.log('error', error));
        }
    };




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
            console.log("🚀 ~ file: ApproveScreen.js ~ line 138 ~ dynamicLink ~ error", error.message)

        }
    }


    const renderNavBar = () => (
        <View style={style.navContainer}>
            {Platform.OS === 'ios' ? null : <View style={styles.statusBar} />}

            <View style={[style.navBar, { paddingTop: Platform.OS === 'ios' ? '0%' : '5%' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueJaja, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/arrow.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: colors.White }} />
                </TouchableOpacity>

            </View>
        </View >
    );


    const title = () => {
        if (!reduxProduct || !reduxProduct.images || reduxProduct.images.length === 0) {
            return null; // Tampilkan null jika reduxProduct atau reduxProduct.images tidak terdefinisi atau kosong
        }

        return (
            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White, marginTop: Platform.OS === 'ios' ? '-11%' : 0 }}>
                <Swiper
                    horizontal={true}
                    dotColor={colors.White}
                    activeDotColor={colors.BlueJaja}
                    style={{ backgroundColor: colors.WhiteBack }}
                >
                    {reduxProduct.images.map((image, index) => (
                        <FastImage
                            key={index}
                            style={{ width: Wp('100%'), height: Wp('100%'), resizeMode: 'contain' }}
                            source={{ uri: image.imagePath }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    ))}
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



    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: '#e8e8e8', paddingBottom: Hp('1%') }]}>

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




                        <View style={[styles.column, styles.p_4, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, borderRadius: 20, paddingBottom: '5%' }]}>
                            <Text style={[styles.mb_4, { color: 'black', fontSize: 20, fontFamily: 'Poppins-SemiBold' }]}>Dapatkan {reduxProduct.name} dengan Penawaran Terbaik</Text>

                            <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 14, fontFamily: 'Poppins-Medium' }]}>Paket yang anda pilih :</Text>


                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 15, backgroundColor: '#3C78FC', width: 130, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8 }]}> {selectedType}</Text>
                                <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 15, backgroundColor: '#3C78FC', width: 110, height: 40, textAlign: 'center', marginHorizontal: 10, borderRadius: 10, paddingTop: 8 }]}> {selectedDrivingOption}KM</Text>
                                <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 15, backgroundColor: '#3C78FC', width: 90, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8 }]}> {selectedDuration} Bulan</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                                <View>
                                    <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 14, fontFamily: 'Poppins-Medium' }]}>Total :</Text>
                                    <Text style={[styles.mb_2, { color: 'white', fontSize: 15, backgroundColor: '#3C78FC', width: 175, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8, fontFamily: 'Poppins-Medium' }]}>RP. {totalPrice}/Bulan</Text>
                                </View>
                            </View>



                            <View style={[styles.mt_5]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                    <TextInput
                                        style={style.input2}
                                        placeholder='Nama Lengkap'
                                        placeholderTextColor={"black"}
                                        value={namaLengkap}
                                        onChangeText={text => setNamaLengkap(text)}
                                    />

                                    <TextInput
                                        style={style.input2}
                                        placeholder='Whatsapp'
                                        placeholderTextColor={"black"}
                                        value={whatsapp}
                                        onChangeText={text => setWhatsapp(text)}
                                        keyboardType='number-pad'
                                    />

                                </View>

                                <TextInput
                                    style={style.input}
                                    placeholder='Alamat Email'
                                    placeholderTextColor={"black"}
                                    value={email}
                                    onChangeText={text => setEmail(text)}
                                    keyboardType='email-address'
                                />

                                <TextInput
                                    style={style.input}
                                    placeholder='Domisili'
                                    placeholderTextColor={"black"}
                                    value={domisili}
                                    onChangeText={text => setDomisili(text)}
                                />

                                {/* <ToggleSwitch
                                    isOn={isToggleOn}
                                    onColor="#FFB236"
                                    offColor="#F1F1F1"
                                    size="medium"
                                    onToggle={isOn => {
                                        setIsToggleOn(isOn);
                                        console.log("changed to : ", isOn);
                                    }}
                                /> */}
                            </View>

                            <TouchableOpacity
                                onPress={handleApprove}
                                style={{
                                    backgroundColor: '#01A0D7',
                                    marginTop: '6%',
                                    height: 50,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}

                            >
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: 18,
                                        textAlign: 'center',
                                    }}
                                >
                                    Ajukan
                                </Text>
                            </TouchableOpacity>
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


            {Object.keys(reduxProduct).length ?
                <Modal statusBarTranslucent={true} animationType="fade" transparent={true} visible={modal} onRequestClose={() => setmodal(!modal)}>
                    <View style={{ height: Hp('50%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 9999, elevation: 11 }}>
                        <ViewShot ref={viewShotRef} options={{ format: "jpg" }}>
                            <View style={{ width: Wp('100%'), height: Wp('100%'), backgroundColor: colors.White }}>
                                <Image style={style.swiperProduct}
                                    source={{ uri: reduxProduct.images[0].imagePath }}
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

    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },

    input: {
        borderWidth: 1, borderColor: '#A0A0A0', width: '100%', height: 50, borderRadius: 15, paddingLeft: 15, fontFamily: 'Poppins-Regular', marginBottom: 20
    },

    input2: {
        borderWidth: 1, borderColor: '#A0A0A0', width: '48%', borderRadius: 15, paddingLeft: 15, fontFamily: 'Poppins-Regular', marginBottom: 20
    },

    btnApprove: {
        backgroundColor: '#64B0C9', marginTop: '4%', height: 45, borderRadius: 15, marginLeft: '2%', marginRight: '2%'
    },

    t_btn: {
        color: '#FFF', textAlign: 'center', alignItems: 'center', fontFamily: 'Poppins-SemiBold', fontSize: 18, paddingTop: '3%'
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