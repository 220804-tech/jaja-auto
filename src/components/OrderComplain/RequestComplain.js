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
    const orderInvoice = useSelector(state => state.order.invoice)
    const realNotif = useSelector(state => state.dashboard.notifikasi)
    const complainDetails = useSelector(state => state.complain.complainDetails)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(null)
    const [complainStep, setComplainStep] = useState(0)
    const [titleHeader, setTitleHeader] = useState('Detail komplain')
    // const [complainDetails, setComplainDetails] = useState('')

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


    return (
        <SafeAreaView style={styles.container}>
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
