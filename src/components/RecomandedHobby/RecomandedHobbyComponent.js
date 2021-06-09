
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Card, Ps, Wp, FastImage } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function RecomandedHobbyComponent() {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])
    const [shimmerData] = useState(['1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X'])

    const dispatch = useDispatch()
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxdashRecommanded = useSelector(state => state.dashboard.recommanded)

    useEffect(() => {
        getStorage()
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
        if (reduxLoadmore) {
            handleLoadMore()
        }
    }, [reduxLoadmore])

    const getStorage = () => {
        EncryptedStorage.getItem('dashrecommanded').then(res => {
            if (res) {
                setstoragedashRecommanded(JSON.parse(res))
            }
        })
    }
    const getData = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let res = ""
        fetch(`https://jaja.id/backend/product/recommendation?page=${page + 1}&limit=6`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 44 ~ getData ~ page + 1", page + 1)
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 101 ~ setTimeout ~ result.data.items", result.data)

                setTimeout(() => {
                    if (result.status.code == 200 || result.status.code == 204) {
                        dispatch({ type: 'SET_DASHRECOMMANDED', payload: reduxdashRecommanded.concat(result.data.items) })
                        EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                    }
                    dispatch({ 'type': 'SET_LOADMORE', payload: false })
                }, 1000);

            })
            .catch(error => {
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    res = 'network'
                }
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 60 ~ getData ~ error", String(error).slice(11, String(error).length) === "Network request failed")
                // ToastAndroid.show(String(error).slice(11, String(error).length), ToastAndroid.SHORT, ToastAndroid.TOP)
            });
        setTimeout(() => {
            if (res === 'network') {
                dispatch({ 'type': 'SET_LOADMORE', payload: false })
                return ToastAndroid.show("Koneksi terputus, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                res = "loading"
                ToastAndroid.show("Sedang memuat..", ToastAndroid.SHORT, ToastAndroid.TOP)
            }
        }, 5000);
        setTimeout(() => {
            if (res === 'loading') {
                ToastAndroid.show("Koneksi lambat, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {

            }
            dispatch({ 'type': 'SET_LOADMORE', payload: false })
        }, 1000);
    }

    const handleLoadMore = () => {
        setTimeout(() => {
            getData()
        }, 500);
        setPage(page + 1)
    }

    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.titleDashboard}>
                    Rekomendasi Hobby
                </Text>
            </View>
            {reduxdashRecommanded && reduxdashRecommanded.length || storagedashRecommanded && storagedashRecommanded.length ?
                <View style={styles.column}>
                    <Card data={reduxdashRecommanded && reduxdashRecommanded.length ? reduxdashRecommanded : storagedashRecommanded && storagedashRecommanded.length ? storagedashRecommanded : []} />
                </View>
                :
                <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {
                        shimmerData.map(item => {
                            return (
                                <TouchableOpacity
                                    style={Ps.cardProduct}
                                    key={item}>
                                    <FastImage
                                        style={[Ps.imageProduct, styles.mb_2, { backgroundColor: colors.Silver }]}
                                        source={require('../../assets/images/JajaId.png')}
                                        resizeMode={FastImage.resizeMode.contain}
                                        tintColor={colors.White}

                                    />
                                    {/* <Image source={require('../../assets/images/JajaId.png')} style={[Ps.imageProduct, { resizeMode: 'center', tintColor: colors.White, backgroundColor: colors.Silver }]} /> */}
                                    <View style={Ps.bottomCard}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('40%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 1, marginBottom: '2%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('30%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 1, marginBottom: '5%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            width={Wp('20%')}
                                            height={Wp("4%")}
                                            style={{ borderRadius: 1, marginBottom: '7%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <View style={Ps.location}>
                                            {/* <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} /> */}
                                            <ShimmerPlaceHolder
                                                LinearGradient={LinearGradient}
                                                width={Wp('30%')}
                                                height={Wp("4%")}
                                                style={{ borderRadius: 1, marginBottom: '5%' }}
                                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }

                </ScrollView>
            }
            {reduxLoadmore ?
                <View style={style.content}>
                    <View style={style.loading}>
                        <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                    </View>
                </View>
                : null}
        </View>
    )
}


const style = StyleSheet.create({
    content: {
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 100,

    }
})