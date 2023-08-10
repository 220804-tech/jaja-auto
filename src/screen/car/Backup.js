import React, { useEffect, useState, useRef } from 'react'
import { View, Text, SafeAreaView, Image, ScrollView, TextInput, TouchableOpacity, FlatList, StatusBar, Dimensions, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { Appbar, colors, styles, Wp, useNavigation, CardProduct, ServiceProduct, Utils, ShimmerCardProduct, RecomandedCar } from '../../export'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { SelectList } from 'react-native-dropdown-select-list'
import Modals from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';


const { width: viewportWidth } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = windowWidth * 0.95; // 90% dari lebar layar
const imageHeight = windowHeight * 0.22; // 30% dari tinggi layar

const sliderWidth = viewportWidth;
const itemWidth = sliderWidth - 10;

export default function CarScreen() {

    const reduxdashRecommandedAuto = useSelector(state => state.dashboard.recommandedauto)
    const brandFilter = useSelector(state => state.dashboard.brandfilter)
    const modelFilter = useSelector(state => state.dashboard.modelfilter)
    const reduxBadges = useSelector(state => state.user.badges)

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null); // New state for marking the selected option

    const navigation = useNavigation();
    const dispatch = useDispatch()


    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setSelectedModel(null);
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };


    // CARAOSEL 

    const [entries, setEntries] = useState([
        { title: 'Item 1', image: require('../../assets/icons/gift/Banner-JajaAuto1.jpg') },
        { title: 'Item 2', image: require('../../assets/icons/gift/Banner-JajaAuto1.jpg') },
        { title: 'Item 3', image: require('../../assets/icons/gift/Banner-JajaAuto1.jpg') },
        // tambahkan item sebanyak yang Anda butuhkan
    ]);

    const carouselRef = useRef(null);

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={{ width: '95%', height: imageHeight, borderRadius: 15 }} />
            </View>
        );
    }


    // SELECT BRAND
    const Brand = brandFilter
        .filter((item, index, self) => item.value !== "" && self.findIndex(i => i.value === item.value) === index)
        .sort((a, b) => a.value.localeCompare(b.value));



    // SELECT MODEL
    const filteredModels = modelFilter
        .filter(item => item.value !== "" && item.brand === selectedBrand) // Filter item dengan value bukan kosong dan merek yang dipilih
        .map(item => ({
            key: item.key,
            value: item.value.split(' ').slice(0, 3).join(' ') + (item.value.split(' ').length > 3 ? '...' : '')
        }));



    // MODAL
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleModal();
    }


    const getData = () => {
        if (reduxdashRecommandedAuto) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
            myHeaders.append("Authorization", "Bearer qtUPRXyF8NsA3U37wcPNMw==");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.jaja.id/jauto/produk/get", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const newData = result.data.map(item => {
                        let types = item.grades.map(grade => ({ value: grade.type, key: grade.typeId }));

                        // Map through the images array and get the colorName
                        // let colors = item.images.map(image => image.colorName);

                        return {
                            productId: item.productId,
                            model: item.model,
                            images: item.images[0].imagePath,
                            slug: item.slug,
                            type: types,
                            price: item.price,
                            color: item.images[0].colorName, // Store the colors array

                        };
                    });

                    dispatch({ type: 'SET_DASHRECOMMANDEDAUTO', payload: newData });
                })
                .catch(error => {
                    Utils.handleError(error.message, 'Error dengan kode status : 13006');
                });
        }
    };


    const getBrand = async () => {
        if (brandFilter) {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
                myHeaders.append("Authorization", "Bearer qtUPRXyF8NsA3U37wcPNMw==");

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch('https://api.jaja.id/jauto/produk/get', requestOptions);
                const result = await response.json();

                const brand = result.data.map(item => ({ value: item.brand, key: item.productId }));

                dispatch({ type: 'SET_BRANDFILTER', payload: brand });
            } catch (error) {
                Utils.handleError(error.message, 'Error dengan kode status : 13006');
            }
        }
    };


    const getModel = async () => {
        if (modelFilter) {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
                myHeaders.append("Authorization", "Bearer qtUPRXyF8NsA3U37wcPNMw==");

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch('https://api.jaja.id/jauto/produk/get', requestOptions);
                const result = await response.json();

                const model = result.data.map(item => ({ value: item.name, key: item.slug, brand: item.brand }));

                dispatch({ type: 'SET_MODELFILTER', payload: model });
            } catch (error) {
                Utils.handleError(error.message, 'Error dengan kode status : 13006');
            }
        }
    };

    const handleFilter = async () => {
        if (!selectedBrand || !selectedModel) {
            alert("Harap pilih brand dan model terlebih dahulu.");
            return;
        }

        try {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
            myHeaders.append("Authorization", "Bearer qtUPRXyF8NsA3U37wcPNMw==");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(`https://api.jaja.id/jauto/produk/get?brand=${selectedBrand}&model=${selectedModel}`, requestOptions);
            const result = await response.json();

            console.log(result);
            navigation.navigate('FilterResult', { result: result });
        } catch (error) {
            Utils.handleError(error.message, 'Error dengan kode status : 13006');
        }
    };



    useEffect(() => {
        getData();
        getBrand();
        getModel();
    }, []);

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [countdown]);


    const [selecteds, setSelecteds] = useState('new');

    return (
        <ScrollView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueAuto : colors.White }]}>
            <StatusBar backgroundColor="#01A0D7" />
            {/* <Appbar back={true} Bg={colors.BlueAuto} /> */}
            <View style={{ paddingVertical: '3%', backgroundColor: '#01A0D7', paddingHorizontal: '2.5%', borderBottomRightRadius: 14, borderBottomLeftRadius: 14, paddingBottom: 25 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <View style={[styles.row_between_center]}>
                            <TouchableOpacity style={[styles.column, styles.mx]} onPress={toggleModal}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 100, height: 20, tintColor: colors.White, marginRight: 9 }} />
                                    <Image source={require('../../assets/icons/arrow2.png')} style={{ width: 15, height: 8, tintColor: colors.White }} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Modals
                            isVisible={isModalVisible}
                            onSwipeComplete={toggleModal}
                            style={{ justifyContent: 'flex-start', margin: 0 }}
                            animationIn="slideInDown"
                            animationOut="slideOutUp"
                            backdropToClose={false}
                            swipeToClose={false}
                        >
                            <View style={{ backgroundColor: 'white', height: 160, borderBottomLeftRadius: 20, padding: 18, borderBottomRightRadius: 20, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View>
                                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold' }}>Pilih Kategori</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={toggleModal}>
                                            <Text>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 175,
                                            height: 80,
                                            borderWidth: 1,
                                            borderColor: '#64B0C9',
                                            borderRadius: 15,
                                            padding: 10,

                                        }}
                                        onPress={() => {
                                            selectOption('jajaid');
                                            navigation.navigate('Home'); // add this line to navigate
                                        }}
                                    >
                                        <Image source={require('../../assets/images/modal/jajaid.png')} style={{ width: 90, height: 35, marginBottom: 7 }} />
                                        <Text style={{ fontSize: 8, fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Penuhi kebutuhan hobby mu di sini</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            width: 175,
                                            height: 80,
                                            borderWidth: 1,
                                            borderColor: '#64B0C9',
                                            borderRadius: 15,
                                            padding: 17,
                                            paddingTop: 20,

                                        }}
                                        onPress={() => {
                                            selectOption('jajaauto');
                                            navigation.navigate('Car'); // add this line to navigate
                                        }}
                                    >
                                        <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 115, height: 23, marginBottom: 7 }} />
                                        <Text style={{ fontSize: 8, fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Temukan Mobil impian mu di sini</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </Modals>
                    </View>

                    <View style={[styles.row_between_center]}>
                        <TouchableOpacity style={[styles.column, styles.mx_2]} onPress={() => reduxAuth ? navigation.navigate('Notification') : navigation.navigate('Login')}>
                            <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, tintColor: colors.White }} />
                            {Object.keys(reduxBadges).length && reduxBadges.totalNotifUnread ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalNotifUnread >= 100 ? "99+" : reduxBadges.totalNotifUnread}</Text></View>

                                // <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalNotifUnread >= 100 ? "99+" : reduxBadges.totalNotifUnread + ''}</Text></View>
                                : null
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: '5%', marginBottom: '7%' }}>
                    {/* Karusel Anda */}
                    <Carousel
                        autoplay
                        autoplayDelay={4000}
                        autoplayInterval={5000}
                        loop
                        ref={carouselRef}
                        data={entries}
                        renderItem={renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                    />
                </View>

                <View style={{ width: '95%', height: 120, borderRadius: 15, backgroundColor: '#FFF', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: '4%' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setSelecteds('new')}>
                                <Text style={[styled.text, selecteds === 'new' && styled.selected]}>Mobil Baru</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '80%', width: 1, backgroundColor: '#01A0D7' }} />

                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setSelecteds('used')}>
                                <Text style={[styled.text, selecteds === 'used' && styled.selected]}>Mobil Bekas</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ width: '100%', marginTop: '7%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: "#A0A0A0", paddingLeft: 14 }}>Temukan mobil impian Anda sekarang</Text>
                        <Image
                            source={require('../../assets/icons/Search.png')} style={{ width: 22, height: 22, marginRight: 14 }}
                        />
                    </TouchableOpacity>
                </View>



            </View>

            <ScrollView stickyHeaderIndices={[3]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ backgroundColor: Platform.OS === 'ios' ? colors.White : null }}>

                {/* <View style={{ backgroundColor: '#FFBE00', width: 240, marginTop: 10, paddingVertical: 12, paddingLeft: 15, borderBottomRightRadius: 30, borderBottomRightRadius: 30, marginBottom: '3.5%' }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: 'white' }}>Sedang mencari mobil?</Text>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: 'white' }}>Beritahu  kami kebutuhan kamu</Text>
                </View>

                <View style={{ marginHorizontal: '3%', justifyContent: 'space-between', }}>
                    <View>
                        <SelectList
                            setSelected={handleBrandSelect}
                            data={Brand}
                            save="value"
                            placeholder="Brand"
                            boxStyles={{ borderColor: '#01A0D7', width: '100%' }}
                            inputStyles={{ color: '#01A0D7', fontFamily: 'Poppins-Medium' }}

                        />
                    </View>


                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                        <View style={{ width: '80%' }}>
                            <SelectList
                                setSelected={handleModelSelect}
                                data={filteredModels}
                                save="value"
                                placeholder="Model"
                                boxStyles={{ borderColor: '#01A0D7', width: '95%' }}
                                inputStyles={{ color: '#01A0D7', fontFamily: 'Poppins-Medium' }}
                            />
                        </View>

                        <View style={{ width: '20%' }}>
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    backgroundColor: '#01A0D7',
                                    height: 49,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={handleFilter}
                            >
                                <Image
                                    style={{ width: 28, height: 28 }}
                                    source={require('../../assets/icons/searchAuto.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View> */}




                <View style={{ backgroundColor: '#FFBE00', width: 150, marginTop: '5%', paddingVertical: 10, paddingLeft: 15, borderBottomRightRadius: 30, marginBottom: '3.5%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: 'white' }}>Sedang Populer</Text>
                </View>

                <RecomandedCar />


            </ScrollView>
        </ScrollView >
    )
}

const styled = StyleSheet.create({
    text: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: "#A0A0A0",
        paddingBottom: 10,
        textAlign: 'center'
    },
    selected: {
        borderBottomWidth: 2.5,
        borderBottomColor: '#3C78FC', // color of the selection line
        width: 155
    },
    unselected: {
        borderBottomWidth: 2.5,
        borderBottomColor: '#3C78FC', // color of the selection line
        width: 155
    }
});
