import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, ToastAndroid } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, Wp, Hp, colors, useNavigation, CardProduct } from '../../export'
import Swiper from 'react-native-swiper'
import EncryptedStorage from 'react-native-encrypted-storage'
import { Paragraph } from 'react-native-paper'

export default function MainPage() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const greeting = useSelector(state => state.store.store.greeting)
    console.log("🚀 ~ file: MainPage.js ~ line 13 ~ MainPage ~ greeting", greeting)
    const vouchers = useSelector(state => state.store.store.voucher)
    const products = useSelector(state => state.store.storeProduct)
    const [auth, setAuth] = useState("")
    const image = useSelector(state => state.store.store.image)

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
    }, [])

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }

    // const handleLoadMore = () => {
    //     if (reduxLoadmore) {
    //         setLoadmore(true)
    //     }
    //     setTimeout(() => {
    //         dispatch({ 'type': 'SET_LOADMORE', payload: false })
    //     }, 5000);

    // }

    const handleVoucher = (val) => {
        console.log("🚀 ~ file: MainPage.js ~ line 59 ~ handleVoucher ~ val", val)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");

        var raw = JSON.stringify({
            "voucherId": val
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/voucher/claimVoucherStore", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    ToastAndroid.show("Voucher berhasil diklaim", ToastAndroid.LONG, ToastAndroid.CENTER)
                } else if (result.status.code === 409) {
                    ToastAndroid.show("Voucher sudah pernah diklaim", ToastAndroid.LONG, ToastAndroid.CENTER)

                }
            })
            .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
    }
    return (
        <View style={[styles.column_start, styles.py_2, { width: Wp('100%') }]}>
            <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }}>


                <View style={[styles.column, { backgroundColor: 'white', width: Wp('100%') }]}>
                    {greeting ?
                        <View style={[styles.p_2, { elevation: 3, backgroundColor: colors.White, width: Wp('100%') }]}>
                            <Paragraph style={[styles.font_13]}>{greeting}</Paragraph>
                        </View>
                        : null}
                    {vouchers && vouchers.length !== 0 ?
                        <View style={[styles.row_center, { height: Wp('20%'), paddingHorizontal: '1%' }]}>
                            <ScrollView horizontal contentContainerStyle={{ height: Wp('20%') }}>
                                <FlatList
                                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                                    horizontal
                                    keyExtractor={(item) => item.id}
                                    data={vouchers}
                                    renderItem={({ item }) => {
                                        console.log("🚀 ~ file: MainPage.js ~ line 92 ~ MainPage ~ item", item)
                                        return (
                                            <View style={[styles.row_start_center, styles.my_3, { width: Wp('45%'), height: Wp('17%'), marginRight: 10 }]}>
                                                <View style={[styles.row_between_center, styles.pr_2, { width: '100%', height: '100%', backgroundColor: colors.BlueJaja }]}>
                                                    <View style={[styles.column, { width: '70%', height: '100%' }]}>
                                                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.BlueJaja, flexDirection: 'column', paddingVertical: '1%', justifyContent: 'center' }}>
                                                            <View style={{ height: '18%', width: '8%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '8%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '8%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '8%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '8%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        </View>

                                                        <View style={[styles.column_center_start, { height: '100%', width: '100%', paddingLeft: '15%' }]}>
                                                            <Text style={[styles.font_14, styles.mb_2, { color: colors.White, fontWeight: 'bold' }]}>{item.name}</Text>
                                                            <Text numberOfLines={2} style={[styles.font_8, { color: colors.White, fontWeight: 'bold', width: '80%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity onPress={() => handleVoucher(item.id)} style={{ width: '30%', backgroundColor: item.isClaimed ? colors.White : colors.RedFlashsale, padding: '1%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.RedFlashsale, borderRadius: 3 }}>
                                                        <Text style={[styles.font_12, { color: item.isClaimed ? colors.RedFlashsale : colors.White }]}>{"Klaim"}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />
                            </ScrollView>
                        </View>
                        : null
                    }
                    {image && image.mainBanner ?
                        <View style={[styles.column, { width: Wp('100%'), height: Wp('50%') }]}>
                            <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: image.mainBanner }} />
                        </View>
                        : null
                    }
                    {image && image.promoBanner && image.promoBanner.length ?
                        <View style={[styles.column, { width: Wp('100%'), height: Wp('50%'), justifyContent: 'center', alignItems: 'center' }]}>
                            <Swiper
                                autoplayTimeout={3}

                                horizontal={true}
                                // style={{ width: '100%', height: '100%' }}
                                pagingEnabled={true}
                                dotColor={colors.White}
                                activeDotColor={colors.BlueJaja}
                                paginationStyle={{ bottom: 5 }}
                                autoplay={true}
                                loop={true}>
                                {image.promoBanner.map((item, key) => {
                                    console.log("🚀 ~ file: MainPage.js", item)

                                    return (
                                        <View style={{ width: Wp('100%'), height: Wp('50%') }}>
                                            {item ?
                                                <Image key={String(key) + 'y'} style={{ width: "100%", height: Wp('50%'), resizeMode: 'contain' }}
                                                    source={{ uri: item }}
                                                />
                                                :
                                                <Image key={String(key) + 'z'} style={{ width: "100%", height: Wp('50%'), resizeMode: 'center', tintColor: colors.Silver }}
                                                    source={require('../../assets/images/JajaId.png')}
                                                />}
                                        </View>
                                    );
                                })}
                            </Swiper>
                        </View>
                        : null
                    }
                    {products && products.length ?
                        <>
                            <View style={[styles.row, { width: Wp('100%'), height: Wp('50%') }]}>
                                <View style={{ flex: 1, height: Wp('50%') }}>
                                    <Image style={{ flex: 1, height: Wp('50%'), resizeMode: 'contain' }} source={{ uri: products[0].image }} />
                                </View>
                                <View style={{ flex: 1, height: Wp('50%') }}>
                                    <Image style={{ flex: 1, height: Wp('50%'), resizeMode: 'contain' }} source={{ uri: products[1].image }} />
                                </View>
                                <View style={{ flex: 1, height: Wp('50%') }}>
                                    <Image style={{ flex: 1, height: Wp('50%'), resizeMode: 'contain' }} source={{ uri: products[2].image }} />
                                </View>
                            </View>
                            <View style={[styles.column, styles.mb_2, { width: Wp('100%') }]}>
                                <View style={{ width: Wp('100%'), height: Wp('100%') }}>
                                    <Image style={{ width: '100%', height: Wp('100%'), resizeMode: 'contain' }} source={{ uri: products[3].image }} />
                                </View>
                                <View style={{ width: Wp('100%'), height: Wp('100%') }}>
                                    <Image style={{ width: '100%', height: Wp('100%'), resizeMode: 'contain' }} source={{ uri: products[4].image }} />
                                </View>
                            </View>
                        </>

                        : null}
                </View>
                <View style={[styles.column, styles.mt_5, styles.pt_3]}>
                    {products && products.length ?
                        <CardProduct data={products} />
                        :
                        <View style={{ justifyContent: 'center', width: Wp('100%'), height: Hp('20%') }}>
                            <Text style={[styles.font_14, { alignSelf: 'center', color: colors.BlackGrayScale }]}>Produk tidak ditemukan</Text>
                        </View>
                    }
                    {/* <FlatList
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        updateCellsBatchingPeriod={100} // Increase time between renders
                        windowSize={7}
                        data={products}
                        scrollEnabled={true}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleShowDetail(item)}
                                    style={Ps.cardProduct}
                                    key={index}>
                                    {item.isDiscount ?
                                        <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                    <FastImage
                                        style={Ps.imageProduct}
                                        source={{
                                            uri: item.image,
                                            headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
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
                                        <View style={Ps.location}>
                                            <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                            <Text style={Ps.locarionName}>{item.location}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    /> */}
                </View>
            </ScrollView>
        </View >
    )
}
