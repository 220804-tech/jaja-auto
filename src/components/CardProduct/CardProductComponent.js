import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import { colors, FastImage, Ps, styles, useNavigation, Wp } from '../../export'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { Item } from 'react-native-paper/lib/typescript/components/List/List'

export default function CardProductComponent(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [img, setImg] = useState(require('../../assets/images/JajaId.png'))

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }
    useEffect(() => {
        // dispatch({ type: 'SET_DASHRECOMMANDED', payload: [] })
    }, [])

    FastImage.preload([
        {
            uri: 'https://picsum.photos/700',
            headers: { Authorization: 'someAuthToken' },
        },
        {
            uri: 'https://picsum.photos/700',
            headers: { Authorization: 'someAuthToken' },
        },
    ])

    return (
        <FlatList
            removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={1} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={7}
            data={props.data}
            numColumns={2}
            scrollEnabled={true}
            keyExtractor={(item, index) => String(item.id) + index + "XH"}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item, index }) => {
                return (
                    <>
                        {!item.loading ?
                            <TouchableOpacity
                                onPress={() => handleShowDetail(item)}
                                style={[Ps.cardProduct, { marginRight: '3.5%' }]}
                                key={index}>
                                {item.isDiscount ? <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                <View style={[styles.column, { height: Wp('44%'), width: Wp('44%'), borderTopLeftRadius: 3, borderTopRightRadius: 3 }]}>
                                    <FastImage
                                        style={Ps.imageProduct}
                                        source={{
                                            uri: item.image,
                                            headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    {item.freeOngkir == 'Y' ?
                                        <View style={[styles.font_14, styles.px_5, styles.py, { position: 'absolute', bottom: 0, backgroundColor: colors.RedFlashsale, borderTopRightRadius: 11, justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={[styles.font_10, styles.T_medium, { marginBottom: '-2%', marginLeft: '-1.5%', color: colors.White }]}>Gratis Ongkir</Text>
                                        </View>
                                        : null
                                    }

                                </View>
                                <View style={Ps.bottomCard}>
                                    <Text
                                        numberOfLines={2}
                                        style={Ps.nameProduct}>
                                        {item.name}
                                    </Text>
                                    {item.isDiscount ?
                                        <>
                                            <Text style={Ps.priceBefore}>{item.price}</Text>
                                            <View style={styles.row_start_center}>
                                                <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                                {item.isFlashsale ? <Image style={[styles.icon_16, { tintColor: colors.RedFlashsale, marginTop: '-1.5%', marginLeft: '2%' }]} source={require('../../assets/icons/flash.png')} /> : null}
                                            </View>
                                        </>
                                        :
                                        <Text style={[Ps.price, { color: colors.BlueJaja }]}>{item.price}</Text>
                                    }
                                </View>
                                <View style={[Ps.cardBottom, styles.py]}>
                                    <View style={[Ps.location]}>
                                        <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                        <Text style={[Ps.locarionName]}>{item.location}</Text>
                                    </View>
                                    {/* {item.freeOngkir == 'Y' ?
                                        <View style={{ width: Wp('6%'), height: Wp('6%'), justifyContent: 'center' }}>
                                            <Image style={[{ width: '100%', height: '100%', margin: 0 }]} source={require('../../assets/icons/free-delivery.png')} />
                                        </View>
                                        : null} */}

                                </View>
                            </TouchableOpacity>
                            :
                            null
                        }
                    </>
                )
            }}
        />
    )
}
