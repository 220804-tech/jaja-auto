import React, { useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, RefreshControl, Dimensions, StatusBar } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, Loading, Hp, CardProduct, ShimmerCardProduct, Utils, FastImage } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
const { height: hg } = Dimensions.get('screen')

export default function ProductSearchScreen() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const data = useSelector(state => state.search.searchProduct)
    const keyword = useSelector(state => state.search.keywordSearch)
    const categoryName = useSelector(state => state.search.categoryName)

    const reduxFilters = useSelector(state => state.search.filters)
    const reduxSorts = useSelector(state => state.search.sorts)
    const reduxmaxProduct = useSelector(state => state.search.maxProduct)
    const reduxSearch = useSelector(state => state.search)

    const dispatch = useDispatch()
    const [scrollY, setscrollY] = useState(new Animated.Value(0))
    const [count, setcount] = useState(0)
    const [selectedFilter, setselectedFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(false);
    const [page, setPage] = useState(1);

    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const searchLoading = useSelector(state => state.search.searchLoading)





    const handleFetch = () => {
        try {
            actionSheetRef.current?.setModalVisible(false)
            dispatch({ type: 'SET_MAX_SEARCH', payload: false })
            setTimeout(() => {
                setLoading(true)
            }, 200);
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            setPage(1)
            fetch(`https://jaja.id/backend/product/${categoryName ? 'category/' + categoryName : 'search/result'}?page=1&limit=40&keyword=${categoryName ? '' : keyword}&filter_category=${categoryName}&filter_price=&filter_location=${location}&filter_condition=${condition}&filter_preorder=${stock}&filter_brand=&sort=${sort}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: productSearchScreen.js ~ line 61 ~ handleFetch ~ result", result)
                    if (result.status.code === 200 || result.status.code === 204) {
                        dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500);
                    // dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                    // dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                })
                .catch(error => {
                    Utils.handleError(error.message, 'Error with status code : 16001')
                });
        } catch (error) {
            Utils.handleError(error.message, 'Error with status code : 21087')
        }
    }

    const handleReset = () => {
        try {
            actionSheetRef.current?.setModalVisible(false)
            dispatch({ type: 'SET_MAX_SEARCH', payload: false })
            setTimeout(() => {
                setLoading(true)
            }, 200);
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            setLocation("")
            setCondition("")
            setStock("")
            setSort('')
            setPage(1)

            fetch(`https://jaja.id/backend/product/${categoryName ? 'category/' + categoryName : 'search/result'}?page=1&limit=40&keyword=${categoryName ? '' : keyword}&filter_category=${categoryName}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: productSearchScreen.js ~ line 12112 ~ handleFetch ~ result", result)
                    if (result.status.code === 200 || result.status.code === 204) {
                        dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500);
                    // dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                    // dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                })
                .catch(error => {
                    Utils.handleError('Error with status code : 130001')
                    console.log(error.message)

                });

        } catch (error) {
            Utils.handleError(error.message, 'Error with status code : 21088')
        }
    }

    const handleFilter = () => {
        if (reduxFilters && reduxFilters.length) {
            setLoading(false)
            actionSheetRef.current?.setModalVisible(true)
        } else {
            setLoading(true)
            setTimeout(() => {
                if (reduxFilters && reduxFilters.length) {
                    setLoading(false)
                    actionSheetRef.current?.setModalVisible(true)
                } else {
                    setLoading(true)
                    setTimeout(() => {
                        if (reduxFilters && reduxFilters.length) {
                            setLoading(false)
                            actionSheetRef.current?.setModalVisible(true)
                        }
                    }, 2500);
                }
            }, 2500);
        }

    }

    const handleSelected = (name, indexParent, indexChild) => {
        console.log("🚀 ~ file: productSearchScreen.js ~ line 148 ~ handleSelected ~ name, indexParent, indexChild", name, indexParent, indexChild)

        if (name === 'filter') {
            let val = reduxFilters[indexParent].name
            let valChild = reduxFilters[indexParent].items[indexChild].value
            console.log("🚀 ~ file: productSearchScreen.js ~ line 153 ~ handleSelected ~ valChild", valChild)
            if (val === "Lokasi") {
                if (location === valChild) {
                    setLocation("")
                } else {
                    setLocation(valChild)
                }
            } else if (val === "Kondisi") {
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

            }
            // dispatch({ type: 'SET_SEARCH', payload: result.data.items })
            // dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
            // dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
            // dispatch({ type: 'SET_KEYWORD', payload: text })
        } else if (name === "sort") {
            let valChild = reduxSorts[indexChild].value
            console.log("🚀 ~ file: productSearchScreen.js ~ line 180 ~ handleSelected ~ valChild", valChild)
            if (valChild === sort) {
                setSort("")
            } else {
                setSort(valChild)
            }
        }
    }
    const handleLoadMore = () => {
        if (loadmore === false) {
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
        console.log("🚀 ~ file: productSearchScreen.js ~ line 199 ~ fetchLoadmore ~ data?.length", data?.length)
        try {
            if (data?.length <= 80) {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                fetch(`https://jaja.id/backend/product/search/result?page=${page + 1}&limit=40&keyword=${keyword}&filter_price=&filter_location=${location}&filter_condition=${condition}&filter_preorder=${stock}&filter_brand=&sort=${sort}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log("🚀 ~ file: productSearchScreen.js ~ line 208 ~ fetchLoadmore ~ result", result)
                        if (result.status.code === 200) {
                            if (result.data.items && result.data.items.length) {
                                dispatch({ type: 'SET_SEARCH', payload: data.concat(result.data.items) })
                            } else {
                                dispatch({ type: 'SET_MAX_SEARCH', payload: true })
                            }
                        }
                    })
                    .catch(error => Utils.alertPopUp(String(error)) & setLoadmore(false));
            } else {
                dispatch({ type: 'SET_MAX_SEARCH', payload: true })
            }
        } catch (error) {
            Utils.handleError(error.message, 'Error with status code : 21090')

        }
    }
    const onRefresh = useCallback(() => {
        if (data && data.length) {
            setRefreshing(true);
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
                    <FastImage tintColor={colors.White} style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />

                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%', height: Hp('5%') }]}>
                    <TouchableOpacity style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]} onPress={() => navigation.navigate('Search')}>
                        <FastImage style={{ width: 19, height: 19, marginRight: '3%' }} source={require('../../assets/icons/loupe.png')} />
                        {keyword ?
                            <Text numberOfLines={1} style={[styles.font_14, { width: '93%' }]}>{keyword}</Text>
                            : null}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFilter} style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', backgroundColor: colors.BlueJaja, height: '100%', width: '15%', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                        <FastImage tintColor={colors.White} style={styles.icon_25} source={require('../../assets/icons/filter.png')} />

                    </TouchableOpacity>
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

                            {reduxmaxProduct || data.length < 2 ? <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center', color: colors.BlueJaja, width: Wp('100%'), textAlign: 'center' }]}>Semua produk berhasil ditampilkan</Text> : <ShimmerCardProduct />}
                        </ScrollView>

                    </View>
                    : reduxmaxProduct ? null : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
                }

            </View>

            <ActionSheet ref={actionSheetRef} delayActionSheetDraw={false} containerStyle={{ height: Hp('60%'), padding: '4%' }}>
                <View style={[styles.row_between_center, styles.mb_3, { width: '100%' }]}>
                    <Text adjustsFontSizeToFit style={[styles.font_16, styles.T_semi_bold, { width: '50%', color: colors.BlueJaja, }]}>Filter</Text>
                    <View style={[styles.row_center_end]}>
                        <TouchableOpacity onPress={handleReset} style={{ paddingHorizontal: '2%', justifyContent: 'center', marginRight: '2%' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_14, styles.T_semi_bold, styles.mr_3, { color: colors.YellowJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Reset</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleFetch} style={{ paddingHorizontal: '2%', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_14, styles.T_semi_bold, { color: colors.BlueJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {selectedFilter && selectedFilter.length ?
                    <View style={[styles.row, { flexWrap: 'wrap', marginBottom: '4%' }]}>
                        {selectedFilter.map((item, i) => {
                            return (
                                <TouchableOpacity key={String(i) + "AW"} onPress={() => console.log("nais")} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: colors.BlueJaja, backgroundColor: colors.BlueJaja, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '1.5%', marginRight: '3%', marginTop: '3%' }}>
                                    <Text adjustsFontSizeToFit style={[styles.font_14, { color: colors.White }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null} */}

                <ScrollView style={styles.mb_5}>
                    {reduxFilters && reduxFilters.length ?
                        reduxFilters.map((item, index) => {
                            return (
                                <View key={String(index) + "XP"} style={[styles.mb_4]}>
                                    <Text adjustsFontSizeToFit style={[styles.font_16, { fontFamily: 'SignikaNegative-SemiBold', color: colors.BlackGrayScale }]}>{item.name}</Text>
                                    <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                        {item.items.map((child, idx) => {
                                            return (
                                                <TouchableOpacity key={String(idx) + 'LJ'} onPress={() => {
                                                    console.log(child)
                                                    handleSelected('filter', index, idx)
                                                }} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === location || child.value === condition || child.value === stock ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === location || child.value === condition || child.value === stock ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
                                                    <Text adjustsFontSizeToFit style={[styles.font_14, { color: child.value === location || child.value === condition || child.value === stock ? colors.White : colors.BlackGrayScale }]}>{child.name}</Text>
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
                            <Text adjustsFontSizeToFit style={[styles.font_16, { fontFamily: 'SignikaNegative-SemiBold', color: colors.BlackGrayScale }]}>Urutkan</Text>
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