import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { styles, Appbar, colors } from '../../export'
export default function KoinJaja() {
    const reduxUser = useSelector(state => state.user.user)
    console.log("🚀 ~ file: KoinJaja.js ~ line 8 ~ KoinJaja ~ reduxUser", reduxUser.coin ? true : false)


    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Koin Kamu" />
            <View style={styles.column}>
                <View style={[styles.column, styles.pt_2, { backgroundColor: colors.White }]}>
                    <View style={[styles.row_between_center, styles.p_2]}>
                        <View style={styles.column}>
                            <Text style={[styles.font_13, styles.T_medium, styles.mb_3, {}]}>Koin Tersedia</Text>
                            <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>Nomor Akun</Text>
                        </View>
                        <View style={styles.column_center_end}>
                            <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{reduxUser.coin}</Text>
                            <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{reduxUser.account ? String(reduxUser.account).slice(0, 4) + 'XXXXX' : '-'}</Text>
                        </View>
                    </View>
                    <View style={[styles.row_center, styles.mb_2, { width: '95%', alignSelf: 'center' }]}>
                        {/* <TouchableRipple disabled={reduxUser.coin && reduxUser.coin !== '0' ? false : true} onPress={handleRefund} style={[styles.row_center, styles.py_2, { width: '100%', backgroundColor: reduxUser.coin && reduxUser.coin !== '0' ? colors.BlueJaja : colors.Silver }]}>
                            <Text style={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                Ajukan Penarikan
                            </Text>
                        </TouchableRipple> */}
                    </View>
                </View>
                <View style={[styles.column, styles.mt_2, styles.p_2, { backgroundColor: colors.White }]}>
                    <View>
                        <View style={[styles.row_center, styles.p_2, { borderWidth: 0.5 }]}>
                            <Text style={[styles.font_13, { width: 100 / 3 + '%', borderRightWidth: 0.5, textAlign: 'center' }]}>No.</Text>
                            <Text style={[styles.font_13, { width: 100 / 3 + '%', borderRightWidth: 0.5, textAlign: 'center' }]}>Jumlah</Text>
                            <Text style={[styles.font_13, { width: 100 / 3 + '%', textAlign: 'center' }]}>Status</Text>
                        </View>
                        <View style={[styles.row_center, styles.p_5]}>
                            <Text style={[styles.font_13, { textAlign: 'center' }]}>Tidak ada data</Text>
                        </View>
                    </View>
                </View>
            </View>


                <Text>

                </Text>
        </SafeAreaView >
    )
}
