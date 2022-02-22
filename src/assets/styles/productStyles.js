import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Wp, Hp } from '../../export';
import colors from '../colors';
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const IS_6INCH = SCREEN_HEIGHT > 765 ? true : false
console.log("🚀 ~ file: productStyles.js ~ line 800000 ~ IS_6INCH", IS_6INCH)
console.log("🚀 ~ file: productStyles.js ~ line 12121 ~ SCREEN_HEIGHT", SCREEN_HEIGHT)
// second argument is standardScreenHeight(optional),
export const style = StyleSheet.create({
    cardProduct: {
        borderRadius: 3,
        width: Wp("44%"),
        marginLeft: Wp('4%'),
        height: Hp("41%"),
        marginVertical: 5,
        justifyContent: "flex-start",
        backgroundColor: colors.White,
        flexDirection: 'column',
        alignSelf: 'center',
        resizeMode: 'contain',
        shadowColor: colors.BlackGrayScale,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 0.9,

        elevation: 1,
    },

    cardProductSmall: {
        marginLeft: 1, marginRight: 9, width: Wp('33%'), height: Wp('57%'), alignItems: 'center',
        borderRadius: 3,
        marginVertical: 5,
        justifyContent: "flex-start",
        backgroundColor: colors.White,
        flexDirection: 'column',
        alignSelf: 'center',
        resizeMode: 'contain',
        shadowColor: colors.BlackGrayScale,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 0.9,

        elevation: 1,
    },

    textDiscount: {
        position: 'absolute', fontSize: RFValue(7, 480), zIndex: 1, backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '5%', paddingHorizontal: '2%', top: 0, right: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
    },
    imageProduct: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    bottomCard: {
        flex: 0, flexDirection: 'column', padding: '3%'
    },
    nameProduct: {
        fontSize: IS_6INCH ? RFValue(13) : RFValue(10),
        fontFamily: 'Poppins-Regular',
        alignSelf: 'flex-start',
        marginBottom: '2%',
        color: colors.BlackGrayScale,
        // backgroundColor: 'red',
        width: Wp("30%"),
    },
    nameProductSmall: {
        fontSize: IS_6INCH ? RFValue(11) : RFValue(10),
        fontFamily: 'Poppins-Regular',
        alignSelf: 'flex-start',
        marginBottom: '2%',
        color: colors.BlackGrayScale,
        // backgroundColor: 'red',
        width: Wp("30%"),
    },
    priceBefore: { fontSize: IS_6INCH ? RFValue(9) : RFValue(8), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceBeforeSmall: { fontSize: IS_6INCH ? RFValue(7) : RFValue(6), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },

    priceAfter: { fontSize: RFValue(13), fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },
    priceAfterSmall: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },

    price: { fontSize: IS_6INCH ? RFValue(14) : RFValue(13), fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale },
    priceSmall: { fontSize: IS_6INCH ? RFValue(12) : RFValue(10), fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },

    discountSmall: { fontSize: RFValue(6), backgroundColor: colors.RedFlashsale, color: colors.White, paddingVertical: '1%', paddingHorizontal: '2%', borderRadius: 3 },


    cardBottom: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', position: 'absolute', bottom: 3, width: '97%', paddingHorizontal: '3%' },
    location: { flex: 0, flexDirection: 'row', width: '75%', alignItems: 'center' },
    locarionName: { fontSize: IS_6INCH ? RFValue(9) : RFValue(8), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, marginRight: '2%' },
    locarionNameSmall: { fontSize: IS_6INCH ? RFValue(8) : RFValue(7), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, marginRight: '2%' },

    locationIcon: {
        width: 13,
        height: 13,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        tintColor: colors.RedFlashsale,
        marginRight: '3%',
    },
    locationIconSmall: {
        width: 12,
        height: 12,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        tintColor: colors.RedFlashsale,
        marginRight: '3%',
    },
});
