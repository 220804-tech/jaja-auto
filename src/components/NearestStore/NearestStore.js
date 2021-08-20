import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, useNavigation, FastImage, colors, Wp, useFocusEffect, } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import TextTicker from 'react-native-text-ticker'

export default function NearestStore() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashNearestStore = useSelector(state => state.dashboard.nearestStore)


    useEffect(() => {
    }, [])


    useFocusEffect(
        useCallback(() => {
        }, []),
    );



    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image, flashsale: true })
    }

    const [shimmerData] = useState(['1X', '2X', '3X'])

    return (
        <View style={[styles.column, styles.px_3, styles.py_4, { backgroundColor: colors.White }]}>
            <View style={[styles.row_between_center, styles.mb_3]}>
                <Text style={styles.titleDashboard}>
                    Berdasarkan Toko Terdekat
                </Text>
                {/* <TouchableOpacity onPress={() => handleCategory('Art Shop')}>
                    <Text style={[{ fontSize: 13, fontWeight: 'bold', color: colors.BlueJaja }]}>
                        Lihat Semua <Image source={require('../../assets/icons/play.png')} style={[styles.icon_10, { tintColor: colors.BlueJaja }]} />
                    </Text>
                </TouchableOpacity> */}
            </View>
            {reduxdashNearestStore && reduxdashNearestStore.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxdashNearestStore.slice(0, 20)}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center', elevation: 2 }]}
                                onPress={() => handleShowDetail(item)} >
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
                                    <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.BlueJaja, borderTopRightRadius: 11, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={[styles.font_8, { marginBottom: '-2%', color: colors.White }]}>Seller Terdekat</Text>
                                    </View>
                                </View>
                                <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                    <Text numberOfLines={1} style={[Ps.nameProduct, { fontSize: 13 }]}>{item.name}</Text>

                                    {item.isDiscount ?
                                        <>
                                            <View style={styles.row}>
                                                <Text style={[Ps.priceBefore, styles.mr_3,]}>{item.price}</Text>
                                                <Text style={{ fontSize: 10, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '1%', paddingHorizontal: '5%', borderRadius: 2 }}>{item.discount}%</Text>
                                            </View>
                                            <Text style={Ps.priceAfter}>{item.price}</Text>
                                        </>
                                        :
                                        <Text style={[Ps.price, { fontWeight: 'bold', color: colors.BlueJaja }]}>{item.price}</Text>
                                    }
                                </View>
                                <View style={[Ps.location, { width: '94%' }]}>
                                    <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                    <Text numberOfLines={1} style={[Ps.locarionName, { fontSize: 10, width: '85%' }]}>{item.location}</Text>
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
        </View >
    )
}
