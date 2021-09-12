import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, ToastAndroid, TouchableOpacity } from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import { useSelector, useDispatch } from 'react-redux';
import { Appbar, colors, styles, Utils, Loading, Wp } from '../../export';
import firebaseDatabase from '@react-native-firebase/database';
import FinishedComplain from '../../components/OrderComplain/FinishedComplain';
import WaitingDelivery from '../../components/OrderComplain/WaitingDelivery';
import ProsesComplain from '../../components/OrderComplain/ProsesComplain';
import RequestComplain from '../../components/OrderComplain/RequestComplain';

export default function DetailKomplain() {
    const reduxAuth = useSelector(state => state.auth.auth)
    const orderInvoice = useSelector(state => state.order.invoice)
    const updateComplain = useSelector(state => state.complain.complainUpdate)
    // const orderUid = useSelector(state => state.orders.orderUid)
    const reaUpdate = useSelector(state => state.dashboard.notifikasi)
    // console.log("🚀 ~ file: DetailKomplain.js ~ line 16 ~ DetailKomplain ~ orderUid", orderUid)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(null)
    const [complainStep, setComplainStep] = useState(0)
    const [titleHeader, setTitleHeader] = useState('Detail komplain')
    const [complainDetails, setComplainDetails] = useState('')

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
        labelFontFamily: 'Poppins-Regular',
    }

    useEffect(() => {
        if (orderInvoice) {
            getItem(orderInvoice)
        }
        if (currentPosition) {
            setTitleHeader('Detail Komplain')
        } else {
            setTitleHeader('Permintaan Komplain')
        }
        // dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: false })

        // firebaseDatabase()
        //     .ref(`/people/${orderUid}/notif`)
        //     .once('value')
        //     .then(snapshot => {
        //         console.log('User data: ', snapshot.val());
        //         let target = snapshot.val();
        //         dispatch({ type: 'HANDLE_NOTIFIKASI', valueNotifikasi: target })
        //     });
        // firebaseDatabase()
        //     .ref(`/people/${orderUid}`)
        //     .once('value')
        //     .then(snapshot => {
        //         let target = snapshot.val();
        //         console.log("🚀 ~ file: DetailKomplain.js ~ line 1211212121 ~ useEffect ~ target", target)
        //         dispatch({ type: 'SET_TARGET', payload: target })
        //     });
    }, [])

    const handleSteps = (step) => {
        dispatch({ type: 'SET_COMPLAIN_STEPS', payload: step })
    }
    const handeCurrencyPosition = (status) => {
        dispatch({ type: 'SET_COMPLAIN_STATUS', payload: status })
    }

    const getItem = (inv) => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=rq2cevhmm63hlhiro9l2ltcnvmcknvce");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let res = true

        fetch(`https://jaja.id/backend/order/komplainDetail?invoice=${inv}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                res = false
                setTimeout(() => setLoading(false), (1000));
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
                            setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Perlu Diproses', 'Komplain Selesai'])
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
                            setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Perlu Diproses', 'Komplain Selesai'])
                            setComplainStep(4)
                            if (!data.resi_customer) {
                                console.log("161")
                                setCurrentPosition(1)
                            } else if (data.resi_customer && !data.alasan_tolak_by_seller && data.status !== 'completed') {
                                console.log("171")
                                setCurrentPosition(2)
                            } else if (data.resi_seller) {
                                console.log("181")
                                setCurrentPosition(3)
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
                                setCurrentPosition(1)

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
            })
            .catch(error => {
                res = false
                Utils.handleError(error, "Error with status code : 12054")
            });

        setTimeout(() => {
            if (res) {
                setTimeout(() => {
                    let signal = Utils.checkSignal();
                    if (!signal.connect) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    }
                    setLoading(false)
                }, 5000);
                ToastAndroid.show("Sedang Memuat..", ToastAndroid.CENTER, ToastAndroid.TOP)
            } else {
                setLoading(false)
            }
        }, 7000);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar title={titleHeader} back={true} />
            {loading ? <Loading /> : null}
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
                        {complainDetails.solusi === 'tolak' || complainDetails.solusi === 'lengkapi' || complainDetails.status === 'completed' ?
                            <FinishedComplain />
                            : currentPosition == 0 ?
                                <RequestComplain />
                                : currentPosition == 2 ?
                                    <ProsesComplain /> : <WaitingDelivery />}
                    </View>
                    : null}
            </View>
        </SafeAreaView >
    )
}
