import { StyleSheet } from 'react-native';
import { Wp, Hp, colors, AppleType } from '../../export';

export const style = StyleSheet.create({
    card: { width: Wp('100%'), backgroundColor: colors.White, elevation: 1, alignSelf: "center", borderRadius: 3, marginBottom: '3%', flexDirection: 'column', paddingTop: '2%', paddingBottom: '3%' },
    imageProduct: { width: AppleType === 'ipad' ? Wp('15%') : Wp('17%'), height: AppleType === 'ipad' ? Wp('15%') : Wp('17%'), borderRadius: 5, backgroundColor: colors.White, resizeMode: "contain", borderWidth: 0.2, borderColor: colors.Silver },
    buttonStatus: { flex: 1, elevation: 2, backgroundColor: colors.White, justifyContent: 'center', alignItems: 'center', padding: '3%' },
    imageStore: {
        width: AppleType === 'ipad' ? Wp('5%') : Wp('8%'), height: AppleType === 'ipad' ? Wp('5%') : Wp('8%'), borderRadius: 9, marginRight: '5%'
    },
    cardOrder: { width: Wp('100%'), paddingHorizontal: '2%', paddingTop: '1%', paddingBottom: '2%', elevation: 1, backgroundColor: colors.White, marginBottom: '2%' }
})