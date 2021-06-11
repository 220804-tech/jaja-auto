
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Card, Ps, Wp, FastImage, CheckSignal } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function CardProduct() {
    const [shimmerData] = useState(['1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X'])

    return (
        <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {
                shimmerData.map(item => {
                    return (
                        <TouchableOpacity
                            style={Ps.cardProduct}
                            key={item}>
                            <FastImage
                                style={[Ps.imageProduct, styles.mb_2, { backgroundColor: colors.Silver }]}
                                source={require('../../assets/images/JajaId.png')}
                                resizeMode={FastImage.resizeMode.contain}
                                tintColor={colors.White}

                            />
                            {/* <Image source={require('../../assets/images/JajaId.png')} style={[Ps.imageProduct, { resizeMode: 'center', tintColor: colors.White, backgroundColor: colors.Silver }]} /> */}
                            <View style={Ps.bottomCard}>
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
                                <View style={Ps.location}>
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