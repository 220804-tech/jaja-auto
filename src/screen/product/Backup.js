import React, { useEffect, useState, useCallback, useRef } from 'react'
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar, Animated, Platform, Dimensions, LogBox, ToastAndroid, RefreshControl, Alert, RFValue, Modal, Share, TextInput, useWindowDimensions, ActivityIndicator } from 'react-native'
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Swiper from 'react-native-swiper'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { FilterLocation, styles, colors, useNavigation, Hp, Wp, Ps, Loading, ServiceCart, ServiceUser, useFocusEffect, ServiceStore, ServiceProduct, FastImage, RecomandedCar, Countdown, Utils, HeaderTitleHome, RadioButton, ServiceProductAuto } from '../../export'
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const { height: hg } = Dimensions.get('screen')
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { SelectList } from 'react-native-dropdown-select-list'
import RadioForm from 'react-native-simple-radio-button';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import CheckBox from '@react-native-community/checkbox';
import RNFS from 'react-native-fs';


LogBox.ignoreAllLogs()

export default function ProductAuto(props) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const scrollViewRef = useRef(null);

    const reduxProduct = useSelector(state => state.product.productDetailAuto);
    const reduxUser = useSelector(state => state.user.user)


    const [chosenOption, setChosenOption] = useState('');
    const [chosenDuration, setChosenDuration] = useState('');
    const [chosenReplace, setChosenReplace] = useState('');

    const [selected, setSelected] = useState("");
    const [selectedType, setSelectedType] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedDrivingOption, setSelectedDrivingOption] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedPackageId, setSelectedPackageId] = useState(null);


    const [selectedPackageIdStatis, setSelectedPackageIdStatis] = useState(19897);


    const otr = 209000000;
    const [selectedTenor, setSelectedTenor] = useState('');
    const [selectedDp, setSelectedDp] = useState('');

    const [selectedBulanMulai, setSelectedBulanMulai] = useState('');
    const [bulanMulai, setBulanMulai] = useState([]);
    const [selectedTahunMulai, setSelectedTahunMulai] = useState('');

    const [selectedBulanAkhir, setSelectedBulanAkhir] = useState('');
    const [selectedTahunAkhir, setSelectedTahunAkhir] = useState('');

    const [selectedPerhitunganBunga, setSelectedPerhitunganBunga] = useState('');
    const [selectedJenisCicilan, setSelectedJenisCicilan] = useState('');

    const [angsuranPokokResult, setAngsuranPokokResult] = useState(0);
    const [angsuranBungaResult, setAngsuranBungaResult] = useState(0);
    const [angsuranTotalResult, setAngsuranTotalResult] = useState(0);

    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);

        // Perform your refresh logic here
        // ...

        setIsRefreshing(false);
    };

    // ANGGSURAN
    const AngsuranPokok = () => {
        if (selectedTenor !== '') {
            return otr / selectedTenor;
        }
        return 0; // jika selectedTenor masih kosong atau 0
    };


    const AngsuranBunga = () => {
        if (selectedTenor !== '') {
            const dpValue = otr * (selectedDp / 100); // Menghitung nilai uang muka
            const result = (otr + dpValue - otr) / 12;
            return result;
        }
        return 0; // jika selectedTenor masih kosong atau 0
    };

    const TotalAnggsuran = () => {
        if (selectedTenor !== '') {
            return angsuranPokokResult + angsuranBungaResult;
        }
        return 0; // jika selectedTenor masih kosong atau 0
    };


    const handleCalculate = () => {
        if (selectedTenor === '' || selectedDp === '') {
            Alert.alert('Peringatan', 'Harap pilih jangka waktu dan bunga pinjaman terlebih dahulu.');
            return;
        }
        setIsLoading(true);

        setTimeout(() => {
            const result = AngsuranPokok();
            const resultsTotal = TotalAnggsuran();
            const results = AngsuranBunga();

            setAngsuranPokokResult(result);
            setAngsuranTotalResult(resultsTotal);
            setAngsuranBungaResult(results);

            setShowResult(true);
            setIsLoading(false); // Set isLoading back to false after 2 seconds
        }, 500);
    };

    useEffect(() => {
        const resultsTotal = TotalAnggsuran();
        setAngsuranTotalResult(resultsTotal);
    }, [angsuranPokokResult, angsuranBungaResult]);



    useEffect(() => {
        setSelectedType(selected);
        setSelectedTenor(selected)
        setSelectedDp(selected)
    }, [selected]);

    // OTR
    const OtrPrice = otr ? formatRupiah(otr) : "";

    // ANGSURAN POKOK
    const totalPokok = angsuranPokokResult.toFixed(2);
    const AnggsuranPokok = formatRupiah(totalPokok);

    const AnggsuranPokokRepeated = Array.from({ length: selectedTenor }, () => AnggsuranPokok);
    const angsuranPokok = angsuranPokokResult * selectedTenor;

    const FinalAngsuran = formatRupiah(angsuranPokok);

    let sisa = angsuranPokok;
    let hasilPengurangan = [];

    for (let i = 0; i < selectedTenor; i++) {
        const pengurangan = sisa - angsuranPokokResult;
        hasilPengurangan.push(pengurangan.toFixed(2));
        sisa = pengurangan;
    }

    const hasilCetak = hasilPengurangan.map((hasil) => formatRupiah(hasil));


    // ANGSURAN BUNGA
    const totalBunga = angsuranBungaResult.toFixed(2);
    const AnggsuranBunga = formatRupiah(totalBunga);

    const AnggsuranBungaRepeated = Array.from({ length: selectedTenor }, () => AnggsuranBunga);
    const angsuranBunga = angsuranBungaResult * selectedTenor;

    const FinalBunga = formatRupiah(angsuranBunga);


    // TOTAL ANGGSURAN
    const totalAnggsuran = angsuranTotalResult.toFixed(2);
    const AnggsuranTotal = formatRupiah(totalAnggsuran);

    const AnggsuranTotalRepeated = Array.from({ length: selectedTenor }, () => AnggsuranTotal);
    const angsuranTotal = angsuranTotalResult * selectedTenor;

    const Final = formatRupiah(angsuranTotal);

    // CHECKBOX
    const [toggleCheckBox, setToggleCheckBox] = useState(false)


    // SEWA
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



    const types = reduxProduct && reduxProduct.grades ? reduxProduct.grades.map((grade) => ({ value: grade.type, key: grade.typeId })) : [];
    const Tipe = types

    const duration = reduxProduct && reduxProduct.grades ? reduxProduct.grades[0].packages.filter((pkg, index, self) => self.findIndex((p) => p.duration === pkg.duration) === index).map((pkg, index) => ({
        label: <Text style={[{ color: '#130F26', fontSize: 15, fontFamily: 'Poppins-Regular' }]}>{pkg.duration} Bulan</Text>,
        value: pkg.duration,
        key: index.toString()
    })) : [];

    const option = reduxProduct && reduxProduct.grades ? reduxProduct.grades[0].packages.map((pkg, index) => ({
        label: <Text style={[{ color: '#130F26', fontSize: 15, fontFamily: 'Poppins-Regular' }]}>{pkg.drivingOption} KM/Tahun</Text>,
        value: pkg.drivingOption,
        key: index.toString()
    })).sort((a, b) => a.value - b.value) : [];

    const options = option;

    const replaceCar = [
        { label: <Text style={[styles.mb_2, { color: '#130F26', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Ya</Text>, value: 'yes' },
        { label: <Text style={[styles.mb_2, { color: '#130F26', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Tidak</Text>, value: 'no' },
    ];

    const Tenor = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>12</Text>, value: '12' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>24</Text>, value: '24' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>36</Text>, value: '36' },
    ];

    const dp = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>20% </Text>, value: '20' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>40%</Text>, value: '40' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>60%</Text>, value: '60' },
    ]



    // SELECT BULAN SAAT INI
    useEffect(() => {
        const currentMonth = new Date().getMonth();
        const initialBulanMulai = generateBulanMulai(currentMonth);
        setBulanMulai(initialBulanMulai);
        setSelectedBulanMulai(initialBulanMulai[0]?.value);
    }, []);

    const generateBulanMulai = (currentMonth) => {
        const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const bulanMulai = bulanList.slice(currentMonth);
        return bulanMulai.map((bulan) => ({ key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>{bulan}</Text>, value: bulan }));
    };


    // SELECT TAHUN SAAT INI
    const currentYear = new Date().getFullYear();
    const tahunMulai = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>{currentYear}</Text>, value: currentYear },
        // { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>{currentYear + 1}</Text>, value: currentYear + 1 },
    ];

    useEffect(() => {
        setSelectedTahunMulai(currentYear.toString());
    }, []);

    // const bulanAkhir = [
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>April </Text>, value: 'April' },
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>May</Text>, value: 'May' },
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Juni</Text>, value: 'Juni' },
    // ]

    // const tahunAkhir = [
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>2027 </Text>, value: 2027 },
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>2028</Text>, value: 2028 },
    //     { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>2030</Text>, value: 2030 },
    // ]

    const perhitunganBunga = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>FLAT </Text>, value: 'FLAT' },
    ]


    const jenisCicilan = [
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Bulan </Text>, value: 'Bulan' },
        { key: <Text style={[styles.mb_2, { color: '#939495', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Tahub</Text>, value: 'Tahun' },
    ]

    // FINAL PRICE

    // FORMAT PRICE
    function formatRupiah(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // TOTAL PRICE
    const totalPrice = selectedPrice ? formatRupiah(selectedPrice) : "";

    // PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
    
    
        <title>company invoice - Bootdey.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet">
        <style type="text/css">
            body {
                margin-top: 20px;
                color: #484b51;
                font-family: 'Poppins';
            }
    
            .text-secondary-d1 {
                color: #728299 !important;
            }
    
            .page-header {
                margin: 0 0 1rem;
                padding-bottom: 1rem;
                padding-top: .5rem;
                border-bottom: 1px dotted #e2e2e2;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: justify;
                justify-content: space-between;
                -ms-flex-align: center;
                align-items: center;
            }
    
            .page-title {
                padding: 0;
                margin: 0;
                font-size: 1.75rem;
                font-weight: 300;
            }
    
            .brc-default-l1 {
                border-color: #dce9f0 !important;
            }
    
            .ml-n1,
            .mx-n1 {
                margin-left: -.25rem !important;
            }
    
            .mr-n1,
            .mx-n1 {
                margin-right: -.25rem !important;
            }
    
            .mb-4,
            .my-4 {
                margin-bottom: 1.5rem !important;
            }
    
            hr {
                margin-top: 1rem;
                margin-bottom: 1rem;
                border: 0;
                border-top: 1px solid rgba(0, 0, 0, .1);
            }
    
            .text-grey-m2 {
                color: #888a8d !important;
            }
    
            .text-success-m2 {
                color: #86bd68 !important;
            }
    
            .font-bolder,
            .text-600 {
                font-weight: 600 !important;
            }
    
            .text-110 {
                font-size: 110% !important;
            }
    
            .text-blue {
                color: #478fcc !important;
            }
    
            .pb-25,
            .py-25 {
                padding-bottom: .75rem !important;
            }
    
            .pt-25,
            .py-25 {
                padding-top: .75rem !important;
            }
    
            .bgc-default-tp1 {
                background-color: rgba(121, 169, 197, .92) !important;
            }
    
            .bgc-default-l4,
            .bgc-h-default-l4:hover {
                background-color: #f3f8fa !important;
            }
    
            .page-header .page-tools {
                -ms-flex-item-align: end;
                align-self: flex-end;
            }
    
            .btn-light {
                color: #757984;
                background-color: #f5f6f9;
                border-color: #dddfe4;
            }
    
            .w-2 {
                width: 1rem;
            }
    
            .text-120 {
                font-size: 120% !important;
            }
    
            .text-primary-m1 {
                color:#4087d4 !important;
            }
    
            .text-danger-m1 {
                color: #dd4949 !important;
            }
    
            .text-blue-m2 {
                color: #68a3d5 !important;
            }
    
            .text-150 {
                font-size: 150% !important;
            }
    
            .text-60 {
                font-size: 60% !important;
            }
    
            .text-grey-m1 {
                color: #7b7d81 !important;
            }
    
            .align-bottom {
                vertical-align: bottom !important;
            }
        </style>
    </head>
    
    <body>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <div class="page-content container">
            <div class="page-header text-blue-d2">
                <img src="https://seller.jaja.id/asset/front/images/file/2023071164acd6324fd36.png" class="img-fluid w-25"
                    alt="Responsive image">
                <div class="page-tools">
                    <div class="action-buttons">
                        <a class="btn bg-white btn-light mx-1px text-95" href="#" data-title="Print">
                            <i class="mr-1 fa fa-print text-primary-m1 text-120 w-2"></i>
                            Print
                        </a>
                        <a class="btn bg-white btn-light mx-1px text-95" href="#" data-title="PDF">
                            <i class="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"></i>
                            Export
                        </a>
                    </div>
                </div>
            </div>
            <div class="container px-0">
                <div class="row mt-4">
                    <div class="col-12 col-lg-12">
                        <div class="row">
                            <div class="col-sm-6">
                                <div>
                                    <span class="text-sm text-grey-m2 align-middle">To:</span>
                                    <span class="text-600 text-110 text-blue align-middle">  ${reduxUser && reduxUser.name ? reduxUser.name : 'Guest'}</span>
                                </div>
                                <div class="text-grey-m2">
                                    <div class="my-1">
                                    ${reduxUser && reduxUser.location && reduxUser.location[0] ? `${reduxUser.location[0].kelurahan}, ${reduxUser.location[0].kecamatan}` : 'Unknown Location'}
                                    </div>
                                    <div class="my-1">
                                    ${reduxUser && reduxUser.location && reduxUser.location[0] ? reduxUser.location[0].provinsi : ''}
                                    </div>
                                    <div class="my-1"><i class="fa fa-phone fa-flip-horizontal text-secondary"></i> <b
                                            class="text-600"> ${reduxUser && reduxUser.phoneNumber ? reduxUser.phoneNumber : ''}</b></div>
                                </div>
                            </div>
    
                            <div class="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                <hr class="d-sm-none" />
                                <div class="text-grey-m2">
                                    <div class="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                                        Invoice
                                    </div>
                                    <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span
                                            class="text-600 text-90">OTR</span> : ${FinalAngsuran}</div>
                                    <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span
                                            class="text-600 text-90">Tenor</span> : ${selectedTenor} Bulan</div>
                                    <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">Bunga</span> <span class="badge badge-warning badge-pill px-25"> : ${selectedDp}%</span></div>
                                </div>
                            </div>
    
                        </div>
                        <div class="mt-4">
                            <table class="table">
                                <thead class="thead-light">
                                    <tr>
    
                                        <th scope="col">Angsuran Pokok</th>
                                        <th scope="col">Bunga</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Sisa Angsuran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                ${AnggsuranBungaRepeated.map((bungaValue, index) => (
        `<tr>
                                                           
                                                                <td><span>RP.${AnggsuranPokokRepeated[index]}</span></td>
                                                                <td><span>RP.${bungaValue}</span></td>
                                                                <td><span>RP.${AnggsuranTotalRepeated[index]}</span></td>
                                                                <td><span>RP.${hasilCetak[index]}</span></td>
                                                                
                                                            </tr>`
    )).join('')}
                                </tbody>

                                
                                <tr>
                                    <th><span class="text-primary">RP.${FinalAngsuran}</span></th>
                                    <th><span class="text-primary">RP.${FinalBunga}</span></th>
                                    <th><span class="text-primary">RP.${Final}</span></th>
                                </tr>
                            </table>
                        </div>
                        <div class="row border-b-2 brc-default-l2"></div>
                        <hr />
                        <div>
                            <span class="text-secondary-d1 text-105">Thank you for your business</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.bundle.min.js"></script>
        <script type="text/javascript">
    
        </script>
    </body>
    
    </html>
    `;

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



    const FirstRoute = () => (
        <View style={{ backgroundColor: '#ffff' }}>
            <View style={{ marginTop: 20, marginBottom: 10 }}>
                <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Harga OTR</Text>
                <Text style={[styles.mb_2, { color: '#130F26', fontSize: 26, backgroundColor: '#F3F4F6', width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold', textAlign: 'center', alignContent: 'center' }]}>RP.{OtrPrice}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Jangka Waktu</Text>
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
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>DP</Text>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Mulai Pinjaman</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedBulanMulai(val)}
                            data={bulanMulai}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                            value={selectedBulanMulai}
                        />

                    </View>
                </View>

                <View style={{ width: '50%', marginTop: 5 }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}></Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedTahunMulai(val)}
                            data={tahunMulai}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                            value={selectedTahunMulai}
                        />
                    </View>
                </View>

            </View>

            {/* 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                <View>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Akhir Pinjaman</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedBulanAkhir(val)}
                            data={bulanAkhir}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />

                    </View>
                </View>

                <View>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}></Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedTahunAkhir(val)}
                            data={tahunAkhir}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: 175, borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />
                    </View>
                </View>

            </View> */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Perhitunga Bunga</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedPerhitunganBunga(val)}
                            data={perhitunganBunga}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />

                    </View>
                </View>

                <View style={{ width: '50%' }}>
                    <Text style={[styles.mb_3, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Jenis Cicilan</Text>
                    <View>
                        <SelectList
                            setSelected={(val) => setSelectedJenisCicilan(val)}
                            data={jenisCicilan}
                            save="value"
                            placeholder="Pilih"
                            boxStyles={{ borderColor: '#A0A0A0', width: '96%', borderRadius: 15 }}
                            inputStyles={{ color: '#000', fontFamily: 'Poppins-Regular' }}
                        />
                    </View>
                </View>

            </View>

            <View style={{ marginTop: 10 }}>
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
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            Hitung Simulasi
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {showResult && (
                <View>
                    <View style={{
                        width: 115,
                        height: 40,
                        backgroundColor: '#3C78FC',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 40,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        alignSelf: "flex-end"
                    }}>
                        <Text style={{ color: '#ffff', fontSize: 16, fontFamily: 'Poppins-SemiBold' }}>
                            {selectedPerhitunganBunga}
                        </Text>
                    </View>


                    <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>OTR</Text>
                            < Text style={[styles.mb_2, { color: '#000', fontSize: 17, width: 220, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}> RP.{OtrPrice}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Tenor</Text>
                                <Text style={[styles.mb_2, { color: '#000', fontSize: 16, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>{selectedTenor} Bulan</Text>
                            </View>

                            <View style={{ marginLeft: 25 }}>
                                <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>DP</Text>
                                <Text style={[styles.mb_2, { color: '#000', fontSize: 16, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>{selectedDp}%</Text>
                            </View>
                        </View>

                    </View>

                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Angsuran Pokok</Text>
                            < Text style={[styles.mb_2, { color: '#000', fontSize: 17, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}> RP.{AnggsuranPokok}{"\n"} / Bulan</Text>
                        </View>

                        <View>
                            <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Angsuran Bunga</Text>
                            <Text style={[styles.mb_2, { color: '#000', fontSize: 17, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>RP.{AnggsuranBunga}{"\n"}/Bulan</Text>
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
                            <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Total Anggsuran</Text>
                            <Text style={[styles.mb_2, { color: '#000', fontSize: 22, width: 260, borderRadius: 8, fontFamily: 'Poppins-SemiBold' }]}>RP.{AnggsuranTotal}{"\n"}/Bulan</Text>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                        />

                        <Text style={{ color: '#818B8C', fontSize: 13, fontFamily: 'Poppins-Regular' }}>Berminat dengan hasil perhitungan?</Text>
                    </View>


                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => createPdf()}
                            style={{
                                backgroundColor: '#01A0D7',
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
                                    color: '#FFF',
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}
                            >
                                PriceList
                            </Text>
                        </TouchableOpacity>

                        {/* Show this TouchableOpacity only when toggleCheckBox is true */}
                        {toggleCheckBox && (
                            <TouchableOpacity
                                onPress={handleApproveKredit}
                                style={{
                                    backgroundColor: '#01A0D7',
                                    marginTop: '4%',
                                    height: 50,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 210
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
                                    Ajukan Sekarang
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            )}


        </View >
    );

    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: '#fff' }} >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, flexWrap: 'wrap' }}>
                {/* 2 */}
                <View>
                    <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Pilihan Paket</Text>
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
                        <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Durasi Berlanganan</Text>
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
                        <Text style={[styles.mb_3, { color: '#A0A0A0', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Mobil Pengganti</Text>
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
                    <Text style={[{ color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Regular' }]}>Biaya Berlanganan</Text>
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


    const navigation = useNavigation()
    const reduxLoad = useSelector(state => state.product.productLoad)
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)

    const dispatch = useDispatch()

    const [scrollY, setscrollY] = useState(new Animated.Value(0))

    const [loading, setLoading] = useState(true)
    const [alert, setalert] = useState("")
    const [translucent, settranslucent] = useState(true)
    const [bgBar, setbgBar] = useState('transparent')


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


    const handleApproveKredit = useCallback(() => {
        if (selectedTenor === '' || selectedDp === '') {
            Alert.alert('Peringatan', 'Harap pilih paket terlebih dahulu.');
            return;
        }

        navigation.navigate('ApproveCredit', {
            selectedPackageIdStatis,
            selectedTenor,
            selectedDp,
            OtrPrice,
            AnggsuranTotal,
            selectedBulanMulai,
            selectedBulanAkhir,
            selectedTahunMulai,
            selectedTahunAkhir,
            selectedPerhitunganBunga,
            selectedJenisCicilan

        });
    }, [selectedTenor, selectedPackageIdStatis, selectedDp, OtrPrice, AnggsuranTotal, selectedBulanMulai,
        selectedBulanAkhir,
        selectedTahunMulai,
        selectedTahunAkhir, selectedPerhitunganBunga,
        selectedJenisCicilan]);




    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }, []),
    );


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

    const [selectedColor, setSelectedColor] = useState('');

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

    const RadioButtons = () => {
        const color = reduxProduct && reduxProduct.images ? reduxProduct.images.map((grade) => ({ value: grade.colorName, key: grade.hexColorCode })) : [];

        return (
            <View style={style.radioColor}>
                <View style={style.colorLabel}>
                    <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 16, marginRight: 18, fontFamily: 'Poppins-Medium' }]}>Warna</Text>
                    <Text style={[styles.mb_2, { color: colors.Black, fontSize: 16, fontFamily: 'Poppins-Medium' }]}>{selectedColor}</Text>
                </View>
                <View style={style.colorsContainer}>
                    {color.map((colorItem) => (
                        <TouchableOpacity
                            key={colorItem.key}
                            style={{ ...style.colorButton, backgroundColor: colorItem.key }}
                            onPress={() => setSelectedColor(colorItem.value)}
                        />
                    ))}
                </View>
            </View>
        );
    };


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

                {!reduxLoad ?
                    <View style={styles.column}>
                        <View style={[styles.column, styles.p_5, styles.my, styles.shadow_5, { shadowColor: colors.BlueJaja, backgroundColor: colors.White, borderRadius: 20, paddingBottom: '-20%' }]}>
                            <View style={{ width: 110, height: 30, borderRadius: 5, backgroundColor: '#3C78FC', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2%', flexDirection: 'row' }}>
                                <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 85, height: 15, tintColor: colors.White }} />
                                {/* <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 14 }}>JajaAuto</Text> */}
                            </View>

                            <Text style={[{ color: colors.Black, fontSize: 22, fontFamily: 'Poppins-SemiBold' }]}>{reduxProduct.model}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap' }}>

                                {/* 1 */}
                                <View>
                                    <Text style={[styles.mb_5, { color: '#818B8C', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>Tipe</Text>
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
                                                <Text style={[{ color: focused ? 'black' : '#A0A0A0', fontFamily: 'Poppins-SemiBold', fontSize: 16 }]}>
                                                    {route.title}
                                                </Text>
                                            )}
                                            indicatorStyle={{ borderColor: '#3C78FC', borderWidth: 2, borderRadius: 5 }}
                                        />
                                    }
                                    onIndexChange={setIndex}
                                    initialLayout={{ width: layout.width }}
                                    style={{ width: '100%', height: Hp('128%') }}
                                />
                            </View>

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

