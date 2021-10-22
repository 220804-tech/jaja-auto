import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, Wp, Hp, colors, Ts, RFValue } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function TrendingComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashTrending = useSelector(state => state.dashboard.trending)
    const [storagedashTrending, setstoragedashTrending] = useState([])
    const [auth, setAuth] = useState("")
    const [shimmerData] = useState(['1X', '2X', '3X'])

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
        getStorage()
    }, [])
    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
        dispatch({ type: 'SET_SLUG', payload: item.slug })
        navigation.push("Product", { slug: item.slug, image: item.image })
    }


    const getStorage = () => {
        EncryptedStorage.getItem('dashtrending').then(res => {
            if (res) {
                setstoragedashTrending(JSON.parse(res))
            }
        })
    }
    return (
        <View style={[styles.column, styles.p_3]}>
            <View style={[styles.row, styles.mb_3]}>
                <Text style={styles.titleDashboard}>
                    Sedang Trending
                </Text>
            </View>
            {reduxdashTrending && reduxdashTrending.length || storagedashTrending && storagedashTrending.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxdashTrending && reduxdashTrending.length ? reduxdashTrending : storagedashTrending && storagedashTrending.length ? storagedashTrending : []}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleShowDetail(item)}
                                style={Ts.cardtrnding}
                                key={index}>
                                <FastImage
                                    style={Ts.trendingImage}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{ marginLeft: '0.5%', width: '65%', flexDirection: 'column' }}>
                                    <Text
                                        numberOfLines={2}
                                        style={[styles.font_11, { width: '85%' }]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.font_7, { color: colors.BlackGrey }]}
                                    >
                                        {item.totalSeen + " Mengunjungi"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
                :
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        shimmerData.map(item => {
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[Ts.cardtrnding]}>
                                    <FastImage
                                        style={[Ts.trendingImage, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: colors.Silver }]}
                                        source={require('../../assets/images/JajaId.png')}
                                        tintColor={colors.White}
                                        resizeMode={FastImage.resizeMode.center}
                                    />
                                    <View style={{ marginLeft: 5, width: '65%', flexDirection: 'column' }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('21%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 1, marginBottom: '2%' }}

                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('15%')}
                                            height={Wp("3.5%")}
                                            style={{ borderRadius: 1, marginBottom: '6%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('21%')}
                                            height={Wp("3%")}
                                            style={{ borderRadius: 1 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>

                                    {/* </View> */}
                                    {/* <View style={[Ps.bottomCard, styles.mt_2, { alignSelf: 'flex-start' }]}>
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
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('31%')}
                                            height={Wp("5%")}
                                            style={{ borderRadius: 100 }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View> */}
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            }
        </View>
    )
}
