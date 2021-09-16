import React from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import colors from '../../assets/colors'
import { styles } from '../../assets/styles/styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux'

export default function TrendingComponent() {
    const reduxDashboard = useSelector(state => state.dashboard.basedOnSearch)
    const dispatch = useDispatch()

    const handleShowDetail = async item => {
        navigation.push("Product")
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
        dispatch({ type: 'SET_SLUG', payload: item.slug })
    }
    return (
        <View style={styles.p_3}>
            <View style={styles.row}>
                <Text style={styles.titleDashboard}>
                    Pencarian Popular
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
                                style={{
                                    borderRadius: 10,
                                    width: wp("46%"),
                                    height: wp("20%"),
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
                                onPress={() => {
                                    // this.props.navigation.navigate("ProductDetailMart", {
                                    //     product: item,
                                    //     id_product: item['id_produk'],
                                    //     id_toko: item['id_toko'],
                                    //     nama_toko: item['nama_toko'],
                                    //     title: item['title'],
                                    //     produk_slug: item['produk_slug'],
                                    //     image: item['image'],

                                    //     harga: item['harga'],
                                    //     diskon: item['harga'],
                                    //     berat: item['berat'],
                                    //     variasi_model: item['variasi_model'],
                                    //     variasi_warna: item['variasi_warna'],
                                    //     variasi_ukuran: item['variasi_ukuran'],
                                    //     pencarian: this.state.dataPencarian,
                                    // });
                                }}
                                key={index}
                            >
                                {/* wilayah view */}

                                <Image
                                    style={{
                                        width: "45%",
                                        height: "100%",
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        borderColor: colors.BlueJaja,
                                    }}
                                    resizeMethod={"scale"}
                                    resizeMode={item["image"] == '' ? "center" : "cover"}
                                    source={{ uri: item["image"] }}
                                />
                                <View style={{ marginLeft: 5 }}>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            width: 95,
                                            fontSize: hp("1.6%"),
                                            fontFamily: 'Lato-Bold',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                        }}
                                    >
                                        {item.name}
                                    </Text>


                                    {/* <Text
                                        style={{
                                            marginTop: 4,
                                            fontSize: hp("1.4%"),
                                            width: '95%',
                                            letterSpacing: 0,
                                            textAlign: "left",
                                            color: colors.BlackGrey,
                                        }}
                                    >
                                        {item.totalSeen + " Mengunjungi"}
                                    </Text> */}
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
