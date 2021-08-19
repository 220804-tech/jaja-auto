import React, { useEffect, useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ToastAndroid, StyleSheet, ScrollView, Animated, RefreshControl, Dimensions } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, Loading, Hp, CardProduct, ShimmerCardProduct, Utils } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
const { height: hg } = Dimensions.get('screen')

export default function ProductSearchScreen() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const data = useSelector(state => state.search.searchProduct)
    const keyword = useSelector(state => state.search.keywordSearch)
    const reduxFilters = useSelector(state => state.search.filters)
    const reduxSorts = useSelector(state => state.search.sorts)
    const reduxmaxProduct = useSelector(state => state.search.maxProduct)

    const dispatch = useDispatch()
    const [scrollY, setscrollY] = useState(new Animated.Value(0))

    const [auth, setAuth] = useState("")

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


    useEffect(() => {
        EncryptedStorage.getItem("token").then(res => {
            if (res) {
                setAuth(JSON.parse(auth))
            }
        }).catch(err => console.log("Token null : ", err))
        setLoadmore(false)
    }, [])




    const handleFetch = () => {
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


        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=${keyword}&filter_price=&filter_location=${location}&filter_condition=${condition}&filter_preorder=${stock}&filter_brand=&sort=${sort}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: productSearchScreen.js ~ line 12112 ~ handleFetch ~ result", result.data.items)
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
                Utils.CheckSignal().then(res => {
                    if (res.connect == false) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        console.log("saa")
                        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                })
            });

    }

    const handleReset = () => {
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

        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=${keyword}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
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
                Utils.CheckSignal().then(res => {
                    if (res.connect == false) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        console.log("saa")
                        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                })
            });

    }

    const handleFilter = (res, name) => {
        console.log("🚀 ~ file: productSearchScreen.js ~ line 62 ~ handleFilter ~ res", res)
        let newArr = selectedFilter
        selectedFilter.map(item => {
            if (item.status !== "name") {
                newArr.push({
                    'name': res.name,
                    'value': res.value,
                    'status': name
                })
            }
        })
        setselectedFilter(newArr)
        setcount(count + 1)
    }

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }

    const handleSelected = (name, indexParent, indexChild) => {
        if (name === 'filter') {
            let val = reduxFilters[indexParent].name
            let valChild = reduxFilters[indexParent].items[indexChild].value
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
            if (valChild === sort) {
                setSort("")
            } else {
                setSort(valChild)
            }
        }
    }
    const handleLoadMore = () => {
        console.log("reloaddddddddddddddd")
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
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - (hg * 0.77)
    }

    const fetchLoadmore = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/product/search/result?page=${page + 1}&limit=10&keyword=${keyword}&filter_price=&filter_location=${location}&filter_condition=${condition}&filter_preorder=${stock}&filter_brand=&sort=${sort}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    if (result.data.items && result.data.items.length) {
                        dispatch({ type: 'SET_SEARCH', payload: data.concat(result.data.items) })
                    } else {
                        dispatch({ type: 'SET_MAX_SEARCH', payload: true })
                    }
                }
            })
            .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER) & setLoadmore(false));
    }
    const onRefresh = useCallback(() => {
        if (data && data.length) {
            setRefreshing(true);
            setTimeout(() => {
                setRefreshing(false)
            }, 2000);
        } else {
            handleReset()
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%' }]}>
                    <TouchableOpacity style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]} onPress={() => navigation.navigate('Search')}>
                        <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                        <Text numberOfLines={1} style={[styles.font_14, { width: '93%' }]}>{keyword ? keyword : ""}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', backgroundColor: colors.BlueJaja, height: '100%', width: '15%', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                        <Image source={require('../../assets/icons/filter.png')} style={[styles.icon_25, { tintColor: colors.White }]} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }, styles.p_3]}>
                {/* <View style={{ flex: 0, flexDirection: 'row', height: Hp('5%'), width: '100%', justifyContent: 'space-between', marginBottom: '3%' }}> */}
                {/* <ScrollView horizontal={true} style={{ backgroundColor: 'pink', flex: 0, flexDirection: 'row' }} contentContainerStyle={{ flex: 0, flexDirection: 'row' }}> */}
                {/* <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: filter ? colors.BlueJaja : colors.BlackGrey, backgroundColor: filter ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4.5%', paddingVertical: '1%' }}>
                        <Image source={require('../../assets/icons/filter.png')} style={{ width: 15, height: 15, marginRight: '3%', tintColor: filter ? colors.White : colors.BlackGrayScale }} />
                        <Text adjustsFontSizeToFit style={[styles.font_12, { color: filter ? colors.White : colors.BlackGrayScale }]}>Filter</Text>
                    </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => setTerbaru(!terbaru)} style={{ flex: 0, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: terbaru ? colors.BlueJaja : colors.BlackGrey, backgroundColor: terbaru ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4.5%', paddingVertical: '1%', }}>
                        <Text adjustsFontSizeToFit style={[styles.font_12, { color: terbaru ? colors.White : colors.BlackGrayScale }]}>Terbaru</Text>
                    </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => setJabodetabek(!jabodetabek)} style={{ flex: 0, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: jabodetabek ? colors.BlueJaja : colors.BlackGrey, backgroundColor: jabodetabek ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4.5%', paddingVertical: '1%', }}>
                        <Text adjustsFontSizeToFit style={[styles.font_12, { color: jabodetabek ? colors.White : colors.BlackGrayScale }]}>Jabodetabek</Text>
                    </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => image === 0 ? setImage(1) : image === 1 ? setImage(2) : setImage(0) & handleFetch()} style={{ flex: 0, width: 80, flexDirection: 'row', justifyContent: image > 0 ? "space-between" : 'center', alignItems: 'center', borderWidth: 1, borderColor: image > 0 ? colors.BlueJaja : colors.BlackGrey, backgroundColor: image > 0 ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4%', paddingVertical: '1%', }}>
                        <Text adjustsFontSizeToFit style={[styles.font_12, { color: image > 0 ? colors.White : colors.BlackGrayScale }]}>Harga</Text>
                        {image > 0 ?
                            <Image source={require('../../assets/icons/arrow.png')} style={[styles.icon_18, { tintColor: colors.White, transform: [{ rotate: image == 1 ? "90deg" : "270deg" }] }]} />
                            : null}
                        </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => setCondition(!condition) & handleFetch()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: condition ? colors.BlueJaja : colors.BlackGrey, backgroundColor: condition ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4%', paddingVertical: '1%', }}>
                        <Text adjustsFontSizeToFit style={[styles.font_12, { color: condition ? colors.White : colors.BlackGrayScale }]}>Kondisi</Text>
                    </TouchableOpacity> */}
                {/* </ScrollView> */}
                {/* </View> */}
                {loading ? <Loading /> : null}
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

                            {reduxmaxProduct ? <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center', color: colors.BlueJaja, width: Wp('100%'), textAlign: 'center' }]}>Semua produk berhasil ditampilkan</Text> : <ShimmerCardProduct />}
                        </ScrollView>

                    </View>
                    : reduxmaxProduct ? null : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
                }

            </View>

            <ActionSheet ref={actionSheetRef} delayActionSheetDraw={false} containerStyle={{ height: Hp('60%'), padding: '4%' }}>
                <View style={styles.row_between_center}>
                    <Text adjustsFontSizeToFit style={[styles.font_16, styles.my_3, { fontWeight: 'bold', color: colors.BlueJaja, }]}>Filter</Text>
                    <View style={styles.row_around_center}>
                        <TouchableOpacity onPress={handleReset} style={{ paddingLeft: '3%', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_16, styles.my_3, { fontWeight: 'bold', color: colors.YellowJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Reset</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleFetch} style={{ paddingLeft: '3%', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit style={[styles.font_16, styles.my_3, { fontWeight: 'bold', color: colors.BlueJaja, alignSelf: 'flex-start', textAlign: 'right' }]}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {selectedFilter && selectedFilter.length ?
                    <View style={[styles.row, { flexWrap: 'wrap', marginBottom: '4%' }]}>
                        {selectedFilter.map((item, i) => {
                            return (
                                <TouchableOpacity key={String(i) + "m"} onPress={() => console.log("nais")} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: colors.BlueJaja, backgroundColor: colors.BlueJaja, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '1.5%', marginRight: '3%', marginTop: '3%' }}>
                                    <Text adjustsFontSizeToFit style={[styles.font_14, { color: colors.White }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null}

                <ScrollView style={styles.mb_5}>
                    {reduxFilters && reduxFilters.length ?
                        reduxFilters.map((item, index) => {
                            return (
                                <View key={String(index) + "s"} style={[styles.mb_4]}>
                                    <Text adjustsFontSizeToFit style={[styles.font_16, { fontWeight: 'bold', color: colors.BlackGrayScale }]}>{item.name}</Text>
                                    <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                        {item.items.map((child, idx) => {
                                            return (
                                                <TouchableOpacity onPress={() => handleSelected('filter', index, idx)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === location || child.value === condition || child.value === stock ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === location || child.value === condition || child.value === stock ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
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
                            <Text adjustsFontSizeToFit style={[styles.font_16, { fontWeight: 'bold', color: colors.BlackGrayScale }]}>Urutkan</Text>
                            <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {reduxSorts.map((child, idx) => {
                                    return (
                                        <TouchableOpacity key={String(idx) + "C"} onPress={() => handleSelected('sort', null, idx)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === sort ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === sort ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
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