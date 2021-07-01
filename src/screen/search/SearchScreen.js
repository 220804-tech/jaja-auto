import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, TextInput, FlatList, ToastAndroid } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useNavigation, colors, styles, Wp, CheckSignal, ServiceStore, useFocusEffect } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
export default function SearchScreen() {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const reduxSlug = useSelector(state => state.search.slug)
    const [count, setCount] = useState(0)
    const [historySearch, sethistorySearch] = useState([])
    const [storeSearch, setstoreSearch] = useState([])
    const [productSearch, setproductSearch] = useState([])
    const [slug] = useState(['Badminton', 'Basketball', 'Cooking', 'Cycling', 'Fishing', 'Football', 'Photography', 'Reading',])


    useEffect(() => {
        getItem();
    }, [])

    useFocusEffect(
        useCallback(() => {
            dispatch({ type: 'SET_MAX_SEARCH', payload: false })
        }, []),
    );
    const getItem = () => {
        try {
            EncryptedStorage.getItem('historySearching').then(res => {
                if (res) {
                    console.log("🚀 ~ file: SearchScreen.js ~ line 24 ~ EncryptedStorage.getItem ~ res", res)
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
                    console.log("🚀 ~ file: SearchScreen.js ~ line 49 ~ handleSearch ~ result", result.data.store)
                    if (result.status.code == 200) {
                        setCount(count + 1)
                        if (result.data.product.length) {
                            setproductSearch(result.data.product)
                        } else {
                            setproductSearch([{}])
                        }
                        setstoreSearch(result.data.store)
                    }
                }).catch(error => console.log('error', error));
        } else {
            console.log("test")
            setproductSearch([])
            setstoreSearch([])
        }
    }

    const handleClear = () => {
        let data = []
        EncryptedStorage.setItem('historySearching', JSON.stringify(data))
        sethistorySearch(data)
    }

    const handleSelected = (res) => {
        handleFetch(res.name)
        handleSaveKeyword(res.name)
    }

    const handleSaveKeyword = (keyword) => {
        let newArr = historySearch;
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
        if (text) {
            handleFetch(text)
            handleSaveKeyword(text)
        }

    }

    const handleFetch = (text) => {
        // if (text) {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=bk461otlv7le6rfqes5eim0h9cf99n3u");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=10&keyword=${text}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
            .then(response => response.json())
            .then(result => {
                dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                dispatch({ type: 'SET_KEYWORD', payload: text })
            })
            .catch(error => {
                CheckSignal().then(res => {
                    if (res.connect == false) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                })
            });
        dispatch({ type: 'SET_SLUG', payload: text })

        navigation.navigate('ProductSearch')
        // } 
    }
    const handleSelectedToko = (item) => {
        if (item.slug !== reduxSlug) {
            dispatch({ "type": 'SET_STORE', payload: {} })
            dispatch({ "type": 'SET_STORE_PRODUCT', payload: [] })
        }
        dispatch({ type: 'SET_SLUG', payload: item.slug })
        ServiceStore.getStore(item.slug).then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE', payload: res })
            }
        })
        ServiceStore.getStoreProduct(item.slug, "", "", "", "", "", "").then(res => {
            if (res) {
                dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
            }
        })
        navigation.navigate('Store')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <TextInput keyboardType="name-phone-pad" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={styles.font_14} placeholder='Cari hobimu sekarang..' onChangeText={(text) => handleSearch(text)} onSubmitEditing={(value) => handleSearchInput(value.nativeEvent.text)}></TextInput>
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
                            <FlatList
                                data={productSearch}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                extraData={productSearch}
                                renderItem={({ item }) => {
                                    console.log("🚀 ~ file: SearchScreen.js ~ line 178 ~ SearchScreen ~ item", item)
                                    return (
                                        <>
                                            {Object.keys(item).length ?
                                                <TouchableOpacity onPress={() => handleSelected(item)} style={{ paddingVertical: '2.5%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrey }]}>{item.name}</Text>
                                                </TouchableOpacity>
                                                : null}
                                        </>
                                    )
                                }} />
                            <View style={[styles.column, styles.py_3]}>
                                <Text style={[styles.font_14, { color: colors.BlueJaja, marginBottom: '2%' }]} adjustsFontSizeToFit>Toko</Text>
                                <FlatList
                                    data={storeSearch}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    extraData={count}
                                    renderItem={({ item }) => {
                                        console.log("🚀 ~ file: SearchScreen.js ~ line 213 ~ SearchScreen ~ item", item)
                                        return (
                                            <TouchableOpacity onPress={() => handleSelectedToko(item)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: '2%', marginBottom: '2%', backgroundColor: colors.White, borderBottomWidth: 0.5, borderColor: colors.Silver }}>
                                                <Image style={[styles.mr_2, { height: Wp('9%'), width: Wp('9%'), borderRadius: 100 }]} source={{ uri: item.image }} />

                                                <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrey }]}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
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
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={({ item, index }) => {
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
                                    <Text style={[styles.font_14, { color: colors.BlueJaja }]} adjustsFontSizeToFit>Recomendation</Text>
                                </View>
                                <FlatList
                                    data={slug}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => String(index)}
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
