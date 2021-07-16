import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper'
import { colors, styles, Wp, Hp, Appbar, } from '../../export'
import ImgToBase64 from 'react-native-image-base64';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

export default function ReferralScreen() {
    const reduxUser = useSelector(state => state.user.user)
    console.log("file: ReferralScreen.js ~ line 11 ~ ReferralScreen ~ reduxUser", reduxUser.pin)
    const [image, setImage] = useState('')


    useEffect(() => {
        ImgToBase64.getBase64String('https://nimda.jaja.id/asset/front/images/file/5e177ef22d9e286155e8a3c2cd9e00aa.png')
            .then(async base64String => {
                let urlString = 'data:image/jpeg;base64,' + base64String;
                setImage(urlString)
            })
            .catch(err => console.log("cok"));
    }, [])

    const handleShare = () => {
        try {
            console.log("file: ReferralScreen.js ~ line 32 ~ handleShare ~ image", image)
            let string = String(reduxUser.pin).toLocaleUpperCase()
            const shareOptions = {
                title: 'Jaja',
                message: `Pakai kode referral saya *${string}* dan dapatkan 10.000 koin, untuk belanja di Jaja.id, instal sekarang https://play.google.com/store/apps/details?id=com.seller.jaja`, // Note that according to the documentation at least one of "message" or "url" fields is required
                url: image,
            };
            console.log("file: ReferralScreen.js ~ line 33 ~ handleShare ~ shareOptions", shareOptions)

            Share.open(shareOptions)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });

            // Share.share(shareOptions);
            // const result = await Share.share({
            //     message: 'Pakai kode undanganku dan dapatkan 10.000 koin Jaja.id https://play.google.com/store/apps/details?id=com.seller.jaja | '
            // });
            // if (result.action === Share.sharedAction) {
            //     if (result.activityType) {
            //         // shared with activity type of result.activityType
            //     } else {
            //         // shared
            //     }
            // } else if (result.action === Share.dismissedAction) {
            //     // dismissed
            // }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Undang Teman" />
            <View style={[styles.column, styles.p_3, { flex: 1, backgroundColor: colors.White }]}>
                <View style={[styles.row_between_center, style.card, styles.p_4, styles.mb_4]}>
                    <View style={styles.column}>
                        <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlackSilver }]}>
                            KODE REFERRAL KAMU
                        </Text>
                        <Text style={[styles.font_18, { color: colors.BlueJaja }]}>
                            {String(reduxUser.pin).toLocaleUpperCase()}
                        </Text>
                    </View>
                    <Button onPress={handleShare} color={colors.BlueJaja} labelStyle={{ color: colors.White, fontWeight: 'bold', fontSize: 10 }} mode="contained" style={{ borderRadius: 100 }}>Bagikan Kode</Button>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <View style={[style.banner, styles.px_4, styles.py_5, { width: '100%' }]}>
                        <Text style={[styles.font_16, { color: colors.White, fontWeight: 'bold', alignSelf: 'center' }]}>Cara mendapatkan koin jaja</Text>
                    </View>
                    <View style={[styles.column_center_start, styles.px_3, styles.py_5, [{ width: '100%' }]]}>
                        <View style={[styles.row_start_center, styles.mb_5, { width: '100%' }]}>
                            <View style={[styles.row_center, { backgroundColor: colors.BlueJaja, width: Wp('8%'), height: Wp('8%'), borderRadius: 100 }]}>
                                <Text numberOfLines={1} style={[styles.font_18, { color: colors.White, fontWeight: 'bold' }]}>1</Text>
                            </View>
                            <Text numberOfLines={4} style={[styles.font_16, styles.ml_4, { width: '80%' }]}>Bagikan kode referral kamu dengan cara tap BAGIKAN KODE</Text>
                        </View>
                        <View style={[styles.row_start_center, styles.mb_5, styles.mt_5, { width: '100%' }]}>
                            <View style={[styles.row_center, { backgroundColor: colors.BlueJaja, width: Wp('8%'), height: Wp('8%'), borderRadius: 100 }]}>
                                <Text numberOfLines={1} style={[styles.font_18, { color: colors.White, fontWeight: 'bold' }]}>2</Text>
                            </View>
                            <Text numberOfLines={4} style={[styles.font_16, styles.ml_4, { width: '80%' }]}>Ajak teman instal Jaja.id, dan pastikan teman kamu menggunakan kodemu</Text>
                        </View>
                        <View style={[styles.row_start_center, styles.mb_5, styles.mt_5, { width: '100%' }]}>
                            <View style={[styles.row_center, { backgroundColor: colors.BlueJaja, width: Wp('8%'), height: Wp('8%'), borderRadius: 100 }]}>
                                <Text numberOfLines={1} style={[styles.font_18, { color: colors.White, fontWeight: 'bold' }]}>3</Text>
                            </View>
                            <Text numberOfLines={4} style={[styles.font_16, styles.ml_4, { width: '80%' }]}>Saat teman kamu belanja di Jaja.id, kamu akan mendapatkan 5.000 Koin</Text>
                        </View>
                        <View style={[styles.row_start_center, styles.mb_5, styles.mt_5, { width: '100%' }]}>
                            <View style={[styles.row_center, { backgroundColor: colors.BlueJaja, width: Wp('8%'), height: Wp('8%'), borderRadius: 100 }]}>
                                <Text numberOfLines={1} style={[styles.font_18, { color: colors.White, fontWeight: 'bold' }]}>4</Text>
                            </View>
                            <Text numberOfLines={6} style={[styles.font_16, styles.ml_4, { width: '80%' }]}>Tidak sampai disitu, kamu juga akan mendapatkan 2.000 Koin, ketika teman kamu berhasil mengundang teman lainnya.<Text style={[styles.font_12, { fontStyle: 'italic' }]}> ( Hanya berlaku 1 hirarki ke undangan selanjutnya )</Text></Text>
                        </View>
                        <Text numberOfLines={3} style={[styles.font_14, styles.my_5, { fontStyle: 'italic' }]}>*Undang teman kamu sekarang, untuk mendapatkan koin jaja sebanyak- banyaknya</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    banner: {
        backgroundColor: colors.BlueJaja,
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    }
})