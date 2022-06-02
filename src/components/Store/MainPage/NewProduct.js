import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, useNavigation, FastImage, colors, Wp, useFocusEffect, ServiceProduct, Utils, } from '../../../export'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function NewProduct() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashNearestStore = useSelector(state => state.dashboard.nearestStore)
    const products = useSelector(state => state.store.newProduct)
    const loadingProduct = useSelector(state => state.store.loadNewProduct)

    const reduxAuth = useSelector(state => state.user.auth)
    const reduxLoad = useSelector(state => state.product.productLoad)



    // const handleShowDetail = item => {
    //     dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
    //     dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
    //     dispatch({ type: 'SET_SLUG', payload: item.slug })
    //     navigation.push("Product", { slug: item.slug, image: item.image })
    // }

    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                !status ? await navigation.push("Product") : null
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


    const [shimmerData] = useState(['1X', '2X', '3X'])

    return (
        <View style={[styles.column, styles.px_3, styles.py_4, { backgroundColor: colors.White }]}>
            {/* <View style={[styles.row_between_center, styles.mb_3]}>
                <Text style={styles.titleDashboard}>
                        Produk terbaru
                </Text>
            </View> */}

            {!loadingProduct ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={products.slice(0, 20)}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={[Ps.cardProductSmall]}
                                onPress={() => handleShowDetail(item, false)} >
                                <View style={[styles.column, { height: Wp('33%'), width: '100%' }]}>
                                    <FastImage
                                        style={[Ps.imageProduct, { height: '100%', width: '100%' }]}
                                        source={{
                                            uri: item.image,
                                            headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </View>
                                <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                    <Text numberOfLines={1} style={[Ps.nameProductSmall]}>{item.name}</Text>
                                    {item.isDiscount ?
                                        <>
                                            <View style={styles.row}>
                                                <Text style={[Ps.priceBeforeSmall, styles.mr_3,]}>{item.price}</Text>
                                                <Text style={[Ps.discountSmall, styles.T_medium,]}>{item.discount}%</Text>
                                            </View>
                                            <Text style={[Ps.priceSmall, { color: colors.YellowJaja }]}>{item.priceDiscount}</Text>
                                        </>
                                        :
                                        <Text style={[Ps.priceSmall, styles.T_semi_bold, { color: colors.YellowJaja }]}>{item.price}</Text>
                                    }
                                </View>
                                <View style={[Ps.location, { width: '94%' }]}>
                                    <Image style={Ps.locationIconSmall} source={require('../../../assets/icons/google-maps.png')} />
                                    <Text numberOfLines={1} style={[Ps.locarionNameSmall, { width: '85%' }]}>{item.location}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
                :
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {shimmerData.map(item => {
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center' }]}>
                                <FastImage
                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%', backgroundColor: colors.Silver, borderTopRightRadius: 3, borderTopLeftRadius: 3 }]}
                                    source={require('../../../assets/images/JajaId.png')}
                                    tintColor={colors.White}
                                    resizeMode={FastImage.resizeMode.center}
                                />
                                <View style={[Ps.bottomCard, styles.mt_3, { alignSelf: 'flex-start' }]}>
                                    <View style={{ width: '95%', marginBottom: '5%', paddingLeft: '0.5%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('31%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 2 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={{ width: '95%', marginBottom: '4%', paddingLeft: '0.5%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('21%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 2 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={{ width: '95%', marginBottom: '8%', paddingLeft: '0.5%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('25%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 2 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        width={Wp('31%')}
                                        height={Wp("3.8%")}
                                        style={{ borderRadius: 100 }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    })
                    }
                </ScrollView>

            }
        </View >
    )
}
