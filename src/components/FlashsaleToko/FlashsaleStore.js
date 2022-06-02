import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, colors, Wp, useFocusEffect, Utils, ServiceCore, ServiceProduct } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import CountdownStore from './CountdownStore'

export default function FlashsaleComponent(props) {
    console.log("🚀 ~ file: FlashsaleToko.js ~ line 11 ~ FlashsaleComponent ~ props", props.data)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashFlashsale = useSelector(state => state.dashboard.flashsale)
    const reduxShowFlashsale = useSelector(state => state.dashboard.showFlashsale)

    const reduxAuth = useSelector(state => state.auth.auth)


    useEffect(() => {
        console.log("flashsalee")
        ServiceCore.getDateTime().then(res => {
            if (res) {
                let date = new Date()
                // if (date.toJSON().toString().slice(0, 10) !== res.dateNow) {
                //     Alert.alert(
                //         "Peringatan!",
                //         `Sepertinya tanggal tidak sesuai!`,
                //         [
                //             { text: "OK", onPress: () => navigation.goBack() }
                //         ],
                //         { cancelable: false }
                //     );
                // } else {
                ServiceCore.getFlashsale().then(resp => {
                    if (resp && resp.flashsale && resp.flashsale.length) {
                        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: true })
                        dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                    } else {
                        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
                    }
                })
                // }
            }
        })
    }, [])


    useFocusEffect(
        useCallback(() => {
            // ServiceCore.getDateTime().then(res => {
            //     if (res) {
            //         let date = new Date()
            //         if (date.toString().slice(0, 10) !== res.dateNow) {
            //             Alert.alert(
            //                 "Peringatan!",
            //                 `Sepertinya tanggal tidak sesuai!`,
            //                 [
            //                     { text: "OK", onPress: () => navigation.goBack() }
            //                 ],
            //                 { cancelable: false }
            //             );
            //         }
            //     }
            // })
        }, []),
    );



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
        <>
            {props.data ?
                <View style={[styles.column, styles.p_3, { backgroundColor: colors.RedFlashsale }]}>
                    <View style={[styles.row_between_center, styles.mb_2,]}>
                        <View style={[styles.row_start_center]}>
                            <View style={[styles.row_center, { height: Wp('6%') }]}>
                                <Text style={[styles.flashsale, styles.ml_2, { marginRight: '-1%', height: '100%' }]}>
                                    F
                                </Text>
                                <Image style={[styles.icon_14, { tintColor: colors.White, marginRight: '-1%' }]} source={require('../../assets/icons/flash.png')} />
                                <Text style={[[styles.flashsale, { height: '100%' }]]}>
                                    ashsale
                                </Text>
                            </View>
                            <CountdownStore size={11} wrap={6} home={true} />
                        </View>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('Flashsale')}>
                            <Text style={[{ fontSize: 13, fontFamily: 'SignikaNegative-SemiBold', color: colors.White }]}>
                                Lihat Semua <Image source={require('../../assets/icons/play.png')} style={[styles.icon_10, { tintColor: colors.White }]} />
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                    {props.data && props.data.length ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={props.data}
                            horizontal={true}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center', elevation: 2 }]}
                                        onPress={() => handleShowDetail(item, false)} >
                                        <FastImage
                                            style={[Ps.imageProduct, { height: Wp('33%'), width: '100%' }]}
                                            source={{
                                                uri: item.image,
                                                headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'center', alignItems: 'flex-start' }]}>
                                            <Text
                                                numberOfLines={1}
                                                style={Ps.name_product}>
                                                {item.name}
                                            </Text>
                                            <View style={styles.row}>
                                                <Text style={[Ps.priceBefore, styles.mr_3,]}>{item.price}</Text>
                                                <Text style={{ fontSize: 10, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '1%', paddingHorizontal: '5%', borderRadius: 2 }}>{item.discountFlash}%</Text>

                                            </View>
                                            <Text style={[Ps.priceAfter, { color: colors.RedFlashsale }]}>{item.priceDiscountFlash}</Text>

                                        </View>
                                        <View style={{ flex: 0, width: '95%', alignSelf: 'center', height: Wp('4%'), justifyContent: 'center', marginTop: '1%' }}>
                                            <View style={{
                                                borderRadius: 100,
                                                borderColor: colors.RedFlashsale,
                                                backgroundColor: colors.RedFlashSoft,
                                                borderWidth: 0.5,
                                                height: '90%',
                                                width: "100%",

                                            }}>
                                                <View style={{
                                                    backgroundColor: colors.RedFlashsale,
                                                    // borderRadius: 100,
                                                    borderTopLeftRadius: 100,
                                                    borderBottomLeftRadius: 100,
                                                    borderTopRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 97 ? 0 : 100,
                                                    borderBottomRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 97 ? 0 : 100,
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
                                            source={require('../../assets/images/JajaId.png')}
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
                </View > : null}
        </>
    )
}
