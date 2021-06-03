import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image } from 'react-native'
import MidtransComponent from '../../components/Midtrans/MidtransComponent'
import { Loading, styles, Wp, Hp, colors, useNavigation, ServiceCheckout } from '../../export'
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';


export default function MidtransScreen() {
    const navigation = useNavigation()
    const [loading, setloading] = useState(false)
    const reduxOrderId = useSelector(state => state.checkout.orderId)
    const [view, setView] = useState("")
    const [text, setText] = useState("Sedang Menghubungkan..")
    const [auth, setAuth] = useState("")

    const [payment] = useState(
        `<html lang="en">

        <head>
            <title>JJD-202105116391 Selesaikan Pembayaran kamu</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="keywords" content="" />
            <link rel="stylesheet" href="https://jaja.id/vendor/bootstrap/css/bootstrap.min.css" />
            <link rel="shortcut icon" type="icon" href="https://jaja.id/asset/home/logo/logofav.png" />
            <link rel="stylesheet" href="https://jaja.id/asset/home/css/style.css" type="text/css" media="all" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" 
        crossorigin="anonymous">
            <link rel="stylesheet" href="https://jaja.id/asset/home/css/custom.css">
            <script src="https://jaja.id/vendor/jquery/dist/jquery.min.js"></script>
        
            <!-- Midtrans -->
            <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-5WsXpT-RV8mTehtr"></script>
        </head>
        
        <body style="overflow-x:hidden;" class="common-home res layout-4">
            <style>
                .Table_JajaID thead tr td {
                    font-size: 12pt !important;
                    color: #888 !important;
                }
        
                .Table_JajaID tfoot tr td {
                    font-size: 12pt !important;
                    color: #222 !important;
                }
        
                .Table_JajaID tbody .Barang_JajaID td {
                    font-size: 12pt !important;
                    color: #222 !important;
                    /* padding:2em 4em!important; */
                }
        
                .Table_JajaID tbody .Lapak_JajaID td {
                    font-size: 11pt !important;
                    color: #222 !important;
                    padding-top: 1% !important;
                    font-weight: 600;
                    border-bottom: #eee solid 1px;
                }
        
                .HeaderCart_JajaID {
                    background: #fafafa;
                    border-radius: 8px;
                    color: #555 !important;
                }
        
                .Coloring {
                    color: #3CB7E7 !important;
                    font-size: 13pt !important;
                }
        
                .HeaderCartBody_JajaID tr {
                    padding: 2em 5em !important;
                }
        
                .Barang_JajaID td img {
                    margin: 5px 10px 5px 0px;
                }
        
                .TitleKeranjang {
                    margin-top: 2% !important;
                    margin-bottom: 2% !important;
                }
        
                .qty .count {
                    color: #555;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 18px;
                    font-weight: 300;
                    line-height: 30px;
                    padding: 0 2px;
                    min-width: 35px;
                    text-align: center;
                }
        
                .qty .plus {
                    cursor: pointer;
                    display: inline-block;
                    vertical-align: top;
                    /* background:#eee; */
                    border: #ddd solid 1px;
                    color: #999;
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    font: 26px/1 "Arial", sans-serif;
                    text-align: center;
                }
        
                .StokReady {
                    display: inline-block;
                    font-size: 10pt;
                    margin: 3px 17px 5px;
                }
        
                .qty .minus {
                    cursor: pointer;
                    display: inline-block;
                    vertical-align: top;
                    /* background:#eee; */
                    border: #ddd solid 1px;
                    color: #999;
                    width: 30px;
                    height: 30px;
                    font: 26px/1 "Arial", sans-serif;
                    text-align: center;
                    border-radius: 5px;
                    background-clip: padding-box;
                }
        
                .minus:hover {
                    background-color: #eee !important;
                }
        
                .plus:hover {
                    background-color: #eee !important;
                }
        
                .bg-arrow {
                    background: #E2EEF5;
                    display: inline-block;
                    padding: 0px 11px;
                    border-radius: 8px;
                    margin-top: 10px;
                    color: #09f;
                    margin-top: 2% !important;
                }
        
                .qty .count {
                    display: inline-block;
                    vertical-align: top;
                    font-size: 18px;
                    font-weight: 300;
                    border: none !important;
                    line-height: 30px;
                    padding: 0 2px;
                    min-width: 35px;
                    background: #fff;
                    width: 39% !important;
                    border-radius: 8px !important;
                    text-align: center;
                }
        
                .ButtonBuy {
                    background: #64B0C9;
                    font-size: 12pt !important;
                }
        
                .amplop {
                    margin-top: 2%;
                    margin-bottom: 2%;
                    border-top: #3184ED solid 4px;
                    /* border-top:#0E336D solid 4px; */
                    display: inline-block;
                    width: 100%;
                    border-top-right-radius: 8px;
                    border-bottom-right-radius: 8px;
                    border-bottom-left-radius: 8px;
                    border-top-left-radius: 8px;
                }
        
                .amplop p {
                    font-family: "Arial" !important;
                    font-size: 12pt !important;
                    color: #333;
                }
        
                .amplop {
                    padding: 1.2em 2em !important;
        
                    padding-bottom: 3em !important;
                }
        
                .amplop h1 {
                    color: #3CB7E7 !important;
                }
        
                .Gold {
                    color: #F7CC00 !important;
                    font-size: 18pt;
                }
        
                .PrimaryAddress {
                    display: inline-block;
                    background: #0E336D;
                    padding: 6px 20px;
                    color: #F7CC00 !important;
                    border-radius: 10px;
                }
        
                .HargaStyle {
                    background: #f0ffff;
                    border: #09f dashed 1px;
                    border-radius: 8px;
                }
        
                .BackgroundFooter {
                    background: #f0f8ff;
                    border: #09f dashed 1px;
                }
        
                .MetodePembayaran {
                    display: inline-block;
                    margin: 5px;
                    background: #F0F8FF;
                    border: #09f dashed 1px;
                    white-space: pre-line;
                }
        
                .MetodePembayaran h3 {
                    padding: 4px 15px;
                    color: #09f;
                    text-align: center;
                    height: 26px;
                    font-size: 12pt !important;
                }
        
                .Pembayaran:hover .MetodePembayaran {
                    border: #09f solid 1px;
                }
        
                .FontSize {
                    font-size: 12pt !important;
                    color: #222 !important;
                }
        
                table .FontSize tfoot tr td {
                    color: #222 !important;
                }
        
                .NoBorderCustom_JajaID {
                    border: none !important;
                }
        
                .ScrollCustom_JajaID {
                    /* height: 300px!important; */
                    height: 362px !important;
                    overflow-y: scroll !important;
                }
        
                .BagTotalPembayaran {
                    display: inline-block;
                    padding: 5px 10px;
                    color: #222;
                    width: 100%;
                    border-radius: 8px;
                }
        
                .ImgBank {
                    width: 50px;
                    display: inline-block;
                }
        
                .Bank h5 {
                    font-size: 11pt !important;
                    color: #222 !important;
        
                }
        
                .Bank {
                    display: inline-block;
                    padding: 3px 7px;
                }
        
                .TotalPembayaran {
                    color: #64B0C9 !important;
                    font-size: 12pt !important;
                    font-family: "Arial" !important;
                    font-weight: 600;
                }
        
                .ContentMetode {
                    margin-top: 4% !important;
                    display: inline-block;
                    width: 100%;
                    padding: 12px !important;
                    border-radius: 8px;
                }
        
                .ContentMetode p {
                    font-family: "Arial" !important;
                    font-size: 12pt !important;
                    padding: 5px !important;
                }
        
                .modal-content p {
                    padding-top: 0px !important;
                }
        
                #MetodePembayaranOther {
                    padding-left: 0px !important;
                }
        
                .modal-title {
                    color: #333 !important;
                }
        
                .ContentMetodeCustom {
                    margin-top: 2% !important;
                    display: inline-block;
                    width: 100%;
                    padding: 0px !important;
                    border-radius: 8px;
                    border: #ddd solid 1px;
                }
        
                .ContentMetodeCustom:hover {
                    border: #0E336D solid 1px;
                }
        
                .table td,
                .table>tbody>tr>td,
                .table>tbody>tr>th,
                .table>tfoot>tr>td,
                .table>tfoot>tr>th,
                .table>thead>tr>td,
                .table>thead>tr>th {
                    padding: 6px !important;
                }
        
                #days2 {
                    border-radius: 8px;
                    font-size: 1.5em;
                    color: #555;
                    font-size: 13pt;
                    float: left;
                    display: inline-block;
                    padding: 9px 5px;
                }
        
                #hours2 {
                    border-radius: 8px;
                    font-size: 1.5em;
                    color: #555;
                    font-size: 17pt;
                    float: left;
                    display: inline-block;
                    padding: 9px 5px;
                    margin-right: 5px;
                }
        
                #minutes2 {
                    border-radius: 8px;
                    font-size: 1.5em;
                    color: #555;
                    font-size: 17pt;
                    float: left;
                    display: inline-block;
                    padding: 9px 5px;
                    margin-right: 5px;
                }
        
                #seconds2 {
                    border-radius: 8px;
                    font-size: 1.5em;
                    font-size: 17pt;
                    color: #555;
                    display: inline-block;
                    padding: 9px 5px;
                    margin-right: 5px;
                }
        
                #timer {
                    display: inline-block !important;
                }
        
                .JumlahTagihan {
                    display: inline-block;
                    width: 100%;
                    line-height: 2;
                    margin-top: 4% !important;
                }
        
                .JumlahTagihan h3 {
                    margin: 10px;
                }
        
                .Copy {
                    border-bottom: #09f dotted 1px;
                    display: inline-block;
                    font-size: 11pt;
                    color: #222;
                }
        
                .JumlahTagihan h2 {
                    padding-bottom: 0px;
                }
        
                .ColorIng {
                    color: #64B0C9;
                }
        
                .tata-cara {
                    padding-top: 2%;
                    padding-left: 20px !important;
                }
        
                .tata-cara li {
                    list-style-type: decimal;
                    font-size: 12pt;
                    padding: 2px !important;
                }
        
                .JumlahTagihan p {
                    font-size: 11pt !important;
                }
            </style>
        
            <div class="row mt-2">
                <div class="col-md-12">
                    <center>
                        <div class="col-md-6 ">
        
                            <div class="amplop BlurOriginal">
                                <br><br>
                                <h4 class="text-center fs">Mohon segera selesaikan pembayaran kamu. </h4>
                                <center>
        
                                    <div class="JumlahTagihan mb-2">
                                        <h5 class="fs">Nomor Pembayaran</h5>
                                        <h3 class="ColorIng fs"><b><span id="orderId">JJD-202105116391</span></b></h3>
                                        <a href="javascript:" onclick="copyToClipboard('#orderId')" class="Copy clipboard" title="Copy to Clipboard">Salin</a>
                                    </div>
        
                                    <!-- <h4>Batas Pembayaran: </h4>
                                        <div id="timer">
                                            <div id="hours2">01</div>
                                            <div id="minutes2">01</div>
                                            <div id="seconds2">01</div>
                                        </div> -->
        
                                    <div class="JumlahTagihan">
                                        <h3 class="fs"><b>Jumlah yang harus dibayar</b></h3>
                                        <h2 class="ColorIng fs"><b>Rp98.000</b></h2>
                                        <span id="value" style="display: none;">98000</span>
                                        <a href="javascript:" onclick="copyToClipboard('#value')" class="Copy clipboard" title="Copy to Clipboard">Salin</a>
                                    </div>
        
                                    <div class="JumlahTagihan fs">
                                        <a href="javascript:void(0);" onclick="toApp()" class="btn btn-primary" style="font-family: Open Sans">Lihat Pesanan Saya</a><br><br>
                                        <button onclick="bayar_sekarang();" class="btn btn-success" style="font-family: Open Sans">Lakukan Pembayaran</button>
                                    </div>
                                </center>
        
                                <div class="JumlahTagihan fs">
                                    <p class="CatatanSmall">
                                        <b>Catatan:</b> <br>
                                        Mohon pastikan nominal yang ditransfer sesuai dengan jumlah pembayaran.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </center>
                </div>
            </div>
        
            <script type="text/javascript" src="https://jaja.id/vendor/sweetalert/sweetalert.min.js"></script>
            <script type="text/javascript" src="https://jaja.id/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script>
                function bayar_sekarang() {
                    snap.pay("3a504e11-1730-435b-b89c-7c239b1d8a1e", {
                        onSuccess: function(result) {
                            console.log('success');
                            console.log(result);
                        },
                        onPending: function(result) {
                            console.log('pending');
                            console.log(result);
                        },
                        onError: function(result) {
                            console.log('error');
                            console.log(result);
                        },
                        onClose: function() {
                            console.log('customer closed the popup without finishing the payment');
                        }
                    });
                }
        
                function toApp() {
                    window.location = "https://play.google.com/store/apps/details?id=com.seller.jaja";
                }
        
                function copyToClipboard(element) {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val($(element).text()).select();
                    document.execCommand("copy");
                    $temp.remove();
        
                    try {
                        swal("OK", 'Copy to clipboard', 'success');
                    } catch (err) {
                        swal("Warning", 'unable to copy text', 'warning');
                    }
                }
            </script>
        </body>
        </html>`
    )

    useEffect(() => {
        setText("Sedang Menghubungkan..")
        setloading(true)
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.parse(res))
                getItem(JSON.parse(res))
            } else {
                navigation.navigate('Login')
            }
        })
        if (view) {
            getItem(auth)
        }
    }, [view])

    const getItem = (val) => {
        if (reduxOrderId) {
            console.log("🚀 ~ file: MidtransComponent.js ~ line 22 ~ getItem ~ reduxOrderId", reduxOrderId)
            ServiceCheckout.getPayment(val, reduxOrderId).then(res => {
                setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
                setView(res)
                setTimeout(() => setloading(false), 3000);
            }).catch(error => {
                ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

                ServiceCheckout.getPayment(val, reduxOrderId).then(res => {
                    setTimeout(() => setText('Terhubung Payment Gateway'), 1000);
                    setView(res)
                    setTimeout(() => setloading(false), 3000);
                }).catch(err => ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER) & setloading(false))
            });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {console.log("html view => ", view)}
            {loading ?
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: Wp("100%"),
                    height: Hp("100%"),
                    backgroundColor: colors.White
                }}>
                    <Image
                        style={{ width: Wp("100%"), height: Wp('100%'), resizeMode: 'contain' }}
                        resizeMethod={"scale"}
                        source={require("../../assets/gifs/gif_payment.gif")}
                    />
                    <Text style={{ fontWeight: "bold" }}>{text}</Text>
                </View>
                :
                <WebView
                    style={{ alignSelf: 'stretch' }}
                    javaScriptEnabled={true}
                    allowsFullscreenVideo={true}
                    scalesPageToFit={true}
                    originWhitelist={['*']}
                    source={{ html: view }}
                />
            }
        </SafeAreaView>
    )
}
