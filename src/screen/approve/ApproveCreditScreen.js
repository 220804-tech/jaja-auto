import React, { useEffect, useState, useCallback, useRef } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, RFValue, Modal, Share, TextInput, Linking } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { styles, colors, useNavigation, Hp, Wp, Ps, Loading, useFocusEffect, ServiceProduct, FastImage, RecomandedCar, Countdown, Utils, HeaderTitleHome, } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useDispatch, useSelector } from "react-redux";
import ToggleSwitch from 'toggle-switch-react-native'


LogBox.ignoreAllLogs()

export default function ApproveCreditScreen({ props, route }) {
    const {
        selectedTenor,
        selectedDp,
        OtrPrice,
        UM,
        JPinjaman,
        PokokHutang,
        AngsuranPokok,
        TotalDP,
        selectedType,
    } = route.params;

    // Redux selectors
    const reduxProduct = useSelector(state => state.product.productDetailAuto);
    const reduxUser = useSelector(state => state.user);

    // Other hooks
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Local state

    const [loading, setLoading] = useState(true);
    const [translucent, setTranslucent] = useState(true);
    const [bgBar, setBgBar] = useState('transparent');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [domisili, setDomisili] = useState('');
    const [isToggleOn, setIsToggleOn] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }, []),
    );


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


    // VALIDASI TIDAK BOLEH KOSONG 
    const validateInputs = (namaLengkap, whatsapp, email, domisili) => {
        if (!namaLengkap || !whatsapp || !email || !domisili) {
            showAlert('Peringatan', 'Harap lengkapi form pengajuan');
            return false;
        }
        if (!isValidEmail(email)) {
            showAlert('Peringatan', 'Alamat email tidak valid');
            return false;
        }
        return true;
    };

    // VALIDASI EMAIL HARUS SESUAI STANDARD 
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // VALIDASI MODAL 
    const showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    };


    // SUBMIT PENGAJUAN 
    const handleApprove = () => {
        if (!validateInputs(namaLengkap, whatsapp, email, domisili)) {
            return;
        }

        const requestOptions = createRequestOptions(namaLengkap, whatsapp, email, domisili, JPinjaman, selectedTenor, selectedDp, AngsuranPokok);

        submitForm(requestOptions)
            .then(() => {
                navigation.navigate('SuccessApprove', { selectedType });
                startWhatsappChat(namaLengkap, whatsapp, reduxProduct.model, OtrPrice, UM, selectedTenor, TotalDP, AngsuranPokok);
                resetState();
            })
            .catch((error) => console.log('error', error));
    };

    const createRequestOptions = (namaLengkap, whatsapp, email, domisili, JPinjaman, selectedTenor, selectedDp, AngsuranPokok) => {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let raw = JSON.stringify({
            packageId: 19845,
            name: namaLengkap,
            contactNumber: whatsapp,
            email: email,
            domisili: domisili,
            rentOrCredit: 'credit',
            jumlahPinjaman: JPinjaman,
            lamaPinjaman: selectedTenor,
            bungaPerTahun: selectedDp,
            angsuran: AngsuranPokok,
            jenisCicilanWaktu: "",
            mulaiPinjamanBulan: "",
            mulaiPinjamanTahun: "",
            akhirPinjamanBulan: "",
            akhirPinjamanTahun: "",
            perhitunganBunga: ""
        });

        return {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    };

    const submitForm = async (requestOptions) => {
        let response = await fetch('https://api.jaja.id/order/submit', requestOptions);
        let result = await response.json();

        if (result.message !== 'Berhasil') {
            throw new Error(result.message);
        }
    };

    const startWhatsappChat = (namaLengkap, whatsapp, model, OtrPrice, UM, selectedTenor, TotalDP, AngsuranPokok) => {
        let msg = `Halooo Admin Jaja Auto 😊,
Perkenalkan, Nama saya ${namaLengkap}. Saya tertarik untuk mengetahui lebih lanjut tentang penawaran kredit Jaja Auto.
    
Berikut detail mobil yang saya minati:
    
Unit: ${model},
OTR : Rp ${OtrPrice},
Uang Muka : Rp ${UM},
Tenor: ${selectedTenor} Bulan,
Total DP: Rp ${TotalDP},
Jumlah Angsuran : Rp ${AngsuranPokok}
    
Saya berharap dapat mendiskusikan penawaran ini lebih lanjut. Mohon petunjuk selanjutnya.
    
Terima kasih 🙏🏻,
${namaLengkap}`

        let phoneWithCountryCode = '+62' + whatsapp.slice(1);
        let whatsappUrl = 'whatsapp://send?text=' + msg + '&phone=' + phoneWithCountryCode;

        Linking.openURL(whatsappUrl).catch(err => console.error('An error occurred', err));
    };

    const resetState = () => {
        setNamaLengkap('');
        setWhatsapp('');
        setEmail('');
        setDomisili('');
    };




    const renderContent = () => {
        return (
            <View style={[styles.column, { backgroundColor: '#e8e8e8', paddingBottom: Hp('2%') }]}>

                <View style={[styles.column, styles.p_4, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, borderRadius: 20, paddingBottom: '13%' }]}>
                    <Text style={[styles.mb_4, { color: 'black', fontSize: 20, fontFamily: 'Poppins-SemiBold' }]}>Dapatkan {reduxProduct.name} dengan Penawaran Terbaik</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View>
                            <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 14, fontFamily: 'Poppins-Medium' }]}>OTR</Text>
                            <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, backgroundColor: '#3C78FC', width: 130, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8 }]}> {OtrPrice}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 14, fontFamily: 'Poppins-Medium' }]}>Tenor</Text>
                            <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, backgroundColor: '#3C78FC', width: 85, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8 }]}> {selectedTenor} Bulan</Text>
                        </View>
                        <View>
                            <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 14, fontFamily: 'Poppins-Medium' }]}>Total Angsuran</Text>
                            <Text style={[styles.mb_2, { fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, backgroundColor: '#3C78FC', width: 130, height: 40, textAlign: 'center', borderRadius: 10, paddingTop: 8 }]}> {AngsuranPokok}</Text>
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
                            marginTop: '4%',
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
                            Dapatkan Penawaran
                        </Text>
                    </TouchableOpacity>
                </View>


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
            />

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