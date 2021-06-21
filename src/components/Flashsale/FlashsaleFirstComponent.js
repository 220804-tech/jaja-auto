import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { colors, FastImage, Ps, styles, Wp } from '../../export'

export default function FlashsaleFirstComponent() {
    const reduxFlashsale = useSelector(state => state.dashboard.flashsale)
    return (
        <View style={[styles.container, { backgroundColor: colors.White }]}>
            <FlatList
                data={reduxFlashsale}
                keyExtractor={(item, index) => String(index) + "FZ"}
                style={styles.my_5}
                renderItem={({ item }) => {
                    let load = false;

                    return (
                        <TouchableOpacity style={[styles.row_start_center, styles.mb_2, { height: Wp('30%'), width: Wp('100%'), borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                            <FastImage
                                style={[Ps.imageProduct, { height: Wp('29%'), width: Wp('29%'), borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
                                // onLoadStart={() => load = true}
                                // onLoadEnd={() => load = false}
                                source={{
                                    uri: item.image,
                                    headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <View style={[styles.column_between_center, styles.px, styles.pb, { width: Wp('67%'), height: '100%', alignItems: 'flex-start' }]}>
                                <Text numberOfLines={2} style={Ps.nameProduct}>{item.nama_produk}</Text>
                                <View style={styles.column}>
                                    <View style={styles.row}>
                                        <View style={[styles.row_center, styles.mr_3, { width: Wp('9.5%'), height: Wp('9.5%'), backgroundColor: colors.RedFlashsale, padding: '2%', borderRadius: 5 }]}>
                                            <Text style={{ fontSize: 12, color: colors.White, fontWeight: 'bold', backgroundColor: colors.RedFlashsale }}>{item.discountFlash}%</Text>
                                        </View>
                                        <View style={styles.column}>
                                            <Text style={Ps.priceBefore}>{item.price}</Text>
                                            <Text style={Ps.priceAfter}>{item.priceDiscountFlash}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.row_start, { width: '100%' }]}>
                                        <View style={{ flex: 0, width: '75%', alignSelf: 'center', height: Wp('4%'), justifyContent: 'center', marginTop: '1%', marginRight: '3%' }}>
                                            <View style={{
                                                borderRadius: 100,
                                                borderColor: colors.RedFlashsale,
                                                backgroundColor: "#FFc9b9",
                                                borderWidth: 0.5,
                                                height: '90%',
                                                width: "100%",

                                            }}>
                                                <View style={{
                                                    backgroundColor: colors.RedFlashsale,
                                                    borderTopLeftRadius: 100,
                                                    borderBottomLeftRadius: 100,
                                                    borderTopRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 98 ? 0 : 100,
                                                    borderBottomRightRadius: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) < 98 ? 0 : 100,
                                                    height: '100%',
                                                    width: ((parseInt(item.amountSold) / parseInt(item.stockInFlashSale)) * 100) + "%",

                                                }}>
                                                </View>
                                                <Text style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    bottom: 0,
                                                    alignSelf: "center",
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    color: "white",
                                                    marginTop: -1,
                                                    fontSize: 10,
                                                    fontWeight: 'bold'
                                                }}
                                                >{item.amountSold} Terjual</Text>
                                            </View>
                                        </View>
                                        <Button mode="contained" color={colors.RedFlashsale} style={{ margin: 0, height: Wp('8%') }} contentStyle={{ padding: 0, height: Wp('8%') }} labelStyle={{ fontSize: 10, color: colors.White }}>
                                            Beli
                                        </Button>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}
