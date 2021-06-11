
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Card, Ps, Wp, FastImage, CheckSignal, ShimmerCardProduct } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default function RecomandedHobbyComponent() {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])
    const [loading, setLoading] = useState(false)

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
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 1000);
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
                CheckSignal().then(res => {
                    if (res.connect == false) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        Alert.alert(
                            "Error with status 13002",
                            JSON.stringify(error)
                            [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                })
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 60 ~ getData ~ error", String(error).slice(11, String(error).length) === "Network request failed")
                // ToastAndroid.show(String(error).slice(11, String(error).length), ToastAndroid.SHORT, ToastAndroid.TOP)
            });
        setTimeout(() => {
            if (res === 'network') {
                dispatch({ 'type': 'SET_LOADMORE', payload: false })
                return ToastAndroid.show("Koneksi terputus, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                res = "loading"
                if (!loading && reduxLoadmore) {
                    ToastAndroid.show("Sedang memuat..", ToastAndroid.SHORT, ToastAndroid.TOP)
                }
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
                <ShimmerCardProduct />
            }
            {reduxLoadmore ?
                loading ?
                    <View style={style.content}>
                        <View style={style.loading}>
                            <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                        </View>
                    </View>
                    :
                    <ShimmerCardProduct />
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