
import React, { useEffect, useState } from 'react'
import { View, Text, ToastAndroid, StyleSheet, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, CardProduct, CheckSignal, ShimmerCardProduct } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';

export default function RecomandedHobbyComponent(props) {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxdashRecommanded = useSelector(state => state.dashboard.recommanded)
    const reduxmaxRecommanded = useSelector(state => state.dashboard.maxRecomandded)

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
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 52 ~ getData ~ result", result)
                if (result.status.code == 200) {
                    dispatch({ type: 'SET_DASHRECOMMANDED', payload: reduxdashRecommanded.concat(result.data.items) })
                    EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                    dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: false })
                } else if (result.status.code === 204) {
                    dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })
                }
                dispatch({ 'type': 'SET_LOADMORE', payload: false })

            })
            .catch(error => {
                dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })

                CheckSignal().then(signal => {
                    if (signal.connect == false) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        Alert.alert(
                            "Error with status 13002",
                            JSON.stringify(error),
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                })
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
        <View style={[styles.column, styles.p_3]}>
            <View style={[styles.row, styles.mb_3]}>
                <Text style={[styles.titleDashboard, { color: props.color ? props.color : colors.BlueJaja }]}>
                    Rekomendasi Hobby
                </Text>
            </View>
            {reduxdashRecommanded && reduxdashRecommanded.length || storagedashRecommanded && storagedashRecommanded.length ?
                <View style={styles.column}>
                    <CardProduct data={reduxdashRecommanded && reduxdashRecommanded.length ? reduxdashRecommanded : storagedashRecommanded && storagedashRecommanded.length ? storagedashRecommanded : []} />
                </View>
                :
                <ShimmerCardProduct />
            }
            {reduxmaxRecommanded ? <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Semua produk berhasil ditampilkan</Text> : <ShimmerCardProduct />}
            {/* {reduxLoadmore ?
                loading ?
                    <View style={style.content}>
                        <View style={style.loading}>
                            <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                        </View>
                    </View>
                    : */}
            {/* : null} */}
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