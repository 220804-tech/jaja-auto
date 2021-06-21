
import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { styles, colors, Ps, Wp, FastImage } from '../../export'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function CardProduct() {
    const [shimmerData] = useState(['1X', '2X', '3X', '4X'])

    return (
        <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {
                shimmerData.map(item => {
                    return (
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
                                <View style={{ position: 'absolute', bottom: 0, padding: '3%' }}>
                                    {/* <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} /> */}
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

                    )
                })
            }

        </ScrollView>
    )

}