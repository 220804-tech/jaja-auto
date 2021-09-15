import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper'
import { colors, styles, Wp, Hp, Appbar, useNavigation, } from '../../export'
import { useSelector } from 'react-redux';

export default function RewardScreen() {
    const reduxUser = useSelector(state => state.user.user)
    console.log("file: RewardScreen.js ~ line 9 ~ RewardScreen ~ reduxUser", reduxUser)
    const navigation = useNavigation();
    const [status, setStatus] = useState('false');

    useEffect(() => {

    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Reward" />
            <View style={[styles.column, styles.p_3, { flex: 1, backgroundColor: colors.White }]}>
                <View style={[styles.column, style.card]}>
                    <View style={[style.banner, styles.px_4, styles.py_5]}>
                        <Text style={[styles.font_14, { color: colors.White, fontFamily: 'Poppins-SemiBold' }]}>Undang teman kamu untuk install Jaja.id dan dapatkan koin belanja hingga 100.000</Text>
                    </View>
                    <View style={[styles.row_center_start, styles.p_4]}>
                        <View style={[styles.column_start, { width: '58%' }]}>
                            <View style={styles.row_center}>
                                <Text numberOfLines={1} style={styles.font_22}>{reduxUser.coin} </Text>
                                <Image style={styles.icon_21} source={require('../../assets/icons/coin.png')} />
                            </View>
                            <Text numberOfLines={2} style={styles.font_14}>Koin yang telah kamu dapatkan</Text>
                        </View>
                        <View style={{ borderRightWidth: 2, borderRightColor: colors.Silver, opacity: 0.2, height: '100%', marginHorizontal: '2%' }}></View>
                        <View style={[styles.column_start, { width: '38%' }]}>
                            <Text style={styles.font_22}>0</Text>
                            <Text numberOfLines={2} style={styles.font_14}>Teman yang telah kamu undang</Text>
                        </View>
                    </View>
                    <View style={[styles.column_center_start, styles.px_4, styles.pt, styles.pb_5]}>
                        <Text numberOfLines={2} style={[styles.font_13, styles.mb_5, { fontStyle: 'italic', color: colors.RedFlashsale }]}>* Promo ini hanya berlaku selama event berlangsung</Text>
                        <Button onPress={() => navigation.navigate('Referral')} color={colors.BlueJaja} labelStyle={{ color: colors.White, fontFamily: 'Poppins-SemiBold', fontSize: 12 }} mode="contained" style={{ borderRadius: 100 }}>Pelajari</Button>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    banner: {
        backgroundColor: colors.BlueJaja,
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    }
})