import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ToastAndroid, StyleSheet, ScrollView, Animated, RefreshControl, Dimensions } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, Loading, Hp, CardProduct, ShimmerCardProduct, Utils, ServiceStore } from '../../../export'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-native-paper';
const { height: hg } = Dimensions.get('screen')

export default function StoreProducts() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    // const data = useSelector(state => state.search.searchProduct)
    const keyword = useSelector(state => state.search.keywordSearch)
    const reduxFilters = useSelector(state => state.search.filters)
    const reduxSorts = useSelector(state => state.search.sorts)
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

    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
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
            console.log("🚀 ~ file: StoreProducts.js ~ line 54 ~ useEffect ~ focus", focus)
            fetchLoadmore()
        }
    }, [focus])

    const handleLoadMore = () => {
        console.log("reloaddddddddddddddd")
        if (loadmore === true) {
            console.log("reloaddddddddddddddd trueeeeeeeeeeeeee")
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
                        console.log("masuk filter ")
                        dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
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
            console.log("🚀 ~ file: StoreProducts.js ~ line 214 ~ fetchLoadmore ~ error", error)
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }]}>
                <View style={[styles.row_around_center, { width: '100%', elevation: 1 }]}>
                    <Button style={{ width: Wp('33.33%'), borderRadius: 0, borderRightWidth: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_medium, { color: focus == 1 || focus == 0 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => setFocus(1) & setFilter(true)} mode="outlined">
                        Semua
                    </Button>
                    <Button style={{ width: Wp('33.33%'), borderRadius: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_medium, { color: focus == 2 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => setFocus(2) & setFilter(true)} mode="outlined">
                        Terlaris
                    </Button>
                    <Button icon={focus == 3 ? require('../../../assets/icons/sort-up.png') : focus == 4 ? require('../../../assets/icons/sort-down.png') : null} style={{ width: Wp('33.33%'), borderRadius: 0, borderLeftWidth: 0 }} uppercase={false} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_medium, { color: focus == 3 || focus == 4 ? colors.BlueJaja : colors.BlackGrayScale }]} contentStyle={{ borderRadius: 0 }} onPress={() => {
                        focus == 3 ? setFocus(4) : setFocus(3)
                        setFilter(true)
                    }} mode="outlined">
                        Harga
                    </Button>
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
                                {/* {console.log("🚀 ~ file: StoreProducts.js ~ line 256 ~ StoreProducts ~ reduxmaxProduct", reduxmaxProduct)} */}
                            </ScrollView>

                        </View>
                        : reduxmaxProduct ? null : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
                }

            </View >

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