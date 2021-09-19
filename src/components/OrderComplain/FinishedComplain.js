import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, ToastAndroid, Image, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Wp, Hp, Utils, } from '../../export'
import { Button } from 'react-native-paper'

export default function FinishedComplain() {
    const dispatch = useDispatch()

    const reduxAuth = useSelector(state => state.auth.auth)
    const complainDetails = useSelector(state => state.complain.complainDetails)
    const orderInvoice = useSelector(state => state.order.invoice)



    const [receipNumber, setReceipNumber] = useState('');

    const handleReceiptNumber = () => {
        if (String(receipNumber).length > 5) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=06hsuo4cuq7thfvijjnk64ucdtu1eb99");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/order/inputResiCustomer?invoice=${orderInvoice}&resi_customer=${receipNumber}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: WaitingDelivery.js ~ line 30 ~ handleReceiptNumber ~ result", result)
                    if (result.status.code == 200) {
                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12034")
                    }
                })
                .catch(error => Utils.handleError(error, "Error with status codde : 12035"));
        } else {
            ToastAndroid.show('Masukkan nomor resi dengan benar!', ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.pt_2} >

                {complainDetails.solusi === 'change' || complainDetails.solusi === 'refund' ?
                    //     <Text style={[styles.font_13]}>Resi <Text style={[styles.font_12, styles.T_medium]}>{complainDetails.resi_customer}</Text> berhasil ditambahkan, pesanan kamu akan diproses setelah penjual menerimanya.</Text>
                    <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[styles.font_13, styles.my]}>Nomor resi telah ditambahkan:</Text>
                        <Text style={[styles.font_12]}>{complainDetails.resi_customer}</Text>
                    </View>
                    : null
                }

                <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    {complainDetails.solusi == 'refund' ?
                        !complainDetails.alasan_tolak_by_seller ?
                            <>
                                <Text style={[styles.font_13, styles.mb]}>Proses komplain telah selesai, saldo akan dikembalikan ke pembeli bila sudah menambahkan rekening</Text>
                                <Text style={[styles.font_13, styles.mb]}>Buka halaman profile untuk menambahkan nomor rekening</Text>


                            </>
                            :
                            <>
                                <Text style={[styles.font_13, styles.mb]}>Penjual telah menolak pesanan dengan alasan: {complainDetails.alasan_tolak_by_seller} {'\n'}</Text>
                                <Text style={[styles.font_13, styles.mb]}>Pesanan kamu akan dikembalikan karna tidak sesuai syarat dan ketentuan pengembalian barang.{'\n'}</Text>
                                <Text style={[styles.font_13, styles.mb]}>Nomor resi pengiriman pesanan kamu saat ini: {complainDetails.resi_seller}  </Text>

                                {newFunction()}
                            </>

                        :
                        null}
                    {complainDetails.solusi == 'change' ?
                        !complainDetails.alasan_tolak_by_seller ?

                            <>
                                <Text style={[styles.font_13, styles.mb]}>Proses komplain telah selesai, nomor resi pengiriman pesanan kamu saat ini: {complainDetails.resi_seller}</Text>
                            </>

                            :
                            <>
                                <Text style={[styles.font_13, styles.mb]}>Penjual telah menolak pesanan dengan alasan: {complainDetails.alasan_tolak_by_seller} {'\n'}</Text>
                                <Text style={[styles.font_13, styles.mb]}>Pesanan kamu akan dikembalikan karna tidak sesuai syarat dan ketentuan pengembalian barang.{'\n'}</Text>
                                <Text style={[styles.font_13, styles.mb]}>Nomor resi pengiriman pesanan kamu saat ini: {complainDetails.resi_seller}  </Text>
                            </>
                        :

                        null
                    }
                    {complainDetails.solusi == 'lengkapi' ?
                        <>
                            <Text style={[styles.font_13, styles.mb]}>Proses komplain telah selesai, nomor resi pengiriman pesanan kamu saat ini: {complainDetails.resi_seller}</Text>
                        </>
                        :
                        null
                    }
                    {complainDetails.solusi == 'tolak' ?
                        <>
                            <Text style={[styles.font_13, styles.mb]}>Penjual telah menolak permintaan komplain dengan alasan: {complainDetails.catatan_solusi} {'\n'}</Text>
                            <Text style={[styles.font_13, styles.mb]}>Proses komplain telah selesai</Text>
                        </>
                        :
                        null
                    }
                </View>
                {newFunction()}
            </ScrollView>
        </View>
    )

    function newFunction() {
        return (
            <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]} >
                <View style={[styles.row_between_center]}>
                    <Text style={[styles.font_13, styles.T_medium, styles.my]}>Detail komplain</Text>
                    <Text style={[styles.font_12, { color: colors.BlueJaja }]}>{complainDetails.status === "request" ? "Menunggu Konfirmasi" : complainDetails.status == "sendback" ? 'Sedang Dikirim' : complainDetails.status == "delivered" ? 'Pesanan Diterima' : complainDetails.status == "completed" ? "Komplain Selesai" : 'Dikonfirmasi'}</Text>
                </View>

                <View style={[styles.column, styles.px]}>
                    <Text numberOfLines={3} style={[styles.font_13, styles.mt_3]}>Alasan Komplain: <Text style={styles.font_13}>{complainDetails.jenis_komplain ? complainDetails.jenis_komplain + ', ' : null}{complainDetails.judul_komplain ? complainDetails.judul_komplain + ', ' : null}{'\n' + complainDetails.komplain}</Text></Text>
                    <Text style={[styles.font_13, styles.mt_3]}>Bukti komplain :</Text>

                    <View style={[styles.row]}>
                        {!complainDetails.gambar1 && !complainDetails.gambar2 && !complainDetails.gambar3 && BcomplainDetails.video ?
                            <View style={styles.column}>
                                <Text style={[styles.font_13, styles.T_light]}>- 0 Foto dilampirkan</Text>
                                <Text style={[styles.font_13, styles.T_light]}>- 0 Video dilampirkan</Text>
                            </View>
                            : null}
                        {complainDetails.gambar1 ?
                            <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar1 }} />
                            </TouchableOpacity>

                            : null}
                        {complainDetails.gambar2 ?
                            <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar2 }} />
                            </TouchableOpacity>
                            : null}
                        {complainDetails.gambar3 ?
                            <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={styles.my_2}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: 15, backgroundColor: colors.BlackGrey }} source={{ uri: complainDetails.gambar3 }} />
                            </TouchableOpacity>
                            : null}
                        {complainDetails.video ?
                            <TouchableOpacity onPress={() => setModal(true) & setStatusBar(colors.Black)} style={[styles.row_center, styles.my_2, { width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.Black }]}>
                                <Image style={{ width: '35%', height: '35%', tintColor: colors.White, alignSelf: 'center' }} source={require('../../assets/icons/play.png')} />
                            </TouchableOpacity>
                            :
                            null}
                    </View>
                    <Text style={[styles.font_13, styles.mt_3]}>Produk dikomplain :</Text>
                    <View style={[styles.row_start_center, styles.mt, { width: '100%', }]}>
                        <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5 }}
                            resizeMethod={"scale"}
                            resizeMode="cover"
                            source={{ uri: complainDetails.product[0].image }} />
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
            </View >
        )
    }
}
