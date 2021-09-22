import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, TextInput, FlatList, ToastAndroid } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useNavigation, colors, styles, Wp, CheckSignal, ServiceStore, useFocusEffect, Utils, } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
export default function SearchScreen() {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const reduxSlug = useSelector(state => state.search.slug)
    const reduxStore = useSelector(state => state.store.store)

    const [count, setCount] = useState(0)
    const [historySearch, sethistorySearch] = useState([])
    const [storeSearch, setstoreSearch] = useState([])
    const [productSearch, setproductSearch] = useState([])
    const [slug, setSlug] = useState(['Badminton', 'Basketball', 'Cooking', 'Cycling', 'Fishing', 'Football', 'Photography', 'Reading'])
    const [focus, setFocus] = useState(true)


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
        console.log(`https://jaja.id/backend/product/search?limit=10&keyword=${text}`)
        if (text) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/product/search?limit=10&keyword=${text}`, requestOptions)
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

    const handleSelected = (res) => {
        console.log("🚀 ~ file: SearchScreen.js ~ line 85 ~ handleSelected ~ res", res)
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.push("Product", { slug: res.slug, image: null })
        handleSaveKeyword(res.name)
    }

    const handleSaveKeyword = (text) => {
        let newArr = historySearch;
        let keyword = String(text).toLocaleLowerCase()
        newArr.push(keyword)
        EncryptedStorage.getItem('historySearching').then(res => {
            if (res) {
                const HashSet = new Set(JSON.parse(res))
                HashSet.add(keyword)
                sethistorySearch(Array.from(HashSet))
                EncryptedStorage.setItem("historySearching", JSON.stringify(Array.from(HashSet)))
            }
        })
        sethistorySearch(newArr)
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
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        dispatch({ type: 'SET_SEARCH', payload: [] })
        dispatch({ type: 'SET_FILTERS', payload: [] })
        dispatch({ type: 'SET_SORTS', payload: [] })
        dispatch({ type: 'SET_KEYWORD', payload: '' })
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
        dispatch({ type: 'SET_SLUG', payload: String(text).toLocaleLowerCase() })
        navigation.navigate('ProductSearch')
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
        console.log("🚀 ~ file: SearchScreen.js ~ line 195 ~ handleSelectedToko ~ item", item)
        if (reduxStore && Object.keys(reduxStore).length) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 259 ~ handleStore ~ reduxStore", reduxStore)
            if (reduxStore.name != item.name) {
                dispatch({ "type": 'SET_STORE', payload: {} })
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
            }
        }
        ServiceStore.getStore(item.slug).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE', payload: res })
                navigation.navigate('Store')
            }
        })
        let obj = {
            slug: item.slug,
            page: 1,
            limit: 30,
            keyword: '',
            price: '',
            condition: '',
            preorder: '',
            brand: '',
            sort: 'produk.id_produk-desc',
        }

        ServiceStore.getStoreProduct(obj).then(res => {
            if (res) {
                console.log('cari new product')
                dispatch({ "type": 'SET_NEW_PRODUCT', payload: res.items })
            }
        })
        obj.sort = ''
        ServiceStore.getStoreProduct(obj).then(res => {
            console.log("🚀 ~ file: ProductScreen.js ~ line 286 ~ ServiceStore.getStoreProduct ~ obj", obj)
            console.log("🚀 ~ file: ProductScreen.js ~ line 286 ~ ServiceStore.getStoreProduct ~ res", res)
            if (res) {
                console.log('cari all product')
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
            }
        })


        // if (item.slug !== reduxSlug) {
        //     dispatch({ "type": 'SET_STORE', payload: {} })
        //     dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
        // }
        // dispatch({ type: 'SET_SLUG', payload: item.slug })
        // ServiceStore.getStore(item.slug).then(res => {
        //     if (res) {
        //         dispatch({ "type": 'SET_STORE', payload: res })
        //     }
        // })
        // let obj = {
        //     slug: slug,
        //     page: 1,
        //     limit: 10,
        //     keyword: '',
        //     price: '',
        //     condition: '',
        //     preorder: '',
        //     brand: '',
        //     sort: '',
        // }
        // ServiceStore.getStoreProduct(obj).then(res => {
        //     if (res) {
        //         dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
        //     }
        // })
        // if (item.slug !== reduxSlug) {
        //     dispatch({ "type": 'SET_STORE', payload: {} })
        //     dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
        //     dispatch({ type: 'SET_SLUG', payload: item.slug })
        // }
        // ServiceStore.getStore(item.slug).then(res => {
        //     if (res) {
        //         dispatch({ "type": 'SET_STORE', payload: res })
        //     }
        // })
        // let obj = {
        //     slug: item.slug,
        //     page: 1,
        //     limit: 10,
        //     keyword: '',
        //     price: '',
        //     condition: '',
        //     preorder: '',
        //     brand: '',
        //     sort: '',
        // }
        // ServiceStore.getStoreProduct(obj).then(res => {
        //     if (res) {
        //         dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
        //     }
        // })
        // navigation.navigate('Store')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <TextInput keyboardType="name-phone-pad" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={[styles.font_13, { width: '90%', marginBottom: '-1%' }]} placeholder='Cari hobimu disini..' onChangeText={(text) => handleSearch(text)} onSubmitEditing={(value) => handleSearchInput(value.nativeEvent.text)}></TextInput>
                </View>
                {/* <TouchableOpacity style={style.searchBar} onPress={() => navigation.navigate("Search")}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <Text style={styles.font_14}>{text}..</Text>
                </TouchableOpacity> */}
            </View>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }, styles.p_3]}>
                <View style={{ flex: 0, minHeight: '35%', maxHeight: '80%' }}>
                    {productSearch && productSearch.length || storeSearch.length ?
                        <View style={styles.column}>
                            <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]} adjustsFontSizeToFit>Berdasarkan pencarian</Text>
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
                                                    <TouchableOpacity onPress={() => handleSelected(item)} style={{ paddingVertical: '2.5%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                        <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrey }]}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                            </>
                                        )
                                    }} />
                                : <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrey }]}>- Produk tidak ditemukan</Text>
                            }
                            <View style={[styles.column, styles.py_3]}>
                                <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]} adjustsFontSizeToFit>Toko</Text>
                                {storeSearch && storeSearch.length > 0 ?
                                    <FlatList
                                        data={storeSearch}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => String(index + 4) + 'XA'}
                                        extraData={count}
                                        renderItem={({ item }) => {
                                            return (
                                                <TouchableOpacity onPress={() => handleSelectedToko(item)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: '2%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                    <Image style={[styles.mr_2, { height: Wp('9%'), width: Wp('9%'), borderRadius: 100 }]} source={{ uri: item.image }} />
                                                    <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrey }]}>{item.name}</Text>
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
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]} adjustsFontSizeToFit>Riwayat Pencarian</Text>
                                    <TouchableOpacity onPress={handleClear} style={{ width: '20%' }}>
                                        <Text style={[styles.font_14, { color: colors.BlueJaja, textAlign: 'center' }]} adjustsFontSizeToFit>Clear</Text>
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
                                                <Text style={[styles.font_14, { color: colors.BlackGrey }]}>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
                            </View>
                            :
                            <View style={styles.column}>
                                <View style={[styles.row_between_center, styles.mb_5]}>
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]} adjustsFontSizeToFit>Rekomendasi</Text>
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
                </View>
                {/* <View style={{ flex: 1, width: '100%', height: '50%' }}>

                </View> */}
            </View>

        </SafeAreaView >
    )
}
