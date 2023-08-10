import React, { useEffect } from 'react'
import { createStore } from 'redux'
import { Provider, useDispatch } from 'react-redux';
import store from '../store/combineReducer'
import Routes from '../routes/Routes'
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
// import queryString from 'query-string';

export default function Portal() {

    useEffect(() => {
        getItem()

    }, [])

    // const handleDynamicLink = link => {
    //     alert(JSON.stringify(link))
    //     // alert(link)
    //     // Handle dynamic link inside your own application
    //     // const parsed = queryString.parseUrl(link.url);
    //     if ('https://jajaid.page.link/product?' === String(link.url).slice(0, 33)) {
    //         // dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
    //         // dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
    //         // let slug = Object.keys(parsed.query)
    //         // dispatch({ type: 'SET_SLUG', payload: slug[0] })
    //         navigation.push("Product", { slug: slug[0], image: null })
    //         // navigation.navigate('Pesanan')
    //     }
    // };



    const getItem = async () => {
        messaging().requestPermission().then(authStatus => {
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                messaging().getToken().then(res => {
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