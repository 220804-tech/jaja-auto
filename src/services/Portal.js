import React, { useEffect } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import store from '../store/combineReducer'
import Routes from '../routes/Routes'
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';

export default function Portal() {
    useEffect(() => {
        getItem()
    }, [])


    const getItem = async () => {
        messaging().requestPermission().then(authStatus => {
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                messaging().getToken().then(res => {
                    console.log("🚀 ~ file: Portal.js ~ line 22 ~ messaging ~ res", res)
                    EncryptedStorage.setItem('deviceToken', JSON.stringify(res))
                })
            }
        }).catch(res => {

        })
    }


    return (
        <Provider store={createStore(store)}>
            <Routes />
        </Provider>
    )
}