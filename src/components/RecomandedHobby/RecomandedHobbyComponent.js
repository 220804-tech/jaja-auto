
import React, { useEffect, useState } from 'react'
import { View, Text, ToastAndroid, StyleSheet, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, CardProduct, CheckSignal, ShimmerCardProduct, Utils, Wp } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';

export default function RecomandedHobbyComponent(props) {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])

    const dispatch = useDispatch()
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxdashRecommanded = useSelector(state => state.dashboard.recommanded)
    const reduxmaxRecommanded = useSelector(state => state.dashboard.maxRecomandded)

    useEffect(() => {
        if (reduxLoadmore) {
            handleLoadMore()
        }
    }, [reduxLoadmore])


    useEffect(() => {
        // getStorage()
    }, [])
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
        let loadingFetch = true
        fetch(`https://jaja.id/backend/product/recommendation?page=${page + 1}&limit=20`, requestOptions)
            .then(response => response.json())
            .then(result => {
                loadingFetch = false
                dispatch({ 'type': 'SET_LOADMORE', payload: false })
                if (result?.status?.code === 200) {
                    dispatch({ type: 'SET_DASHRECOMMANDED', payload: reduxdashRecommanded.concat(result.data.items) })
                    dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: false })
                    EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                } else if (result?.status?.code === 204) {
                    dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })
                }
            })
            .catch(error => {
                loadingFetch = false
                dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })
                dispatch({ 'type': 'SET_LOADMORE', payload: false })
                Utils.handleError(error, 'Error with status code : 13002')
            });
        setTimeout(() => {
            if (loadingFetch) {
                Utils.alertPopUp("Sedang memuat..")
                setTimeout(() => {
                    Utils.handleSignal()
                    dispatch({ type: 'SET_LOADMORE', payload: false })
                }, 7000);
            } else {
                dispatch({ 'type': 'SET_LOADMORE', payload: false })
            }
        }, 5000);

    }

    const handleLoadMore = () => {
        setTimeout(() => {
            getData()
        }, 500);
        setPage(page + 1)
    }

    return (
        <View style={[styles.column]}>
            <View style={[styles.row, styles.mb_3, styles.px_3]}>
                <Text style={[styles.titleDashboard, { color: props.color ? props.color : colors.BlueJaja }]}>
                    Rekomendasi Hobby
                </Text>
            </View>
            {reduxdashRecommanded && reduxdashRecommanded.length || storagedashRecommanded && storagedashRecommanded.length ?
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <CardProduct refresh={props.refresh ? true : false} data={Array(reduxdashRecommanded).length ? reduxdashRecommanded : Array(storagedashRecommanded).length ? storagedashRecommanded : []} />
                </View>
                :
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <ShimmerCardProduct />
                </View>
            }
            {reduxmaxRecommanded ? <Text style={[styles.font_14, styles.mt_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Semua produk berhasil ditampilkan.</Text> : <ShimmerCardProduct />}
            {/* {reduxLoadmore ?
                <View style={style.content}>
                    <View style={style.loading}>
                        <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                    </View>
                </View> 
                : null} */}
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