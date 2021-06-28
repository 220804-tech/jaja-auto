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
        width: wp("44%"),
        height: wp("44%"),
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
    priceBefore: { fontSize: 12, fontWeight: '900', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceAfter: { fontSize: 16, fontWeight: 'bold', color: colors.BlueJaja },
    price: { fontSize: 14, fontWeight: '900', color: colors.BlackGrayScale },
    location: { flex: 0, flexDirection: 'row', marginTop: '3%', position: 'absolute', bottom: 10, left: 3, width: '80   %' },
    locarionName: { fontSize: 12, color: colors.BlackGrayScale, marginRight: '2%', textAlignVertical: 'top' },
    locationIcon: {
        width: 15,
        height: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        tintColor: colors.BlackGrayScale,
        marginRight: '3%',
    },
});
