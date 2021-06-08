
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Card } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';
export default function RecomandedHobbyComponent() {

    const [auth, setAuth] = useState("")
    const [loadmore, setLoadmore] = useState(false)
    const [page, setPage] = useState(1);
    const [maxPage, setmaxPage] = useState(1);

    const dispatch = useDispatch()
    const reduxDashboard = useSelector(state => state.dashboard.recommanded)
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore)

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
        if (reduxLoadmore) {
            handleLoadMore()
        }
    }, [reduxLoadmore])

    const getData = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/product/recommendation?page=${page + 1}&limit=6`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 44 ~ getData ~ page + 1", page + 1)
                console.log("🚀 ~ file: RecomandedHobbyComponent.js ~ line 101 ~ setTimeout ~ result.data.items", result.data)

                setTimeout(() => {
                    if (result.status.code == 200 || result.status.code == 204) {
                        dispatch({ type: 'SET_DASHRECOMMANDED', payload: reduxDashboard.concat(result.data.items) })
                        EncryptedStorage.setItem('dashrecommanded', JSON.stringify(result.data.items))
                    }
                    dispatch({ 'type': 'SET_LOADMORE', payload: false })
                }, 2000);

            })
            .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER) & setLoadmore(false));
    }

    const handleLoadMore = () => {
        getData()
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
                    <Card data={reduxDashboard} />
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