import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../colors';

export const style = StyleSheet.create({
    cardProduct: {
        borderRadius: 10,
        width: wp("44%"),
        // minHeight: wp('70%'),
        height: wp("80%"),
        marginLeft: 1,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        elevation: 2,
        backgroundColor: colors.White,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textDiscount: {
        position: 'absolute', fontSize: 14, zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '6%', paddingHorizontal: '3%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
    },
    imageProduct: {
        width: "100%",
        height: "60%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    bottomCard: {
        flex: 0, flexDirection: 'column', padding: '3%'
    },
    nameProduct: {
        fontSize: 14,
        fontFamily: 'Lato-Bold',
        textAlign: "left",
        alignSelf: 'flex-start',
        marginBottom: '2%'
    },
    priceBefore: { fontSize: 12, fontWeight: '900', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceAfter: { fontSize: 16, fontWeight: '900', color: colors.RedFlashsale },
    price: { fontSize: 14, fontWeight: '900', color: colors.BlackGrayScale },
    location: { flex: 0, flexDirection: 'row', marginTop: '3%' },
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
