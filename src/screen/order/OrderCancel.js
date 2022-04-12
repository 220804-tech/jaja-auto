import React, { useState } from 'react'
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, StatusBar, ScrollView, Alert, Platform, Modal } from 'react-native'
import { styles, Appbar, colors, Wp, Loading, useNavigation, Utils, ServiceOrder, Hp } from '../../export'
import { Button, RadioButton, TouchableRipple } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { useDispatch, useSelector } from 'react-redux';

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
    const [modalNext, setmodalNext] = useState(false);

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
        // if (!activeSections) {
        //     setalertText('Pilih salah satu jenis pembatalan!')
        // } else {

        setmodalNext(false)
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
            console.log("🚀 ~ file: OrderCancel.js ~ line 74 ~ handleSendCancel ~ reduxOrderInvoice", reduxOrderInvoice)
            fetch(`https://jaja.id/backend/order/batalBelumbayar?order_id=${reduxOrderInvoice}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result && Object.keys(result).length && result.status.code == 200) {
                        handleFetchUnpaid()
                        setTimeout(() => {
                            setLoading(false)
                            navigation.navigate('Pesanan')
                        }, 3000);
                    } else {
                        setLoading(false)
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
                    if (result && Object.keys(result).length && result.status.code == 200) {
                        handleFetchProcess()
                        setTimeout(() => {
                            setLoading(false)
                            navigation.navigate('Pesanan')
                        }, 3000);
                    } else {
                        setLoading(false)
                        Utils.handleErrorResponse(result, "Error with status code : 12019")
                    }
                })
                .catch(error => {
                    setLoading(false)
                    Utils.handleError(error, "Error with status code : 12020")
                });
            //     }
            // }
            //         },

            //     ],
            //     { cancelable: false }
            // );
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
                        <Text numberOfLines={2} style={[styles.font_14, styles.T_semi_bold, styles.mb_5]}>Pilih salah satu alasan pembatalan atau pilih lainnya : </Text>
                        <FlatList
                            style={{ width: '100%' }}
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return (

                                    <TouchableOpacity onPress={() => setactiveSections(item.id) & setChecked(null) & setcategoryCompalain(item.title) & settitleComplain("") & setalertText("")} style={[styles.column_center_start, styles.mb_5, styles.p_3, {
                                        backgroundColor: colors.White, width: '100%', shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }]}>
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
                        <Button onPress={() => {
                            if (!activeSections) {
                                setalertText('Pilih salah satu jenis pembatalan!')
                            } else {
                                setmodalNext(true)
                            }
                        }} style={{ width: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]} mode="contained">Batalkan Pesanan</Button>
                    </View>
                </ScrollView>
            </View>
            <Modal
                statusBarTranslucent={true}
                animationType="fade"
                transparent={true}
                visible={modalNext}
                onRequestClose={() => {
                    setmodalNext(!modalNext);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        width: Wp("100%"),
                        height: Hp("100%"),
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={[
                            styles.column_between_center,
                            styles.p_4,
                            {
                                alignItems: 'flex-start',
                                width: Wp("85%"),
                                height: Wp("45%"),
                                borderRadius: 7,
                                backgroundColor: colors.White,
                                elevation: 11,
                                zIndex: 999,
                            },
                        ]}
                    >

                        <Text style={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja }]} >Batalkan Pesanan</Text>
                        <Text style={[styles.font_13, styles.T_medium, { marginTop: '-3%' }]} >Kamu yakin ingin membatalkan pesanan ini?</Text>

                        <View style={[styles.row_end, { width: '100%' }]}>
                            <TouchableRipple onPress={() => setmodalNext(false)} style={[styles.px_4, styles.py_2, { borderRadius: 3, backgroundColor: colors.YellowJaja }]}>
                                <Text style={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>KEMBALI</Text>
                            </TouchableRipple>
                            <TouchableRipple onPress={handleSendCancel} style={[styles.px_4, styles.py_2, styles.ml_2, { borderRadius: 3, backgroundColor: colors.RedMaroon }]}>
                                <Text style={[styles.font_11, styles.T_semi_bold, { color: colors.White }]}>BATALKAN</Text>
                            </TouchableRipple>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}
