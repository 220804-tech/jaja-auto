import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, StatusBar } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { styles, Appbar, colors, Wp, Hp } from '../../export'
import Collapsible from 'react-native-collapsible';
import { IconButton, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function ResponseComplain(props) {
    const reduxAuth = useSelector(state => state.auth.auth)
    const [details, setDetails] = useState("")

    const [activeSections, setactiveSections] = useState(true)
    const [chat, setChat] = useState("")
    const [imageLength, setImageLength] = useState(0)
    const [solusi, setSolusi] = useState('refund')
    const [detailSolution] = useState({
        refund: `1. Pembeli harus mengirim barang ke alamat penjual menggunakan jasa kurir JNE terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di bawah ini, sebagai bukti pengiriman dengan format RESI-011RE52119.
        \n3. Setelah penjual menerima produk, uang akan di kembalikan ke rekening pembeli, bila belum menambahkan rekening buka halaman Akun => Refund.
        `,
        change: `1. Pembeli harus mengirim barang ke alamat penjual menggunakan jasa kurir JNE terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di bawah ini, sebagai bukti pengiriman dengan format RESI-011RE52119.
        \n3. Setelah penjual menerima produk, penjual akan mengirim kembali sesuai produk yang dipesan.
        `,
        complete: `1. Penjual akan mengirim kembali produk yang kurang sesuai alamat kamu.
        \n2. Penjual akan memasukkan nomor resi pengiriman, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima produk, penjual akan mengirim kembali sesuai produk yang dipesan.
        `,
    })

    useEffect(() => {
        EncryptedStorage.getItem('RequestComplain').then(res => {
            if (res) {
                // setDetails(JSON.parse(res))
            }
        })

        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=rq2cevhmm63hlhiro9l2ltcnvmcknvce");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/order/komplainDetail?invoice=${props.route.params.invoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    let res = result.data[0];
                    let imgLength = 0
                    setDetails(res)
                    if (res.gambar1) imgLength += 1
                    if (res.gambar2) imgLength += 1
                    if (res.gambar3) imgLength += 1
                    setImageLength(imgLength)
                    console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 38 ~ useEffect ~ result.data[0]", result.data[0])
                }
            })
            .catch(error => console.log('error', error));
    }, [])

    const handleSend = (vaL) => {

    }
    const handleAccept = () => {

    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.YellowJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Komplain Pesanan" Bg={colors.YellowJaja} />
            <ScrollView style={{ marginBottom: Hp('15%') }}>
                <View style={[styles.column_center, styles.p_3]}>
                    <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[styles.font_12]}>Komplain anda telah diajukan, akan di proses paling lambat 4X24 Jam</Text>
                    </View>
                    {details ?
                        // <Collapsible style={{ width: '100%' }} collapsed={activeSections}>
                        <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.my]}>Detail komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text numberOfLines={1} style={[styles.font_13, styles.mt]}>Status Komplain : <Text style={{ color: details.status === "request" ? colors.YellowJaja : colors.BlackGrayScale }}>{details.status === "request" ? "Menunggu Konfirmasi" : details.status}</Text></Text>

                                <Text numberOfLines={3} style={[styles.font_13, styles.mt]}>Jenis Komplain : {details.jenis_komplain} - {details.judul_komplain}</Text>
                                <Text numberOfLines={25} style={[styles.font_13, styles.mt]}>Alasan Komplain : {details.komplain}</Text>
                            </View>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Produk dikomplain</Text>
                            <View style={[styles.row_start_center, { width: '100%', height: Wp('17%') }]}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: colors.BlackGrey }}
                                    resizeMethod={"scale"}
                                    resizeMode="cover"
                                    source={{ uri: details.product[0].image }}
                                />
                                <View style={[styles.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('15%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                    <Text numberOfLines={1} style={[styles.font_13, styles.T_medium, { width: '90%' }]}>{details.product[0].name}</Text>
                                    <Text numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale }]}>{details.product[0].variasi ? details.product[0].variasi : ""}</Text>
                                    <View style={[styles.row_between_center, { width: '90%' }]}>
                                        <Text numberOfLines={1} style={[styles.font_13, styles.T_light]}>{details.totalOtherProduct ? "+(" + details.totalOtherProduct + " produk lainnya)" : ""}</Text>
                                        <Text numberOfLines={1} style={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja, }]}>{details.totalPriceCurrencyFormat}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_3, styles.mb]}>Bukti komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text style={[styles.font_12]}>- {imageLength} Foto dilampirkan </Text>
                                <Text style={[styles.font_12, styles.mt_2]}>- {details.video ? '1' : '0'} Video dilampirkan</Text>
                            </View>
                        </View>
                        // </Collapsible>
                        : null
                    }
                    {solusi === "refund" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={styles.font_13}>Penjual telah memilih opsi {solusi} <Text style={styles.font_12}>(pengembalian dana)</Text>, dibawah ini adalah syarat untuk refund : </Text>
                            <Text style={styles.font_12}>{detailSolution[solusi]}</Text>

                            <Text style={[styles.font_12, { color: colors.RedNotif }]}>Note : biaya pengiriman ditanggung pembeli</Text>
                        </View>
                        : null
                    }
                    {solusi === "refund" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={styles.font_13}>Kirim barang yang anda terima melalui jasa kurir JNE terdekat, sesuai alamat penjual dibawah ini.</Text>
                            <Text style={[styles.font_12, { color: colors.RedNotif }]}>Note : biaya pengiriman ditanggung pembeli</Text>
                        </View>
                        : null
                    }
                </View>
            </ScrollView>
            {/* <View style={[styles.row_center, {
                position: 'absolute',
                bottom: 0,
                marginBottom: Hp('8.5%'),
                width: Wp('94%'),
                // backgroundColor: 'silver',
                alignSelf: 'center'
            }]}>
            </View> */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flex: 0,
                    width: Wp("100%"),
                    height: Hp('15%'),
                    // marginBottom: Hp('1%'),
                    paddingHorizontal: '2%',
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: 'space-around',
                    backgroundColor: colors.White,

                }}>
                <Button onPress={handleAccept} mode="contained" color={colors.White} style={{ width: '100%', alignSelf: 'center', elevation: 0, borderWidth: 0.5, borderColor: colors.WhiteGrey }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja }]}>Terima Pesanan</Button>

                <View style={[styles.row_around_center, { width: '100%' }]}>
                    <View style={[styles.row_start_center, { width: "80%", height: Hp('5.5%'), borderRadius: 100, backgroundColor: colors.WhiteGrey, opacity: 0.8 }]}>

                        <TextInput
                            style={{
                                width: "85%",
                                fontSize: Wp("4%"),
                                borderColor: "gray",
                                borderBottomLeftRadius: 100,
                                borderTopLeftRadius: 100,
                                paddingHorizontal: 20,
                            }}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setChat(text)} onSubmitEditing={() => handleSend(null)}
                            value={chat}
                        />
                        {!chat.length ?
                            <IconButton
                                icon={require('../../assets/icons/camera.png')}
                                style={{ margin: 0, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                                color={colors.White}
                                onPress={() => galeryRef.current?.setModalVisible(true)}
                            /> : null}
                    </View>

                    <IconButton
                        icon={require('../../assets/icons/send.png')}
                        style={{ margin: 0, backgroundColor: colors.YellowJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                        color={colors.White}
                        onPress={() => handleSend(null)}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}
