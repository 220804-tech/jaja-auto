import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { Appbar, colors, styles, Wp, useNavigation, CardProduct, ServiceProduct, Utils, ShimmerCardProduct } from '../../export'
const { width } = Dimensions.get('screen')


export default function GiftScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [state, setstate] = useState([{ name: 'PAKET 100 RIBU', uri: `${require('../../assets/icons/gift/tshirt.png')}`, price: '0-199999' }, { name: 'PAKET 300 RIBU', uri: `${require('../../assets/icons/gift/summer.png')}`, price: '200000-399999' }, { name: 'PAKET 500 RIBU', uri: `${require('../../assets/icons/gift/shoes.png')}`, price: '400000-599999' }, { name: 'PAKET 700 RIBU', uri: `${require('../../assets/icons/gift/trousers.png')}`, price: '600000-799999' }, { name: 'PAKET 900 RIBU', uri: `${require('../../assets/icons/gift/watch.png')}`, price: '800000-999999' }, { name: 'PAKET 1 JUTA', uri: `${require('../../assets/icons/gift/makeover.png')}`, price: '1000000' },])
    const [data, setdata] = useState([
        {
            name: 'Apple iPhone 12 256GB Red',
            image: 'https://kejutan.id/statics/uploads/shopimg/20210131/14803806060016.jpg',
            price: 'Rp14.500.000',
            priceBox: 'Rp14.507.000',
            priceInt: '14500000',
            location: 'Jakarta Selatan',
            brand: 'Apple',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Elektronik' },
            amountSold: 44,
            description: 'Apple iPhone 12 merupakan handphone HP dengan kapasitas 2815mAh dan layar 6.1" yang dilengkapi dengan kamera belakang 12 + 12MP dengan tingkat densitas piksel sebesar 476ppi dan tampilan resolusi sebesar 2340 x 1080pixels. Dengan berat sebesar 162g, handphone HP ini memiliki prosesor Octa Core. Tanggal rilis untuk Apple iPhone 12: Oktober 2020.'

        },
        {
            name: 'Apple iPhone 11 64GB Green',
            image: 'https://p-id.ipricegroup.com/uploaded_3530d15904c81a8c1c932122d62a0587.jpg',
            price: 'Rp9.287.000',
            priceBox: 'Rp9.294.000',
            priceInt: '9287000',
            location: 'Jakarta Selatan',
            brand: 'Apple',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Elektronik' },
            amountSold: 44,
            description: 'Apple iPhone 11 merupakan handphone HP dengan kapasitas 3110mAh dan layar 6.1" yang dilengkapi dengan kamera belakang 12 + 12MP dengan tingkat densitas piksel sebesar 326ppi dan tampilan resolusi sebesar 828 x 1792pixels. Dengan berat sebesar 194g, handphone HP ini memiliki prosesor Hexa Core. Tanggal rilis untuk Apple iPhone 11: September 2019.'

        },
        {
            name: 'Apple iPhone 12 128GB Purple',
            image: 'https://p-id.ipricegroup.com/uploaded_2dde0c6627ddc25f0fd47508aa511ced.jpg',
            price: 'Rp12.550.000',
            priceBox: 'Rp12.557.000',
            priceInt: '12550000',
            location: 'Jakarta Selatan',
            brand: 'Apple',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Elektronik' },
            amountSold: 33,
            description: 'Apple iPhone 11 merupakan handphone HP dengan kapasitas 3110mAh dan layar 6.1" yang dilengkapi dengan kamera belakang 12 + 12MP dengan tingkat densitas piksel sebesar 326ppi dan tampilan resolusi sebesar 828 x 1792pixels. Dengan berat sebesar 194g, handphone HP ini memiliki prosesor Hexa Core. Tanggal rilis untuk Apple iPhone 11: September 2019.'

        },
        {
            name: 'Apple iPhone 12 Pro Max 256GB Gold',
            image: 'https://p-id.ipricegroup.com/uploaded_8905fca05dfb8e35e9e5e9a90b48ed69.jpg',
            price: 'Rp17.000.000',
            priceBox: 'Rp17.007.000',
            priceInt: '17000000',
            location: 'Jakarta Selatan',
            brand: 'Apple',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Elektronik' },
            amountSold: 44,
            description: 'Apple iPhone 12 Pro Max merupakan handphone HP dengan kapasitas 4100mAh dan layar 6.7" yang dilengkapi dengan kamera belakang 12 + 12 + 12MP dengan tingkat densitas piksel sebesar 458ppi dan tampilan resolusi sebesar 2778 x 1284pixels. Dengan berat sebesar 226g, handphone HP ini memiliki prosesor Octa Core. Tanggal rilis untuk Apple iPhone 12 Pro Max: Oktober 2020. '

        },
    ])
    const productGiftHome = useSelector(state => state.gift.productGiftHome)


    useEffect(() => {

        try {

        } catch (error) {

        }

    }, [])

    const handleFilter = (item) => {
        navigation.navigate('GiftSearch', { price: item.price })
        dispatch({ type: "SET_GIFT_LOADING", payload: true })
        let error = true
        ServiceProduct.getStoreProduct({ gift: 1, price: item.price }).then(res => {
            console.log("🚀 ~ file: GiftScreen.js ~ line 100 ~ ServiceProduct.getStoreProduct ~ res", res)
            dispatch({ type: "SET_PRODUCT_GIFT", payload: res?.data?.items })
            dispatch({ type: "SET_PRODUCT_GIFT_SAVE", payload: res?.data?.items })
            dispatch({ type: "SET_GIFT_LOADING", payload: false })
            error = false
        }).catch(err => {
            error = false
            dispatch({ type: "SET_GIFT_LOADING", payload: false })
        })
        setTimeout(() => {
            if (error) {
                Utils.handleSignal()
                dispatch({ type: "SET_GIFT_LOADING", payload: false })
            }
        }, 15000);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Jaja Gift" Bg={colors.BlueJaja} />
            <ScrollView>
                {/* <View> */}
                <Image style={{ width: width, height: width * 0.5 }} source={require('../../assets/icons/gift/bannerGif.jpeg')} />
                <View style={[styles.row_start_center, styles.mt_3, styles.px_3, styles.py, { width: "70%", backgroundColor: colors.RedFlashsale, borderBottomRightRadius: 100 }]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Beli Sekarang Kirim Nanti!</Text>
                </View>
                <View style={[styles.row_center, styles.mt_2, { flexWrap: 'wrap', width: '100%', alignSelf: 'center' }]}>
                    {state.map((item, idx) => {
                        return (
                            <TouchableRipple key={String(idx) + 'QW'} onPress={() => handleFilter(item)} style={[styles.column_center, styles.py_5, { marginRight: idx == 0 || idx == 1 || idx == 3 || idx == 4 ? Wp('1%') : '0%', width: Wp('31.5%'), height: Wp('31.5%'), backgroundColor: colors.BlueJaja, marginBottom: '1%', borderRadius: 4 }]}>
                                <>
                                    <View style={[styles.px_5, styles.mb_5, { width: '70%', height: '70%' }]}>
                                        <Image style={[{ width: '100%', height: '100%', tintColor: colors.White, marginBottom: '5%' }]} source={item.uri} />
                                    </View>
                                    <Text style={[styles.font_11, styles.T_semi_bold, { color: colors.White, width: '90%', alignSelf: 'center', textAlign: 'center' }]}>{item.name}</Text>
                                </>
                            </TouchableRipple>
                        )
                    })

                    }
                </View>

                <View style={[styles.row_start_center, styles.mt_3, styles.px_3, styles.py, { width: "70%", backgroundColor: colors.RedFlashsale, borderBottomRightRadius: 100 }]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Pilih Hadiah!</Text>
                </View>

                <View style={[styles.p_3, { width: Wp('100%') }]}>
                    {productGiftHome && productGiftHome.length ?
                        <CardProduct gift={true} data={productGiftHome} />
                        :
                        <ShimmerCardProduct />}
                </View>
                {/* <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "85%", backgroundColor: colors.BlueJaja, borderBottomRightRadius: 100 }]}>
                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Pilih hadiah sesuai keinginan kamu!</Text>
            </View> */}
                {/* </View> */}
            </ScrollView>
        </SafeAreaView >
    )
}
