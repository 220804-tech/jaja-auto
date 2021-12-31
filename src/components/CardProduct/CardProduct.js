import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors, FastImage, Ps, ServiceProduct, styles, useNavigation, Wp } from '../../export'
const { height: hg } = Dimensions.get('screen')

export default function CardProduct(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [img, setImg] = useState(require('../../assets/images/JajaId.png'))
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)

    const handleShowDetail = item => {
        console.log("🚀 ~ file: CardProductComponent.js ~ line 15 ~ CardProductComponent ~ item", item)
        dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
        if (!props.gift) {
            navigation.navigate("Product")
        } else {
            dispatch({ type: 'SET_GIFT', payload: item })
            dispatch({ type: 'SET_PRODUCT_TEMPORARY', payload: {} })
            dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
            navigation.navigate("GiftDetails")
        }
        dispatch({ type: 'SET_PRODUCT_TEMPORARY', payload: item })
        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
        dispatch({ type: 'SET_SLUG', payload: item.slug })

        ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
            if (res && res?.status?.code === 400) {
                Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                navigation.goBack()
            } else {
                dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                setTimeout(() => dispatch({ type: 'SET_PRODUCT_LOAD', payload: false }), 500);
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
            }
        })

    }

    useEffect(() => {
        // dispatch({ type: 'SET_DASHRECOMMANDED', payload: [] })
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => handleShowDetail(item)}
                style={[Ps.cardProduct, { marginRight: '3.5%' }]}
                key={index}>
                {item.isDiscount ? <Text adjustsFontSizeToFit style={Ps.textDiscount}>{item.discount}%</Text> : null}
                <View style={[styles.column, { height: Wp('44%'), width: Wp('44%'), borderTopLeftRadius: 3, borderTopRightRadius: 3 }]}>
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
                                <Text adjustsFontSizeToFit style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                {item.isFlashsale ? <Image style={[styles.icon_16, { tintColor: colors.RedFlashsale, marginTop: '-1.5%', marginLeft: '2%' }]} source={require('../../assets/icons/flash.png')} /> : null}
                            </View>
                        </>
                        :
                        <Text adjustsFontSizeToFit style={[Ps.price, { color: colors.BlueJaja }]}>{item.price}</Text>
                    }
                </View>
                <View style={[Ps.cardBottom, styles.py]}>
                    {item.amountSold && item.amountSold > 0 ?
                        <View style={[Ps.location]}>
                            <Text adjustsFontSizeToFit style={[Ps.locarionName]}>Terjual {item.amountSold}</Text>
                        </View> : null
                    }
                    <View style={[Ps.location]}>
                        <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                        <Text adjustsFontSizeToFit style={[Ps.locarionName]}>{item.location}</Text>
                    </View>
                    {/* {item.freeOngkir == 'Y' ?
                                <View style={{ width: Wp('6%'), height: Wp('6%'), justifyContent: 'center' }}>
                                    <Image style={[{ width: '100%', height: '100%', margin: 0 }]} source={require('../../assets/icons/free-delivery.png')} />
                                </View>
                                : null} */}

                </View>
            </TouchableOpacity>

        )

    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - (hg * 0.80) || layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 0.05)
    }
    const loadMoreData = () => {
        if (reduxLoadmore === false) {
            dispatch({ 'type': 'SET_LOADMORE', payload: true })
        }
    }
    console.log("🚀 ~ file: CardProductComponent.js ~ line 55 ~ CardProductComponent ~ props.data", props.data.length)
    return (
        <FlatList
            // removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={6} // Reduce initial render amount
            // maxToRenderPerBatch={1} // Reduce number in each render batch
            // updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={7}
            data={props.data}
            numColumns={2}
            scrollEnabled={true}
            keyExtractor={(item, index) => String(item.id) + index + "XH"}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            // renderItem={renderItem}
            scrollViewProps={{
                refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
                onScroll: Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    Platform.OS === "android" ?
                        {
                            useNativeDriver: false,
                            listener: event => {
                                if (isCloseToBottom(event.nativeEvent)) {
                                    loadMoreData()
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
    )
}
