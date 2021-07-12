import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { styles, Appbar, colors, Wp } from '../../export'

export default function ResponseComplain() {
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Komplain Pesanan" Bg={colors.YellowJaja} />

            <View style={[styles.container, styles.p_4, { width: Wp('100%') }]}>
                <Text style={[styles.font_13, styles.T_semi_bold]}>Produk dikomplain</Text>
                
            </View>

        </SafeAreaView>
    )
}
