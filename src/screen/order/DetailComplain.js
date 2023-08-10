import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, ScrollView, Modal, RefreshControl } from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import { useSelector, useDispatch } from 'react-redux';
import { Appbar, colors, styles, Utils, Loading, Wp, Hp, ServiceFirebase as Firebase, ServiceCheckout } from '../../export';
import firebaseDatabase from '@react-native-firebase/database';
import FinishedComplain from '../../components/OrderComplain/FinishedComplain';
import WaitingDelivery from '../../components/OrderComplain/WaitingDelivery';
import ProsesComplain from '../../components/OrderComplain/ProsesComplain';
import RequestComplain from '../../components/OrderComplain/RequestComplain';
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

export default function DetailComplain() {
    const navigation = useNavigation()
    const reduxAuth = useSelector(state => state.auth.auth)
    const orderInvoice = useSelector(state => state.order.invoice)
    const updateComplain = useSelector(state => state.complain.complainUpdate)
    const orderUid = useSelector(state => state.complain.complainUid)
    const reaUpdate = useSelector(state => state.dashboard.notifikasi)
    const complainTarget = useSelector(state => state.complain.complainTarget)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(null)
    const [complainStep, setComplainStep] = useState(0)
    const [titleHeader, setTitleHeader] = useState('Detail komplain')
    const [complainDetails, setComplainDetails] = useState('')
    const [modalConfirm, setModalConfirm] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const [tabLabels, setTabLabels] = useState(['Permintaan Komplain'])
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: colors.RedNotif,
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: colors.BlueJaja,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: colors.BlueJaja,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: colors.BlueJaja,
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: colors.RedNotif,
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 12,
        currentStepLabelColor: colors.RedNotif,
        labelFontFamily: 'SignikaNegative-Regular',
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);

    useEffect(() => {
        try {
            if (updateComplain) {
                getItem()
                setLoading(true)
            } else {
                setLoading(false)

            }
            if (currentPosition) {
                setTitleHeader('Detail Komplain')
            } else {
                setTitleHeader('Permintaan Komplain')
            }
        } catch (error) {
            console.log(error.message)

        }

        firebaseDatabase()
            .ref(`/people/${orderUid}`)
            .once('value')
            .then(snapshot => {
                let target = snapshot.val();
                dispatch({ type: 'SET_COMPLAIN_TARGET', payload: target.token })
            });
        if (updateComplain) {
            getItem()
        }

    }, [updateComplain])


    const handleSteps = (step) => {
        dispatch({ type: 'SET_COMPLAIN_STEPS', payload: step })
    }

    const handeCurrencyPosition = (status) => {
        dispatch({ type: 'SET_COMPLAIN_STATUS', payload: status })
    }

    const getItem = () => {
        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: false })

        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=rq2cevhmm63hlhiro9l2ltcnvmcknvce");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let res = true

        fetch(`https://jaja.id/backend/order/komplainDetail?invoice=${orderInvoice}`, requestOptions)
            .then(response => response.text())
            .then(rsl => {
                try {
                    let result = JSON.parse(rsl)
                    if (result.status.code === 200) {
                        if (result.data && Object.keys(result.data[0]).length) {
                            let data = result.data[0];
                            setLoading(false)
                            dispatch({ type: 'SET_COMPLAIN_DETAILS', payload: data })
                            setComplainDetails(data)
                            console.log("101")
                            if (!data.solusi) {
                                setCurrentPosition(0)
                                setComplainStep(1)
                                console.log("111")

                                setTabLabels(['Permintaan Komplain'])
                            } else if (data.solusi == 'refund') {
                                setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Dalam Proses', 'Komplain Selesai'])
                                setComplainStep(4)
                                if (!data.resi_customer) {
                                    setCurrentPosition(1)
                                    console.log("151")
                                } else if (data.resi_customer && !data.alasan_tolak_by_seller && data.status !== 'completed') {
                                    setCurrentPosition(2)
                                    console.log("141")
                                } else if (data.alasan_tolak_by_seller && data.resi_seller) {
                                    setCurrentPosition(3)
                                    console.log("131")

                                } else if (data.status == 'completed') {
                                    console.log("121")
                                    setCurrentPosition(4)
                                }
                            } else if (data.solusi == 'change') {
                                setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Dalam Proses', 'Komplain Selesai'])
                                setComplainStep(4)
                                if (!data.resi_customer) {
                                    console.log("161")
                                    setCurrentPosition(1)
                                } else if (data.resi_customer && !data.alasan_tolak_by_seller && data.status !== 'completed') {
                                    console.log("171")
                                    setCurrentPosition(2)
                                } else if (data.resi_seller) {
                                    console.log("181")
                                    setCurrentPosition(4)
                                } else if (data.status == 'completed') {
                                    console.log("191")
                                    setCurrentPosition(4)
                                }
                            } else if (data.solusi == 'lengkapi') {
                                setComplainStep(2)
                                console.log("200")
                                setTabLabels(['Permintaan Komplain', 'Komplain Selesai'])
                                if (!data.resi_seller) {
                                    console.log("201")
                                    setCurrentPosition(0)
                                } else if (data.resi_seller && !data.alasan_tolak_by_seller && data.status !== 'completed') {
                                    console.log("211")
                                    setCurrentPosition(1)
                                } else if (data.status == 'completed') {
                                    console.log("221")
                                    setCurrentPosition(2)
                                    setCurrentPosition(4)

                                }

                            } else if (data.solusi == 'tolak') {
                                console.log("231")
                                setComplainStep(2)
                                setTabLabels(['Permintaan Komplain', 'Komplain Selesai'])
                                if (complainDetails.status === 'completed') {
                                    setCurrentPosition(4)
                                } else {
                                    setCurrentPosition(2)
                                }
                            }
                            //     setDetails(data)
                            //     setstatusTest(data.status)
                            //     setSolusiTest(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                            //     // refund,change, lengkapi, tolak
                            //     setalasanTolak(data.alasan_tolak_by_seller)
                            //     setResiBuyer(data.resi_customer)
                            //     setResiSeller(data.resi_seller)
                            //     setSolusiTest(data.solusi)
                            //     if (data.solusi) {
                            //         setDisabled(true)
                            //         setChecked(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                            //         console.log("masuk sisni")
                            //     } else {
                            //         setDisabled(false)
                            //     }
                            // }
                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12053')
                        }
                    }
                    res = false

                    setTimeout(() => setCount(count + 1), (500));

                    setTimeout(() => setLoading(false), (1000));
                } catch (error) {
                    console.log(error.message)

                }

            })
            .catch(error => {
                res = false
                Utils.handleError(error.message, "Error with status code : 12054")
            });

        setTimeout(() => {
            if (res) {
                setTimeout(() => {
                    let signal = Utils.CheckSignal();
                    if (!signal.connect) {
                        Utils.alertPopUp('Tidak dapat terhubung, periksa kembali koneksi internet anda!')
                    }
                    setLoading(false)
                }, 5000);
                Utils.alertPopUp("Sedang Memuat..")
            } else {
                setLoading(false)
            }
        }, 7000);
    }

    const handleAccept = () => {
        setModalConfirm(false)
        // Firebase.notifChat(complainTarget, { body: 'Pembeli telah mengirim kembali barang yang di komplain', title: 'Komplain' })
        // Firebase.buyerNotifications('orders', orderUid)
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=7vgloal55kn733tsqch0v7lh1tfrcilq");

        var formdata = new FormData();
        formdata.append("invoice", orderInvoice);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/order/pesananDiterima", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: DetailComplain.js ~ line 269 ~ handleAccept ~ result", result)
                if (result.status.code == 200) {
                    console.log('masuk sini nggk kntol')
                    navigation.navigate('Pesanan')
                    Firebase.notifChat(complainTarget, { body: 'Pembeli Telah Menerima Pesanan', title: 'Pesanan' })
                    Firebase.buyerNotifications('orders', orderUid)
                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 12036")
                }
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                Utils.handleError(error.message, "Error with staus code : 12037")
            });
    }



    return (
        <SafeAreaView style={[styles.containerFix]}>
            <Appbar title={titleHeader} back={true} />
            {loading ? <Loading /> : null}
            <View style={[styles.containerIn,]}>
                <ScrollView contentContainerStyle={{ height: Hp('100%') }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>

                    <View style={[styles.column, { flex: 1 }]}>
                        {complainDetails && Object.keys(complainDetails).length && currentPosition !== 0 ?
                            <View style={[{ backgroundColor: colors.White, justifyContent: 'center', paddingVertical: '3%' }]}>
                                <StepIndicator
                                    customStyles={customStyles}
                                    currentPosition={currentPosition}
                                    labels={tabLabels}
                                    stepCount={complainStep}
                                />
                            </View>
                            :
                            null
                        }
                        {complainDetails && Object.keys(complainDetails).length ?
                            <View style={[styles.container]}>
                                {complainDetails.solusi === 'tolak' || complainDetails.solusi === 'lengkapi' || complainDetails.status === 'completed' || complainDetails.alasan_tolak_by_seller ?
                                    <FinishedComplain />
                                    : currentPosition == 0 ?
                                        <RequestComplain />
                                        : currentPosition == 2 ?
                                            <ProsesComplain /> : <WaitingDelivery />}
                            </View>
                            : null}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            flex: 0,
                            width: Wp("100%"),
                            height: Hp('8%'),
                            // marginBottom: Hp('1%'),
                            paddingHorizontal: '2%',
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: 'space-around',
                            backgroundColor: colors.White,

                        }}>
                        <Button onPress={() => setModalConfirm(true)} mode="contained" color={colors.White} style={{ width: '90%', alignSelf: 'center', elevation: 0, borderWidth: 0.5, borderColor: colors.BlueJaja }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja }]}>Terima Pesanan</Button>

                    </View>
                </ScrollView>
            </View>
            <Modal transparent={true} visible={modalConfirm} animationType='fade' >
                <View style={{ width: Wp('100%'), height: Hp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.column, { width: Wp('90%'), height: Wp('45%'), backgroundColor: colors.White, elevation: 11, zIndex: 999, borderRadius: 7 }]}>
                        <View style={[styles.column_center_start, styles.p_4, { flex: 1 }]}>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja }]}>Terima Pesanan</Text>
                            <Text style={[styles.font_13]}>Dengan menerima pesanan proses komplain selesai.</Text>
                        </View>
                        <View style={[styles.row_end, styles.p_2, { alignItems: 'flex-end', width: '100%', }]}>
                            <Button mode="text" onPress={() => setModalConfirm(false)} labelStyle={[styles.font_12, styles.T_semi_bold]} style={{ height: '100%', width: '30%' }} color={colors.YellowJaja}>
                                BATAL
                            </Button>
                            <Button mode="text" onPress={handleAccept} labelStyle={[styles.font_12, styles.T_semi_bold]} style={{ height: '100%', width: '30%' }} color={colors.BlueJaja}>
                                TERIMA
                            </Button>
                        </View>
                    </View>
                </View >
            </Modal >
        </SafeAreaView >
    )
}
