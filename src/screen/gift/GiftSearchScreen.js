import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { AppbarSecond, colors, styles, Ps, CardProduct, Wp, } from '../../export'

export default function GiftSearchScreen(props) {
    const dispatch = useDispatch()
    const [index, setIndex] = useState(0)

    const [state, setstate] = useState([
        // {
        //     name: 'Baju setelan anak umur 1-2 tahun 1 set',
        //     image: 'https://cf.shopee.co.id/file/777e151cf16d256501aca6f5e2fd8b3d',
        //     price: 'Rp30.000',
        //     priceBox: 'Rp37.000',
        //     priceInt: '30000',
        //     location: 'Jakarta Timur',
        //     brand: 'Eureka Bookhouse',
        //     weight: '500',
        //     condition: 'baru',
        //     stock: 100,
        //     category: { name: 'Fashion' },
        //     amountSold: 44,
        //     description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'

        // },
        // {
        //     name: 'Baju tidur Aanak Setelan Piyama Bayi Set Lengan Panjang Bahan Lembut',
        //     image: 'https://cf.shopee.co.id/file/777e151cf16d256501aca6f5e2fd8b3d',
        //     price: 'Rp45.000',
        //     priceBox: 'Rp52.000',
        //     priceInt: '45000',
        //     location: 'Jakarta Timur',
        //     brand: 'Eureka Bookhouse',
        //     weight: '500',
        //     condition: 'baru',
        //     stock: 100,
        //     category: { name: 'Fashion' },
        //     amountSold: 44,
        //     description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        // },
        // {
        //     name: 'Setelan Kaos Olahraga Dewasa 1 Set Baju Badminton',
        //     image: 'https://cf.shopee.co.id/file/777e151cf16d256501aca6f5e2fd8b3d',
        //     price: 'Rp50.000',
        //     priceBox: 'Rp57.000',
        //     priceInt: '50000',
        //     location: 'Jakarta Timur',
        //     brand: 'Eureka Bookhouse',
        //     weight: '500',
        //     condition: 'baru',
        //     stock: 100,
        //     category: { name: 'Fashion' },
        //     amountSold: 44,
        //     description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        // },
        // {
        //     name: 'Setelan Kaos Voli Training Pakaian Olahraga',
        //     image: 'https://cf.shopee.co.id/file/4995b2042faf93910b4b96891a0b1efb',
        //     price: 'Rp45.000',
        //     priceBox: 'Rp52.000',
        //     priceInt: '45000',
        //     location: 'Jakarta Timur',
        //     brand: 'Eureka Bookhouse',
        //     weight: '500',
        //     condition: 'baru',
        //     stock: 100,
        //     category: { name: 'Fashion' },
        //     amountSold: 44,
        //     description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        // },
        {
            name: 'STARLADY Sepatu Wanita Olin Hitam',
            image: 'https://cf.shopee.co.id/file/a251b318c1f22bd317ddb353fd8d1022',
            price: 'Rp67.500',
            priceBox: 'Rp74.500',
            priceInt: '67500',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'LUBRENE Sandal Gunung Anak Laki-laki Gibson-Gt Htm/Cklt',
            image: 'https://cf.shopee.co.id/file/777e151cf16d256501aca6f5e2fd8b3d',
            price: 'Rp87.800',
            priceBox: 'Rp94.800',
            priceInt: '87800',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'STARLADY Sepatu Wanita Olin Hitam',
            image: 'https://cf.shopee.co.id/file/a251b318c1f22bd317ddb353fd8d1022',
            price: 'Rp60.000',
            priceBox: 'Rp67.000',
            priceInt: '60000',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'LUBRENE Sandal Gunung Anak Laki-laki Gibson-Gt Htm/Cklt',
            image: 'https://cf.shopee.co.id/file/777e151cf16d256501aca6f5e2fd8b3d',
            price: 'Rp123.000',
            priceBox: 'Rp130.000',
            priceInt: '123000',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'Les Catino Monogram Buckle Tote L Warm Taupe L.Brown',
            image: 'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/4/8/d9636a3d-ed3e-4cf8-8316-570496261766.jpg',
            price: 'Rp479.000',
            priceBox: 'Rp486.000',
            priceInt: '486000',
            location: 'Jakarta Timur',
            brand: 'Les Catino',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'Les Catino Olexa Tote Black',
            image: 'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/16/40672dba-809c-485c-8b15-f735252379f5.jpg',
            price: 'Rp321.000',
            priceBox: 'Rp328.000',
            priceInt: '321000',
            location: 'Jakarta Timur',
            brand: 'Les Catino',
            weight: '500',
            condition: 'baru',
            stock: 100,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'Les Catino Monogram Vc Tote Warm Taupe/L.Brown',
            image: 'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/16/40672dba-809c-485c-8b15-f735252379f5.jpg',
            price: 'Rp439.000',
            priceBox: 'Rp446.000',
            priceInt: '439.000',
            location: 'Jakarta Timur',
            brand: 'Les Catino',
            weight: '500',
            condition: 'baru',
            stock: 78,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'Sepatu Snikers Pria Nike Air Jordan 1 Low Smoke grey Premium BNIB - 38',
            image: 'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/7/24/87cb1990-1d99-46ed-bc00-7ec2ca98be85.jpg',
            price: '401.000',
            priceBox: 'Rp408.000',
            priceInt: '408000',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 78,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        },
        {
            name: 'Nike Cortez classic leather White Black BNIB - 39',
            image: 'https://images.tokopedia.net/img/cache/900/VqbcmM/2020/12/16/77cb65d2-dee8-4e40-985f-4fe7eec3f812.jpg',
            price: 'Rp450.000',
            priceBox: 'Rp457.000',
            priceInt: '450000',
            location: 'Jakarta Timur',
            brand: 'Eureka Bookhouse',
            weight: '500',
            condition: 'baru',
            stock: 78,
            category: { name: 'Fashion' },
            amountSold: 44,
            description: 'Barang Ready Stock Ya Kaka.\nBila pesan sebelum jam 3 siang, pesanan akan dikirim di hari itu juga'
        }
    ])


    useEffect(() => {
        if (props.route.params.price) {
            setIndex(props.route.params.price)
        }

        // let arr = state.sort((a, b) => a > b ? 1 : -1);
        // setstate(arr)
    }, [props])



    const handleSearch = () => {

    }

    return (
        <SafeAreaView style={styles.container}>
            <AppbarSecond autofocus={false} handleSearch={handleSearch} title='Cari hadiah disini..' handleSubmit={handleSearch} />
            <View style={[styles.row_around_center, styles.p_2,]}>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(100000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 100000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 100000 ? colors.White : colors.BlueJaja }]}> PAKET 100K</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(200000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 200000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 200000 ? colors.White : colors.BlueJaja }]}> PAKET 200K</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(300000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 300000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 300000 ? colors.White : colors.BlueJaja }]}> PAKET 300K</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(400000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 400000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 400000 ? colors.White : colors.BlueJaja }]}> PAKET 400K</Text>
                </TouchableRipple>
            </View>
            <ScrollView>
                <View style={[styles.p_3, { width: Wp('100%') }]}>
                    <CardProduct gift={true} data={state.filter(item => item.priceInt >= index)} />
                </View>
            </ScrollView>

        </SafeAreaView >
    )
}
