
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, Ps, Language, useNavigation, FastImage, ServiceProduct, colors } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Progress from 'react-native-progress';

export default function RecomandedHobbyComponent() {
    const navigation = useNavigation()

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

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }


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
                    <FlatList
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        updateCellsBatchingPeriod={100} // Increase time between renders
                        windowSize={7}
                        // getItemLayout={(data, index) => getItemLayout(data, index)}
                        data={reduxDashboard}
                        scrollEnabled={true}
                        keyExtractor={(item, index) => String(index)}
                        // style={{ flexDirection: 'row' }}
                        onScroll={(e) => console.log("event ", e)}
                        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleShowDetail(item)}
                                    style={Ps.cardProduct}
                                    key={index}>
                                    {item.isDiscount ?
                                        <Text style={Ps.textDiscount}>{item.discount}%</Text> : null}
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
                                        resizeMode={FastImage.resizeMode.contain}
                                    />

                                    <View style={Ps.bottomCard}>
                                        <Text
                                            numberOfLines={2}
                                            style={Ps.nameProduct}>
                                            {item.name}
                                        </Text>
                                        {item.isDiscount ?
                                            <>
                                                <Text style={Ps.priceBefore}>{item.price}</Text>
                                                <Text style={Ps.priceAfter}>{item.priceDiscount}</Text>
                                            </>
                                            :
                                            <Text style={Ps.price}>{item.price}</Text>
                                        }
                                        <View style={Ps.location}>
                                            <Image style={Ps.locationIcon} source={require('../../assets/icons/google-maps.png')} />
                                            <Text style={Ps.locarionName}>{item.location}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
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