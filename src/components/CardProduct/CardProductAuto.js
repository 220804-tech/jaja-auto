import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, FastImage, Ps, ServiceProduct, styles, useNavigation, Wp, ServiceProductAuto } from '../../export';
import ImageProgress from 'react-native-image-progress';
import { RFValue } from "react-native-responsive-fontsize";


function formatRupiah(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Membuat Card sebagai component terpisah, dan membungkusnya dengan React.memo
const ProductCard = React.memo(({ item, handleShowDetail }) => {
    const totalPrice = useMemo(() => item.price ? formatRupiah(item.price) : "", [item.price]);

    return (
        <TouchableOpacity
            onPress={() => handleShowDetail(item, false)}
            style={[Ps.cardProductAuto, styles.shadow_3, { shadowColor: colors.BlueJaja }]}
            key={item.id}>

            <View style={[styles.column, { height: Wp('35%'), width: Wp('44%'), borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
                <ImageProgress
                    renderImage={props => <FastImage {...props} />}
                    renderError={() => <Image source={require('../../assets/ilustrations/CarNotFound.png')} style={{ width: 130, height: 90 }} />}
                    source={{ uri: item.image ? item.image : item.images }}
                    style={Ps.imageProductAuto}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>

            <View style={[Ps.bottomCardAuto]}>
                <View>
                    <View style={{ width: 90, height: 25, borderRadius: 5, backgroundColor: '#3C78FC', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2%', flexDirection: 'row' }}>
                        <Image source={require('../../assets/images/modal/JajaAuto.png')} style={{ width: 67, height: 13, tintColor: colors.White }} />
                    </View>

                    <Text numberOfLines={1} style={[Ps.nameProductAuto, { width: Wp('40%') }]}>
                        {item.model}
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: '-3%' }}>
                        <Text adjustsFontSizeToFit style={[{ color: '#A0A0A0', fontSize: RFValue(10), fontFamily: 'Poppins-Medium' }]}>
                            {item.color}
                        </Text>
                        <View style={{ borderLeftWidth: 1.5, borderLeftColor: '#D9D9D9', height: 11, marginHorizontal: 7, alignSelf: 'center' }}></View>
                        <Text adjustsFontSizeToFit style={[{ color: '#A0A0A0', fontSize: RFValue(10), fontFamily: 'Poppins-Medium' }]}>
                            10000-50000 km
                        </Text>
                    </View>

                    <Text style={[{
                        width: Wp('40%'), fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        alignSelf: 'flex-start',
                        color: '#A0A0A0',
                        width: Wp("30%"),
                        marginTop: '7%',
                        fontSize: RFValue(10.5)
                    }]}>
                        Mulai dari
                    </Text>
                </View>

                <View>
                    <Text adjustsFontSizeToFit style={[Ps.priceAuto]}>RP.{totalPrice} </Text>
                </View>

            </View>

        </TouchableOpacity>
    );
});

export default function CardProductAuto(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const reduxLoad = useSelector(state => state.product.productLoad);
    const reduxAuth = useSelector(state => state.auth.auth);

    let needReload = true;

    const handleShowDetail = (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                if (!props.gift) {
                    navigation.push('ProductAuto');
                } else {
                    navigation.push('GiftDetails');
                }

                ServiceProductAuto.getProduct(reduxAuth, item.slug)
                    .then((res) => {
                        dispatch({ type: 'SET_DETAIL_PRODUCT_AUTO', payload: res });
                        needReload = false; // set penanda jika data sudah di-fetch
                    })
                    .catch((error) => {
                        error = false;
                        console.log(error.message);
                    });
            } else {
                error = false;
            }
            setTimeout(() => { }, 11000);
        } catch (error) {
            alert(String(error.message));
            error = false;
        }
        setTimeout(() => {
            if (error && needReload) {
                // cek apakah perlu memanggil fungsi tersebut lagi
                handleShowDetail(item, true);
            }
        }, 15000);
    };

    const renderItem = ({ item }) => <ProductCard item={item} handleShowDetail={handleShowDetail} />;

    const keyExtractor = useCallback((item, index) => item.id ? item.id.toString() : `default-id-${index}`, []);

    const ITEM_HEIGHT = Wp('41%');
    const getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

    return (
        <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={10}
            data={props.data}
            numColumns={2}
            scrollEnabled={props?.scroll === 1 ? false : true}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ flex: 0, width: Wp('100%'), justifyContent: 'center', alignSelf: 'center' }}
            renderItem={renderItem}
            extraData={props.data}
        />
    );
}


