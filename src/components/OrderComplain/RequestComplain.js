import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal, ToastAndroid, StatusBar } from 'react-native'
import { Button, Checkbox } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { styles, colors, Wp, Hp, Utils, Firebase } from '../../export'
import VideoPlayer from 'react-native-video-player';
import Swiper from 'react-native-swiper'
import firebaseDatabase from '@react-native-firebase/database';
export default function RequestComplain() {
    const complainDetails = useSelector(state => state.complain.complainDetails)
    console.log("🚀 ~ file: RequestComplain.js ~ line 11 ~ RequestComplain ~ complainDetails", complainDetails)
    const complainStep = useSelector(state => state.complain.complainStep)
    const orderInvoice = useSelector(state => state.order.invoice)
    // const orderUid = useSelector(state => state.order.orderUid)
    const realNotif = useSelector(state => state.dashboard.notifikasi)
    // const target = useSelector(state => state.notification.target)
    // console.log("🚀 ~ file: RequestComplain.js ~ line 18 ~ RequestComplain ~ target", target)

    const dispatch = useDispatch()
    const refScrolView = useRef()
    const [collapsForm, setCollapsForm] = useState(true)
    const [resiSeller, setResiSeller] = useState('')
    const [checked, setChecked] = useState('');
    const [modalConfirm, setModalConfirm] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [modal, setModal] = useState(false);
    const [statusBar, setStatusBar] = useState(colors.BlueJaja);

    useEffect(() => {
        setTimeout(() => {
            refScrolView.current?.scrollTo({ y: 100, animated: true });
        }, 2000);
    }, [])

    const handleSolution = () => {
        Alert.alert(
            `${checked == "refund" ? "Pengembalian Dana" : checked == "change" ? "Tukar Barang" : checked === "complete" ? 'Lengkapi Barang' : checked === "delivery" ? "Masalah Pengiriman" : ""}`,
            "Setelah anda memilih, solusi tidak dapat diubah",
            [
                {
                    text: "Batal",
                    onPress: () => console.log(checked),
                    style: "cancel",
                },
                {
                    text: "Pilih",
                    onPress: () => {
                        var myHeaders = new Headers();
                        myHeaders.append("Cookie", "ci_session=baigr5juu7sdhf8f8s882cvs311g7mg0");

                        var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`https://jaja.id/core/seller/order/solusiKomplain?invoice=${orderInvoice}&solusi=${checked}&catatan_solusi=checked`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.status.code == 200) {
                                    ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                                    getItem()
                                } else {
                                    Utils.handleErrorResponse(result, 'Error with status code : 12030')
                                }
                            })
                            .catch(error => Utils.handleError(error, "Error with status code : 12031"));
                    },
                    style: "default",
                },
            ],
            {
                cancelable: true,
            }
        );
    }
    const handleConfirm = async (val) => {
        console.log("🚀 ~ file: RequestComplain.js ~ line 83 ~ handleConfirm ~ modalConfirm", modalConfirm)
        if (alasanTolak) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=haimvak8880qrbbeleojeao0e60a5eds");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            await fetch(`https://jaja.id/core/seller/order/confirmKomplain?invoice=${orderInvoice}&status=${val}&catatan_solusi=${alasanTolak}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        ToastAndroid.show('Komplain berhasil disetujui!', ToastAndroid.LONG, ToastAndroid.TOP)
                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                        if (val === 'completed') {
                            ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                            Firebase.notifChat(item.token, { body: 'Komplain kamu telah direspon penjual.', title: 'Komplain Pesanan' })
                        }
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 120030')
                    }
                })
                .catch(error => Utils.handleError(error, "Error with status code : 120031"));

            if (modalConfirm === 'confirmed') {
                fetch(`https://jaja.id/core/seller/order/solusiKomplain?invoice=${orderInvoice}&solusi=${checked}&catatan_solusi=checked`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status.code == 200) {
                            ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                            Firebase.notifChat(item.token, { body: 'Komplain kamu telah direspon penjual.', title: 'Komplain Pesanan' })
                            dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12003')
                        }
                    })
                    .catch(error => Utils.handleError(error, "Error with status code : 12001"));
            }
            // firebaseDatabase().ref(`/people/${orderUid}notif`).update({ order: realNotif.orders + 1 });
        }
        setModalConfirm(null)
    }



    return (
        <View style={[styles.container]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={statusBar}
                barStyle='default'
                showHideTransition="fade"
            />
            <ScrollView contentContainerStyle={styles.pt_2} ref={refScrolView}>
                {complainDetails && Object.keys(complainDetails).length ?
                    <View style={styles.container}>
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[styles.font_13, styles.T_medium]}>Komplain anda telah diajukan,<Text style={[styles.font_13, { color: colors.BlackTitle }]}>{'\n'}bila penjual tidak merespon komplain kamu sebelum tanggal {String(complainDetails.complain_limit).slice(0, 16)} pengajuan komplain kamu akan otomatis disetujui dengan solusi Pengembalian Uang</Text></Text>
                        </View>


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
                                    {!complainDetails.gambar1 && !complainDetails.gambar2 && !complainDetails.gambar3 && BcomplainDetails.video ?
                                        <View style={styles.column}>
                                            <Text style={[styles.font_13, styles.T_light]}>- 0 Foto dilampirkan</Text>
                                            <Text style={[styles.font_13, styles.T_light]}>- 0 Video dilampirkan</Text>
                                        </View>
                                        : null
                                    }
                                    {complainDetails.gambar1 ?
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
                    </View>
                    : null
                }
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal);
                    setStatusBar(colors.BlueJaja)
                }}>
                <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: colors.Black, zIndex: 999 }}>
                    {complainDetails && Object.keys(complainDetails).length ?
                        <Swiper style={styles.wrapper} showsButtons={true}>
                            {complainDetails.gambar1 ?
                                <View style={[styles.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar1 }} />
                                </View> : null
                            }
                            {complainDetails.gambar2 ?
                                <View style={[styles.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar2 }} />
                                </View> : null
                            }
                            {complainDetails.gambar3 ?
                                <View style={[styles.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar3 }} />
                                </View> : null
                            }
                            {complainDetails.video ?
                                <View style={[styles.row_center]}>
                                    <VideoPlayer
                                        video={{ uri: complainDetails.video }}
                                        resizeMode="cover"
                                        style={{ width: Wp('100%'), height: Hp('100%') }}
                                        disableFullscreen={false}
                                        fullScreenOnLongPress={true}
                                    />
                                </View>
                                : null
                            }
                        </Swiper>
                        : null
                    }
                </View>
            </Modal >
        </View >
    )
}
