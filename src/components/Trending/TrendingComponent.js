import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, Wp, Hp, colors, Ts, RFValue, ServiceProduct, Utils, HeaderTitleHome } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function TrendingComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashTrending = useSelector(state => state.dashboard.trending)
    const [storagedashTrending, setstoragedashTrending] = useState([])
    const [shimmerData] = useState(['1X', '2X', '3X'])
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoad = useSelector(state => state.product.productLoad)

    useEffect(() => {
        getStorage()
    }, [])

    const handleShowDetail = async (item, status) => {
        let error = true;
        try {
            if (!reduxLoad) {
                !status ? await navigation.push("Product") : null
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
                    error = false
                    if (res === 404) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        navigation.goBack()
                    } else if (res?.data) {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                        dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                        setTimeout(() => dispatch({ type: 'SET_FILTER_LOCATION', payload: true }), 7000);
                    }
                })
            } else {
                error = false
            }
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
            error = false
            console.log(error.message)

        }
        setTimeout(() => {
            if (error) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                Utils.handleSignal()
                setTimeout(() => Utils.alertPopUp('Sedang memuat ulang..'), 2000);
                error = false
                handleShowDetail(item, true)
            }
        }, 20000);
    }

    const getStorage = () => {
        EncryptedStorage.getItem('dashtrending').then(res => {
            if (res) {
                setstoragedashTrending(JSON.parse(res))
            }
        })
    }
    return (
        <View style={[styles.column, styles.pt_3, styles.pb_3, { backgroundColor: colors.BlueJaja }]}>
            <View style={[styles.column, { backgroundColor: colors.White }]}>
                <HeaderTitleHome title='Sedang Trending' />
                <View style={[styles.column, styles.px_3, styles.pt_2, styles.pb_3]}>
                    {reduxdashTrending && reduxdashTrending.length || storagedashTrending && storagedashTrending.length ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={reduxdashTrending && reduxdashTrending.length ? reduxdashTrending : storagedashTrending && storagedashTrending.length ? storagedashTrending : []}
                            horizontal={true}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleShowDetail(item, false)}
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
                                        <View style={{ flex: 0, marginLeft: '0.5%', width: '65%', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Text numberOfLines={2} style={[styles.font_10, styles.mb_5, { width: '85%', color: colors.BlueJaja }]} >
                                                {item.name}
                                            </Text>
                                            <Text numberOfLines={1} style={[styles.font_7, { color: colors.YellowJaja }]} >
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
            </View>
        </View>
    )
}
