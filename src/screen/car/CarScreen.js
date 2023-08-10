import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, colors, styles, Wp, useNavigation, Utils, RecomandedCar } from '../../export';
import Modals from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const imageWidth = windowWidth * 0.95; // 90% dari lebar layar
const imageHeight = Platform.OS === 'tablet' ? windowHeight * 0.29 : windowHeight * 0.23;
const sliderWidth = viewportWidth;
const itemWidth = sliderWidth - 10;
import { RFValue } from "react-native-responsive-fontsize";
import FastImage from 'react-native-fast-image';

import { REACT_APP_BEARER_TOKEN } from '@env'


export default function CarScreen() {
    const reduxdashRecommandedAuto = useSelector(state => state.dashboard.recommandedauto);
    const reduxBadges = useSelector(state => state.user.badges);

    const [selecteds, setSelecteds] = useState('new');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleModal();
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        if (reduxdashRecommandedAuto) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
            myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);

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
                        return {
                            productId: item.productId,
                            model: item.model,
                            images: item.images[0].imagePath,
                            slug: item.slug,
                            type: types,
                            price: item.price,
                            color: item.images[0].colorName,
                        };
                    });

                    dispatch({ type: 'SET_DASHRECOMMANDEDAUTO', payload: newData });
                })
                .catch(error => {
                    Utils.handleError(error.message, 'Error dengan kode status : 13007');
                });
        }
    };

    const handleFilterScreen = () => {
        navigation.navigate('FilterScreen');
    };

    const TypingText = () => {
        const fullText = 'Temukan mobil impian Anda sekarang';
        const [displayedText, setDisplayedText] = useState('');

        useEffect(() => {
            let i = 0;
            let intervalId = null;

            const timeoutId = setTimeout(() => {
                intervalId = setInterval(() => {
                    if (i < fullText.length) {
                        setDisplayedText((displayedText) => displayedText + fullText[i]);
                        i++;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 150); // Adjust typing speed by changing this value
            }, 300); // Start typing after 250 

            return () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            };
        }, []);

        return (
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: RFValue(12), color: "#A0A0A0", paddingLeft: 15 }}>
                {displayedText}
            </Text>
        );
    }


    return (
        <ScrollView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueAuto : colors.White }]}>
            <StatusBar backgroundColor="#01A0D7" />

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
                            <View style={{ backgroundColor: 'white', height: 160, borderBottomLeftRadius: 20, padding: 18, borderBottomRightRadius: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ fontSize: RFValue(14), fontFamily: 'Poppins-SemiBold' }}>Pilih Kategori</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={toggleModal}>
                                            <Text>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                            navigation.navigate('Home');
                                        }}
                                    >
                                        <Image source={require('../../assets/images/modal/jajaid.png')} style={{ width: 90, height: 35, marginBottom: 7 }} />
                                        <Text style={{ fontSize: RFValue(7), fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Penuhi kebutuhan hobby mu di sini</Text>
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
                                            navigation.navigate('Car');
                                        }}
                                    >
                                        <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 115, height: 23, marginBottom: 7 }} />
                                        <Text style={{ fontSize: RFValue(7), fontFamily: 'Poppins-Medium', color: '#64B0C9' }}>Temukan Mobil impian mu di sini</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modals>
                    </View>
                    <View style={[styles.row_between_center]}>
                        <TouchableOpacity style={[styles.column, styles.mx_2]} onPress={() => reduxAuth ? navigation.navigate('Notification') : navigation.navigate('Login')}>
                            <Image source={require('../../assets/icons/notif.png')} style={{ width: 24, height: 24, tintColor: colors.White }} />
                            {Object.keys(reduxBadges).length && reduxBadges.totalNotifUnread ?
                                <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalNotifUnread >= 100 ? '99+' : reduxBadges.totalNotifUnread}</Text></View>
                                : null
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: '5%', marginBottom: '7%' }}>
                    <CarouselSlider entries={[
                        { title: 'Item 1', image: require('../../assets/icons/gift/Banner-JajaAuto1.jpg') },
                        { title: 'Item 2', image: require('../../assets/icons/gift/Banner-JajaAuto2.jpg') },
                        { title: 'Item 3', image: require('../../assets/icons/gift/Banner-JajaAuto1.jpg') },
                    ]} />
                </View>

                <View style={{ width: '95%', height: 110, borderRadius: 15, backgroundColor: '#FFF', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: '4%', marginBottom: '2%' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setSelecteds('new')}>
                                <Text style={[styled.text, selecteds === 'new' && styled.selected]}>Mobil Baru</Text>
                                {selecteds === 'new' && <View style={{ borderBottomWidth: 2, borderColor: '#01A0D7', marginTop: 5, width: 150 }} />}
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '80%', width: 1, backgroundColor: '#01A0D7' }} />

                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => setSelecteds('used')}>
                                <Text style={[styled.text, selecteds === 'used' && styled.selected]}>Mobil Bekas</Text>
                                {selecteds === 'used' && <View style={{ borderBottomWidth: 2, borderColor: '#01A0D7', marginTop: 5, width: 150 }} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }} onPress={handleFilterScreen}>
                        <TypingText />
                        <Image
                            source={require('../../assets/icons/Search.png')} style={{ width: 22, height: 22, marginRight: 15 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView stickyHeaderIndices={[3]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ backgroundColor: Platform.OS === 'ios' ? colors.White : null }}>
                <View style={{ backgroundColor: '#FFBE00', width: 140, marginTop: '5%', paddingVertical: 10, paddingLeft: 15, borderBottomRightRadius: 25, marginBottom: '3.5%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: RFValue(11), color: 'white' }}>Sedang Populer</Text>
                </View>
                <RecomandedCar />
            </ScrollView>
        </ScrollView>
    );
}

const CarouselSlider = ({ entries }) => {
    const carouselRef = useRef(null);

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <FastImage
                    source={item.image} // no uri here
                    style={{ width: '95%', height: imageHeight, borderRadius: 15 }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    }

    return (
        <View>
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
    );
}


const styled = StyleSheet.create({
    text: {
        fontFamily: 'Poppins-Regular',
        fontSize: RFValue(12),
        color: '#A0A0A0',
        textAlign: 'center'
    },
    selected: {
        fontFamily: 'Poppins-Regular',
        color: '#A0A0A0',
    },
});
