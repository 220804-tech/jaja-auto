import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, CardProduct, styles, colors, AppbarSecond, Wp, Hp } from '../../export'


export default function WishlistScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const reduxWistlist = useSelector(state => state.profile.wishlist)
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [index, setIndex] = useState(0)
    const [indexChild, setIndexChild] = useState(0)

    const [keyword, setKeyword] = useState('')
    const [value, setValue] = useState('')


    useEffect(() => {
        getItem()
    }, [])

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=91d3621an28utlc15bm92p079shhhbec");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/user/wishlist/${reduxUser.id}?keyword=${keyword}&filter_category=&filter_preorder=&filter_condition=&filter_location=&limit=10&page=1`, requestOptions)
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
            })
            .catch(error => console.log('error', error));
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
        console.log("file: WishlistScreen.js ~ line 83 ~ handleFilter ~ iChild", iChild)
        console.log("file: WishlistScreen.js ~ line 83 ~ handleFilter ~ idx", index)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=91d3621an28utlc15bm92p079shhhbec");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/user/wishlist/${reduxUser.id}?keyword=&filter_category=${idx == 3 && category ? category : ''}&filter_preorder=${idx == 2 ? iChild == 1 ? 'T' : 'Y' : ''}&filter_condition=${idx == 1 ? iChild == 1 ? 'baru' : 'bekas' : ''}&filter_location=&limit=10&page=1`, requestOptions)
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
            })
            .catch(error => console.log('error', error));
    }

    const handleIndex = (idx, iChild, category) => {
        console.log("file: WishlistScreen.js ~ line 116 ~ handleIndex ~ idx, iChild => ", idx, iChild)
        setIndex(idx)
        if (idx) {
            if (iChild) {
                setIndexChild(iChild)
                handleFilter(idx, iChild, category)
            }
        } else {
            setIndexChild(0)
            getItem()
        }
        if (index !== idx) {
            setIndexChild(0)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppbarSecond handleSearch={(e) => set(e)} title='Favorit' />

            <View style={[styles.column, styles.pb_5, { backgroundColor: colors.White }]}>
                <View style={[styles.column_center, { width: Wp('100%'), height: index ? Hp('13%') : Hp('7%'), backgroundColor: colors.White, elevation: 2, position: 'absolute', zIndex: 9999 }]}>
                    <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, height: Hp('7%') }]}>
                        <TouchableOpacity onPress={() => handleIndex(0, null, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 0 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_12, { color: index === 0 ? colors.White : colors.BlackGrayScale }]}>Favorit Kamu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(1, 0, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_12, { color: index === 1 ? colors.White : colors.BlackGrayScale }]}>Kondisi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(2, 0, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_12, { color: index === 2 ? colors.White : colors.BlackGrayScale }]}>Proses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIndex(3, 0, null)} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                            <Text style={[styles.font_12, { color: index === 3 ? colors.White : colors.BlackGrayScale }]}>Kategori</Text>
                        </TouchableOpacity>
                    </View>
                    {index === 1 ?
                        <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('6%') }]}>
                            <TouchableOpacity onPress={() => handleIndex(1, 1, null) & setIndex(null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                <Text style={[styles.font_12, { color: index === 1 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Baru</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleIndex(1, 2, null)} style={[styles.row_center, styles.py_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 1 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                <Text style={[styles.font_12, { color: index === 1 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Bekas</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        index === 2 ?
                            <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('6%') }]}>
                                <TouchableOpacity onPress={() => handleIndex(2, 1, null)} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                    <Text style={[styles.font_12, { color: index === 2 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Stok Tersedia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleIndex(2, 2, null)} style={[styles.row_center, styles.py_2, { width: Wp('47%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 2 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                    <Text style={[styles.font_12, { color: index === 2 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Pre Order</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            index === 3 ?
                                <View style={[styles.row_between_center, styles.px_2, { width: '100%', backgroundColor: colors.White, elevation: 1, height: Hp('6%') }]}>
                                    <TouchableOpacity onPress={() => handleIndex(3, 1, 'books')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 1 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_12, { color: index === 3 && indexChild === 1 ? colors.White : colors.BlackGrayScale }]}>Books</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleIndex(3, 2, 'musics')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 2 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_12, { color: index === 3 && indexChild === 2 ? colors.White : colors.BlackGrayScale }]}>Musics</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleIndex(3, 3, 'sports')} style={[styles.row_center, styles.py_2, styles.mr_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 3 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_12, { color: index === 3 && indexChild === 3 ? colors.White : colors.BlackGrayScale }]}>Sports</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleIndex(3, 4, 'toys')} style={[styles.row_center, styles.py_2, { width: Wp('22%'), borderWidth: 0.5, borderColor: colors.BlueJaja, backgroundColor: index === 3 && indexChild === 4 ? colors.BlueJaja : colors.White, borderRadius: 5 }]}>
                                        <Text style={[styles.font_12, { color: index === 3 && indexChild === 4 ? colors.White : colors.BlackGrayScale }]}>Toys</Text>
                                    </TouchableOpacity>
                                </View>

                                : null
                    }
                </View>
                <ScrollView contentContainerStyle={styles.pb_5} style={{ marginTop: Hp('7%') }}>
                    {reduxWistlist && reduxWistlist.length ?
                        <View style={[styles.column, styles.px_3, styles.mb_5]}>
                            <CardProduct data={reduxWistlist} />
                        </View>
                        : <Text style={[styles.font_14, styles.py_5, { alignSelf: 'center', marginTop: Hp('7%') }]}>Favorit kamu masih kosong!</Text>
                    }
                    {/* <RecomandedHobby /> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
