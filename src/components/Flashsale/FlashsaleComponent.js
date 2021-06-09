import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { styles, Ps, Language, useNavigation, FastImage, colors } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector, useDispatch } from 'react-redux'

export default function FlashsaleComponent() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxdashFlashsale = useSelector(state => state.dashboard.flashsale)
    const [storagedashFlashsale, setstoragedashFlashsale] = useState([])

    useEffect(() => {
        getStorage()
    }, [])

    const handleShowDetail = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image, flashsale: true })
    }
    const getStorage = () => {
        EncryptedStorage.getItem('dashflashsale').then(res => {
            if (res) {
                setstoragedashFlashsale(JSON.parse(res))
            }
        })
    }
    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.flashsale}>
                    Flashsale
                </Text>
            </View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={reduxdashFlashsale && reduxdashFlashsale.length ? reduxdashFlashsale : storagedashFlashsale && storagedashFlashsale.length ? storagedashFlashsale : []}
                horizontal={true}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={styles.cardProduct} onPress={() => handleShowDetail(item)} >
                            <Text style={{ position: 'absolute', fontSize: 14, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '6%', paddingHorizontal: '3%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, }}>{item.discount}%</Text>
                            <Image source={{ uri: item.image }} style={{ flex: 0, height: '65%', width: '100%', marginBottom: '5%', backgroundColor: colors.BlackGrey }} />
                            <Text style={styles.priceBefore}>{item.price}</Text>
                            <Text style={styles.priceAfter}>{item.priceDiscount}</Text>

                            <View style={{ flex: 0, width: '85%', alignItems: 'center', height: '20%', justifyContent: 'flex-start', marginTop: '1%' }}>
                                <View style={{
                                    borderRadius: 100,
                                    borderColor: colors.RedFlashsale,
                                    backgroundColor: "#FFc9b9",
                                    borderWidth: 1,
                                    height: '45%',
                                    width: "100%",
                                    marginHorizontal: 8,
                                }}>
                                    <View style={{
                                        backgroundColor: colors.RedFlashsale,
                                        borderTopLeftRadius: 100,
                                        borderBottomLeftRadius: 100,
                                        height: '100%',
                                        width: '0%',
                                    }}>
                                    </View>
                                    <Text style={{
                                        position: "absolute",
                                        alignSelf: "center",
                                        color: "white",
                                        fontFamily: 'Lato-Bold',
                                        marginTop: -2,
                                    }}
                                    >{item.amountSold} Terjual</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View >
    )
}
