import React, { useState, createRef, useCallback, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, RefreshControl, Dimensions, StatusBar, TextInput } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, Loading, Hp, CardProduct, ShimmerCardProduct, Utils, FastImage, ServiceStore } from '../../../export'
import { useDispatch, useSelector, } from 'react-redux'
const { height: hg } = Dimensions.get('screen')

export default function EtalaseProducts() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const data = useSelector(state => state.etalase.searchProduct)
    const categoryName = useSelector(state => state.etalase.categoryName)

    const reduxFilters = useSelector(state => state.etalase.filters)
    const reduxSorts = useSelector(state => state.etalase.sorts)
    const reduxmaxProduct = useSelector(state => state.etalase.maxProduct)
    const reduxSearch = useSelector(state => state.etalase)

    const dispatch = useDispatch()
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [count, setcount] = useState(0)
    const [selectedFilter, setselectedFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(false);
    const [page, setPage] = useState(1);
    const [keyword, setkeyword] = useState('');


    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const searchLoading = useSelector(state => state.etalase.searchLoading)
    const etalaseId = useSelector(state => state.etalase.etalaseId)

    const reduxStore = useSelector(state => state.store.store)



    const handleLoadMore = () => {
        console.log("🚀 ~ file: EtalaseProduct.js ~ line 44 ~ handleLoadMore ~ reduxmaxProduct", reduxmaxProduct)
        if (loadmore === false && !reduxmaxProduct) {
            setLoadmore(true)
            setPage(page + 1)
            fetchLoadmore()
            setTimeout(() => {
                setLoadmore(false)
            }, 4000);
        }
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 3)
    }

    const fetchLoadmore = () => {
        try {
            let obj = {
                toko: reduxStore.id,
                page: keyword ? 1 : page + 1,
                keyword: keyword,
                etalase: etalaseId
            }
            ServiceStore.getEtalaseProducts(obj).then(res => {
                dispatch({ type: 'SET_ETALASE_SEARCH', payload: res?.items?.length ? keyword ? res.items : data.concat(res.items) : [] })
                if (res.canLoadMore) {
                    setPage(page + 1)
                } else {
                    dispatch({ type: 'SET_ETALASE_MAX_SEARCH', payload: true })
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: EtalaseProduct.js ~ line 214 ~ fetchLoadmore ~ error", error)
        }
    }
    const onRefresh = useCallback(() => {
        if (data && data.length) {
            setRefreshing(true);
            fetchLoadmore()
            setTimeout(() => {
                setRefreshing(false)
            }, 2000);
        } else {
            // handleReset()
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
            {searchLoading || loading ? <Loading /> : null}

            <View style={[styles.appBar2]}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <FastImage tintColor={colors.White} style={styles.appBarButton} source={require('../../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%', height: Hp('5%') }]}>
                    <View style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]}>
                        <FastImage style={{ width: 19, height: 19, marginRight: '3%' }} source={require('../../../assets/icons/loupe.png')} />
                        <TextInput
                            returnKeyType='search'
                            onEndEditing={() => fetchLoadmore()}
                            style={{ width: '85%' }}
                            value={keyword}
                            placeholder='Cari produk..'
                            onChangeText={(text) => setkeyword(text)}
                        />
                    </View>
                </View>
            </View>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }, styles.p_3]}>
                {data && data.length ?
                    <View style={[styles.column, { flex: 1, justifyContent: "center", alignItems: 'flex-start' }]}>
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
                            {/* {data & data.length ?
                                : null
                            } */}

                            {reduxmaxProduct ? <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center', color: colors.BlueJaja, width: Wp('100%'), textAlign: 'center' }]}>Semua produk berhasil ditampilkan</Text> : <ShimmerCardProduct />}
                        </ScrollView>

                    </View>
                    : reduxmaxProduct ? null : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
                }
            </View>
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