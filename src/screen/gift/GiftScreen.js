import React, { useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, Image, StatusBar } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { Appbar, colors, styles, Wp, useNavigation } from '../../export'
const { width } = Dimensions.get('screen')


export default function GiftScreen() {
    const navigation = useNavigation();

    const [state, setstate] = useState([{ name: 'PAKET GIFT 50 RIBU', uri: `${require('../../assets/icons/gift/tshirt.png')}`, price: 50000 }, { name: 'PAKET GIFT 100 RIBU', uri: `${require('../../assets/icons/gift/summer.png')}`, price: 100000 }, { name: 'PAKET GIFT 150 RIBU', uri: `${require('../../assets/icons/gift/shoes.png')}`, price: 150000 }, { name: 'PAKET GIFT 200 RIBU', uri: `${require('../../assets/icons/gift/watch.png')}`, price: 200000 },])

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Gift" Bg={colors.BlueJaja} />

            {/* <View> */}
            <Image style={{ width: width, height: width * 0.25 }} source={{ uri: 'https://cf.shopee.co.id/file/19ea449dcd69e70b2d22bc9e98581655' }} />
            <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "70%", backgroundColor: colors.BlueJaja, borderBottomRightRadius: 100 }]}>
                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Beli Sekarang Kirim Nanti!</Text>
            </View>
            <View style={[styles.row_start_center, styles.mt_2, { flexWrap: 'wrap', width: '100%' }]}>
                {state.map((item, idx) => {
                    return (
                        <TouchableRipple onPress={() => navigation.navigate('GiftSearch', { price: item.price })} style={[styles.column_center, styles.p_5, { marginRight: idx == 0 || idx == 2 ? '1.5%' : '0%', width: Wp('49%'), height: Wp('49%'), backgroundColor: colors.BlueJaja, marginBottom: '1.5%' }]}>
                            <>
                                <Image style={[{ width: '90%', height: '90%', tintColor: colors.White, marginBottom: '5%' }]} source={item.uri} />
                                <Text style={[styles.font_14, styles.T_medium, { color: colors.White }]}>{item.name}</Text>
                            </>
                        </TouchableRipple>
                    )
                })

                }
            </View>
            {/* <View style={[styles.row_start_center, styles.mt_2, styles.px_3, styles.py, { width: "85%", backgroundColor: colors.BlueJaja, borderBottomRightRadius: 100 }]}>
                <Text style={[styles.font_14, styles.T_semi_bold, { color: colors.White }]}>Pilih hadiah sesuai keinginan kamu!</Text>
            </View> */}
            {/* </View> */}
            <Text></Text>
        </SafeAreaView >
    )
}
