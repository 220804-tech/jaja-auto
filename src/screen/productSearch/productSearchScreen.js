import React, { useEffect, useState, createRef } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, TextInput, FlatList, ToastAndroid, StyleSheet, ScrollView } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheet from "react-native-actions-sheet";
import { useNavigation, colors, styles, Wp, CheckSignal, Loading, Hp, Ps, ServiceProduct, FastImage } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
import * as Progress from 'react-native-progress';

export default function ProductSearchScreen() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const data = useSelector(state => state.search.searchProduct)
    const keyword = useSelector(state => state.search.keywordSearch)
    const reduxFilters = useSelector(state => state.search.filters)
    const reduxSorts = useSelector(state => state.search.sorts)
    const dispatch = useDispatch()

    const [auth, setAuth] = useState("")

    const [count, setcount] = useState(0)
    const [filter, setFilter] = useState(false);
    const [brand, setBrand] = useState(false);
    const [jabodetabek, setJabodetabek] = useState(false);
    const [terbaru, setTerbaru] = useState(false);
    const [selectedFilter, setselectedFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(false);

    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        EncryptedStorage.getItem("token").then(res => {
            if (res) {
                setAuth(JSON.parse(auth))
            }
        }).catch(err => console.log("Token null : ", err))
    }, [])




    const handleFetch = () => {
        actionSheetRef.current?.setModalVisible(false)
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
        console.log("🚀 ~ file: productSearchScreen.js ~ line 53 ~ handleFetch ~ keyword", keyword)
        console.log("🚀 ~ file: productSearchScreen.js ~ line 54 ~ handleFetch ~ location", location)
        console.log("🚀 ~ file: productSearchScreen.js ~ line 55 ~ handleFetch ~ condition", condition)
        console.log("🚀 ~ file: productSearchScreen.js ~ line 56 ~ handleFetch ~ stock", stock)
        console.log("🚀 ~ file: productSearchScreen.js ~ line 57 ~ handleFetch ~ sort", sort)

        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=20&keyword=${keyword}&filter_price=&filter_location=${location}&filter_condition=${condition}&filter_preorder=${stock}&filter_brand=&sort=${sort}`, requestOptions)
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
                CheckSignal().then(res => {
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


        fetch(`https://jaja.id/backend/product/search/result?page=1&limit=20&keyword=${keyword}&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
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
                CheckSignal().then(res => {
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
            console.log("🚀 ~ file: productSearchScreen.js ~ line 120 ~ handleSelected ~ valChild", valChild)

            console.log("🚀 ~ file: productSearchScreen.js ~ line 119 ~ handleSelected ~ val", val)
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
        if (loadmore === false) {
            setLoadmore(true)
            setTimeout(() => {
                setLoadmore(false)
            }, 4000);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%' }]}>
                    <TouchableOpacity style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]} onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                        <Text numberOfLines={1} style={[styles.font_14, { width: '93%' }]}>{keyword ? keyword : ""}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter(true) & actionSheetRef.current?.setModalVisible()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', backgroundColor: colors.BlueJaja, height: '100%', width: '15%', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                        <Image source={require('../../assets/icons/filter.png')} style={[styles.icon_25, { tintColor: colors.White }]} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.column, { flex: 1, backgroundColor: colors.White }, styles.p_2]}>
                {/* <View style={{ flex: 0, flexDirection: 'row', height: Hp('5%'), width: '100%', justifyContent: 'space-between', marginBottom: '3%' }}> */}
                {/* <ScrollView horizontal={true} style={{ backgroundColor: 'pink', flex: 0, flexDirection: 'row' }} contentContainerStyle={{ flex: 0, flexDirection: 'row' }}> */}
                {/* <TouchableOpacity onPress={() => setFilter(true) & actionSheetRef.current?.setModalVisible()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: filter ? colors.BlueJaja : colors.BlackGrey, backgroundColor: filter ? colors.BlueJaja : colors.White, borderRadius: 15, paddingHorizontal: '4.5%', paddingVertical: '1%' }}>
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
                    <View style={[styles.column, { flex: 1 }]}>
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => String(index)}
                            contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            onPress={() => handleShowDetail(item)}
                                            style={[Ps.cardProduct, { width: Wp('43%') }]}
                                            key={index}>
                                            {item.isDiscount ?
                                                <Text adjustsFontSizeToFit style={Ps.textDiscount}>{item.discount}%</Text> : null}
                                            {/* <Image style={Ps.imageProduct}
                                            resizeMethod={"scale"}
                                            resizeMode={item.image ? "cover" : "center"}
                                            source={{ uri: item.image }}
                                        /> */}
                                            <FastImage
                                                style={Ps.imageProduct}
                                                source={{
                                                    uri: item.image,
                                                    headers: { Authorization: 'someAuthToken' },
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                            <View style={Ps.bottomCard}>
                                                <Text adjustsFontSizeToFit
                                                    numberOfLines={2}
                                                    style={Ps.nameProduct}>
                                                    {item.name}
                                                </Text>
                                                {item.isDiscount ?
                                                    <>
                                                        <Text adjustsFontSizeToFit style={Ps.priceBefore}>{item.price}</Text>
                                                        <Text adjustsFontSizeToFit style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                                    </>
                                                    :
                                                    <Text adjustsFontSizeToFit style={Ps.price}>{item.price}</Text>
                                                }
                                                <View style={Ps.location}>
                                                    <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                                    <Text adjustsFontSizeToFit style={Ps.locarionName}>{item.location}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        {loadmore && index === data.length - 1 ?
                                            <View>
                                                <View style={style.content}>
                                                    <View style={style.loading}>
                                                        <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                                                    </View>
                                                </View>
                                                <Text></Text>
                                            </View>
                                            : null}
                                    </View>
                                )
                            }}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0}
                        />

                    </View>
                    : <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center' }]}>Produk tidak ditemukan!</Text>
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
                                <TouchableOpacity onPress={() => console.log("nais")} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: colors.BlueJaja, backgroundColor: colors.BlueJaja, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '1.5%', marginRight: '3%', marginTop: '3%' }}>
                                    <Text adjustsFontSizeToFit style={[styles.font_14, { color: colors.White }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null}

                <ScrollView>
                    {reduxFilters && reduxFilters.length ?
                        reduxFilters.map((item, index) => {
                            console.log("🚀 ~ file: productSearchScreen.js ~ line 138 ~ data.filters.map ~ item", item)
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
                                    console.log("🚀 ~ file: productSearchScreen.js ~ line 295 ~ {reduxSorts.map ~ child", child)
                                    return (
                                        <TouchableOpacity onPress={() => handleSelected('sort', null, idx)} style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: child.value === sort ? colors.BlueJaja : colors.BlackGrey, backgroundColor: child.value === sort ? colors.BlueJaja : colors.White, borderRadius: 11, paddingHorizontal: '3%', paddingVertical: '2%', marginRight: '3%', marginTop: '3%' }}>
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
        width: Wp('100%'),
        backgroundColor: colors.White,
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