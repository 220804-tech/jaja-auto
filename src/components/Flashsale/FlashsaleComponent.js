import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, colors, Wp } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function FlashsaleComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashFlashsale = useSelector(state => state.dashboard.flashsale)
    const [storagedashFlashsale, setstoragedashFlashsale] = useState([])

    useEffect(() => {
        getStorage()
    }, [])

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image, flashsale: true })
    }
    const getStorage = () => {
        EncryptedStorage.getItem('dashflashsale').then(res => {
            if (res) {
                setstoragedashFlashsale(JSON.parse(res))
            }
        })
    }
    const [shimmerData] = useState(['1X', '2X', '3X'])

    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.flashsale}>
                    Flashsale
                </Text>
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
                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('60%'), alignItems: 'center' }]}
                                onPress={() => handleShowDetail(item)} >
                                <Text style={{ position: 'absolute', fontSize: 14, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '6%', paddingHorizontal: '3%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, }}>{item.discount}%</Text>
                                <FastImage
                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%' }]}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={Ps.bottomCard}>
                                    <Text
                                        numberOfLines={1}
                                        style={Ps.nameProduct}>
                                        {item.name}
                                    </Text>
                                    <Text style={Ps.priceBefore}>{item.price}</Text>
                                    <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                </View>


                                <View style={{ flex: 0, width: '95%', alignItems: 'center', height: '18%', justifyContent: 'flex-start', marginTop: '1%' }}>
                                    <View style={{
                                        borderRadius: 100,
                                        borderColor: colors.RedFlashsale,
                                        backgroundColor: "#FFc9b9",
                                        borderWidth: 1,
                                        height: '45%',
                                        width: "100%",
                                        marginHorizontal: 8,
                                    }}>
                                        <View style={{
                                            backgroundColor: colors.RedFlashsale,
                                            borderTopLeftRadius: 100,
                                            borderBottomLeftRadius: 100,
                                            height: '100%',
                                            width: '10%',
                                        }}>
                                        </View>
                                        <Text style={{
                                            position: "absolute",
                                            alignSelf: "center",
                                            color: "white",
                                            marginTop: -1,
                                            fontSize: 13
                                        }}
                                        >1{item.amountSold} Terjual</Text>
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
                                style={[Ps.cardProduct, { marginRight: 11, width: Wp('33%'), height: Wp('60%'), alignItems: 'center' }]}>
                                <FastImage
                                    style={[Ps.imageProduct, { height: Wp('33%'), width: '100%', backgroundColor: colors.Silver, borderTopRightRadius: 10, borderTopLeftRadius: 10 }]}
                                    source={require('../../assets/images/JajaId.png')}
                                    tintColor={colors.White}
                                    resizeMode={FastImage.resizeMode.center}
                                />
                                <View style={[Ps.bottomCard, styles.mt_2, { alignSelf: 'flex-start' }]}>
                                    <View style={{ width: '95%', marginBottom: '5%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('31%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 1 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={{ width: '95%', marginBottom: '3%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('21%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 1 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={{ width: '95%', marginBottom: '6%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('25%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 1 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    {/* <View style={{ width: '100%' }}> */}
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        width={Wp('31%')}
                                        height={Wp("5%")}
                                        style={{ borderRadius: 100 }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    {/* </View> */}
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
