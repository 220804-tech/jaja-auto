import { StyleSheet } from 'react-native';
import { Wp, Hp, colors } from '../../export';

export const style = StyleSheet.create({
    card: { width: Wp('100%'), backgroundColor: colors.White, elevation: 1, alignSelf: "center", borderRadius: 3, marginBottom: '3%', flexDirection: 'column', paddingTop: '2%', paddingBottom: '3%' },
    image: { width: Wp('17%'), height: Wp('17%'), borderRadius: 5, backgroundColor: colors.BlackGrey },
    buttonStatus: { flex: 1, elevation: 2, backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center', padding: '3%' }

})