import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Wp } from '../../export';
import colors from '../colors';

export const style = StyleSheet.create({
    cardProduct: {
        borderRadius: 3,
        width: wp("45%"),
        // minHeight: wp('70%'),
        height: wp("75%"),
        marginLeft: 1,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        elevation: 1,
        backgroundColor: colors.White,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textDiscount: {
        position: 'absolute', fontSize: 12, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '5%', paddingHorizontal: '2%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
    },
    imageProduct: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        // resizeMode: 'center'
    },
    bottomCard: {
        flex: 0, flexDirection: 'column', padding: '3%'
    },
    nameProduct: {
        fontSize: 14,
        alignSelf: 'flex-start',
        marginBottom: '2%',
        color: colors.BlackGrayScale
    },
    priceBefore: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceAfter: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },
    price: { fontSize: 16 , fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale },

    cardBottom: { flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', position: 'absolute', bottom: 3, width: '97%', paddingHorizontal: '3%' },
    location: { flex: 0, flexDirection: 'row', width: '75%', alignItems: 'center' },
    locarionName: { fontSize: 10, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, marginRight: '2%' },
    locationIcon: {
        width: 14,
        height: 14,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        tintColor: colors.BlackGrayScale,
        marginRight: '3%',
    },
});
