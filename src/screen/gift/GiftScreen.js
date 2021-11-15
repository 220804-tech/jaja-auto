import React, { useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, Image, StatusBar, ScrollView } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { Appbar, colors, styles, Wp, useNavigation, CardProduct } from '../../export'
const { width } = Dimensions.get('screen')


export default function GiftScreen() {
    const navigation = useNavigation();
    const [state, setstate] = useState([{ name: 'PAKET GIFT 100 RIBU', uri: `${require('../../assets/icons/gift/tshirt.png')}`, price: 100000 }, { name: 'PAKET GIFT 200 RIBU', uri: `${require('../../assets/icons/gift/summer.png')}`, price: 200000 }, { name: 'PAKET GIFT 300 RIBU', uri: `${require('../../assets/icons/gift/shoes.png')}`, price: 300000 }, { name: 'PAKET GIFT 400 RIBU', uri: `${require('../../assets/icons/gift/watch.png')}`, price: 400000 },])
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

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Gift" Bg={colors.BlueJaja} />
            <ScrollView>
                {/* <View> */}
                <Image style={{ width: width, height: width * 0.5 }} source={require('../../assets/icons/gift/bannerGif.jpeg')} />
                <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "70%", backgroundColor: colors.RedFlashsale, borderBottomRightRadius: 100 }]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Beli Sekarang Kirim Nanti!</Text>
                </View>
                <View style={[styles.row_start_center, styles.mt_2, { flexWrap: 'wrap', width: '100%' }]}>
                    {state.map((item, idx) => {
                        return (
                            <TouchableRipple key={String(idx) + 'QW'} onPress={() => navigation.navigate('GiftSearch', { price: item.price })} style={[styles.column_center, styles.p_5, { marginRight: idx == 0 || idx == 2 ? '1.5%' : '0%', width: Wp('49%'), height: Wp('49%'), backgroundColor: colors.BlueJaja, marginBottom: '1.5%' }]}>
                                <>
                                    <Image style={[{ width: '90%', height: '90%', tintColor: colors.White, marginBottom: '5%' }]} source={item.uri} />
                                    <Text style={[styles.font_14, styles.T_medium, { color: colors.White }]}>{item.name}</Text>
                                </>
                            </TouchableRipple>
                        )
                    })

                    }
                </View>

                <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "70%", backgroundColor: colors.RedFlashsale, borderBottomRightRadius: 100 }]}>
                    <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Pilih Hadiah!</Text>
                </View>

                <View style={[styles.p_3, { width: Wp('100%') }]}>
                    <CardProduct gift={true} data={data} />
                </View>
                {/* <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "85%", backgroundColor: colors.BlueJaja, borderBottomRightRadius: 100 }]}>
                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Pilih hadiah sesuai keinginan kamu!</Text>
            </View> */}
                {/* </View> */}
            </ScrollView>
        </SafeAreaView >
    )
}
