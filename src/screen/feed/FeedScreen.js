import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, SafeAreaView, RefreshControl } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { useDispatch, useSelector } from 'react-redux'
import { colors, styles, Utils, Wp, FastImage, useNavigation, ServiceProduct, Appbar } from '../../export'

export default function FeedScreen(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxLoad = useSelector(state => state.product.productLoad)


    const [refreshing, setrefreshing] = useState(false)
    const [data, setdata] = useState([])
    const [shimmerloading, setshimmerLoading] = useState(false)
    const [shimmerdata, setshimmerData] = useState([{ loading: true }, { loading: true }])



    useEffect(() => {
        handleFirstData()
        return () => {

        }
    }, [])




    const onRefresh = useCallback(() => {
        setrefreshing(true);
        updateData()
        setrefreshing(false);

    }, []);

    const handleFirstData = async () => {
        let result = await getData();
        setdata(result)

    }

    const getData = async (categoryName) => {
        try {
            // setrefreshing(true)
            let errorResponse = true
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            setTimeout(() => {
                if (errorResponse) {
                    Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
                }
            }, 22000);

            return await fetch(`https://jaja.id/backend/product/category/crafting?page=1&limit=100&keyword=&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.text())
                .then(json => {
                    errorResponse = false
                    let result = JSON.parse(json)
                    if (result?.status?.code === 200) {
                        return result.data.items
                    } else if (!result?.data?.items?.length) {
                        return []
                    } else {
                        Utils.alertPopUp(result?.status?.message)
                        return []
                    }
                    // setrefreshing(false)
                })
                .catch(error => {
                    // setrefreshing(false)
                    Utils.handleError(String(error), 'Error with status code : 51001')
                    errorResponse = false
                    return []
                });


        } catch (error) {
            // setrefreshing(false)
            Utils.alertPopUp(String(error), 'Error with status code : 51002')
        }
    }

    const updateData = () => {
        try {

        } catch (error) {

        }
    }

    const handleShowDetail = (item, status) => {
        console.log("🚀 ~ file: FeedScreen.js ~ line 100 ~ handleShowDetail ~ item", item)
        let error = true;
        try {
            if (!reduxLoad) {
                if (!props.gift) {
                    navigation.push("Product")
                } else {
                    navigation.push("GiftDetails")
                }
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
                }).catch(err => {
                    dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                    error = false
                })
            } else {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                error = false
            }
            setTimeout(() => {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            }, 11000);
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
            error = false
        }
        setTimeout(() => {
            if (error) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                Utils.handleSignal()
                setTimeout(() => Utils.alertPopUp('Sedang memuat ulang..'), 2000);
                error = false
                handleShowDetail(item, true)

            }
        }, 15000);
    }

    const renderItem = ({ item, index }) => {
        console.log("🚀 ~ file: FeedScreen.js ~ line 93 ~ renderItem ~ item", item)
        return (
            <View style={[styles.column_center, styles.mb_2, styles.shadow_3, { elevation: 1, shadowColor: colors.Silver, width: Wp('95%'), height: Wp('120%'), borderRadius: 3, backgroundColor: colors.White }]}>
                {item?.loading ?
                    <View style={styles.column_center}>
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={Wp('95%')}
                            height={Wp("95%")}
                            style={[styles.mb_2, { borderRadius: 3 }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={Wp('30%')}
                            height={Wp("5%")}
                            style={[styles.mb, { borderRadius: 2, alignSelf: 'flex-end' }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={Wp('35%')}
                            height={Wp("5%")}
                            style={[styles.mb_2, { borderRadius: 2, alignSelf: 'flex-start' }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            width={Wp('75%')}
                            height={Wp("5%")}
                            style={{ borderRadius: 2, alignSelf: 'flex-start' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View> :
                    <View style={[[styles.column_center, { width: Wp('95%'), height: Wp('95%') }]]}>
                        <View style={{ height: Wp('95%'), width: Wp('95%'), borderRadius: 3 }}>
                            <FastImage
                                source={{ uri: item.image }}
                                style={{ width: Wp('95%'), height: Wp('95%') }}
                                resizeMode={FastImage.resizeMode.contain}

                            />
                        </View>
                        <View style={[styles.row_between_center, styles.p_2, { width: '100%', height: Wp('25%'), }]}>
                            <View style={[styles.column_between_center, { alignItems: 'flex-start', width: '58%', height: '100%' }]}>
                                <Text numberOfLines={2} style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{item.name}</Text>
                                <View style={styles.row_start_center}>
                                    <FastImage
                                        source={require('../../assets/icons/google-maps.png')}
                                        style={styles.icon_14}
                                        tintColor={colors.YellowJaja}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.font_9, styles.ml_2]}>{item.location}</Text>

                                </View>
                            </View>
                            <View style={[styles.row_end, { width: '40%', height: '100%', }]}>
                                {/* <FastImage
                                    source={require('../../assets/icons/love.png')}
                                    style={styles.icon_21}
                                    tintColor={colors.BlueJaja}
                                    resizeMode={FastImage.resizeMode.contain}
                                /> */}
                                <TouchableOpacity
                                    style={styles.row_center}
                                    onPress={() => handleShowDetail(item, false)}>

                                    <FastImage

                                        source={require('../../assets/icons/gift.png')}
                                        style={[styles.icon_23, styles.mr_5]}
                                        tintColor={colors.BlueJaja}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </TouchableOpacity>

                                {/* <FastImage
                                    source={require('../../assets/icons/share.png')}
                                    style={[styles.icon_23, styles.ml_5]}
                                    tintColor={colors.BlueJaja}
                                    resizeMode={FastImage.resizeMode.contain}
                                /> */}

                            </View>
                        </View>

                    </View >
                }
            </View >
        )

    }


    return (
        <SafeAreaView style={[styles.container]}>
            <Appbar title="Feed" trolley={true} notif={true} />

            <FlatList
                contentContainerStyle={[styles.column_center, { alignSelf: 'center' }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={styles.p_2}
                data={data.concat(shimmerdata)}
                keyExtractor={(item, index) => String(index + 'SJ')}
                renderItem={renderItem}
            />

        </SafeAreaView>
    )
}
