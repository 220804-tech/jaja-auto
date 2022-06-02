
import React, { useEffect, useState } from 'react'
import { View, Text, ToastAndroid, StyleSheet, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, CardProduct, CheckSignal, ShimmerCardProduct, Utils, Wp, HeaderTitleHome } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';

export default function RecomandedHobbyComponent(props) {

    const [auth, setAuth] = useState("")
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([])

    const dispatch = useDispatch()
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)
    const reduxdashRecommanded = useSelector(state => state.dashboard.recommanded)
    const reduxmaxRecommanded = useSelector(state => state.dashboard.maxRecomandded)
    console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 17 ~ RecomandedHobbyComponent ~ reduxdashRecommanded", reduxdashRecommanded.length)

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
        if (reduxdashRecommanded?.length <= 110) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            let loadingFetch = true
            fetch(`https://jaja.id/backend/product/recommendation?page=${page + 1}&limit=40`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    loadingFetch = false
                    if (result?.status?.code === 200) {
                        dispatch({ type: 'SET_DASHRECOMMANDED', payload: reduxdashRecommanded.concat(result.data.items) })
                        dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: false })
                        // EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                    } else if (result?.status?.code === 204) {
                        dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })
                    }
                    dispatch({ 'type': 'SET_LOADMORE', payload: false })
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
                    }, 10000);
                } else {
                    dispatch({ 'type': 'SET_LOADMORE', payload: false })
                }
            }, 7000);

        } else {
            dispatch({ 'type': 'SET_MAX_RECOMMANDED', payload: true })
        }
    }

    const handleLoadMore = () => {
        setTimeout(() => {
            getData()
        }, 500);
        setPage(page + 1)
    }

    return (
        <View style={[styles.column]}>
            <HeaderTitleHome title='Rekomendasi Hobby' />
            {reduxdashRecommanded && reduxdashRecommanded.length || storagedashRecommanded && storagedashRecommanded.length ?
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <CardProduct refresh={props.refresh ? true : false} data={Array(reduxdashRecommanded).length ? reduxdashRecommanded : Array(storagedashRecommanded).length ? storagedashRecommanded : []} />
                </View>
                :
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <ShimmerCardProduct />
                </View>
            }
            {reduxmaxRecommanded ? <Text style={[styles.font_14, styles.my_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Semua produk berhasil ditampilkan.</Text> : <ShimmerCardProduct />}
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