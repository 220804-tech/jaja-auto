import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ScrollView } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { styles, Appbar, colors, Wp, Hp } from '../../export'
import Collapsible from 'react-native-collapsible';
import { IconButton } from 'react-native-paper';

export default function ResponseComplain() {
    const [details, setDetails] = useState("")

    const [activeSections, setactiveSections] = useState(true)
    const [chat, setChat] = useState("")

    useEffect(() => {
        EncryptedStorage.getItem('RequestComplain').then(res => {
            console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 10 ~ EncryptedStorage.getItem ~ res", res)
            if (res) {
                setDetails(JSON.parse(res))
            }
        })
    }, [])

    const handleSend = (vaL) => {

    }
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Komplain Pesanan" Bg={colors.YellowJaja} />
            <ScrollView style={{ marginBottom: Hp('7%') }}>
                <View style={[styles.column_center, styles.p_3]}>
                    <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[styles.font_12]}>Komplain anda telah diajukan, akan di proses paling lambat 4X24 Jam</Text>
                    </View>
                    {details ?
                        // <Collapsible style={{ width: '100%' }} collapsed={activeSections}>
                        <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.my]}>Detail komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text style={[styles.font_12, styles.mt]}>{details.category}</Text>
                                <Text style={[styles.font_12, styles.mt]}>{details.title}</Text>
                                <Text style={[styles.font_12, styles.mt]}>{details.body}</Text>
                            </View>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Produk dikomplain</Text>
                            <View style={[styles.row_start_center, { width: '100%', height: Wp('17%') }]}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.BlackGrey }}
                                    resizeMethod={"scale"}
                                    resizeMode="cover"
                                    source={{ uri: details.data.image }}
                                />
                                <View style={[styles.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('15%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                    <Text numberOfLines={1} style={[styles.font_13, styles.T_medium, { color: colors.BlueJaja }]}>{details.data.name}</Text>
                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale }]}>{details.data.variant ? details.data.variant : ""}</Text>
                                    {details.data.isDiscount ?
                                        <>
                                            <Text numberOfLines={1} style={[styles.priceBefore, { fontStyle: 'italic' }]}>{details.data.priceCurrencyFormat}</Text>
                                            <View style={styles.row}>
                                                <Text numberOfLines={1} style={[styles.font_14]}>{details.data.qty} x</Text>
                                                <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {details.data.priceDiscountCurrencyFormat}</Text>
                                            </View>
                                        </>
                                        :
                                        <View style={styles.row}>
                                            <Text numberOfLines={1} style={[styles.font_14]}>{details.data.qty} x</Text>
                                            <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {details.data.priceCurrencyFormat}</Text>
                                        </View>
                                    }
                                </View>
                            </View>

                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Bukti komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text style={[styles.font_12]}>- {details.image && details.image.length ? details.image.length : 0} Foto dilampirkan </Text>
                                <Text style={[styles.font_12, styles.mt_2]}>- {details.video ? '1' : '0'} Video dilampirkan</Text>
                            </View>
                        </View>
                        // </Collapsible>
                        : null
                    }
                </View>
                <View style={[styles.column_center, styles.p_3]}>
                    <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[styles.font_12]}>Komplain anda telah diajukan, akan di proses paling lambat 4X24 Jam</Text>
                    </View>
                    {details ?
                        // <Collapsible style={{ width: '100%' }} collapsed={activeSections}>
                        <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.my]}>Detail komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text style={[styles.font_12, styles.mt]}>{details.category}</Text>
                                <Text style={[styles.font_12, styles.mt]}>{details.title}</Text>
                                <Text style={[styles.font_12, styles.mt]}>{details.body}</Text>
                            </View>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Produk dikomplain</Text>
                            <View style={[styles.row_start_center, { width: '100%', height: Wp('17%') }]}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.BlackGrey }}
                                    resizeMethod={"scale"}
                                    resizeMode="cover"
                                    source={{ uri: details.data.image }}
                                />
                                <View style={[styles.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('15%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                    <Text numberOfLines={1} style={[styles.font_13, styles.T_medium, { color: colors.BlueJaja }]}>{details.data.name}</Text>
                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale }]}>{details.data.variant ? details.data.variant : ""}</Text>
                                    {details.data.isDiscount ?
                                        <>
                                            <Text numberOfLines={1} style={[styles.priceBefore, { fontStyle: 'italic' }]}>{details.data.priceCurrencyFormat}</Text>
                                            <View style={styles.row}>
                                                <Text numberOfLines={1} style={[styles.font_14]}>{details.data.qty} x</Text>
                                                <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {details.data.priceDiscountCurrencyFormat}</Text>
                                            </View>
                                        </>
                                        :
                                        <View style={styles.row}>
                                            <Text numberOfLines={1} style={[styles.font_14]}>{details.data.qty} x</Text>
                                            <Text numberOfLines={1} style={[styles.priceAfter, { color: colors.BlueJaja }]}> {details.data.priceCurrencyFormat}</Text>
                                        </View>
                                    }
                                </View>
                            </View>

                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Bukti komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text style={[styles.font_12]}>- {details.image && details.image.length ? details.image.length : 0} Foto dilampirkan </Text>
                                <Text style={[styles.font_12, styles.mt_2]}>- {details.video ? '1' : '0'} Video dilampirkan</Text>
                            </View>
                        </View>
                        // </Collapsible>
                        : null
                    }
                </View>

            </ScrollView>
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flex: 0,
                    width: Wp("100%"),
                    height: Hp('8%'),
                    // marginBottom: Hp('1%'),
                    paddingHorizontal: '2%',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-around',
                    backgroundColor: colors.White,

                }}>
                <View style={[styles.row_start_center, { width: "80%", height: Hp('5.5%'), borderRadius: 100, backgroundColor: colors.WhiteGrey, opacity: 0.8 }]}>
                    <TextInput
                        style={{
                            width: "85%",
                            fontSize: Wp("4%"),
                            borderColor: "gray",
                            borderBottomLeftRadius: 100,
                            borderTopLeftRadius: 100,
                            paddingHorizontal: 20,
                        }}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
                        value={chat}
                    />
                    {!chat.length ?
                        <IconButton
                            icon={require('../../assets/icons/camera.png')}
                            style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                            color={colors.White}
                            onPress={() => galeryRef.current?.setModalVisible(true)}
                        /> : null}
                </View>

                <IconButton
                    icon={require('../../assets/icons/send.png')}
                    style={{ margin: 0, backgroundColor: colors.YellowJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                    color={colors.White}
                    onPress={() => handleSend(null)}
                />
            </View>
        </SafeAreaView >
    )
}
