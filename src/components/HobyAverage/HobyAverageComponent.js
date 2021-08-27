import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import colors from '../../assets/colors'
import { styles } from '../../assets/styles/styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux'

export default function RecomandedHobbyComponent() {
    const reduxDashboard = useSelector(state => state.dashboard.hobyAverage)
    const dispatch = useDispatch()

    const handleShowDetail = async item => {
        navigation.navigate("Product")
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        setTimeout(() => {
            productDetail(item.slug).then(res => {
                if (res) {
                    dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res })
                } else {
                    console.log("keluar")
                    dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
                }
            })
        }, 100);
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
