import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Wp, Hp } from '../../export';
import colors from '../colors';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

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
        fontSize: RFValue(9, 480),
        fontFamily: 'Poppins-Regular',
        alignSelf: 'flex-start',
        marginBottom: '2%',
        color: colors.BlackGrayScale,
        // backgroundColor: 'red',
        width: Wp("30%"),
    },
    nameProductSmall: {
        fontSize: RFValue(8, 480),
        fontFamily: 'Poppins-Regular',
        alignSelf: 'flex-start',
        marginBottom: '2%',
        color: colors.BlackGrayScale,
        // backgroundColor: 'red',
        width: Wp("30%"),
    },
    priceBefore: { fontSize: 11, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceBeforeSmall: { fontSize: 9, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },

    priceAfter: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },
    priceAfterSmall: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja },

    price: { fontSize: RFValue(10, 480), fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale },
    priceSmall: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale },

    cardBottom: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', position: 'absolute', bottom: 3, width: '97%', paddingHorizontal: '3%' },
    location: { flex: 0, flexDirection: 'row', width: '75%', alignItems: 'center' },
    locarionName: { fontSize: RFValue(7, 480), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, marginRight: '2%' },
    locarionNameSmall: { fontSize: RFValue(6.5, 480), fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, marginRight: '2%' },

    locationIcon: {
        width: 13,
        height: 13,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        tintColor: colors.RedFlashsale,
        marginRight: '3%',
    },
});
