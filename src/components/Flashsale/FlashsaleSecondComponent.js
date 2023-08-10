import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { colors, FastImage, Ps, styles, Wp, Countdown, Utils, useNavigation, ServiceProduct } from '../../export'

export default function FlashsaleSecondComponent() {
    const reduxFlashsale = useSelector(state => state.dashboard.flashsale)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const reduxLoad = useSelector(state => state.product.productLoad)

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
            console.log(error.message)
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

    return (
        <View style={[styles.container]}>
            <FlatList
                data={reduxFlashsale}
                keyExtractor={(item, index) => String(index) + "FZ"}
                style={styles.my_5}
                renderItem={({ item }) => {

                    if (String(item.time_live) === '18:00') {
                        return (
                            <View onPress={() => handleShowDetail(item, false)} style={[styles.row_start_center, styles.mb_2, styles.px_2, { height: Wp('31.5%'), width: Wp('100%'), borderBottomWidth: 0.5, borderBottomColor: colors.Silver, backgroundColor: colors.White }]}>
                                <View style={[styles.row_center, { position: 'absolute', left: 0, top: 0, zIndex: 999, width: Wp('8%'), height: Wp('6.5%'), backgroundColor: colors.RedFlashsale, padding: '2%', borderBottomRightRadius: 5 }]}>
                                    <Text style={{ fontSize: 10, color: colors.White, fontFamily: 'SignikaNegative-SemiBold', backgroundColor: colors.RedFlashsale }}>{item.discountFlash}%</Text>
                                </View>
                                {/* <View style={[styles.column, { height: Wp('25%'), width: Wp('25%'), backgroundColor: colors.White, alignItems: 'center', justifyContent: 'center' }]}> */}
                                <FastImage
                                    style={{ height: Wp('25%'), width: Wp('25%'), borderRadius: 3 }}
                                    // onLoadStart={() => load = true}
                                    // onLoadEnd={() => load = false}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />

                                {/* </View> */}
                                <View style={[styles.column_between_center, styles.px_2, { width: Wp('77%'), height: Wp('25%'), alignItems: 'flex-start' }]}>
                                    <Text numberOfLines={2} style={[styles.font_13, styles.mb, { width: Wp('65%') }]}>{item.name}Et proident excepteur Lorem elit excepteur sint ad deserunt amet laborum.</Text>
                                    <Text style={[Ps.priceBefore, { fontSize: 10 }]}>{item.price}</Text>
                                    <Text style={[styles.font_14, styles.T_medium, { color: colors.RedFlashsale, marginTop: '-1.5%' }]}>{item.priceDiscountFlash}</Text>
                                    <View style={[styles.row_start, { width: '100%', marginTop: '-2.5%' }]}>
                                        <View style={{ flex: 0, width: '65%', alignSelf: 'center', height: Wp('4%'), justifyContent: 'center', marginRight: '3%' }}>
                                            <View style={{
                                                borderRadius: 100,
                                                borderColor: colors.RedFlashsale,
                                                backgroundColor: "#FFc9b9",
                                                borderWidth: 0.5,
                                                height: '90%',
                                                width: "100%",

                                            }}>
                                                <View style={{
                                                    backgroundColor: colors.RedFlashsale,
                                                    borderTopLeftRadius: 100,
                                                    borderBottomLeftRadius: 100,
                                                    borderTopRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 98 ? 0 : 100,
                                                    borderBottomRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 98 ? 0 : 100,
                                                    height: '100%',
                                                    width: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) + "%",

                                                }}>
                                                </View>
                                                <Text style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    bottom: 0,
                                                    alignSelf: "center",
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    color: "white",
                                                    marginTop: -1,
                                                    fontSize: 10,
                                                    fontFamily: 'SignikaNegative-SemiBold'
                                                }}
                                                >{item.amountSold} Terjual</Text>
                                            </View>
                                        </View>
                                        <Button onPress={() => handleShowDetail(item, false)} mode="contained" color={colors.RedFlashsale} style={{ width: '25%', height: Wp('9%') }} labelStyle={[styles.font_10, styles.T_semi_bold, { color: colors.White, padding: 0 }]}>
                                            Beli
                                        </Button>
                                    </View>

                                </View>
                            </View>
                        )
                    }
                }}
            />
        </View>
    )
}
