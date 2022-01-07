import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ToastAndroid, StyleSheet, ScrollView, Animated, RefreshControl, Dimensions } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, Loading, Hp, CardProduct, ShimmerCardProduct, Utils, ServiceStore } from '../../../export'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Menu, Divider, Provider } from 'react-native-paper';
const { height: hg } = Dimensions.get('screen')

export default function StoreProducts() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    // const data = useSelector(state => state.search.searchProduct)
    const keyword = useSelector(state => state.search.keywordSearch)
    const reduxFilters = useSelector(state => state.store.storeFilter)
    const reduxSorts = useSelector(state => state.store.storeSort)

    const reduxmaxProduct = useSelector(state => state.store.maxProduct)
    const data = useSelector(state => state.store.storeProduct)
    const textSearch = useSelector(state => state.store.storeKeyword)
    const reduxStore = useSelector(state => state.store.store)


    const dispatch = useDispatch()
    const [scrollY, setscrollY] = useState(new Animated.Value(0))

    const [auth, setAuth] = useState("")

    const [count, setcount] = useState(0)
    const [selectedFilter, setselectedFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(true);
    const [page, setPage] = useState(1);

    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');


    const [refreshing, setRefreshing] = useState(false);
    const [focus, setFocus] = useState(0);
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 500);
        // if (data && data.length) {
        //     setLoading(false)
        // } else {
        //     setLoading(false)
        //     console.log("jsahfdhjkjhgfdfghjk")
        // }
        if (focus > 0) {
            fetchLoadmore()
        }
    }, [focus])

    const handleLoadMore = () => {
        if (loadmore === true) {
            setLoadmore(true)
            setPage(page + 1)
            fetchLoadmore()
            setTimeout(() => {
                setLoadmore(false)
            }, 4000);
        }
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 1)
    }

    const fetchLoadmore = () => {
        let error = true;
        try {
            let obj = {
                // store: red,
                slug: reduxStore.slug,
                page: filter ? page : page + 1,
                limit: filter ? 10 * parseInt(page) : 20,
                keyword: textSearch,
                price: '',
                condition: '',
                preorder: '',
                brand: '',
                sort: focus == 1 ? '' : focus == 2 ? 'getAmountSold-desc' : focus == 3 ? 'produk_variasi.harga_variasi-desc' : 'produk_variasi.harga_variasi-asc'
            }


            ServiceStore.getStoreProduct(obj).then(res => {
                error = false
                setTimeout(() => setLoading(false), 1000);
                if (res && res.items && res.items.length) {
                    if (filter) {
                        dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
                    } else {
                        dispatch({ "type": 'SET_STORE_PRODUCT', payload: data.concat(res.items) })
                    }
                } else {
                    dispatch({ type: 'SET_MAX_STORE', payload: true })
                }
                setFilter(false)
            })
        } catch (error) {
            error = false
        }
        setTimeout(() => {
            if (error == true) {
                Utils.CheckSignal().then(res => {
                    if (!res.connect) {
                        ToastAndroid.show("Sedang memuat..", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        setTimeout(() => {
                            Utils.CheckSignal().then(resp => {
                                if (!resp.connect) {
                                    ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                                }
                            })
                        }, 5000);
                    }
                })
            }
        }, 5000);
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
            condition: '',
            preorder: '',
            brand: '',
            sort: '',
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
            setCondition('')
            setSort('')
            setStock('')
            setCategory('')
            setFocus(1)
        }
        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                dispatch({ type: 'SET_STORE_PRODUCT', payload: res.items })
                setcount(count + 1)
                setTimeout(() => setLoading(false), 1000);
            }
        })
        setTimeout(() => setLoading(false), 15000);
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);


    const handleSelected = (name, indexParent, indexChild) => {
        if (name === 'filter') {
            let val = reduxFilters[indexParent].name
            let valChild = reduxFilters[indexParent].items[indexChild].value
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
            let valChild = reduxSorts[indexChild].value
            if (valChild === sort) {
                setSort("")
            } else {
                setSort(valChild)
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }]}>
                <View style={[styles.row_around_center, { width: '100%', elevation: 1 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Button style={{ width: Wp('33.33%'), borderRadius: 0, borderRightWidth: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_medium, { color: focus == 1 || focus == 0 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => setFocus(1) & setFilter(true)} mode="outlined">
                            Semua
                        </Button>
                        {/* <Button style={{ width: Wp('33.33%'), borderRadius: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_medium, { color: focus == 2 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => setFocus(2) & setFilter(true)} mode="outlined">
                                Terlaris
                            </Button> */}
                        <Button icon={focus == 3 ? require('../../../assets/icons/sort-up.png') : focus == 4 ? require('../../../assets/icons/sort-down.png') : null} style={{ width: Wp('33.33%'), borderRadius: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_medium, { color: focus == 3 || focus == 4 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => {
                            focus == 3 ? setFocus(4) : setFocus(3)
                            setFilter(true)
                        }} mode="outlined">
                            Harga
                        </Button>
                        <Button style={{ width: Wp('33.33%'), borderRadius: 0, borderLeftWidth: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_11, styles.T_medium, { color: focus == 2 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => actionSheetRef.current?.setModalVisible(true)} mode="outlined">
                            Filter
                        </Button>
                    </ScrollView>

                </View>

                {loading ? <Loading /> : null}
                {
                    data && data.length ?
                        <View style={[styles.column, styles.px_3, { flex: 1, justifyContent: "center", alignItems: 'flex-start' }]}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    {
                                        useNativeDriver: false,
                                        listener: event => {
                                            if (isCloseToBottom(event.nativeEvent)) {
                                                handleLoadMore()
                                            }
                                        }
                                    }
                                )}
                                onMomentumScrollEnd={({ nativeEvent }) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                        handleLoadMore()
                                    }
                                }}
                            >
                                <CardProduct data={data} />

                                {reduxmaxProduct || data.length < 2 ? <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center', color: colors.BlueJaja, width: Wp('100%'), textAlign: 'center' }]}>Semua produk berhasil ditampilkan.</Text> : <ShimmerCardProduct />}
                            </ScrollView>

                        </View>
                        : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
                }

            </View >
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
                    {reduxFilters && reduxFilters.length ?
                        reduxFilters.map((item, index) => {
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
                    {reduxSorts && reduxSorts.length ?
                        <View style={[styles.mb_4]}>
                            <Text adjustsFontSizeToFit style={[styles.font_16, { fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale }]}>Urutkan</Text>
                            <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {reduxSorts.map((child, idx) => {
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

const style = StyleSheet.create({
    content: {
        width: Wp('96%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
    },
    loading: {
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 100,

    }
})