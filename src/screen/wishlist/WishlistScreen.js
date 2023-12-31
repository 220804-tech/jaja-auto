import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Alert, ScrollView, TouchableOpacity, Settings } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, CardProduct, styles, colors, AppbarSecond, Wp, Hp, Loading, Utils } from '../../export'


export default function WishlistScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const reduxWistlist = useSelector(state => state.profile.wishlist)
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [index, setIndex] = useState(0)
    const [indexChild, setIndexChild] = useState(0)
    const [showChild, setShowChild] = useState(false)
    const [loading, setLoading] = useState(false)

    const [keyword, setKeyword] = useState('')
    const [value, setValue] = useState('')


    useEffect(() => {
        getItem(null)
    }, [])

    const getItem = (text) => {
        if (text) {
            setLoading(true)
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=91d3621an28utlc15bm92p079shhhbec");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/user/wishlist/${reduxUser.id}?keyword=${text ? text : ""}&filter_category=&filter_preorder=&filter_condition=&filter_location=&limit=10&page=1`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_WISHLIST', payload: result.data.wishlist })
                } else {
                    Alert.alert(
                        "Sepertinya ada masalah!",
                        `${result.status.message + " => " + result.status.code}`,
                        [
                            { text: "TUTUP", onPress: () => navigation.goBack() }
                        ],
                        { cancelable: false }
                    );
                }
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                if (String(error).slice(11, String(error).length).replace(" ", " ") === "Network request failed") {
                    ToastAndroid("Tidak dapat terhubung, periksa kembali koneksi anda!")
                } else {
                    Alert.alert(
                        "Error With Status Code 19001",
                        String(error),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                        ]
                    );
                }
            })
        // var myHeaders = new Headers();
        // myHeaders.append("token", red);
        // myHeaders.append("Cookie", "ci_session=i675frc252bb865f11581rdactlukptk");

        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     redirect: 'follow'
        // };

        // fetch(`https://jaja.id/backend/user/wishlist/${reduxUser && reduxUser.id ? reduxUser.id : ""}`, requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         if (result.status.code === 200 || result.status.code === 204) {
        //             dispatch({ type: 'SET_WISHLIST', payload: result.data.wishlist })
        //         } else {
        //             Alert.alert(
        //                 "Sepertinya ada masalah!",
        //                 `${result.status.message + " => " + result.status.code}`,
        //                 [
        //                     { text: "TUTUP", onPress: () => navigation.goBack() }
        //                 ],
        //                 { cancelable: false }
        //             );

        //         }
        //     })
        //     .catch(error => console.log('error', error));
    }
    const handleFilter = (idx, iChild, category) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=91d3621an28utlc15bm92p079shhhbec");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/user/wishlist/keyword=&filter_category=${idx == 3 && category ? category : ''}&filter_preorder=${idx == 2 ? iChild == 1 ? 'T' : 'Y' : ''}&filter_condition=${idx == 1 ? iChild == 1 ? 'baru' : 'pernah dipakai' : ''}&filter_location=&limit=10&page=1`, requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let data = JSON.parse(result)
                    if (data.status.code === 200 || data.status.code === 204) {
                        dispatch({ type: 'SET_WISHLIST', payload: data.data.wishlist })
                    } else {
                        Utils.alertPopUp(data?.status?.message)
                    }
                } catch (error) {
                    Utils.handleError(String(result), 'Error with status code : 190021')
                    console.log("🚀 ~ file: WishlistScreen.js ~ line 125 ~ handleFilter ~ error", error.message)

                }
            }).catch(error => {
                Utils.handleError(error.message, 'Error with status code 190022')
            })
    }

    const handleIndex = (idx, iChild, category) => {
        console.log("file: WishlistScreen.js ~ line 116 ~ handleIndex ~ idx, iChild => ", idx, iChild)
        setIndex(idx)
        if (idx) {
            setShowChild(true)
            if (iChild) {
                setIndexChild(iChild)
                handleFilter(idx, iChild, category)
                setShowChild(false)
            }
        } else {
            setShowChild(false)
            setIndexChild(0)
            getItem(null)
        }
        if (index !== idx) {
            setIndexChild(0)
        }
    }

    return (
        <SafeAreaView style={styles.containerFix}>
            <AppbarSecond handleSearch={(e) => getItem(e)} title='Cari di sini..' />
            {loading ? <Loading /> : null}
            <View style={[styles.containerIn, styles.pb_5, { backgroundColor: colors.White }]}>
                <View style={[styles.column_center, { width: Wp('100%'), height: showChild ? index === 3 ? Hp('25%') : Hp('13%') : Hp('7%'), backgroundColor: colors.White, elevation: 2, position: 'absolute', zIndex: 9999 }]}>
                    <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, height: Hp('7%') }]}>
                        <TouchableOpacity onPress={() => handleIndex(0, null, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 0 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_10, { color: index === 0 ? colors.White : colors.BlackGrayScale }]}>Favorit Kamu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(1, 0, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_10, { color: index === 1 ? colors.White : colors.BlackGrayScale }]}>Kondisi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(2, 0, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_10, { color: index === 2 ? colors.White : colors.BlackGrayScale }]}>Proses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(3, 0, null)} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_10, { color: index === 3 ? colors.White : colors.BlackGrayScale }]}>Kategori</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        showChild ?
                            index === 1 ?
                                <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('6%') }]}>
                                    <TouchableOpacity onPress={() => handleIndex(1, 1, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_10, { color: index === 1 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Baru</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleIndex(1, 2, null)} style={[styles.row_center, styles.py_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_10, { color: index === 1 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Bekas</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                index === 2 ?
                                    <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('6%') }]}>
                                        <TouchableOpacity onPress={() => handleIndex(2, 1, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                            <Text style={[styles.font_10, { color: index === 2 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Stok Tersedia</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleIndex(2, 2, null)} style={[styles.row_center, styles.py_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                            <Text style={[styles.font_10, { color: index === 2 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Pre Order</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    index === 3 ?
                                        <View style={[styles.column, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('18%') }]}>
                                            <View style={[styles.row_between_center, styles.mb_4,]}>
                                                <TouchableOpacity onPress={() => handleIndex(3, 1, 'books')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Books</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 2, 'musics')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Musics</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 3, 'sports')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 3 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 3 ? colors.White : colors.BlackGrayScale }]}>Sports</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 4, 'toys')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 4 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 4 ? colors.White : colors.BlackGrayScale }]}>Toys</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.row_between_center, styles.mb_4,]}>
                                                <TouchableOpacity onPress={() => handleIndex(3, 5, 'electronics')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 5 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 5 ? colors.White : colors.BlackGrayScale }]}>Electronics</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 6, 'fashion')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 6 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 6 ? colors.White : colors.BlackGrayScale }]}>Fashion</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 7, 'travelling')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 7 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 7 ? colors.White : colors.BlackGrayScale }]}>Travelling</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 8, 'cooking')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 8 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 8 ? colors.White : colors.BlackGrayScale }]}>Cooking</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.row_between_center]}>
                                                <TouchableOpacity onPress={() => handleIndex(3, 9, 'art-shop')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 9 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 9 ? colors.White : colors.BlackGrayScale }]}>Art Shop</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 10, 'gaming')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 10 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 10 ? colors.White : colors.BlackGrayScale }]}>Gaming</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 11, 'pets')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 11 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 11 ? colors.White : colors.BlackGrayScale }]}>Pets</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleIndex(3, 12, 'gardening')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 12 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                                    <Text style={[styles.font_10, { color: index === 3 && indexChild === 12 ? colors.White : colors.BlackGrayScale }]}>Gardening</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        : null
                            : null
                    }
                </View>
                <ScrollView contentContainerStyle={styles.pb_5} style={{ marginTop: Hp('7%'), width: Wp('100%') }}>
                    {reduxWistlist && reduxWistlist.length ?
                        <View style={[styles.column, styles.px_3, styles.mb_5]}>
                            <CardProduct scroll={1} data={reduxWistlist} />
                        </View>
                        : <Text style={[styles.font_14, styles.py_5, { height: Hp('100%'), alignSelf: 'center', marginTop: Hp('7%') }]}>Favorit kamu masih kosong!</Text>
                    }
                    {/* <RecomandedHobby /> */}
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}
