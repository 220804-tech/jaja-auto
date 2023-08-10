import React, { useState } from 'react'
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, StatusBar, ScrollView, Alert, Platform } from 'react-native'
import { styles, Appbar, colors, Wp, Loading, useNavigation, Utils, ServiceOrder } from '../../export'
import { Button, RadioButton } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import CheckBox from '@react-native-community/checkbox'
import axios from 'axios';

export default function OrderComplain(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
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
        { id: '2CV', title: "Ganti Alamat Pengiriman", content: [] },
        { id: '3CV', title: "Ganti Produk atau Variasi Produk", content: [] },
        { id: '4CV', title: "Respon Penjual Lambat", content: [] },
        { id: '5CV', title: "Lainnya", content: [] },

    ]

    const handleSendCancel = () => {
        if (!activeSections) {
            setalertText('Pilih salah satu jenis pembatalan!');
        } else {
            setalertText('');
            Alert.alert(
                "Batalkan Pesanan",
                `Kamu yakin ingin membatalkan pesanan?`,
                [
                    { text: "Kembali", onPress: () => console.log("OK Pressed") },
                    {
                        text: "Batalkan", onPress: async () => {
                            setLoading(true);
                            const config = {
                                headers: {
                                    Authorization: reduxAuth,
                                    Cookie: 'ci_session=dek9j11bii7l7sqi5ujffskglpj315vc',
                                }
                            };

                            try {
                                let result;
                                if (reduxOrderStatus == "Menunggu Pembayaran") {
                                    const response = await axios.get(`https://jaja.id/backend/order/batalBelumbayar?order_id=${reduxOrderInvoice}`, config);
                                    result = response.data;

                                    if (result && Object.keys(result).length && result.status.code == 200) {
                                        handleFetchUnpaid();
                                        setTimeout(() => {
                                            setLoading(false);
                                            navigation.navigate('Pesanan', { index: 4 });
                                        }, 3000);
                                    } else {
                                        setLoading(false);
                                        Utils.handleErrorResponse(result, "Error with status code : 12017");
                                    }
                                } else {
                                    const response = await axios.get(`https://jaja.id/backend/order/batalMenungguKonfirmasi?invoice=${reduxOrderInvoice}`, config);
                                    result = response.data;

                                    if (result && Object.keys(result).length && result.status.code == 200) {
                                        handleFetchProcess();
                                        setTimeout(() => {
                                            setLoading(false);
                                            navigation.navigate('Pesanan');
                                        }, 3000);
                                    } else {
                                        setLoading(false);
                                        Utils.handleErrorResponse(result, "Error with status code : 12019");
                                    }
                                }
                            } catch (error) {
                                setLoading(false);
                                Utils.handleError(error.message, "Error with status code : 12020");
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        }
    }


    const handleFetchUnpaid = () => {
        ServiceOrder.getUnpaid(reduxAuth).then(resUnpaid => {
            if (resUnpaid) {
                dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
            }
        })
        handleFetchFailed()
    }

    const handleFetchProcess = () => {
        ServiceOrder.getWaitConfirm(reduxAuth).then(reswaitConfirm => {
            if (x) {
                dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
            }
        })
        ServiceOrder.getProcess(reduxAuth).then(resProcess => {
            if (resProcess) {
                dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
            }
        })
        handleFetchFailed()
    }
    const handleFetchFailed = () => {
        ServiceOrder.getFailed(reduxAuth).then(resFailed => {
            if (resFailed) {
                dispatch({ type: 'SET_FAILED', payload: resFailed.items })
            }
        })
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Batalkan Pesanan" Bg={colors.BlueJaja} />
            {loading ? <Loading /> : null}
            <View style={[styles.container, { backgroundColor: colors.White }]}>
                <ScrollView>
                    <View style={[styles.column_start, styles.p_4, { width: Wp('100%'), backgroundColor: colors.White }]}>
                        <Text numberOfLines={2} style={[styles.font_13, styles.T_semi_bold, styles.mb_5]}>Pilih salah satu alasan pembatalan atau pilih lainnya : </Text>
                        <FlatList
                            style={{ width: '100%' }}
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return (

                                    <TouchableOpacity onPress={() => setactiveSections(item.id) & setChecked(null) & setcategoryCompalain(item.title) & settitleComplain("") & setalertText("")} style={[styles.column_center_start, styles.mb_5, styles.p_3, styles.shadow_5, {
                                        backgroundColor: colors.White, width: '100%', shadowColor: colors.BlueJaja,
                                    }]}>
                                        <View style={[styles.row_between_center, { width: '100%' }]}>
                                            <Text style={[styles.font_13, styles.T_semi_bold]}>{item.title}</Text>
                                            {/* <RadioButton
                                                color={colors.BlueJaja}
                                                value={activeSections}
                                                status={activeSections === item.id ? 'checked' : 'unchecked'}
                                                onPress={() => setactiveSections(item.id)}
                                            /> */}
                                            <CheckBox

                                                value={activeSections === item.id ? true : false}
                                                onValueChange={() => setactiveSections(item.id)}
                                                style={styles.mr_2}
                                                onTintColor={colors.YellowJaja}
                                                onCheckColor={colors.YellowJaja}
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
                        <Button onPress={handleSendCancel} style={{ width: '100%' }} color={colors.RedDanger} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} mode="contained">Batalkan Pesanan</Button>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}
