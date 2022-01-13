import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import colors from '../../assets/colors'
import { styles } from '../../assets/styles/styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux'
import { ServiceProduct } from '../../export';

export default function RecomandedHobbyComponent() {
    const reduxDashboard = useSelector(state => state.dashboard.hobyAverage)
    const dispatch = useDispatch()
    const reduxLoad = useSelector(state => state.product.productLoad)

    const handleShowDetail = item => {
        try {
            if (!reduxLoad) {
                dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
                let newItem = { ...item }
                let img = newItem.image;
                newItem.image = [img]
                dispatch({ type: 'SET_DETAIL_PRODUCT', payload: newItem })
                if (!props.gift) {
                    navigation.push("Product")
                } else {
                    navigation.push("GiftDetails")
                }
                dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
                dispatch({ type: 'SET_SLUG', payload: item.slug })

                ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
                    if (res?.status?.code === 400) {
                        Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                        navigation.goBack()
                    } else {
                        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
                    }
                    dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
                })
            }
        } catch (error) {
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
            alert(String(error.message))
        }
    }
    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.titleDashboard}>
                    Rekomendasi Hobby
                </Text>
            </View>
            {reduxDashboard && reduxDashboard.length ?
                <View style={[styles.row, { flexWrap: 'wrap' }]}>
                    {/* <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ height: 500 }}> */}
                    {reduxDashboard.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleShowDetail(item)}
                                style={{
                                    borderRadius: 10,
                                    width: wp("43%"),
                                    height: wp("65%"),
                                    marginLeft: 5,
                                    marginRight: 11,
                                    marginTop: 5,
                                    marginBottom: 5,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    elevation: 2,
                                    backgroundColor: colors.White,
                                    flexDirection: 'column'
                                }}
                                key={index}>
                                <Image
                                    style={{
                                        width: "100%",
                                        height: "70%",
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10,
                                        borderColor: colors.BlueJaja,
                                    }}
                                    resizeMethod={"scale"}
                                    resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={{ uri: item["image"] }}
                                />
                                <View style={styles.mt_3}>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            // width: 95,
                                            fontSize: 14,
                                            fontFamily: 'Lato-Bold',
                                            // letterSpacing: 0,
                                            textAlign: "left",
                                        }}>
                                        {item["title"]}
                                    </Text>


                                    <Text
                                        style={{
                                            marginTop: 4,
                                            fontSize: hp("1.4%"),
                                            // fontFamily: fo,
                                            letterSpacing: 0,
                                            textAlign: "left",
                                            color: colors.BlackGrey,
                                        }}>
                                        {item["jml_produk"] + " Produk"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                </View>
                : null
            }
        </View>
    )
}
