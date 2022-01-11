import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, FlatList, ToastAndroid } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useNavigation, colors, styles, Wp, CheckSignal, ServiceStore, useFocusEffect, Utils, AppbarSecond, ServiceProduct, ServiceCategory, } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
export default function SearchScreen(props) {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const reduxSlug = useSelector(state => state.search.slug)
    const reduxStore = useSelector(state => state.store.store)
    const reduxAuth = useSelector(state => state.auth.auth)

    const [count, setCount] = useState(0)
    const [historySearch, sethistorySearch] = useState([])
    const [storeSearch, setstoreSearch] = useState([])
    const [productSearch, setproductSearch] = useState([])
    const [categorySearch, setcategorySearch] = useState([])

    const [slug, setSlug] = useState(['Badminton', 'Basketball', 'Cooking', 'Cycling', 'Fishing', 'Football', 'Photography', 'Reading'])
    const [focus, setFocus] = useState(true)

    const reduxLoad = useSelector(state => state.product.productLoad)

    useEffect(() => {
        getItem();
    }, [])

    useFocusEffect(
        useCallback(() => {
            dispatch({ type: 'SET_MAX_SEARCH', payload: false })
            setFocus(true)
        }, []),
    );
    const getItem = () => {
        try {
            EncryptedStorage.getItem('historySearching').then(res => {
                if (res) {
                    sethistorySearch(JSON.parse(res))
                } else {
                    let data = []
                    EncryptedStorage.setItem("historySearching", JSON.stringify(data))
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: SearchScreen.js ~ line 33 ~ getItem ~ error", error)
        }

    }

    const handleSearch = (text) => {
        if (text) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/product/search?limit=5&keyword=${text}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setproductSearch([])
                    if (result.status.code == 200 || result.status.code == 204) {
                        setstoreSearch(result.data.store)
                        if (result.data.product.length) {
                            setproductSearch(result.data.product)
                        } else {
                            setproductSearch([])
                        }

                        if (result.data.category.length) {
                            setcategorySearch(result.data.category)
                        } else {
                            setcategorySearch([])
                        }
                        setCount(count + 1)
                    }
                }).catch(error => console.log('error', error));
        } else {
            console.log("test")
            setproductSearch([])
            setstoreSearch([])
            setCount(0)
        }



    }

    const handleClear = () => {
        let data = []
        EncryptedStorage.setItem('historySearching', JSON.stringify(data))
        sethistorySearch(data)
        setCount(count + 1)
    }



    const handleShowDetail = item => {
        console.log("🚀 ~ file: SearchScreen.js ~ line 106 ~ SearchScreen ~ item", item)
        try {
            if (!reduxLoad) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                if (!props.gift) {
                    navigation.push("Product")
                    handleSaveKeyword(res.slug)
                } else {
                    dispatch({ type: 'SET_GIFT', payload: item })
                    dispatch({ type: 'SET_PRODUCT_TEMPORARY', payload: {} })
                    dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
                    navigation.push("GiftDetails")
                }
                dispatch({ type: 'SET_PRODUCT_TEMPORARY', payload: item })
                dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
                dispatch({ type: 'SET_SLUG', payload: item.slug })

                ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
                    setTimeout(() => dispatch({ type: 'SET_PRODUCT_LOAD', payload: false }), 500);
                    if (res?.status?.code === 400) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        navigation.goBack()
                    } else {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                    }
                })
            }
        } catch (error) {
            console.log("🚀 ~ file: SearchScreen.js ~ line 138 ~ SearchScreen ~ error", error)
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
        }

    }

    const handleSaveKeyword = (keyword) => {
        console.log("🚀 ~ file: SearchScreen.js ~ line 145 ~ handleSaveKeyword ~ keyword", keyword)
        dispatch({ type: 'SET_KEYWORD', payload: String(keyword).toLocaleLowerCase() })

        EncryptedStorage.getItem('historySearching').then(res => {
            console.log("🚀 ~ file: SearchScreen.js ~ line 149 ~ EncryptedStorage.getItem ~ res", res)
            if (res) {
                let data = JSON.parse(res);
                if (!data.includes(keyword)) {
                    data.push(String(keyword).toLocaleLowerCase())
                    EncryptedStorage.setItem("historySearching", JSON.stringify(data))
                }
            }
        })
    }
    const handleSearchInput = (text) => {
        console.log("🚀 ~ file: SearchScreen.js ~ line 102 ~ handleSearchInput ~ text", text)
        if (text && String(text).length >= 1) {
            handleFetch(text)
            handleSaveKeyword(text)
        } else {
            console.log('handleSearchInputt', text.length)
            setproductSearch([])
            setstoreSearch([])
            setCount(0)
            setSlug(['Badminton', 'Basketball', 'Cooking', 'Cycling', 'Fishing', 'Football', 'Photography', 'Reading'])
        }

    }

    const handleFetch = (keyword) => {
        let text = String(keyword).toLocaleLowerCase();
        dispatch({ type: 'SET_SEARCH_LOADING', payload: true })
        navigation.navigate('ProductSearch')
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        dispatch({ type: 'SET_CATEGORY_NAME', payload: null })

        dispatch({ type: 'SET_SEARCH', payload: [] })
        dispatch({ type: 'SET_FILTERS', payload: [] })
        dispatch({ type: 'SET_SORTS', payload: [] })
        dispatch({ type: 'SET_KEYWORD', payload: '' })
        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=50&keyword=${text}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
            .then(response => response.json())
            .then(result => {
                dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                dispatch({ type: 'SET_KEYWORD', payload: text })
                dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
            })
            .catch(error => {
                dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
                Utils.handleError(error, "Error with status code : 12050")
            });
        dispatch({ type: 'SET_SLUG', payload: String(text).toLocaleLowerCase() })
        setTimeout(() => {
            CheckSignal().then(resp => {
                handleLoopSignal(resp, text)
                if (resp.connect === false) {
                    setTimeout(() => {
                        CheckSignal().then(respo => {
                            handleLoopSignal(respo, text)
                        })
                    }, 7000);
                }
            })
        }, 7000);
    }

    const handleLoopSignal = (signal, text) => {
        if (signal.connect === true) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(`https://jaja.id/backend/product/search/result?page=1&limit=20&keyword=${text}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: SearchScreen.js ~ line 127 ~ handleFetch ~ result", result.data)
                    dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                    dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                    dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                    dispatch({ type: 'SET_KEYWORD', payload: text })
                })
                .catch(error => {
                    Utils.handleError(error, "Error with status code : 12050")
                });
        } else {
            ToastAndroid.show("Periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }


    const handleSelectedToko = (item) => {
        if (reduxStore && Object.keys(reduxStore).length) {
            if (reduxStore.name != item.name) {
                dispatch({ "type": 'SET_STORE', payload: {} })
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
            }
        }
        ServiceStore.getStore(item.slug, reduxAuth).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE', payload: res })
                navigation.navigate('Store')
            }
        })
        dispatch({ type: 'SET_CATEGORY_NAME', payload: null })

        let obj = {
            slug: item.slug,
            page: 1,
            limit: 100,
            keyword: '',
            price: '',
            condition: '',
            preorder: '',
            brand: '',
            sort: 'produk.id_produk-desc',
        }

        ServiceStore.getStoreProduct(obj).then(res => {
            console.log("🚀 ~ file: SearchScreen.js ~ line 234 ~ ServiceStore.getStoreProduct ~ res", res)
            if (res) {
                dispatch({ "type": 'SET_NEW_PRODUCT', payload: res.items })
            }
        })
        obj.sort = ''
        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
                dispatch({ "type": 'SET_STORE_FILTER', payload: res.filters })
                dispatch({ "type": 'SET_STORE_SORT', payload: res.sorts })
            }
        })
    }

    const handleSelectedCategory = (res) => {
        navigation.navigate('ProductSearch')
        ServiceCategory.getCategroys(res.slug, dispatch);
        handleSaveKeyword(res.slug)
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
            <AppbarSecond autofocus={true} handleSearch={handleSearch} title='Cari hobimu disini..' handleSubmit={handleFetch} />
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }, styles.p_3]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {productSearch && productSearch.length || storeSearch.length || categorySearch.length ?
                        <View style={styles.column}>
                            <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]}>Berdasarkan Kategori</Text>
                            {categorySearch && categorySearch.length > 0 ?
                                <FlatList
                                    data={categorySearch}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => String(index + 4) + 'XA'}
                                    extraData={count}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity onPress={() => handleSelectedCategory(item)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: '2%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                <Image style={[styles.mr_2, { height: Wp('8%'), width: Wp('8%'), borderRadius: 100 }]} source={{ uri: item.icon }} />
                                                <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrey }]}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
                                : <Text numberOfLines={1} style={[styles.font_12, styles.mb_3, { color: colors.BlackGrey }]}>- Kategori tidak ditemukan</Text>
                            }
                            <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]} >Berdasarkan pencarian</Text>
                            {productSearch && productSearch.length > 0 ?
                                <FlatList
                                    data={productSearch}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => String(index + 3) + 'SX'}
                                    extraData={productSearch}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                {Object.keys(item).length ?
                                                    <TouchableOpacity onPress={() => handleShowDetail(item)} style={{ paddingVertical: '2.5%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                        <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrey }]}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                            </>
                                        )
                                    }} />
                                : <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrey }]}>- Produk tidak ditemukan</Text>
                            }
                            <View style={[styles.column, styles.py_3]}>
                                <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]} >Toko</Text>
                                {storeSearch && storeSearch.length > 0 ?
                                    <FlatList
                                        data={storeSearch}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => String(index + 4) + 'XA'}
                                        extraData={count}
                                        renderItem={({ item }) => {
                                            return (
                                                <TouchableOpacity onPress={() => handleSelectedToko(item)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: '2%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                    <Image style={[styles.mr_2, { height: Wp('8%'), width: Wp('8%'), borderRadius: 100, resizeMode: 'contain' }]} source={{ uri: item.image }} />
                                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrey }]}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        }} />
                                    : <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrey }]}>- Toko tidak ditemukan</Text>
                                }
                            </View>
                        </View>
                        :
                        historySearch.length ?
                            <View style={styles.column}>
                                <View style={[styles.row_between_center, styles.mb_5]}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]}>Riwayat Pencarian</Text>
                                    <TouchableOpacity onPress={handleClear} style={{ width: '20%' }}>
                                        <Text style={[styles.font_14, { color: colors.BlueJaja, textAlign: 'center' }]} >Clear</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={historySearch}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => String(index + 1) + "SA"}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity onPress={() => handleSearchInput(item)} style={styles.row}>
                                                <Image style={[styles.icon_24, styles.mr_3, styles.mb_4, { tintColor: colors.BlackGrey }]} source={require('../../assets/icons/history.png')} />
                                                <Text style={[styles.font_14, { color: colors.BlackGrey }]}>{String(String(item.replace("-", " ")).replace("-", " ")).replace("-", " ")}</Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
                            </View>
                            :
                            <View style={styles.column}>
                                <View style={[styles.row_between_center, styles.mb_5]}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]} >Rekomendasi</Text>
                                </View>
                                <FlatList
                                    data={slug}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => String(index + 2) + 'LK'}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => handleSearchInput(item)} style={[styles.row_start_center, styles.mb_5]}>
                                                <Image style={[styles.icon_23, styles.mr_3, { tintColor: colors.BlackGrey }]} source={require('../../assets/icons/star.png')} />
                                                <Text style={[styles.font_14, { color: colors.BlackGrey }]}>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
                            </View>
                    }
                </ScrollView>
                {/* <View style={{ flex: 1, width: '100%', height: '50%' }}>

                </View> */}
            </View>

        </SafeAreaView >
    )
}
