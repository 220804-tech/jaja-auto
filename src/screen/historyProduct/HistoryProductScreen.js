import React, { useEffect } from 'react'
import { SafeAreaView, View, Text, Alert, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RecomandedHobby, useNavigation, CardProduct, Appbar, styles, colors } from '../../export'


export default function HistoryProductScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const reduxHistoryProduct = useSelector(state => state.profile.historyProduct)
    const reduxUser = useSelector(state => state.user.user)

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

        fetch(`https://jaja.id/backend/user/terakhirDilihat/${reduxUser && reduxUser.id ? reduxUser.id : ""}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_HISTORY_PRODUCT', payload: result.data.history })
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
            <Appbar back={true} title='Terakhir Diihat' />
            <View style={[styles.column, styles.pb_5, { flex: 1, backgroundColor: colors.White }]}>
                <ScrollView contentContainerStyle={styles.pb_5}>
                    {reduxHistoryProduct && reduxHistoryProduct.length ?
                        <View style={[styles.column, styles.px_3]}>
                            <CardProduct data={reduxHistoryProduct} />
                        </View>
                        : <Text style={[styles.font_14, styles.my_5, styles.py_5, { alignSelf: 'center' }]}>Riwayat kamu masih kosong!</Text>
                    }
                    {/* <RecomandedHobby /> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
