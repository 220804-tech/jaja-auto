import React, { useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors, FastImage, Ps, ServiceProduct, styles, useNavigation, Wp, useFocusEffect, Uti, ServiceProductAuto } from '../../export'



export default function CardProductAuto(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()


    // const handleShowDetail = (item, status) => {
    //     let error = true;
    //     try {
    //         if (!reduxLoad) {
    //             if (!props.gift) {
    //                 navigation.push("ProductAuto")
    //             } else {
    //                 navigation.push("GiftDetails")
    //             }
    //             dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
    //             ServiceProductAuto.getProduct(reduxAuth, item.slug).then(res => {
    //                 console.log("🚀 ~ file: CardProductAuto.js ~ line 33 ~ ServiceProductAuto.getProduct ~ res", res)
    //                 error = false
    //                 if (res === 404) {
    //                     Utils.alertPopUp('Sepertinya data tidak ditemukan!')
    //                     dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //                     navigation.goBack()
    //                 } else if (res?.data) {
    //                     dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
    //                     dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //                     setTimeout(() => dispatch({ type: 'SET_FILTER_LOCATION', payload: true }), 7000);
    //                 }
    //             }).catch(error => {
    //                 dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //                 error = false
    //                 console.log(error.message)
    //             })
    //         } else {
    //             dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //             error = false
    //         }
    //         setTimeout(() => {
    //             dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //         }, 11000);
    //     } catch (error) {
    //         dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //         alert(String(error.message))
    //         error = false
    //     }
    //     setTimeout(() => {
    //         if (error) {
    //             dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
    //             Utils.handleSignal()
    //             setTimeout(() => Utils.alertPopUp('Sedang memuat ulang..'), 2000);
    //             error = false
    //             handleShowDetail(item, true)

    //         }
    //     }, 15000);
    // }


    const renderItem = ({ item, index }) => {

        const number = (item.subscription_cost);

        function formatRupiah(num) {
            return 'Rp' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        const totalPrice = formatRupiah(number)


        const models = (item.model);
        const capitalizedModel = models.toUpperCase();

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductAuto', { data: item })}
                style={[Ps.cardProductAuto, styles.shadow_3, { shadowColor: colors.BlueJaja }]}
                key={index}>
                {item.isDiscount && item.discount != '0' ? <Text adjustsFontSizeToFit style={Ps.textDiscount}>{item.discount}%</Text> : null}
                <View style={[styles.column, { height: Wp('44%'), width: Wp('44%'), borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
                    {
                        item?.image && item.image !== null && String(item.image).includes('http') || String(item.images) ?
                            <FastImage
                                style={Ps.imageProduct}
                                source={{
                                    uri: item.image ? item.image : item.images,
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
                        <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.RedFlashsale, borderTopRightRadius: 11, justifyContent: 'center', alignItems: 'center', paddingBottom: 4 }]}>
                            <Text adjustsFontSizeToFit style={[styles.font_10, styles.T_medium, { marginBottom: '-2%', marginLeft: '-1.5%', color: colors.White }]}>Gratis Ongkir</Text>
                        </View>
                        : null
                    }

                </View>
                <View style={Ps.bottomCardAuto}>
                    <Text
                        numberOfLines={2}
                        style={[Ps.nameProductAuto, { width: Wp('40%') }]}>
                        {capitalizedModel}
                    </Text>
                    <Text
                        style={[{
                            width: Wp('40%'), fontSize: 15,
                            fontFamily: 'SignikaNegative-SemiBold',
                            alignSelf: 'flex-start',
                            marginBottom: '2%',
                            color: colors.BlueJaja,
                            // backgroundColor: 'red',
                            width: Wp("30%"),
                        }]}>
                        Mulai dari
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
                        <Text adjustsFontSizeToFit style={[Ps.priceAuto, { color: colors.YellowJaja }]}>{totalPrice}/bulan </Text>
                    }
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
