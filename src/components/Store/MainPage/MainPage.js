import React, { useState, useEffect, createRef } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, Wp, Hp, colors, useNavigation, CardProduct, NearestStore, FlashsaleToko, ServiceStore, Utils } from '../../../export'
import Swiper from 'react-native-swiper'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import NewProduct from './NewProduct'

export default function MainPage() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();

    const dispatch = useDispatch()
    const greeting = useSelector(state => state.store.store.description)
    const vouchers = useSelector(state => state.store.store.voucher)
    const products = useSelector(state => state.store.newProduct)
    const reduxStore = useSelector(state => state.store)
    const [count, setCount] = useState(0)
    const reduxAuth = useSelector(state => state.auth.auth)

    const image = useSelector(state => state.store.store.image)

    useEffect(() => {

    }, [vouchers, reduxAuth, reduxStore])

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

    // const handleLoadMore = () => {
    //     if (reduxLoadmore) {
    //         setLoadmore(true)
    //     }
    //     setTimeout(() => {
    //         dispatch({ 'type': 'SET_LOADMORE', payload: false })
    //     }, 5000);
    // }

    const handleVoucher = (val) => {
        if (!reduxAuth) {
            navigation.navigate('Login', { navigate: "Store" })
        } else if (val.isClaimed) {
            dispatch({ "type": 'SET_STORE_INDEX', payload: 1 })
        }
        else {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");

            var raw = JSON.stringify({
                "voucherId": val.id
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
                        Utils.alertPopUp('Voucher berhasil diklaim')
                        ServiceStore.getStore(reduxStore.store.slug, reduxAuth).then(res => {
                            if (res) {
                                dispatch({ "type": 'SET_STORE', payload: res })
                                setCount(count + 1)
                            }
                        })
                    } else if (result.status.code === 409) {
                        Utils.alertPopUp("Voucher sudah pernah diklaim")
                    }
                })
                .catch(error => Utils.alertPopUp(String(error)));
        }
    }

    const handleDescription = voucher => {
        console.log("file: VoucherScreen.js ~ line 154 ~ VoucherScreen ~ voucher", voucher)
        Alert.alert(
            "Syarat dan Ketentuan Voucher",
            `\n\n1.Kode ${voucher.code}
            \n2. Voucher ${String(voucher.category) === "ongkir" ? "Gratis Biaya Pengiriman" : String(voucher.category) === "diskon" ? 'Diskon Belanja' : "CASHBACK"}
            \n3. Mulai tanggal ${voucher.startDate}
            \n4. Berakhir tanggal ${voucher.endDate}
            \n5. Diskon didapatkan ${voucher.discount}
            ${voucher.minShoppingCurrencyFormat ? '\n6. Minimal pembelian ' + voucher.minShoppingCurrencyFormat : ""}
            `,
            [
                {
                    text: "Setuju",
                    onPress: () => console.log("ok"),
                    style: "cancel",
                },
            ],
            {
                cancelable: false,
            }
        );
    }

    return (
        <View style={[styles.column_start, { width: Wp('100%'), backgroundColor: colors.White }]}>
            <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }}>
                <View style={[styles.column, { width: Wp('100%') }]}>
                    {vouchers && vouchers.length !== 0 ?
                        <View style={[styles.column_center_start, styles.my_2]}>
                            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: Wp('20%') }}>
                                <FlatList
                                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    data={vouchers}
                                    renderItem={({ item }) => {
                                        console.log("🚀 ~ file: MainPage.js ~ line 126 ~ MainPage ~ item", item)

                                        return (
                                            <View style={[styles.row_start_center, styles.my_3, { width: Wp('45%'), height: Wp('17%'), marginRight: 10 }]}>
                                                <View style={[styles.row_between_center, styles.pr_2, { width: '100%', height: '100%', backgroundColor: colors.BlueJaja }]}>
                                                    <View style={[styles.column, { width: '70%', height: '100%' }]}>
                                                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.BlueJaja, flexDirection: 'column', paddingVertical: '1%', justifyContent: 'center' }}>
                                                            <View style={{ height: '18%', width: '6%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '6%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '6%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '6%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                            <View style={{ height: '18%', width: '6%', backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                        </View>

                                                        <View style={[styles.column_center_start, { height: '100%', width: '100%', paddingLeft: '15%' }]}>
                                                            <Text style={[styles.font_14, styles.mb_2, { color: colors.White, fontFamily: 'Poppins-SemiBold' }]}>{item.name}</Text>
                                                            <Text numberOfLines={2} style={[styles.font_8, { color: colors.White, fontFamily: 'Poppins-SemiBold', width: '80%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity onPress={() => handleVoucher(item)} style={{ width: '30%', backgroundColor: item.isClaimed ? colors.Silver : colors.RedFlashsale, padding: '1%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: item.isClaimed ? colors.Silver : colors.RedFlashsale, borderRadius: 3 }}>
                                                        <Text style={[styles.font_11, { color: item.isClaimed ? colors.BlackGrayScale : colors.White }]}>{item.isClaimed ? 'Pakai' : 'Klaim'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )

                                    }}
                                />
                                {console.log("🚀 ~~~~~~~~~~~~~~~~~ \n\n")}
                            </ScrollView> */}
                            <View style={[styles.px_4, { paddingVertical: '0.2%', backgroundColor: colors.BlueJaja, width: Wp('60%'), borderBottomRightRadius: 100, }]}>
                                <Text style={[styles.font_14, styles.T_medium, { color: colors.White, width: '80%' }]}>
                                    Voucher Toko
                                </Text>
                            </View>
                            <FlatList
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={refreshing}
                                //         onRefresh={onRefresh}
                                //     />
                                // }
                                showsVerticalScrollIndicator={false}
                                style={styles.pt_3}
                                contentContainerStyle={styles.pb_5}
                                data={vouchers}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={[styles.row_center, styles.mb_3]}>
                                            <View style={[styles.row, { width: '95%', height: Wp('27%'), backgroundColor: colors.White, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                                                <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: colors.BlueJaja, flexDirection: 'column', justifyContent: 'center' }}>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                    <View style={{ height: Wp('4.2%'), width: Wp('3%'), backgroundColor: colors.White, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
                                                </View>
                                                <View style={[styles.column_center, styles.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: colors.BlueJaja }]}>
                                                    <Text style={[styles.font_12, styles.mb_2, { color: colors.White, fontFamily: 'Poppins-SemiBold', alignSelf: 'center', textAlign: 'center', width: '90%' }]}>{!item.category ? item.name : item.category === "ongkir" ? 'GRATIS BIAYA PENGIRIMAN' : String(item.category).toUpperCase() + " " + item.discountText}</Text>
                                                </View>
                                                <View style={[styles.column_around_center, styles.px_2, styles.pt_3, { width: '44%' }]}>
                                                    <Text numberOfLines={3} style={[styles.font_13, styles.mb_2, { color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold', width: '100%' }]}>{item.discount}</Text>
                                                    <Text style={[styles.font_8, { color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold', width: '100%' }]}>Berakhir dalam {item.endDate} {item.type}</Text>
                                                </View>
                                                <View style={[styles.column_center, { width: '22%' }]}>
                                                    {/* {item.isClaimed ? */}
                                                    <TouchableOpacity onPress={() => handleVoucher(item, index)} style={{ width: '90%', height: '30%', backgroundColor: item.isClaimed ? colors.White : colors.BlueJaja, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: colors.BlueJaja, borderRadius: 5 }}>
                                                        <Text style={[styles.font_10, { color: item.isClaimed ? colors.BlueJaja : colors.White, fontFamily: 'Poppins-SemiBold' }]}>{item.isClaimed ? item.isSelected ? "TERPAKAI" : "PAKAI" : "KLAIM"}</Text>
                                                    </TouchableOpacity>
                                                    {/* : null} */}
                                                    <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
                                                        <Text style={[styles.font_12, { color: colors.BlueLink }]}>S&K</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        : null
                    }
                    {image && image.promoBanner && image.promoBanner.length ?
                        <View style={[styles.column_center_start, { width: Wp('100%'), height: Wp('50%'), backgroundColor: 'white' }]}>
                            <Swiper
                                autoplayTimeout={3}

                                horizontal={true}
                                pagingEnabled={true}
                                dotColor={colors.White}
                                activeDotColor={colors.BlueJaja}
                                // paginationStyle={{ bottom: 5 }}
                                autoplay={true}
                                loop={true}>
                                {image.promoBanner.map((item, key) => {
                                    return (
                                        <View style={{ width: Wp('100%'), height: Wp('50%') }}>
                                            {item ?
                                                <Image key={String(key) + 'y'} style={{ width: Wp('100%'), height: Wp('50%'), opacity: 0.9 }}
                                                    source={{ uri: item }}
                                                />
                                                :
                                                <Image key={String(key) + 'z'} style={{ width: Wp('100%'), height: Wp('50%'), resizeMode: 'center', tintColor: colors.Silver }}
                                                    source={require('../../../assets/images/JajaId.png')}
                                                />}
                                        </View>
                                    );
                                })}
                            </Swiper>
                        </View>
                        : null
                    }

                    {image && image.mainBanner ?
                        // <View style={[styles.column_center_start, { width: Wp('100%'), height: Wp('30%'), backgroundColor: 'grey' }]}>
                        <Image style={{ width: Wp('100%'), height: Wp('50%'), resizeMode: 'cover' }} source={{ uri: image.mainBanner }} />
                        // </View>
                        : null
                    }
                    {image && image.promoBanner && image.promoBanner.length ?
                        <>
                            <View style={[styles.row, { width: Wp('100%'), height: Wp('50%') }]}>
                                <View style={{ width: Wp('50%'), height: '100%' }}>
                                    <Image style={{ width: Wp('50%'), height: '100%', resizeMode: 'cover' }} source={{ uri: image.promoBanner[3] ? image.promoBanner[3] : null }} />
                                </View>
                                <View style={{ width: Wp('50%'), height: Wp('50%') }}>
                                    <Image style={{ width: Wp('50%'), height: Wp('50%'), resizeMode: 'cover' }} source={{ uri: image.promoBanner[5] ? image.promoBanner[4] : null }} />
                                </View>
                            </View>
                            {/* <View style={[styles.row, styles.mb_2, { width: Wp('100%'), height: Wp('33.3%') }]}>
                                <View style={{ width: Wp('33.3%'), height: Wp('33.3%') }}>
                                    <Image style={{ width: Wp('33.3%'), height: Wp('33.3%'), resizeMode: 'cover' }} source={{ uri: image.promoBanner[2] ? image.promoBanner[2] : null }} />
                                </View>
                                <View style={{ width: Wp('33.3%'), height: Wp('33.3%') }}>
                                    <Image style={{ width: Wp('33.3%'), height: Wp('33.3%'), resizeMode: 'cover' }} source={{ uri: image.promoBanner[3] ? image.promoBanner[3] : null }} />
                                </View>
                                <View style={{ width: Wp('33.3%'), height: Wp('33.3%') }}>
                                    <Image style={{ width: Wp('33.3%'), height: Wp('33.3%'), resizeMode: 'cover' }} source={{ uri: image.promoBanner[4] ? image.promoBanner[4] : null }} />
                                </View>
                            </View> */}

                        </>

                        : null}
                </View>
                <View style={[styles.column, styles.mt_3, styles.pb_5]}>

                    <View style={styles.column}>
                        <View style={[styles.px_4, { paddingVertical: '0.2%', backgroundColor: colors.BlueJaja, width: Wp('60%'), borderBottomRightRadius: 100, }]}>
                            <Text style={[styles.font_14, styles.T_medium, { color: colors.White, width: '80%' }]}>
                                Produk terbaru
                            </Text>
                        </View>
                        {reduxStore.store.flashSale && reduxStore.store.flashSale.length ?
                            <View style={{ width: Wp('100%') }}>
                                <FlashsaleToko data={reduxStore.store.flashSale} />
                            </View>
                            : null
                        }
                        <NewProduct />
                    </View>
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
