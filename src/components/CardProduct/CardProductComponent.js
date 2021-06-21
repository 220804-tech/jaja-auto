import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import { colors, FastImage, Ps, useNavigation, styles, Wp } from '../../export'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';

export default function CardProductComponent(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [img, setImg] = useState(require('../../assets/images/JajaId.png'))

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }


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
            keyExtractor={(item, index) => String(index) + "X"}
            onScroll={(e) => console.log("event ", e)}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item, index }) => {
                let load = false
                return (
                    <>
                        {!load ?
                            <TouchableOpacity
                                onPress={() => handleShowDetail(item)}
                                style={[Ps.cardProduct, { marginRight: '3.5%' }]}
                                key={index}>
                                {item.isDiscount ? <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                <FastImage
                                    style={Ps.imageProduct}
                                    onLoadStart={() => load = true}
                                    onLoadEnd={() => load = false}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />

                                <View style={Ps.bottomCard}>
                                    <Text
                                        numberOfLines={2}
                                        style={Ps.nameProduct}>
                                        {item.name}
                                    </Text>
                                    {item.isDiscount ?
                                        <>
                                            <Text style={Ps.priceBefore}>{item.price}</Text>
                                            <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                        </>
                                        :
                                        <Text style={Ps.price}>{item.price}</Text>
                                    }
                                </View>
                                <View style={Ps.location}>
                                    <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                    <Text style={Ps.locarionName}>{item.location}</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={Ps.cardProduct}
                                key={item}>
                                <FastImage
                                    style={[Ps.imageProduct, { backgroundColor: colors.Silver }]}
                                    source={require('../../assets/images/JajaId.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                    tintColor={colors.White}

                                />
                                <View style={[Ps.bottomCard, { height: Wp('31%') }]}>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        width={Wp('40%')}
                                        height={Wp("4%")}
                                        style={{ borderRadius: 1, marginBottom: '2%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        width={Wp('30%')}
                                        height={Wp("4%")}
                                        style={{ borderRadius: 1, marginBottom: '5%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        width={Wp('20%')}
                                        height={Wp("4%")}
                                        style={{ borderRadius: 1, marginBottom: '7%' }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <View style={{ position: 'absolute', bottom: 0, padding: '4%' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('30%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 1, marginBottom: '5%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                        }
                    </>
                )
            }}
        />
    )
}
