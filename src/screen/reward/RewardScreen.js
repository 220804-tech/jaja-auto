import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, AlertIOS, ToastAndroid, Platform } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import { colors, styles, Wp, Hp, Appbar, useNavigation, } from '../../export'
import { useSelector } from 'react-redux';

export default function RewardScreen() {
    const reduxUser = useSelector(state => state.user.user)
    const navigation = useNavigation();
    const [status, setStatus] = useState('false');

    useEffect(() => {

    }, [])
    const handleRefund = () => {
        let string = 'Tarik saldo masih dalam proses pengembangan!'
        if (Platform.OS === 'android') {
            ToastAndroid.show(string, ToastAndroid.LONG, ToastAndroid.TOP)
        } else {
            AlertIOS.alert(string);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Koin Jaja" />
            <View style={[styles.column, styles.p, { flex: 1 }]}>
                <View style={[styles.column, { backgroundColor: colors.White, borderRadius: 5, height: Hp('50%') }]}>
                    <View style={[styles.column, styles.pt_2,]}>
                        <View style={[styles.row_between_center, styles.p_2, styles.mb_5]}>
                            <View style={[styles.column]}>
                                <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>Koin Tersedia</Text>
                                <Text style={[styles.font_13, styles.T_medium]}>Nomor Akun</Text>
                            </View>
                            <View style={styles.column_center_end}>
                                <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{reduxUser.coin}</Text>
                                <Text style={[styles.font_13, styles.T_medium,]}>{reduxUser.account ? String(reduxUser.account).slice(0, 4) + 'XXXXX' : '-'}</Text>
                            </View>
                        </View>
                        <View style={[styles.row_center, styles.mb_2, { width: '95%', alignSelf: 'center' }]}>
                            <TouchableRipple disabled={reduxUser.coin && reduxUser.coin !== '0' ? false : true} onPress={handleRefund} style={[styles.row_center, styles.py_2, { width: '100%', backgroundColor: reduxUser.coin && reduxUser.coin !== '0' ? colors.BlueJaja : colors.Silver }]}>
                                <Text style={[styles.font_13, styles.T_medium, { color: colors.White }]}>
                                    Ajukan Tarik Saldo
                                </Text>
                            </TouchableRipple>
                        </View>
                    </View>
                    <View style={[styles.column, styles.mt_2, styles.p_2, { backgroundColor: colors.White, flex: 1 }]}>
                        <View style={[styles.column_center, { borderWidth: 0.5, width: '100%', height: '100%' }]}>
                            <View style={[styles.row_center, styles.p_2, { borderBottomWidth: 0.5 }]}>
                                <Text style={[styles.font_12, { width: 100 / 3 + '%', borderRightWidth: 0.5, textAlign: 'center' }]}>No.</Text>
                                <Text style={[styles.font_12, { width: 100 / 3 + '%', borderRightWidth: 0.5, textAlign: 'center' }]}>Jumlah</Text>
                                <Text style={[styles.font_12, { width: 100 / 3 + '%', textAlign: 'center' }]}>Status</Text>
                            </View>
                            <View style={[styles.row_center, styles.p_5, { flex: 1 }]}>
                                <Text style={[styles.font_13, { textAlign: 'center' }]}>Tidak ada data</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.column, style.card, styles.mt_5, styles.pb_3]}>
                    <View style={[style.banner, styles.px_3, styles.py_4]}>
                        <Text style={[styles.font_13, styles.T_medium, { color: colors.White }]}>Undang teman kamu untuk install Jaja.id dan dapatkan koin belanja hingga 100.000</Text>
                    </View>
                    {/* <View style={[styles.row_between_center, styles.p_2, styles.mb_5]}>
                        <View style={[styles.column]}>
                            <Text style={[styles.font_13]}>Teman yang kamu undang</Text>
                        </View>
                        <View style={styles.column_center_end}>
                            <Text style={[styles.font_13, styles.T_medium,]}>0</Text>
                        </View>
                    </View> */}
                    <View style={[styles.column_start, styles.px_3, styles.py_2, { width: '100%' }]}>
                        <Text numberOfLines={1} style={styles.font_22}>0</Text>
                        <Text numberOfLines={1} style={[styles.font_14, styles.mb_5]}>Teman yang telah kamu undang</Text>
                        {/* <Text numberOfLines={2} style={[styles.font_13, { fontStyle: 'italic', color: colors.RedFlashsale }]}>* Promo ini hanya berlaku selama event berlangsung</Text> */}
                    </View>
                    <TouchableRipple onPress={() => navigation.navigate('Referral')} onPressIn={() => navigation.navigate('Referral')} style={[styles.row_center, styles.py_2, { width: '97d%', alignSelf: 'center', backgroundColor: colors.BlueJaja, borderRadius: 3 }]}>
                        <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                            Pelajari
                        </Text>
                    </TouchableRipple>
                    {/* <View style={[styles.row_center_start, styles.p_4]}>
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
                    </View> */}
                </View>
            </View>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        borderRadius: 3,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,
        elevation: 3,
    },
    banner: {
        backgroundColor: colors.BlueJaja,
        width: '100%',
        borderTopRightRadius: 3,
        borderTopLeftRadius: 3
    }
})