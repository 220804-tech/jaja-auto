import React from 'react'
import { SafeAreaView, Text, Image, StatusBar, StyleSheet } from 'react-native'
import { colors, Hp, useNavigation, Wp } from '../../export'
import { Paragraph, Button } from 'react-native-paper'
export default function OrderNotFound() {
    const navigation = useNavigation()
    const handleOpen = () => {
        navigation.goBack()
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
            <Image style={styles.ilustration} source={require('../../assets/ilustrations/notfound.jpg')} />
            <Paragraph style={styles.textHead}>Ups.. <Text style={styles.textBody}>tampaknya pesanan kamu masih kosong</Text></Paragraph>
            {/* <Button labelStyle={{ color: 'white' }} onPress={() => handleOpen()} mode="contained" color={colors.BlueJaja} style={styles.button}>Kembali</Button> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White },
    ilustration: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textHead: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.BlackGrayScale, fontFamily: 'serif', marginVertical: Hp("2%") },
    textBody: { fontSize: 18, fontWeight: '900', color: colors.BlackGrayScale, fontFamily: 'serif' },
    button: {
        color: colors.BlueJaja,
        width: Wp('77%'),
        marginTop: Hp('3%'),
    }
})