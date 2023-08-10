import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, ToastAndroid } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Wp, Hp, Utils, ServiceFirebase as Firebase, } from '../../export'
import { Button } from 'react-native-paper'

export default function WaitingDelivery() {
    const dispatch = useDispatch()

    const reduxAuth = useSelector(state => state.auth.auth)
    const complainDetails = useSelector(state => state.complain.complainDetails)
    const orderInvoice = useSelector(state => state.order.invoice)
    const complainTarget = useSelector(state => state.complain.complainTarget)
    const orderUid = useSelector(state => state.complain.complainUid)


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
                    if (result.status.code === 200) {
                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                        Firebase.notifChat(complainTarget, { body: 'Pembeli telah mengirim kembali barang yang di komplain', title: 'Komplain' })
                        Firebase.buyerNotifications('orders', orderUid)
                    } else {
                        Utils.handleErrorResponse(result, "Error with status code : 12034")
                    }
                })
                .catch(error => Utils.handleError(error.message, "Error with status codde : 12035"));
        } else {
            ToastAndroid.show('Masukkan nomor resi dengan benar!', ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.pt_2} >

                <View style={[styles.row_between_center, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[styles.font_13]}>Solusi Komplain: </Text>
                    <Text style={[styles.font_13, styles.T_medium]}>{complainDetails.solusi == 'refund' ? 'Pengembalian Dana' : complainDetails.solusi == 'change' ? 'Tukar Barang' : 'Lengkapi Barang'}</Text>
                </View>

                <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[styles.font_13, styles.mb_3]}>Prosedur yang harus dilakukan pembeli dalam proses komplain saat ini:</Text>
                    <Text style={[styles.font_13, styles.mb]}>1. Pembeli harus mengirim barang ke alamat penjual menggunakan jasa kurir terdekat</Text>
                    <Text style={[styles.font_13, styles.mb]}>2. Pembeli wajib mengisi form resi dibawah ini sebagai bukti pengiriman </Text>
                </View>
                <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[styles.font_13, styles.mb]}>Masukkan resi pengiriman anda disini :</Text>
                    <View style={[styles.row_between_center, { width: '100%' }]}>
                        <TextInput style={[styles.font_13, { borderWidth: 0.5, borderColor: colors.WhiteSilver, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => setReceipNumber(text)} value={receipNumber} />
                        <Button onPress={handleReceiptNumber} mode="contained" color={colors.BlueJaja} style={{ width: '30%' }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]}>Kirim</Button>
                    </View>
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
