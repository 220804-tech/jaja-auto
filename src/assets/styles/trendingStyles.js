import { StyleSheet } from 'react-native';
import { colors, Wp } from '../../export';

export const style = StyleSheet.create({
    cardtrnding: {
        borderRadius: 7,
        width: Wp("46%"),
        height: Wp("20%"),
        marginLeft: 2,
        marginRight: 11,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: colors.White,
        flexDirection: 'row',
        shadowColor: colors.BlackGrayScale,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    trendingImage: {
        width: Wp("20%"),
        height: "100%",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: colors.BlueJaja,
    }
});
