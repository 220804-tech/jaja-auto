import { StyleSheet } from 'react-native';
import { Wp, Hp, colors } from '../../export';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    row: { flex: 0, flexDirection: 'row' },
    row_center: { flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    row_center_start: { flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' },
    row_center_end: { flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' },
    row_start: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
    row_start_center: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    row_start_end: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' },
    row_end: { flex: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' },
    row_end_center: { flex: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    row_end_start: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },

    row_around_center: { flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    row_between_center: { flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row_evenly_center: { flex: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },


    column: { flex: 0, flexDirection: 'column' },
    column_center: { flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    column_center_start: { flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
    column_center_end: { flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' },
    column_start: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
    column_start_center: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' },
    column_start_end: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' },
    column_end: { flex: 0, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' },
    column_end_center: { flex: 0, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' },
    column_end_start: { flex: 0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },

    column_around_center: { flex: 0, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' },
    column_between_center: { flex: 0, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' },
    column_evenly_center: { flex: 0, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' },

    m: { margin: '1%' },
    m_2: { margin: '2%' },
    m_3: { margin: '3%' },
    m_4: { margin: '4%' },
    m_5: { margin: '5%' },
    mt: { marginTop: '1%' },
    mt_2: { marginTop: '2%' },
    mt_3: { marginTop: '3%' },
    mt_4: { marginTop: '4%' },
    mt_5: { marginTop: '5%' },
    mr: { marginRight: '1%' },
    mr_2: { marginRight: '2%' },
    mr_3: { marginRight: '3%' },
    mr_4: { marginRight: '4%' },
    mr_5: { marginRight: '5%' },
    ml: { marginLeft: '1%' },
    ml_2: { marginLeft: '2%' },
    ml_3: { marginLeft: '3%' },
    ml_4: { marginLeft: '4%' },
    ml_5: { marginLeft: '5%' },
    mb: { marginBottom: '1%' },
    mb_2: { marginBottom: '2%' },
    mb_3: { marginBottom: '3%' },
    mb_4: { marginBottom: '4%' },
    mb_5: { marginBottom: '5%' },
    mx: { marginHorizontal: '1%' },
    mx_2: { marginHorizontal: '2%' },
    mx_3: { marginHorizontal: '3%' },
    mx_4: { marginHorizontal: '4%' },
    mx_5: { marginHorizontal: '5%' },
    my: { marginVertical: '1%' },
    my_2: { marginVertical: '2%' },
    my_3: { marginVertical: '3%' },
    my_4: { marginVertical: '4%' },
    my_5: { marginVertical: '5%' },

    p: { padding: '1%' },
    p_2: { padding: '2%' },
    p_3: { padding: '3%' },
    p_4: { padding: '4%' },
    p_5: { padding: '5%' },
    pt: { paddingTop: '1%' },
    pt_2: { paddingTop: '2%' },
    pt_3: { paddingTop: '3%' },
    pt_4: { paddingTop: '4%' },
    pt_5: { paddingTop: '5%' },
    pr: { paddingRight: '1%' },
    pr_2: { paddingRight: '2%' },
    pr_3: { paddingRight: '3%' },
    pr_4: { paddingRight: '4%' },
    pr_5: { paddingRight: '5%' },
    pl: { paddingLeft: '1%' },
    pl_2: { paddingLeft: '2%' },
    pl_3: { paddingLeft: '3%' },
    pl_4: { paddingLeft: '4%' },
    pl_5: { paddingLeft: '5%' },
    pb: { paddingBottom: '1%' },
    pb_2: { paddingBottom: '2%' },
    pb_3: { paddingBottom: '3%' },
    pb_4: { paddingBottom: '4%' },
    pb_5: { paddingBottom: '5%' },
    px: { paddingHorizontal: '1%' },
    px_2: { paddingHorizontal: '2%' },
    px_3: { paddingHorizontal: '3%' },
    px_4: { paddingHorizontal: '4%' },
    px_5: { paddingHorizontal: '5%' },
    py: { paddingVertical: '1%' },
    py_2: { paddingVertical: '2%' },
    py_3: { paddingVertical: '3%' },
    py_4: { paddingVertical: '4%' },
    py_5: { paddingVertical: '5%' },

    font_8: { fontSize: 8, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_9: { fontSize: 9, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_10: { fontSize: 10, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_11: { fontSize: 11, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_12: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_13: { fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_14: { fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_15: { fontSize: 15, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_16: { fontSize: 16, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_18: { fontSize: 18, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_20: { fontSize: 20, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_22: { fontSize: 22, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_24: { fontSize: 24, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },
    font_26: { fontSize: 26, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale },

    T_semi_bold: { fontFamily: 'Poppins-SemiBold' },
    T_bold: { fontFamily: 'Poppins-Bold' },
    T_medium: { fontFamily: 'Poppins-Medium' },
    T_italic: { fontFamily: 'Poppins-Italic' },
    T_light: { fontFamily: 'Poppins-Light' },
    T_black: { fontFamily: 'Poppins-Black' },
    T_thin: { fontFamily: 'Poppins-Thin' },


    icon_27: { width: 27, height: 27 },
    icon_25: { width: 25, height: 25 },
    icon_24: { width: 24, height: 24 },
    icon_23: { width: 23, height: 23 },
    icon_21: { width: 21, height: 21 },
    icon_19: { width: 19, height: 19 },
    icon_18: { width: 18, height: 18 },
    icon_16: { width: 16, height: 16, tintColor: colors.BlackGrayScale },
    icon_14: { width: 14, height: 14 },
    icon_12: { width: 12, height: 12 },
    icon_10: { width: 10, height: 10 },

    alertText: { fontSize: 14, color: colors.RedNotif },
    priceBefore: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.BlackGrayScale, textDecorationLine: 'line-through', },
    priceAfter: { fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.RedFlashsale },

    appBar: { zIndex: 1000, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#64B0C9', height: Hp('7%'), width: Wp('100%'), color: colors.siplahDefault, paddingHorizontal: '4%' },
    appBarText: { color: 'white', fontSize: 16, fontFamily: 'Poppins-SemiBold', },
    appBarButton: { tintColor: colors.White, height: 25, width: 25 },

    actionSheetTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: colors.BlueJaja },

    countNotif: { position: 'absolute', height: 15, width: 15, backgroundColor: colors.RedNotif, right: -3, top: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
    textNotif: { fontSize: 9, color: colors.White, fontFamily: 'Poppins-Regular' },
    cardProduct: { flex: 0, flexDirection: 'column', marginRight: 11, width: Wp('33%'), height: Wp('53%'), borderRadius: 4, backgroundColor: colors.White, alignItems: 'center' },
    flashsale: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0,
        color: colors.White,
        marginBottom: '3%',
        // fontFamily: 'Poppins-Regular'
    },
    titleDashboard: {
        fontSize: 16,
        textAlign: "left",
        fontFamily: 'Poppins-Medium',
        color: colors.BlueJaja,
        // marginBottom: '3%'
    },
    dashboardContent: {
        marginTop: -28,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 25,
    },
    search: { flexDirection: 'row', paddingHorizontal: '3%', borderRadius: 5, flex: 1, marginHorizontal: '0.5%', marginVertical: '3%', backgroundColor: colors.WhiteSilver },

    searchBar: { flex: 0, flexDirection: 'row', backgroundColor: colors.White, borderRadius: 11, height: '77%', width: '90%', alignItems: 'center', paddingHorizontal: '4%' },

    FL_TouchAble: { borderBottomColor: colors.Silver, borderBottomWidth: 1, paddingVertical: '3%' },
    FL_TouchAbleItem: { fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.BlackGrayScale },
});
