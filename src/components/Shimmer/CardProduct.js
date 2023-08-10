
import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { colors, Ps, Wp, FastImage } from '../../export'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function CardProduct() {
    const [shimmerData] = useState(['1X', '2X', '3X', '4X'])
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={Ps.shimmerCardProduct}
                key={item}>
                <FastImage
                    style={{
                        backgroundColor: colors.Silver,
                        width: Wp("44%"),
                        height: Wp("44%"),
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
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
    }
    return (
        <FlatList
            // removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={2} // Reduce initial render amount
            windowSize={10}
            data={shimmerData}
            numColumns={2}
            scrollEnabled={true}
            keyExtractor={item => String(item)}
            contentContainerStyle={{ flex: 0, width: Wp('100%'), justifyContent: 'center', alignSelf: 'center' }}
            renderItem={renderItem}
        />
    )

}