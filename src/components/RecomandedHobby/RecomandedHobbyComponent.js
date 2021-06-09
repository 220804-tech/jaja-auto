
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, ToastAndroid, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Card } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';
export default function RecomandedHobbyComponent() {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])

    const dispatch = useDispatch()
    const reduxDashboard = useSelector(state => state.dashboard.recommanded)
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
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 60 ~ getData ~ error", error)
                ToastAndroid.show(String(error).slice(11, 45), ToastAndroid.SHORT, ToastAndroid.TOP)
            });
        setTimeout(() => {
            if (!res) {
                ToastAndroid.show("Sedang memuat..", ToastAndroid.SHORT, ToastAndroid.TOP)
            }
        }, 5000);
        setTimeout(() => {
            if (!res) {
                ToastAndroid.show("Koneksi terputus, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
            }
            dispatch({ 'type': 'SET_LOADMORE', payload: false })
        }, 10000);
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
            {reduxDashboard && reduxDashboard.length ?
                <View style={styles.column}>
                    {/* <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ height: 500 }}> */}
                    <Card data={reduxdashRecommanded && reduxdashRecommanded.length ? reduxdashRecommanded : storagedashRecommanded && storagedashRecommanded.length ? storagedashRecommanded : []} />
                </View>
                : null
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