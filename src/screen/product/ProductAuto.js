import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, RefreshControl, Alert, Modal, useWindowDimensions, ActivityIndicator, Picker } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { styles, colors, useNavigation, Hp, Wp, Ps, Loading, useFocusEffect, FastImage, Utils, ServiceProductAuto } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')
import { useDispatch, useSelector } from "react-redux";
import { SelectList } from 'react-native-dropdown-select-list'
import RadioForm from 'react-native-simple-radio-button';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import CheckBox from '@react-native-community/checkbox';
import RNFS from 'react-native-fs';
import { REACT_APP_BEARER_TOKEN } from '@env'
import { RFValue } from "react-native-responsive-fontsize";

LogBox.ignoreAllLogs()

export default function ProductAuto(props) {

    // REDUX - NAVIGASI 
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxLoad = useSelector(state => state.product.productLoad)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxProduct = useSelector(state => state.product.productDetailAuto);

    // STATE SEWA 
    const otr = 209000000;
    const OtrPrice = otr ? formatRupiah(otr) : "";
    const [selected, setSelected] = useState("");
    const [selectedType, setSelectedType] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedDrivingOption, setSelectedDrivingOption] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');

    // STATE KREDIT 
    const [downPayment, setDownPayment] = useState('');
    const [selectedTenor, setSelectedTenor] = useState('');
    const [selectedDp, setSelectedDp] = useState('');
    const [TDP, setTDP] = useState('');
    const [PH, setPH] = useState('');
    const [AP, setAP] = useState('');
    const [JP, setJP] = useState('');
    const UM = otr ? formatRupiah(downPayment) : "";
    const JPinjaman = otr ? formatRupiah(JP) : "";
    const PokokHutang = otr ? formatRupiah(PH) : "";
    const AngsuranPokok = otr ? formatRupiah(AP) : "";
    const TotalDP = otr ? formatRupiah(TDP) : "";

    // STATE SELECTED 
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [chosenOption, setChosenOption] = useState('');
    const [chosenDuration, setChosenDuration] = useState('');
    const [chosenReplace, setChosenReplace] = useState('');
    const [showResult, setShowResult] = useState(false);

    // STATE LOADING - REFRESH 
    const scrollViewRef = useRef(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [loading, setLoading] = useState(true)
    const [translucent, settranslucent] = useState(true)
    const [bgBar, setbgBar] = useState('transparent')


    // STATE MODAL RESULT
    const fullText = "Rincian simulasi diatas bersifat estimasi dan tidak mengikat dan dapat berubah sewaktu-waktu mengikuti kebijakan yang berlaku. Perhitungan diatas sudah termasuk biaya administrasi, fiducia, asuransi kendaraan serta credit protection. Untuk perhitungan detail, hubungi cabang JajaAuto terdekat.";
    const [showFullText, setShowFullText] = useState(false);
    const [shortText, setShortText] = useState(`${fullText.substring(0, 125)}...`);
    const [alert, setalert] = useState("")


    // FORMAT PRICE
    function formatRupiah(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // TOTAL PRICE
    const totalPrice = selectedPrice ? formatRupiah(selectedPrice) : "";


    // REFRESH
    const handleRefresh = () => {
        setIsRefreshing(true);
        setIsRefreshing(false);
    };


    // TAB CREDIT START

    // HANDLE CALCULATE CREDIT
    const handleCalculate = () => {
        if (selectedTenor === '' || selectedDp === '') {
            Alert.alert('Peringatan', 'Harap pilih jangka waktu dan bunga pinjaman terlebih dahulu.');
            return;
        }

        setIsLoading(true);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);
        myHeaders.append("Cookie", "ci_session=0dam8beh6fv9sb5djr36qrt7h2snvsmm");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.jaja.id/jauto/produk/count?otr=${otr}&dppersen=${selectedDp}&tenor=${selectedTenor}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // Handle the response data
                const { data } = result;

                // Update the down payment state
                setDownPayment(data.uangMuka);
                setTDP(data.tdp)
                setPH(data.totalHutang)
                setAP(data.angsuran)
                setJP(data.pokokHutangAwal)



                // Additional logic here
                setIsLoading(false);
                setShowResult(true);
            })
            .catch(error => {
                // Handle errors
                console.log('error', error);
                setIsLoading(false);
            });
    };

    // HANDLE SUBMIT CREDIT
    const handleApproveKredit = useCallback(() => {
        if (selectedTenor === '' || selectedDp === '') {
            Alert.alert('Peringatan', 'Harap pilih paket terlebih dahulu.');
            return;
        }

        navigation.navigate('ApproveCredit', {
            OtrPrice, UM, JPinjaman, PokokHutang, AngsuranPokok, TotalDP, selectedType, selectedDp, selectedTenor

        });
    }, [OtrPrice, UM, JPinjaman, PokokHutang, AngsuranPokok, TotalDP, selectedType, selectedDp, selectedTenor
    ]);

    // HANDLE MODAL RESULT CREDIT
    const handleCloseModal = () => {
        // Menutup modal
        setShowResult(false);
    }

    // HANDLE TOGLE MODAL RESULT CREDIT
    const handleToggleText = () => {
        setShowFullText(!showFullText);
        if (showFullText) {
            setShortText(`${fullText.substring(0, 50)}...`);
        } else {
            setShortText(fullText);
        }
    };

    // HANDLE EXPORT PDF
    const createPdf = async () => {
        let options = {
            html: htmlContent,
            fileName: 'priceList',
            directory: 'Download'
        };

        let file = await RNHTMLtoPDF.convert(options);
        console.log(file); // prints original location

        // const newFilePath = "/storage/emulated/0/Download/priceList.pdf";
        const newFilePath = RNFS.ExternalDirectoryPath + "/Download/priceList.pdf";


        RNFS.moveFile(file.filePath, newFilePath)
            .then(success => {
                console.log('file moved!');
                file.filePath = newFilePath;
                console.log(file); // prints new location

                Alert.alert("Download Selesai", file.filePath);
            })
            .catch(err => {
                console.log("Error: " + err.message);
            });
    }
    const Select = ({ data, setSelected, selectedValue, placeholder }) => {
        const handleSelect = (itemValue) => {
            setSelected(itemValue);
        };

        // Buat array baru dengan elemen placeholder yang memiliki value null
        const pickerData = [{ label: placeholder, value: null, color: '#818B8C' }, ...data];

        return (
            <View style={{ borderWidth: 1, borderColor: '#A0A0A0', width: '95%', height: 50, borderRadius: 15, backgroundColor: '#F3F4F6' }}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => handleSelect(itemValue)}
                >
                    {pickerData.map((item, index) => (
                        <Picker.Item
                            key={index}
                            label={item.label}
                            value={item.value}
                            color={item.color}
                        />
                    ))}
                </Picker>
            </View>
        );

    };



    const FirstRoute = () => (
        <View style={{ backgroundColor: '#ffff' }}>
            <View style={{ marginTop: 20, marginBottom: 10 }}>
                <Text style={[styles.mb_2, { color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Harga OTR</Text>
                <Text style={[styles.mb_2, { color: '#130F26', fontSize: RFValue(20), backgroundColor: '#F3F4F6', width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold', textAlign: 'center', alignContent: 'center' }]}>RP.{OtrPrice}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Jangka Waktu</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedTenor(val)}
                            data={Tenor}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />
                    </View>
                </View>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>DP</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedDp(val)}
                            data={dp}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />
                    </View>
                </View>
            </View>


            <View style={{ marginTop: 10, backgroundColor: '#ffff' }}>
                <TouchableOpacity
                    onPress={handleCalculate}
                    style={{
                        backgroundColor: '#003034',
                        marginTop: '4%',
                        height: 50,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: isLoading ? 0.5 : 1, // Reduce opacity when loading
                    }}
                    disabled={isLoading} // Disable the button when loading
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" /> // Show loading indicator
                    ) : (
                        <Text
                            style={{
                                color: '#FFF',
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: RFValue(16),
                                textAlign: 'center',
                            }}
                        >
                            Hitung Simulasi
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide" // animasi slide dari bawah
                transparent={true} // latar belakang tidak transparan
                visible={showResult} // kontrol tampilan modal berdasarkan state
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 385, backgroundColor: 'white', borderRadius: 20, padding: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{
                                width: '45%',
                                height: 40,
                                backgroundColor: '#3C78FC',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 5,
                                borderBottomRightRadius: 20,
                                borderTopLeftRadius: 20,
                                alignSelf: "flex-start"
                            }}>
                                <Text style={{ color: '#ffff', fontSize: RFValue(12.5), fontFamily: 'Poppins-SemiBold' }}>
                                    {
                                        reduxProduct?.model?.split(' ').slice(-2).join(' ')
                                    }
                                </Text>
                            </View>


                            <TouchableOpacity style={{
                                marginTop: 5,
                                alignSelf: "flex-start"
                            }} onPress={handleCloseModal}>
                                <Text style={{ color: 'black', fontSize: 20, fontFamily: 'Poppins-SemiBold' }}>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>OTR</Text>
                                < Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}> RP.{OtrPrice}</Text>
                            </View>

                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Uang Muka</Text>
                                <Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>RP.{UM}</Text>
                            </View>

                        </View>


                        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Jumlah Pinjaman</Text>
                                < Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}> RP.{JPinjaman}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginRight: 35 }}>
                                    <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Tenor</Text>
                                    <Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>{selectedTenor} Bln</Text>
                                </View>

                                <View >
                                    <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>DP</Text>
                                    <Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>{selectedDp}%</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>TDP</Text>
                                < Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}> RP.{TotalDP}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Pokok Hutang</Text>
                                    <Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(13.5), borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>RP.{PokokHutang}</Text>
                                </View>
                            </View>

                        </View>




                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 1.5, backgroundColor: '#818B8C', width: '91%', borderRadius: 3, marginRight: '4%' }}></View>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: 30, width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>+</Text>
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', }}>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Total Anggsuran</Text>
                                <Text style={[styles.mb_2, { color: '#000', fontSize: RFValue(18), width: 260, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>RP.{AngsuranPokok}./Bulan</Text>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: '#818B8C', fontSize: RFValue(10), fontFamily: 'Poppins-Regular' }}>
                                {showFullText ? fullText : shortText}
                            </Text>
                            {fullText.length > 50 && (
                                <TouchableOpacity onPress={handleToggleText}>
                                    <Text style={{ color: '#3C78FC', fontFamily: 'Poppins-Medium', fontSize: RFValue(10) }}>{showFullText ? 'Tampilkan lebih sedikit' : 'Selengkapnya'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />

                            <Text style={{ color: '#818B8C', fontSize: RFValue(10), fontFamily: 'Poppins-Regular' }}>Berminat dengan hasil perhitungan?</Text>
                        </View>


                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => createPdf()}
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: '#01A0D7',
                                    marginTop: '4%',
                                    height: 50,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 140
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#01A0D7',
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: RFValue(14),
                                        textAlign: 'center',
                                    }}
                                >
                                    PriceList
                                </Text>
                            </TouchableOpacity>

                            {/* Show this TouchableOpacity only when toggleCheckBox is true */}
                            {toggleCheckBox && (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleApproveKredit();
                                        handleCloseModal();
                                    }}
                                    style={{
                                        backgroundColor: '#01A0D7',
                                        marginTop: '4%',
                                        height: 50,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 190
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#FFF',
                                            fontFamily: 'Poppins-SemiBold',
                                            fontSize: RFValue(14),
                                            textAlign: 'center',
                                        }}
                                    >
                                        Ajukan Sekarang
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                    </View>

                </View>
            </Modal>


        </View >
    );

    // TAB CREDIT END



    // TAB SEWA START

    useEffect(() => {
        let isMounted = true;  // menambah flag penanda

        if (isMounted) {
            setSelectedType(selected);
            setSelectedTenor(selected)
            setSelectedDp(selected)
        }

        return () => { isMounted = false };  // mereset flag ketika komponen unmount
    }, [selected]);



    useEffect(() => {
        setSelectedDuration(chosenDuration);
        setSelectedDrivingOption(chosenOption);
    }, [chosenDuration, chosenOption]);

    useEffect(() => {
        const selectedGrade = reduxProduct && reduxProduct.grades ? reduxProduct.grades.find((grade) => grade.type === selectedType) : null;

        let selectedPackage = null;

        if (selectedGrade) {
            selectedPackage = selectedGrade.packages.find(
                (pkg) => pkg.duration === selectedDuration && pkg.drivingOption === selectedDrivingOption
            );
        }

        const priceExclReplaceCarVat = selectedPackage ? selectedPackage.priceExclReplaceCarVat : null;
        const priceInclReplaceCarVat = selectedPackage ? selectedPackage.priceInclReplaceCarVat : null;
        const packageId = selectedPackage ? selectedPackage.id_jauto_produk_grades : null;

        console.log(priceExclReplaceCarVat)
        if (chosenReplace === 'yes') {
            setSelectedPrice(priceInclReplaceCarVat);
        } else {
            setSelectedPrice(priceExclReplaceCarVat);
        }

        setSelectedPackageId(packageId);
    }, [selectedType, selectedDuration, selectedDrivingOption, chosenReplace, reduxProduct]);


    // SELECT TIPE
    const types = reduxProduct && reduxProduct.grades ? reduxProduct.grades.map((grade) => ({ value: grade.type, key: grade.typeId })) : [];
    const Tipe = types


    // SELECT DURASI
    const duration = reduxProduct && reduxProduct.grades ? reduxProduct.grades[0].packages.filter((pkg, index, self) => self.findIndex((p) => p.duration === pkg.duration) === index).map((pkg, index) => ({
        label: <Text style={[{ color: '#130F26', fontSize: 15, fontFamily: 'Poppins-Regular' }]}>{pkg.duration} Bulan</Text>,
        value: pkg.duration,
        key: index.toString()
    })) : [];


    // SELECT PAKET 
    const option = reduxProduct && reduxProduct.grades ? reduxProduct.grades[0].packages.map((pkg, index) => ({
        label: <Text style={[{ color: '#130F26', fontSize: 15, fontFamily: 'Poppins-Regular' }]}>{pkg.drivingOption} KM/Tahun</Text>,
        value: pkg.drivingOption,
        key: index.toString()
    })).sort((a, b) => a.value - b.value) : [];

    const options = option;


    // SELECT MOBIL PENGGANTI 
    const replaceCar = [
        { label: <Text style={[styles.mb_2, { color: '#130F26', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>Ya</Text>, value: 'yes' },
        { label: <Text style={[styles.mb_2, { color: '#130F26', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>Tidak</Text>, value: 'no' },
    ];


    // SELECT TENOR 
    const Tenor = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>12</Text>, value: '12' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>24</Text>, value: '24' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>36</Text>, value: '36' },
    ];


    // SELECT DP 
    const dp = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>20% </Text>, value: '20' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>40%</Text>, value: '40' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>60%</Text>, value: '60' },
    ]


    // HANDLE SUBMIT SEWA 
    const handleApprove = useCallback(() => {
        if (selectedDuration === '' || selectedDrivingOption === '' || selectedType === '') {
            Alert.alert('Peringatan', 'Harap pilih paket terlebih dahulu.');
            return;
        }

        navigation.navigate('Approve', {
            selectedType,
            selectedDrivingOption,
            selectedDuration,
            selectedPackageId,
            selectedPrice
        });
    }, [selectedType, selectedDrivingOption, selectedDuration, selectedPackageId, navigation, selectedPrice]);


    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }, []),
    );


    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: '#fff' }} >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, flexWrap: 'wrap' }}>
                {/* 2 */}
                <View>
                    <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Pilihan Paket</Text>
                    <View style={{ marginTop: 5 }}>

                        <RadioForm
                            radio_props={options}
                            buttonSize={9}
                            buttonOuterSize={20}
                            buttonColor={'#64B0C9'}
                            initial={options.findIndex(option => option.value === chosenOption)}
                            onPress={(value) => {
                                if (chosenOption !== value) {
                                    setChosenOption(value);
                                }
                            }}
                        />


                    </View>
                </View>

                <View>
                    <View>
                        <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Durasi Berlanganan</Text>
                        <View style={{ marginTop: 5 }}>

                            <RadioForm
                                radio_props={duration}
                                buttonSize={9}
                                buttonOuterSize={20}
                                buttonColor={'#64B0C9'}
                                initial={duration.findIndex(option => option.value === chosenDuration)}
                                onPress={(value) => {
                                    if (chosenDuration !== value) {
                                        setChosenDuration(value);
                                    }
                                }}
                            />

                        </View>
                    </View>

                    <View style={{ marginTop: 13 }}>
                        <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Mobil Pengganti</Text>
                        <View style={{ marginTop: 5 }}>

                            <RadioForm
                                radio_props={replaceCar}
                                buttonSize={9}
                                buttonOuterSize={20}
                                buttonColor={'#64B0C9'}
                                initial={replaceCar.findIndex(option => option.value === chosenReplace)}
                                onPress={(value) => {
                                    if (chosenReplace !== value) {
                                        setChosenReplace(value);
                                    }
                                }}
                            />

                        </View>
                    </View>
                </View>
                {/* 2 */}
            </View>

            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* 3 */}
                <View style={{ marginTop: 30 }}>
                    <Text style={[{ color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Regular' }]}>Biaya Berlanganan</Text>
                    <Text style={[{ color: '#818B8C', fontSize: 24, fontFamily: 'Poppins-SemiBold' }]}>Jumlah</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text style={[{ color: colors.BlackGrey, fontSize: 18, marginBottom: -3, fontFamily: 'Poppins-SemiBold' }]}>RP</Text>
                    <Text style={[{ color: '#130F26', fontSize: 28, marginBottom: -2, fontFamily: 'Poppins-SemiBold' }]}>{totalPrice}</Text>
                    <Text style={[{ color: colors.BlackGrey, fontSize: 18, textAlign: 'right', marginRight: 3, fontFamily: 'Poppins-SemiBold' }]}>/Bulan</Text>
                </View>
                {/* 3 */}
            </View>


            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    onPress={handleApprove}
                    style={{
                        backgroundColor: '#003034',
                        marginTop: '4%',
                        height: 50,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: isLoading ? 0.5 : 1, // Reduce opacity when loading
                    }}
                    disabled={isLoading} // Disable the button when loading
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" /> // Show loading indicator
                    ) : (
                        <Text
                            style={{
                                color: '#FFF',
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            Ajukan Sekarang
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View >
    );

    // TAB CREDIT END



    // HANDLE ROUTE TABVIEW 
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'first', title: 'Angsuran' },
        { key: 'second', title: 'Sewa' },
    ]);


    // SELECT WARNA MOBIL 
    useEffect(() => {
        if (reduxProduct && reduxProduct.images && reduxProduct.images.length > 0) {
            setSelectedColor(reduxProduct.images[0].colorName);
        }
    }, [reduxProduct]);

    const RadioButtons = () => {
        const color = reduxProduct && reduxProduct.images ? reduxProduct.images.map((grade) => ({ value: grade.colorName, key: grade.hexColorCode })) : [];

        return (
            <View style={style.radioColor}>
                <View style={style.colorLabel}>
                    <Text style={[styles.mb_2, { color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium', marginRight: 15 }]}>Warna</Text>
                    <Text style={[styles.mb_2, { color: colors.Black, fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>{selectedColor}</Text>
                </View>
                <View style={style.colorsContainer}>
                    {color.map((colorItem) => (
                        <TouchableOpacity
                            key={colorItem.key}
                            style={[
                                style.colorButton,
                                { backgroundColor: colorItem.key },
                                selectedColor === colorItem.value ? { borderColor: '#6BB484', borderWidth: 2.5 } : {}
                            ]}
                            onPress={() => setSelectedColor(colorItem.value)}
                        />
                    ))}
                </View>
            </View>
        );
    };



    // HANDLE DETAIL MOBIL 
    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                ServiceProductAuto.getProduct(reduxAuth, item.slug).then(res => {
                    error = false
                    if (res === 404) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        navigation.goBack()
                    } else if (res?.data) {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res })
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


    const renderNavBar = () => (
        <View style={style.navContainer}>
            {Platform.OS === 'ios' ? null : <View style={styles.statusBar} />}

            <View style={[style.navBar, { paddingTop: Platform.OS === 'ios' ? '0%' : '5%' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, padding: '3%', backgroundColor: colors.BlueAuto, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                    <Image source={require('../../assets/icons/arrow.png')} style={{ width: 25, height: 25, marginRight: '3%', tintColor: colors.White }} />
                </TouchableOpacity>

            </View>
        </View >
    );


    // HANDLE IMAGE 
    const title = () => {
        if (!reduxProduct || !reduxProduct.images || reduxProduct.images.length === 0) {
            return null;
        }

        const selectedImage = selectedColor
            ? reduxProduct.images.find(image => image.colorName === selectedColor)
            : reduxProduct.images[0];

        if (selectedImage) {
            return (
                <FastImage
                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    source={{ uri: selectedImage.imagePath }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            );
        } else {
            return null;
        }
    };




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
            <View style={[styles.column, { backgroundColor: '#e8e8e8' }]}>
                <View style={styles.column}>
                    <View style={[styles.column, styles.p_5, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, borderRadius: 20, paddingBottom: '-20%' }]}>
                        <View style={{ width: 110, height: 30, borderRadius: 5, backgroundColor: '#3C78FC', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2%', flexDirection: 'row' }}>
                            <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 85, height: 15, tintColor: colors.White }} />
                            {/* <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 14 }}>JajaAuto</Text> */}
                        </View>

                        <Text style={[{ color: colors.Black, fontSize: RFValue(18), fontFamily: 'Poppins-SemiBold' }]}>{reduxProduct.model}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap' }}>

                            {/* 1 */}
                            <View>
                                <Text style={[styles.mb_5, { color: '#818B8C', fontSize: RFValue(12.5), fontFamily: 'Poppins-Medium' }]}>Tipe</Text>
                                <View>
                                    <SelectList
                                        setSelected={(val) => setSelected(val)}
                                        data={Tipe}
                                        save="value"
                                        placeholder="Pilih tipe"
                                        boxStyles={{ borderColor: '#A0A0A0', width: 165, borderRadius: 15, height: 47 }}
                                        inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}

                                    />
                                </View>
                            </View>
                            {/* 1 */}


                            {/* 2*/}
                            <View >
                                <RadioButtons />
                            </View>
                            {/* 2 */}


                        </View>


                        <View style={{ marginTop: '2%' }}>
                            <TabView
                                tabBarPosition="top"
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                renderTabBar={props =>
                                    <TabBar
                                        {...props}
                                        style={{
                                            backgroundColor: '#ffff',
                                            shadowColor: 'transparent',
                                            shadowRadius: 0,
                                            shadowOpacity: 0,
                                            elevation: 0
                                        }}
                                        renderLabel={({ route, focused, color }) => (
                                            <Text style={[{ color: focused ? 'black' : '#A0A0A0', fontFamily: 'Poppins-SemiBold', fontSize: RFValue(12.5) }]}>
                                                {route.title}
                                            </Text>
                                        )}
                                        indicatorStyle={{ borderColor: '#3C78FC', borderWidth: 2, borderRadius: 5 }}
                                    />
                                }
                                onIndexChange={setIndex}
                                initialLayout={{ width: layout.width }}
                                style={{ width: '100%', height: Hp('60%') }}
                            />
                        </View>

                    </View>
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
                scrollViewProps={{
                    nestedScrollEnabled: true,
                    refreshControl: (
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    ),
                    ref: scrollViewRef,
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

    radioColor: {
        marginBottom: 20
    },

    colorLabel: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 18,
    },
    colorsContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    colorButton: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },

    swiperProduct: { width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: colors.White },
    loadingProduct: { width: '75%', height: '100%', resizeMode: 'contain', backgroundColor: colors.White, alignSelf: 'center', tintColor: colors.Silver },

    searchBar: { flexDirection: 'row', backgroundColor: colors.White, borderRadius: 12, height: NAV_BAR_HEIGHT / 1.7, width: '70%', alignItems: 'center', paddingHorizontal: '4%' }
});

