import React from 'react'
import { View, Text } from 'react-native'

export default function sasa() {
    return (

        <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
            <View style={[styles.row_between_center]}>
                <Text style={[styles.font_13, styles.T_medium, styles.my]}>Detail komplain</Text>
                <Text style={[styles.font_12, { color: colors.BlueJaja }]}>{complainDetails.status === "request" ? "Menunggu Konfirmasi" : complainDetails.status == "sendback" ? 'Sedang Dikirim' : complainDetails.status == "delivered" ? 'Pesanan Diterima' : complainDetails.status == "completed" ? "Komplain Selesai" : 'Dikonfirmasi'}</Text>
            </View>

            <View style={[styles.column, styles.px]}>
                <Text style={styles.font_13}>{complainDetails.jenis_komplain} - {complainDetails.judul_komplain}</Text>
                <Text numberOfLines={3} style={[styles.font_13, styles.mt_3]}>Alasan Komplain : <Text style={styles.font_13}>{'\n' + complainDetails.komplain}</Text></Text>
                <Text style={[styles.font_13, styles.mt_3]}>Bukti komplain :</Text>

                <View style={[styles.row]}>
                    {complainDetails.gambar1 && !complainDetails.gambar2 && !complainDetails.gambar3 ?
                        <View style={styles.column}>
                            <Text style={[styles.font_13, styles.T_light]}>- 0 Foto dilampirkan</Text>
                            <Text style={[styles.font_13, styles.T_light]}>- 0 Video dilampirkan</Text>
                        </View>
                        : null
                    }
                    {!complainDetails.gambar1 ?
                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                            <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar1 }} />
                        </TouchableOpacity>

                        : null
                    }
                    {complainDetails.gambar2 ?
                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                            <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar2 }} />
                        </TouchableOpacity>
                        : null
                    }
                    {complainDetails.gambar3 ?
                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                            <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar3 }} />
                        </TouchableOpacity>
                        : null
                    }
                    {complainDetails.video ?
                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={[styles.row_center, styles.my_2, { width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.Black }]}>
                            <Image style={{ width: '35%', height: '35%', tintColor: colors.White, alignSelf: 'center' }} source={require('../../assets/icons/play.png')} />
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                <Text style={[styles.font_13, styles.mt_3]}>Produk dikomplain :</Text>
                <View style={[styles.row_start_center, styles.mt, { width: '100%', }]}>
                    <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5 }}
                        resizeMethod={"scale"}
                        resizeMode="cover"
                        source={{ uri: complainDetails.product[0].image }}
                    />
                    <View style={[styles.column_around_center, styles.mt_3, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('13%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                        <Text numberOfLines={1} style={[styles.font_13, { width: '90%' }]}>{complainDetails.product[0].name}</Text>
                        <Text numberOfLines={1} style={[styles.font_12]}>{complainDetails.product[0].variasi ? complainDetails.product[0].variasi : ""}</Text>
                        <View styzx le={[styles.row_between_center, { width: '90%' }]}>
                            <Text numberOfLines={1} style={[styles.font_13, styles.T_light]}>{complainDetails.totalOtherProduct ? "+(" + complainDetails.totalOtherProduct + " produk lainnya)" : ""}</Text>
                            <Text numberOfLines={1} style={[styles.font_13]}>{complainDetails.totalOtherProduct ? complainDetails.totalOtherProduct + ' X ' : null}{complainDetails.totalPriceCurrencyFormat}</Text>
                        </View>
                    </View>
                </View>
            </View>

            )
}
