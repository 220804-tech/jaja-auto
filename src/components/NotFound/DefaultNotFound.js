import React from 'react'
import { SafeAreaView, Text, Image, StatusBar, StyleSheet } from 'react-native'
import { colors, Hp, useNavigation, Wp } from '../../export'
import { Paragraph, Button } from 'react-native-paper'
export default function OrderNotFound(props) {
    const navigation = useNavigation()
    const handleOpen = () => {
        navigation.goBack()
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
            <Image style={styles.ilustration} source={props.ilustration} />
            <Paragraph style={styles.textHead}>{props.textHead} <Text style={styles.textBody}>{props.textBody}</Text></Paragraph>
            {/* <Button labelStyle={{ color: 'white' }} onPress={() => handleOpen()} mode="contained" color={colors.BlueJaja} style={styles.button}>Kembali</Button> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White },
    ilustration: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textHead: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 16, color: colors.BlackGrayScale, fontFamily: 'Poppins-Medium', marginVertical: Hp("2%") },
    textBody: { fontSize: 16, fontWeight: '900', color: colors.BlackGrayScale, fontFamily: 'Poppins-Regular' },
    button: {
        color: colors.BlueJaja,
        width: Wp('77%'),
        marginTop: Hp('3%'),
    }
})
