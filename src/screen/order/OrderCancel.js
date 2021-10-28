import React, { useState } from 'react'
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, StatusBar, ScrollView, Alert } from 'react-native'
import { styles, Appbar, colors, Wp, Loading, useNavigation, Utils } from '../../export'
import { Button, RadioButton } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { useSelector } from 'react-redux';

export default function OrderComplain(props) {
    const navigation = useNavigation()
    const reduxOrderStatus = useSelector(state => state.order.orderStatus)
    const reduxOrderInvoice = useSelector(state => state.order.invoice)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [activeSections, setactiveSections] = useState(null)
    const [checked, setChecked] = useState(null);
    const [categoryCompalain, setcategoryCompalain] = useState('');
    const [titleComplain, settitleComplain] = useState('');
    const [textComplain, settextComplain] = useState('');
    const [alertText, setalertText] = useState('');
    const [loading, setLoading] = useState(false);

    const [images, setImages] = useState([]);

    const [video, setVideo] = useState('');

    const data = [
        { id: '1CV', title: "Ganti Metode Pembayaran", content: [] },
        { id: '2CV', title: "Masih Bimbang", content: [] },
        { id: '3CV', title: "Respon Penjual Lambat", content: [] },
        { id: '4CV', title: "Lainnya", content: [] },

    ]

    const handleSendCancel = () => {
        if (!activeSections) {
            setalertText('Pilih salah satu jenis pembatalan!')
        } else {
            setalertText('')
            Alert.alert(
                "Batalkan Pesanan",
                `Kamu yakin ingin membatalkan pesanan?`,
                [

                    { text: "Kembali", onPress: () => console.log("OK Pressed") },
                    {
                        text: "Batalkan", onPress: () => {
                            setLoading(true)
                            var myHeaders = new Headers();
                            myHeaders.append("Authorization", reduxAuth);
                            myHeaders.append("Cookie", "ci_session=dek9j11bii7l7sqi5ujffskglpj315vc");
                            var raw = "";
                            var requestOptions = {
                                method: 'GET',
                                headers: myHeaders,
                                body: raw,
                                redirect: 'follow'
                            };
                            if (reduxOrderStatus == "Menunggu Pembayaran") {
                                fetch(`https://jaja.id/backend/order/batalBelumbayar?order_id=${reduxOrderInvoice}`, requestOptions)
                                    .then(response => response.json())
                                    .then(result => {
                                        setLoading(false)
                                        if (result && Object.keys(result).length && result.status.code == 200) {
                                            navigation.navigate('Pesanan')
                                        } else {
                                            Utils.handleErrorResponse(result, "Error with status code : 12017")
                                        }
                                    })
                                    .catch(error => {
                                        setLoading(false)
                                        Utils.handleError(error, "Error with status code : 12018")
                                    });
                            } else {
                                fetch(`https://jaja.id/backend/order/batalMenungguKonfirmasi?invoice=${reduxOrderInvoice}`, requestOptions)
                                    .then(response => response.json())
                                    .then(result => {
                                        setLoading(false)
                                        if (result && Object.keys(result).length && result.status.code == 200) {
                                            navigation.navigate('Pesanan')
                                        } else {
                                            Utils.handleErrorResponse(result, "Error with status code : 12019")
                                        }
                                    })
                                    .catch(error => {
                                        setLoading(false)
                                        Utils.handleError(error, "Error with status code : 12020")
                                    });
                            }
                        }
                    },

                ],
                { cancelable: false }
            );
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Batalkan Pesanan" Bg={colors.BlueJaja} />
            {loading ? <Loading /> : null}
            <ScrollView>
                <View style={[styles.column_start, styles.p_4, { width: Wp('100%') }]}>
                    <Text numberOfLines={2} style={[styles.font_14, styles.T_semi_bold, styles.mb_5]}>Pilih salah satu alasan pembatalan atau pilih lainnya : </Text>
                    <FlatList
                        style={{ width: '100%' }}
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            console.log("🚀 ~ file: OrderCancel.js ~ line 141 ~ OrderComplain ~ item", item)

                            return (

                                <TouchableOpacity onPress={() => setactiveSections(item.id) & setChecked(null) & setcategoryCompalain(item.title) & settitleComplain("") & setalertText("")} style={[styles.column_center_start, styles.mb_5, styles.p_3, { backgroundColor: colors.White, elevation: 2, width: '100%', }]}>
                                    <View style={[styles.row_between_center, { width: '100%' }]}>
                                        <Text style={[styles.font_14, styles.T_semi_bold]}>{item.title}</Text>
                                        <RadioButton
                                            color={colors.BlueJaja}
                                            value={activeSections}
                                            status={activeSections === item.id ? 'checked' : 'unchecked'}
                                            onPress={() => setactiveSections(item.id)}

                                        />
                                    </View>
                                    <Collapsible style={{ width: '100%' }} collapsed={activeSections !== item.id ? true : false}>
                                        <View style={[styles.column, styles.px_3]}>
                                            <Text style={[styles.font_12, styles.T_medium, styles.mt_5,]}>Masukkan alasan pembatalan</Text>
                                            <TextInput
                                                value={textComplain}
                                                onChangeText={(text) => settextComplain(text)}
                                                style={[styles.font_12, { borderBottomWidth: 0.5, width: Wp('80%'), minHeight: Wp('15%'), maxHeight: Wp('100%') }]}
                                                numberOfLines={5}
                                                multiline={true}
                                                maxLength={500}
                                                placeholder="Masukkan alasan pembatalan"
                                                textAlignVertical='top'
                                            />
                                        </View>

                                    </Collapsible>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <Text style={[styles.font_12, styles.my_5, { color: colors.RedNotif }]}>{alertText}</Text>
                    <Button onPress={handleSendCancel} style={{ width: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} mode="contained">Batalkan Pesanan</Button>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}
