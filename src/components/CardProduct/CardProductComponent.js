import React, { useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors, FastImage, Ps, ServiceProduct, styles, useNavigation, Wp, useFocusEffect, Utils } from '../../export'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default function CardProductComponent(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoad = useSelector(state => state.product.productLoad)



    // useFocusEffect(
    //     useCallback(() => {

    //     }, []),
    // );

    const handleShowDetail = (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                if (!props.gift) {
                    navigation.push("Product")
                } else {
                    navigation.push("GiftDetails")
                }
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
                }).catch(err => {
                    dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                    error = false
                })
            } else {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                error = false
            }
            setTimeout(() => {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            }, 11000);
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
        }, 15000);
    }


    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => handleShowDetail(item, false)}
                style={[Ps.cardProduct, styles.shadow_5, { shadowColor: colors.BlueJaja }]}
                key={index}>
                {item.isDiscount ? <Text adjustsFontSizeToFit style={Ps.textDiscount}>{item.discount}%</Text> : null}
                <View style={[styles.column, { height: Wp('44%'), width: Wp('44%'), borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
                    {
                        item?.image && item.image !== null && String(item.image).includes('http') ?
                            <FastImage

                                style={Ps.imageProduct}
                                source={{
                                    uri: item.image,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            :
                            <FastImage
                                style={Ps.imageProduct}
                                source={require('../../assets/images/JajaId.png')}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                    }


                    {item.freeOngkir == 'Y' ?
                        <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.RedFlashsale, borderTopRightRadius: 11, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text adjustsFontSizeToFit style={[styles.font_10, styles.T_medium, { marginBottom: '-2%', marginLeft: '-1.5%', color: colors.White }]}>Gratis Ongkir</Text>
                        </View>
                        : null
                    }

                </View>
                <View style={Ps.bottomCard}>
                    <Text
                        numberOfLines={2}
                        style={[Ps.nameProduct, { width: Wp('40%') }]}>
                        {item.name}
                    </Text>
                    {item.isDiscount ?
                        <>
                            <Text adjustsFontSizeToFit style={Ps.priceBefore}>{item.price}</Text>
                            <View style={styles.row_start_center}>
                                <Text adjustsFontSizeToFit style={[Ps.price, { color: colors.YellowJaja }]}>{item.priceDiscount}</Text>
                                {item.isFlashsale ? <Image style={[styles.icon_16, { tintColor: colors.RedFlashsale, marginTop: '-1.5%', marginLeft: '2%' }]} source={require('../../assets/icons/flash.png')} /> : null}
                            </View>
                        </>
                        :
                        <Text adjustsFontSizeToFit style={[Ps.price, { color: colors.YellowJaja }]}>{item.price}</Text>
                    }
                </View>
                <View style={[Ps.cardBottom, styles.py]}>
                    {item.amountSold && item.amountSold > 0 ?
                        <View style={[Ps.location, styles.mb]}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[Ps.locarionNameSmall]}>Terjual {item.amountSold}</Text>
                        </View> : null
                    }
                    <View style={[Ps.location]}>
                        <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                        <Text adjustsFontSizeToFit numberOfLines={1} style={[Ps.locarionNameSmall]}>{item.location}</Text>
                    </View>

                    {/* {item.freeOngkir == 'Y' ?
                                <View style={{ width: Wp('6%'), height: Wp('6%'), justifyContent: 'center' }}>
                                    <Image style={[{ width: '100%', height: '100%', margin: 0 }]} source={require('../../assets/icons/free-delivery.png')} />
                                </View>
                                : null} */}

                </View>
            </TouchableOpacity >

        )

    }


    const keyExtractor = useCallback((item, index) => index + 'XD', [])
    const ITEM_HEIGHT = Wp('41%')
    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    );

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
    )
}
