import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, colors, Wp, useFocusEffect } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function FlashsaleComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashFlashsale = useSelector(state => state.dashboard.flashsale)
    const reduxAuth = useSelector(state => state.auth.auth)


    useEffect(() => {
    }, [])


    useFocusEffect(
        useCallback(() => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth ? JSON.parse(reduxAuth) : "");
            myHeaders.append("Cookie", "ci_session=gpkr7eq1528c92su0vj0rokdjutlsl2r");

            var requestOptions = {
                method: 'GET',
                headers: reduxAuth ? myHeaders : "",
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/home", requestOptions)
                .then(response => response.json())
                .then(resp => {
                    console.log("file: FlashsaleComponent.js ~ line 35 ~ useCallback ~ resp", resp.status)
                    if (resp.status.code == 200 || resp.status.code == 204) {
                        if (resp.data.flashSale) {
                            dispatch({ type: 'SET_DASHFLASHSALE', payload: resp.data.flashSale })
                            EncryptedStorage.setItem('dashflashsale', JSON.stringify(resp.data.flashSale))
                        }
                    } else {
                        dispatch({ type: 'SET_DASHFLASHSALE', payload: [] })
                        Alert.alert(
                            "Error with status 120012",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                })
                .catch(error => {
                    dispatch({ type: 'SET_DASHFLASHSALE', payload: [] })
                    if (String(error).slice(11, String(error).length) === "Network request failed") {
                        ToastAndroid.show("Gagal memuat, periksa kembali koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Alert.alert(
                            "Error with status 120013",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );

                    }
                })
        }, []),
    );

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image, flashsale: true })
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
                                            borderRadius: 100,
                                            height: '100%',
                                            width: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) + "%",
                                        }}>
                                        </View>
                                        <Text style={{
                                            position: "absolute",
                                            alignSelf: "center",
                                            color: "white",
                                            marginTop: -1,
                                            fontSize: 13
                                        }}
                                        >{item.amountSold} Terjual</Text>
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
