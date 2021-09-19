import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, ToastAndroid, Image, TouchableOp } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Wp, Hp, Utils, } from '../../export'
import { Button } from 'react-native-paper'

export default function ProsesComplain() {
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

                <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[styles.font_13]}>Nomor resi: </Text>
                    <Text style={[styles.font_13, styles.T_medium]}>{complainDetails.resi_customer}</Text>
                </View>

                <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[styles.font_13, styles.mb_3]}>Prosedur yang harus dilakukan penjual dalam proses komplain saat ini:</Text>
                    <Text style={[styles.font_13, styles.mb]}>1. Setelah pesanan kamu sampai, penjual akan memproses barang tersebut untuk kelayakan pengembalian ataupun penukaran.{'\n'}</Text>
                    {complainDetails.solusi == 'refund' ?
                        <>
                            <Text style={[styles.font_13, styles.mb]}>2. Bila syarat dan ketentuan pengembalian barang tepenuhi, proses komplain selesai.{'\n'}</Text>
                            <Text style={[styles.font_13, styles.mb]}>3. Bila syarat dan ketentuan pengembalian barang tidak terpenuhi, pesanan akan dikirim kembali ke pembeli, komplain selesai.</Text>

                        </>
                        :

                        <>
                            <Text style={[styles.font_13, styles.mb]}>2. Bila syarat dan ketentuan pengembalian barang tepenuhi, penjual akan menukar barang sesuai pesanan kamu dan beserta resi pengiriman, komplain selesai.</Text>
                            <Text style={[styles.font_13, styles.mb]}>3. Bila syarat dan ketentuan pengembalian barang tidak terpenuhi, pesanan akan dikirim kembali ke pembeli, komplain selesai.</Text>

                        </>}
                </View>

                <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <View style={styles.row_between_center}>
                        <Text style={[styles.font_13, styles.T_medium]}>No. Invoice</Text>
                        <Text style={[styles.font_13, { color: colors.BlackTitle }]}>{complainDetails.invoice}</Text>
                    </View>
                    <View style={styles.row_between_center}>
                        <Text style={[styles.font_13, styles.T_light]}>Tanggal Pengajuan</Text>
                        <Text style={[styles.font_13, { color: colors.BlackTitle }]}>{String(complainDetails.created_date).slice(0, 16)}</Text>
                    </View>
                    <View style={styles.row_between_center}>
                        <Text style={[styles.font_13, styles.T_light]}>Batas Waktu</Text>
                        <Text style={[styles.font_13, { color: colors.BlackTitle }]}>{String(complainDetails.complain_limit).slice(0, 16)}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}
