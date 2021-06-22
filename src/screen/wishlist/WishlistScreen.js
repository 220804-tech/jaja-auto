import React, { useEffect } from 'react'
import { SafeAreaView, View, Text, Alert, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { colors, useNavigation, Card, Appbar, styles } from '../../export'


export default function WishlistScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const reduxWistlist = useSelector(state => state.profile.wishlist)
    const reduxUser = useSelector(state => state.user.user)

    console.log("file: WishlistScreen.js ~ line 8 ~ WishlistScreen ~ reduxWistlist", reduxUser.id)

    useEffect(() => {
        getItem()
    }, [])

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("token", "");
        myHeaders.append("Cookie", "ci_session=i675frc252bb865f11581rdactlukptk");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/user/wishlist/${reduxUser && reduxUser.id ? reduxUser.id : ""}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_WISHLIST', payload: result.data.wishlist })
                } else {
                    Alert.alert(
                        "Sepertinya ada masalah!",
                        `${result.status.message + " => " + result.status.code}`,
                        [
                            { text: "TUTUP", onPress: () => navigation.goBack() }
                        ],
                        { cancelable: false }
                    );

                }
            })
            .catch(error => console.log('error', error));
    }
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title='Favorit' />
            <View style={[styles.column, styles.px_3, styles.mb_5, styles.pb_5]}>
                <ScrollView contentContainerStyle={styles.pb_5}>
                    <Card data={reduxWistlist.concat(reduxWistlist.concat(reduxWistlist.concat(reduxWistlist.concat(reduxWistlist))))} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
