import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, Wp, Hp, colors, ServiceProduct } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'

export default function TrendingComponent() {
    const navigation = useNavigation()
    const [auth, setAuth] = useState("")
    const reduxDashboard = useSelector(state => state.dashboard.trending)
    const dispatch = useDispatch()

    useEffect(() => {
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.stringify(res))
            }
        })
    }, [])
    const handleShowDetail = async item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }

    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.titleDashboard}>
                    Sedang Trending
                </Text>
            </View>
            {reduxDashboard && reduxDashboard.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxDashboard}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleShowDetail(item)}

                                style={{
                                    borderRadius: 10,
                                    width: Wp("46%"),
                                    height: Wp("20%"),
                                    marginLeft: 5,
                                    marginRight: 11,
                                    marginTop: 5,
                                    marginBottom: 5,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    elevation: 2,
                                    backgroundColor: colors.White,
                                    flexDirection: 'row'
                                }}
                                key={index}
                            >
                                {/* wilayah view */}

                                <FastImage
                                    style={{
                                        width: "45%",
                                        height: "100%",
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        borderColor: colors.BlueJaja,
                                    }}
                                    source={{
                                        uri: item.image,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={{ marginLeft: 5, width: '65%', flexDirection: 'column' }}>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            width: '50%',
                                            fontSize: 12,
                                            fontFamily: 'Lato-Bold',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 4,
                                            fontSize: Hp("1.4%"),
                                            width: '95%',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                            color: colors.BlackGrey,
                                        }}
                                    >
                                        {item.totalSeen + " Mengunjungi"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />

                : null
            }
        </View>
    )
}
