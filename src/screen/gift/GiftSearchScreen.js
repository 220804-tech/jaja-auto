import React, { createRef, useCallback, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { AppbarSecond, colors, styles, Ps, CardProduct, Wp, Hp } from '../../export'
import ActionSheet from "react-native-actions-sheet";

export default function GiftSearchScreen(props) {
    const actionSheetRef = createRef();

    console.log("🚀 ~ file: GiftSearchScreen.js ~ line 8 ~ GiftSearchScreen ~ props", props.route.params.price)
    const dispatch = useDispatch()
    const reduxGift = useSelector(state => state.gift.productGift)
    const filtersGift = useSelector(state => state.gift.filterGift)

    const sortsGift = useSelector(state => state.gift.sortGift)

    const [index, setIndex] = useState(0)

    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');
    const [refreshing, setrefreshing] = useState(false);

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
            priceInt: ' 0',
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
    const handleFilter = (name) => {
        actionSheetRef.current?.setModalVisible(false)
        dispatch({ type: 'SET_MAX_SEARCH', payload: false })
        setTimeout(() => setLoading(true), 200);
        let obj = {
            slug: reduxStore.slug,
            page: 1,
            limit: 20,
            keyword: '',
            price: '',
            condition: condition,
            preorder: stock,
            brand: '',
            sort: sort,
            category: ''
        }
        if (name !== 'reset') {
            obj.keyword = keyword
            obj.condition = condition
            obj.preorder = stock
            obj.sort = sort
            obj.category = category
            setFocus(2)
        } else {
            setFocus(1)
            console.log("🚀 ~ file: simpan")
        }
        console.log("🚀 ~ file: StoreProducts.js ~ line 157 ~ ServiceStore.getStoreProduct ~ obj", obj)
        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                console.log("🚀 ~ file: StoreProducts.js ~ line 165 ~ ServiceStore.getStoreProduct ~ res", res.items.length)
                dispatch({ type: 'SET_STORE_PRODUCT', payload: res.items })
                setcount(count + 1)
                setTimeout(() => setLoading(false), 1000);
            }
        })
        setTimeout(() => setLoading(false), 15000);
    }
    const onRefresh = useCallback(() => {
        setrefreshing(true);
        setTimeout(() => {
            setrefreshing(false)
        }, 2000);
    }, []);


    const handleSelected = (name, indexParent, indexChild) => {
        if (name === 'filter') {
            let val = filtersGift[indexParent].name
            let valChild = filtersGift[indexParent].items[indexChild].value
            if (val === "Kondisi") {
                if (condition === valChild) {
                    setCondition("")
                } else {
                    setCondition(valChild)
                }
            } else if (val === "Stok") {
                if (stock === valChild) {
                    setStock("")
                } else {
                    setStock(valChild)
                }
            } else if (val === "Kategori") {
                setCategory(valChild)
            }
        } else if (name === "sort") {
            let valChild = sortsGift[indexChild].value
            if (valChild === sort) {
                setSort("")
            } else {
                setSort(valChild)
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppbarSecond gift={true} autofocus={false} handleSearch={handleSearch} title='Cari hadiah disini..' handleSubmit={handleSearch} />
            <View style={[styles.row_around_center, styles.p_2,]}>
                {/* {props.route?.params?.price ?
                    <TouchableRipple rippleColor={colors.White} style={[styles.row_between_center, styles.p_2, { width: Wp('50%'), justifyContent: 'center', backgroundColor: colors.BlueJaja, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                        <Text style={[styles.font_10, styles.T_semi_bold, { color: colors.White }]}>PAKET GIFT {props.route.params.price}K</Text>
                    </TouchableRipple>
                    : null}
                <Button style={{ width: Wp('33.33%'), borderRadius: 0, borderLeftWidth: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_medium, { color: colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => actionSheetRef.current?.setModalVisible(true)} mode="outlined">
                    Filter
                </Button> */}
                {/* <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(200000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 200000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 200000 ? colors.White : colors.BlueJaja }]}> PAKET 200K</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(300000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 300000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 300000 ? colors.White : colors.BlueJaja }]}> PAKET 300K</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={colors.White} onPress={() => setIndex(400000)} style={[styles.row_between_center, styles.p_2, { backgroundColor: index === 400000 ? colors.BlueJaja : colors.White, borderColor: colors.BlueJaja, borderRadius: 7 }]}>
                    <Text style={[styles.font_10, styles.T_semi_bold, { color: index === 400000 ? colors.White : colors.BlueJaja }]}> PAKET 400K</Text>
                </TouchableRipple> */}
            </View>
            <ScrollView>
                <View style={[styles.p_3, { width: Wp('100%') }]}>
                    <CardProduct gift={true} data={reduxGift} />
                    {/* <CardProduct gift={true} data={reduxGift.filter(item => item.priceInt >= index)} /> */}

                </View>
            </ScrollView>
            <ActionSheet ref={actionSheetRef} delayActionSheetDraw={false} containerStyle={{ height: Hp('60%'), padding: '4%' }}>
                <View style={[styles.row_between_center, styles.mb_3, { width: '100%' }]}>
                    <Text adjustsFontSizeToFit style={[styles.font_16, styles.T_semi_bold, { width: '50%', color: colors.BlueJaja, }]}>Filter</Text>
                    <View style={[styles.row_center_end]}>
                        <TouchableOpacity onPress={() => handleFilter('reset')} style={{ paddingHorizontal: '2%', justifyContent: 'center', marginRight: '2%' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_14, styles.T_semi_bold, styles.mr_3, { color: colors.YellowJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleFilter('filter')} style={{ paddingHorizontal: '2%', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.mb_5}>
                    {filtersGift && filtersGift.length ?
                        filtersGift.map((item, index) => {
                            return (
                                <View key={String(index) + "XP"} style={[styles.mb_4]}>
                                    <Text adjustsFontSizeToFit style={[styles.font_16, { fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale }]}>{item.name}</Text>
                                    <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                        {item.items.map((child, idx) => {
                                            return (
                                                <TouchableOpacity key={String(idx) + 'FA'} onPress={() => handleSelected('filter', index, idx)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === condition || child.value === stock || child.value === category ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === condition || child.value === stock || child.value === category ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
                                                    <Text adjustsFontSizeToFit style={[styles.font_14, { color: child.value === condition || child.value === stock || child.value === category ? colors.White : colors.BlackGrayScale }]}>{child.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        })
                        : null
                    }
                    {sortsGift && sortsGift.length ?
                        <View style={[styles.mb_4]}>
                            <Text adjustsFontSizeToFit style={[styles.font_16, { fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale }]}>Urutkan</Text>
                            <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {sortsGift.map((child, idx) => {
                                    return (
                                        <TouchableOpacity key={String(idx) + "CH"} onPress={() => handleSelected('sort', null, idx)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === sort ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === sort ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
                                            <Text adjustsFontSizeToFit style={[styles.font_14, { color: child.value === sort ? colors.White : colors.BlackGrayScale }]}>{child.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        : null
                    }
                </ScrollView>
            </ActionSheet>
        </SafeAreaView >
    )
}
