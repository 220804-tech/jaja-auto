import React from 'react'
import { SafeAreaView, Text, Image, StatusBar, StyleSheet } from 'react-native'
import { colors, Hp, useNavigation, Wp } from '../../export'
import { Paragraph, Button } from 'react-native-paper'
export default function CustomerServiceScreen() {
    const navigation = useNavigation()
    const handleOpen = () => {
        navigation.goBack()
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
            <Image style={styles.iconMarket} source={require('../../assets/ilustrations/empty.png')} />
            <Paragraph style={styles.textJajakan}>Ups.. <Text style={styles.textCenter}>feature ini akan segera hadir, nantikan update selanjutnya..</Text></Paragraph>
            <Button labelStyle={{ color: 'white' }} onPress={() => handleOpen()} mode="contained" color={colors.BlueJaja} style={styles.button}>Kembali</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 16, fontFamily: 'SignikaNegative-SemiBold', color: colors.BlackGrayScale, fontFamily: 'SignikaNegative-Regular', marginVertical: Hp("2%") },
    textCenter: { fontSize: 16, color: colors.BlackGrayScale, fontFamily: 'SignikaNegative-Regular' },
    button: {
        color: colors.BlueJaja,
        width: Wp('77%'),
        marginTop: Hp('3%'),
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'SignikaNegative-SemiBold'
    }
})
