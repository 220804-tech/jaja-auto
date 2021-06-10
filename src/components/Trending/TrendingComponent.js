import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, Wp, Hp, colors, ServiceProduct, Ts } from '../../export'
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
    const handleShowDetail = async item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }


    const getStorage = () => {
        EncryptedStorage.getItem('dashtrending').then(res => {
            if (res) {
                setstoragedashTrending(JSON.parse(res))
            }
        })
    }
    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
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
                                key={index}
                            >
                                {/* wilayah view */}

                                <FastImage
                                    style={Ts.trendingImage}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={{ marginLeft: 5, width: '65%', flexDirection: 'column' }}>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            width: '50%',
                                            fontSize: 12,
                                            fontFamily: 'Lato-Bold',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 4,
                                            fontSize: Hp("1.4%"),
                                            width: '95%',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                            color: colors.BlackGrey,
                                        }}
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
