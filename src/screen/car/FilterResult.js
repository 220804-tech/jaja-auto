import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { FastImage, Ps, useNavigation, ServiceProductAuto } from '../../export';
import { useDispatch, useSelector } from 'react-redux';
import ImageProgress from 'react-native-image-progress';
import { RFValue } from "react-native-responsive-fontsize";



const FilterResult = ({ route }) => {
    const { result, selectedBrand } = route.params;
    console.log(selectedBrand)
    const reduxAuth = useSelector(state => state.auth.auth);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // FORMAT PRICE
    function formatRupiah(num) {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // FORMAT MODEL
    const getDisplayedModel = (model) => {
        const words = model.split(' ');
        if (words.length > 2) {
            return words.slice(0, 2).join(' ') + '...';
        }
        return model;
    };


    // MASUK DETAIL RESULTFILTER
    const handleShowDetail = (item, status) => {
        try {
            navigation.push("ProductAuto", { slug: item.slug });

            ServiceProductAuto.getProduct(reduxAuth, item.slug)
                .then(res => {
                    dispatch({ type: 'SET_DETAIL_PRODUCT_AUTO', payload: res });
                })
                .catch(error => {
                    console.log(error.message);
                });
        } catch (error) {
            alert(String(error.message));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchResultsWrapper}>
                <Text style={styles.searchResultsText}>
                    {`Hasil pencarian untuk ${selectedBrand}`}
                </Text>
            </View>

            <FlatList
                data={result.data}
                keyExtractor={(item, index) => index.toString()}  // Assuming that the index can serve as unique key
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => handleShowDetail(item, false)}
                    >
                        <View style={styles.card}>
                            <View style={styles.imageWrapper}>
                                <ImageProgress
                                    renderImage={props => <FastImage {...props} />}
                                    renderError={() => <Image source={require('../../assets/ilustrations/CarNotFound.png')} style={{ width: 130, height: 90 }} />}
                                    source={{ uri: item.images && item.images[0] ? item.images[0].imagePath : undefined }}
                                    style={styles.image}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </View>

                            <View style={styles.textWrapper}>
                                <View>
                                    <View>
                                        <Text style={styles.model}>{getDisplayedModel(item.model).toUpperCase()}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <View style={styles.colorBox}>
                                            <Text style={styles.colorText}>Black</Text>
                                        </View>

                                        <View style={styles.colorBox}>
                                            <Text style={styles.colorText}>Manual</Text>
                                        </View>
                                    </View>

                                    <View style={styles.colorBox2}>
                                        <Text style={styles.colorText}>10000-50000 km</Text>
                                    </View>

                                    <View style={styles.priceWrapper}>
                                        <Text style={styles.startingFromText}>Mulai dari</Text>
                                        <Text style={styles.price}>{formatRupiah(item.price)}/bulan</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchResultsWrapper: {
        backgroundColor: '#01A0D7',
        paddingVertical: 15,
        marginBottom: '5%'
    },
    searchResultsText: {
        color: '#ffff',
        fontSize: RFValue(12),
        fontFamily: 'Poppins-Medium',
        textAlign: 'center'
    },
    touchableOpacity: {
        marginHorizontal: 15, marginBottom: '3%'
    },
    card: {
        width: '100%',
        height: 190,
        borderRadius: 15,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    imageWrapper: {
        alignSelf: 'center',
        marginTop: 7
    },
    image: {
        width: 170,
        height: 200
    },
    textWrapper: {
        paddingTop: '5%',
        paddingHorizontal: '5%'
    },
    model: {
        color: '#130F26',
        fontSize: RFValue(13),
        fontFamily: 'Poppins-SemiBold'
    },
    colorBox: {
        width: '30%',
        height: 28,
        backgroundColor: '#3C78FC',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
        marginTop: 5
    },
    colorBox2: {
        marginTop: 7,
        width: '63%',
        height: 28,
        backgroundColor: '#3C78FC',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorText: {
        color: '#ffff',
        fontSize: RFValue(10),
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    },
    priceWrapper: {
        marginTop: '9%'
    },
    startingFromText: {
        color: '#A0A0A0',
        fontSize: RFValue(12),
        fontFamily: 'Poppins-Medium',
    },
    price: {
        color: '#130F26',
        fontSize: RFValue(12),
        fontFamily: 'Poppins-SemiBold'
    }
});

export default FilterResult;
