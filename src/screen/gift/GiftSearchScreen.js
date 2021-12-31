import React, { createRef, useCallback, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { AppbarSecond, colors, styles, Ps, CardProduct, Wp, Hp, Loading } from '../../export'
import ActionSheet from "react-native-actions-sheet";

export default function GiftSearchScreen(props) {
    const actionSheetRef = createRef();

    console.log("🚀 ~ file: GiftSearchScreen.js ~ line 8 ~ GiftSearchScreen ~ props", props.route.params.price)
    const dispatch = useDispatch()
    const reduxGift = useSelector(state => state.gift.productGift)
    const reduxGiftSave = useSelector(state => state.gift.productGiftSave)

    const filtersGift = useSelector(state => state.gift.filterGift)
    const fetchLoading = useSelector(state => state.gift.giftLoading)

    const sortsGift = useSelector(state => state.gift.sortGift)

    const [index, setIndex] = useState(0)

    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');
    const [refreshing, setrefreshing] = useState(false);



    useEffect(() => {
        if (props.route.params.price) {
            setIndex(props.route.params.price)
        }

        // let arr = state.sort((a, b) => a > b ? 1 : -1);
        // setstate(arr)
    }, [props])



    const handleSearch = (text) => {
        const beforeFilter = reduxGiftSave;
        const afterFilter = beforeFilter.filter((item) => {
            const itemData = `${item.name.toUpperCase()} ${item.price.toUpperCase()} ${item.slug.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })
        dispatch({ type: 'SET_PRODUCT_GIFT', payload: afterFilter })

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
            <AppbarSecond gift={true} handleSearch={handleSearch} title='Cari hadiah disini..' handleSubmit={handleSearch} />
            {/*      <View style={[styles.row_around_center, styles.p_2,]}>
                {props.route?.params?.price ?
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
                </TouchableRipple> 
              </View> */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                } >
                <View style={styles.column}>
                    {fetchLoading ?
                        <View style={{ height: Hp('100%') }}>
                            <Loading />
                        </View>
                        :
                        <View style={styles.p_3}>
                            {reduxGift && reduxGift.length ?
                                <CardProduct gift={true} data={reduxGift} />
                                :
                                <Text style={[styles.font_13, styles.mt_5, styles.mb_3, styles.T_light, { alignSelf: 'center', alignItems: 'flex-end' }]}>Produk tidak ditemukan.</Text>

                            }
                            {reduxGift && reduxGift.length ?
                                <Text style={[styles.font_13, styles.mt_5, styles.mb_3, styles.T_light, { alignSelf: 'center', alignItems: 'flex-end' }]}>Semua produk berhasil ditampilkan.</Text>
                                : null
                            }
                        </View>

                    }
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
