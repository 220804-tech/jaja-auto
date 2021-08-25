import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, StatusBar, Alert, RefreshControl } from 'react-native'
import { styles, Appbar, colors, Wp, Hp, Utils, useNavigation } from '../../export'
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function ResponseComplain() {
    const navigation = useNavigation();

    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxInvoice = useSelector(state => state.order.invoice)
    const [refreshing, setRefreshing] = useState(false);
    const [reload, setReload] = useState(0);

    const [details, setDetails] = useState("")
    const [imageLength, setImageLength] = useState(0)
    const [resiBuyer, setResiBuyer] = useState('')
    const [detailSolution] = useState({
        refund: `1. Pembeli harus mengirim barang ke alamat penjual menggunakan jasa kurir JNE terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di bawah ini, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima produk, uang akan di kembalikan ke rekening pembeli, bila belum menambahkan rekening buka halaman Akun => Refund.
        `,
        change: `1. Pembeli harus mengirim barang ke alamat penjual menggunakan jasa kurir JNE terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di bawah ini, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima produk, penjual akan mengirim kembali sesuai produk yang dipesan.
        \n4. Proses komplain selesai, bila pembeli sudah menerima barang.
        `,
        complete: `1. Penjual akan mengirim kembali produk yang kurang sesuai alamat kamu.
        \n2. Penjual akan memasukkan nomor resi pengiriman, sebagai bukti pengiriman.
        \n3. Setelah pembeli menerima produk, proses komplain selesai.
        `,
        delivery: `1. Penjual akan mengirim kembali produk yang kurang sesuai alamat kamu.
        \n2. Penjual akan memasukkan nomor resi pengiriman, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima produk, penjual akan mengirim kembali sesuai produk yang dipesan.
        `,
    })

    useEffect(() => {
        getItem()
    }, [])

    const getItem = () => {
        console.log("masuk")
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=rq2cevhmm63hlhiro9l2ltcnvmcknvce");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/order/komplainDetail?invoice=${reduxInvoice}`, requestOptions)
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
                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 12032")
                }
            })
            .catch(error => Utils.handleError(error, "Error with status code : 12033"));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);
    const handleReceiptNumber = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=06hsuo4cuq7thfvijjnk64ucdtu1eb99");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/order/inputResiCustomer?invoice=${reduxInvoice}&resi_customer=${resiBuyer}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code == 200) {
                    getItem()
                } else {
                    Utils.handleErrorResponse(result, "Error with status code : 12034")
                }
            })
            .catch(error => Utils.handleError(error, "Error with status codde : 12035"));
    }

    const handleAccept = () => {
        Alert.alert(
            "Terima Pesanan",
            `Kamu akan menerima pesanan seharga ${details.totalPriceCurrencyFormat} dan akan dilepaskan ke penjual.`,
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Terima", onPress: () => {
                        setLoading(true)
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", reduxAuth);
                        myHeaders.append("Cookie", "ci_session=7vgloal55kn733tsqch0v7lh1tfrcilq");

                        var formdata = new FormData();
                        formdata.append("invoice", reduxInvoice);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formdata,
                            redirect: 'follow'
                        };

                        fetch("https://jaja.id/backend/order/pesananDiterima", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.status.code === 200) {
                                    navigation.navigate('Pesanan')
                                } else {
                                    Utils.handleErrorResponse(result, "Error with status code : 12036")
                                }
                            })
                            .catch(error => Utils.handleError(error, "Error with staus code : 12037"));
                    }
                }
            ],
            { cancelable: false }
        );

    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.YellowJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Komplain Pesanan" Bg={colors.YellowJaja} />
            <ScrollView style={{ marginBottom: Hp('8%') }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={[styles.column_center, styles.p_3]}>
                    <View style={[styles.column, styles.py_2, styles.px_4, styles.mb_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[styles.font_12]}>Komplain anda telah diajukan, akan di proses paling lambat 4X24 Jam</Text>
                    </View>
                    {details ?
                        <View style={[styles.column, styles.p_4, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                            <Text style={[styles.font_13, styles.T_semi_bold, styles.my]}>Detail komplain</Text>
                            <View style={[styles.column, styles.px_2]}>
                                <Text numberOfLines={1} style={[styles.font_13, styles.mt]}>Status Komplain : <Text style={{ color: details.status === "request" ? colors.YellowJaja : colors.BlueJaja }}>{details.status === "request" ? "Menunggu Konfirmasi" : details.status === "confirmed" ? "Komplain dikonfirmasi" : details.status === "sendback" ? "Kirim Kembali" : details.status === "completed" ? "Selesai" : ""}</Text></Text>
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
                        : null
                    }
                    {details.status === "confirmed" || details.status === "sendback" || details.status === "delivered" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[styles.font_12]}>Komplain anda telah dikonfirmasi oleh penjual</Text>
                        </View>
                        : null
                    }
                    {details.solusi === "refund" || details.solusi === "change" || details.solusi === "lengkapi" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>

                            <Text style={[styles.font_13, styles.mb_2]}>Komplain anda telah di proses penjual, berikut adalah proses yang harus dilakukan : </Text>
                            {details.solusi === "refund" ?
                                <Text style={[styles.font_12]}>{detailSolution.refund}</Text>
                                : details.solusi === "change" ?
                                    <Text style={[styles.font_12]}>{detailSolution.change}</Text>
                                    : details.solusi === "lengkapi" ?
                                        <Text style={[styles.font_12]}>{detailSolution.complete}</Text>
                                        : null
                            }
                        </View>
                        : null
                    }
                    {details.solusi === "pengiriman" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[styles.font_13]}>Komplain anda telah di proses penjual, penjual akan menghubungi jasa kurir terkait.</Text>
                        </View>

                        : !details.resi_customer && details.solusi === 'refund' || details.solusi == "change" ?
                            <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <Text style={[styles.font_13, styles.mb]}>Masukkan resi pengiriman anda disini :</Text>
                                <View style={[styles.row_between_center, { width: '100%' }]}>
                                    <TextInput style={[styles.font_13, { borderWidth: 0.5, borderColor: colors.WhiteSilver, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => setResiBuyer(text)} value={resiBuyer} />
                                    <Button onPress={handleReceiptNumber} mode="contained" color={colors.BlueJaja} style={{ width: '30%' }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]}>Kirim</Button>
                                </View>
                            </View>

                            : details.solusi === "tolak" ?
                                <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                    <Text style={[styles.font_13]}>Penjual tidak mengkonfirmasi komplain, komplain anda tidak dapat diproses.</Text>
                                    <Text style={[styles.font_13]}>Alasan tidak dikonfirmasi : {details.alasan_tolak_by_seller}</Text>
                                </View>

                                : null
                    }
                    {details.solusi === "refund" || details.solusi === "change" && details.resi_customer ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                            <View style={[styles.column]}>
                                <Text style={[styles.font_13]}>Nomor resi {details.resi_customer} berhasil di tambahkan.</Text>
                            </View>
                        </View>
                        : null
                    }
                    {details.resi_seller && details.solusi === "change" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.my_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <View style={[styles.column]}>
                                <Text style={[styles.font_13]}>Penjual telah mengirim barang dengan nomor resi {details.resi_seller}.</Text>
                            </View>
                        </View>
                        : null
                    }
                    {/* refund,change, lengkapi, tolak */}
                    {/* {details.solusi === "refund" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={styles.font_13}>Penjual telah memilih opsi {details.solusi} <Text style={styles.font_12}>(pengembalian dana)</Text>, dibawah ini adalah syarat untuk refund : </Text>
                            <Text style={styles.font_12}>{detailSolution[details.solusi]}</Text>

                            <Text style={[styles.font_12, { color: colors.RedNotif }]}>Note : biaya pengiriman ditanggung pembeli</Text>
                        </View>
                        : null
                    }
                    {details.solusi === "refund" ?
                        <View style={[styles.column, styles.py_2, styles.px_4, styles.mt_2, styles.T_medium, { width: '100%', backgroundColor: colors.White, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={styles.font_13}>Kirim barang yang anda terima melalui jasa kurir JNE terdekat, sesuai alamat penjual dibawah ini.</Text>
                            <Text style={[styles.font_12, { color: colors.RedNotif }]}>Note : biaya pengiriman ditanggung pembeli</Text>
                        </View>
                        : null
                    } */}
                </View>
            </ScrollView>
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flex: 0,
                    width: Wp("100%"),
                    height: Hp('8%'),
                    // marginBottom: Hp('1%'),
                    paddingHorizontal: '2%',
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: 'space-around',
                    backgroundColor: colors.White,

                }}>
                <Button onPress={handleAccept} mode="contained" color={colors.White} style={{ width: '90%', alignSelf: 'center', elevation: 0, borderWidth: 0.5, borderColor: colors.BlueJaja }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.BlueJaja }]}>Terima Pesanan</Button>


            </View>
        </SafeAreaView >
    )
}
