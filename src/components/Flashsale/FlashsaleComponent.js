import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, colors, Wp, useFocusEffect, Hp, ServiceCore } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { color } from 'react-native-reanimated'

export default function FlashsaleComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashFlashsale = useSelector(state => state.dashboard.flashsale)
    const reduxAuth = useSelector(state => state.auth.auth)


    useEffect(() => {
    }, [])


    useFocusEffect(
        useCallback(() => {
            ServiceCore.getDateTime().then(res => {
                if (res) {
                    let date = new Date()
                    if (date.toJSON().toString().slice(0, 10) !== res.dateNow) {
                        Alert.alert(
                            "Peringatan!",
                            `Sepertinya tanggal tidak sesuai!`,
                            [
                                { text: "OK", onPress: () => navigation.goBack() }
                            ],
                            { cancelable: false }
                        );
                    } else {
                        ServiceCore.getFlashsale().then(resp => {
                            if (resp) {
                                dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.flashsale })
                            }
                        })

                    }
                }
            })
        }, []),
    );



    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image, flashsale: true })
    }

    const [shimmerData] = useState(['1X', '2X', '3X'])

    return (
        <View style={styles.p_3}>
            <View style={styles.row_between_center}>
                <Text style={styles.flashsale}>
                    Flashsale
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Flashsale')}>
                    <Text style={[styles.font_12, { fontWeight: 'bold', color: colors.BlueJaja }]}>
                        Lihat Semua <Image source={require('../../assets/icons/play.png')} style={[styles.icon_10, { tintColor: colors.BlueJaja }]} />
                    </Text>
                </TouchableOpacity>
            </View>
            {reduxdashFlashsale && reduxdashFlashsale.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxdashFlashsale}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('57%'), alignItems: 'center' }]}
                                onPress={() => handleShowDetail(item)} >
                                <Text style={{ position: 'absolute', fontSize: 14, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '6%', paddingHorizontal: '3%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, }}>{item.discountFlash}%</Text>
                                <FastImage
                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%' }]}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={[Ps.bottomCard, { alignSelf: 'flex-start', width: '100%', height: Wp('18%'), justifyContent: 'center', alignItems: 'flex-start' }]}>
                                    <Text
                                        numberOfLines={1}
                                        style={Ps.nameProduct}>
                                        {item.name}
                                    </Text>
                                    <Text style={Ps.priceBefore}>{item.price}</Text>
                                    <Text style={Ps.priceAfter}>{item.priceDiscountFlash}</Text>

                                </View>
                                <View style={{ flex: 0, width: '95%', alignSelf: 'center', height: Wp('4%'), justifyContent: 'center', marginTop: '1%' }}>
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
                                            fontWeight: 'bold'
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
                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%', backgroundColor: colors.Silver, borderTopRightRadius: 10, borderTopLeftRadius: 10 }]}
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
