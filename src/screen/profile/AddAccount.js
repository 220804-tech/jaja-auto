import React, { useState, useEffect, useCallback, createRef } from 'react'
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Image, TouchableNativeFeedback, ScrollView, FlatList } from 'react-native'
import { styles, colors, useNavigation, Hp, Wp, Appbar, Utils, Loading } from '../../export'
import ActionSheet from "react-native-actions-sheet";
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function AddAccount() {

    const navigation = useNavigation();
    const reduxAccount = useSelector(state => state.user.seller)
    const reduxAuth = useSelector(state => state.auth.auth)
    const state = useSelector(state => state.state)
    const actionSheetAdd = createRef();
    const actionSheetList = createRef();

    const [refreshControl, setRefreshControl] = useState(false);
    const [listBk, setlistBk] = useState([]);
    const [shimmerRK, setshimmerRK] = useState(false);
    const [alertHapus, setAlertHapus] = useState(false);
    const [firstBank, setFirstBank] = useState([]);
    const [listBankApi, setListBankApi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bkName, setbkName] = useState("");
    const [acc, setacc] = useState("");
    const [bkKode, setbkKode] = useState("");
    const [id, setId] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [city, setcity] = useState("");
    const [branch_office, setbranch_office] = useState("");
    const [alertRekening, setAlertRekening] = useState("");
    const [notif, setnotif] = useState(false);
    const [addAccount, setaddAccount] = useState(false);
    const [namaPemilik, setNamaPemilik] = useState('');
    const [alertNamaPemilik, setAlertNamaPemilik] = useState('');
    const [statusView, setstatusView] = useState('show');

    useEffect(() => {
        getListBank()
    }, [])

    const getListBank = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append(
            "Authorization",
            "Basic SVJJUy01ZjNjZjQ1MC0xZmQwLTQ1ZWQtODk3Zi0xMDVmNGMyMjQwY2I6"
        );
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch("https://app.sandbox.midtrans.com/iris/api/v1/beneficiary_banks", requestOptions)
            .then(response => response.json())
            .then(result => {
                var count = Object.keys(result.beneficiary_banks).length;
                let list = [];
                let pertamax = [];
                let keduax = [];
                setTimeout(() => setshimmerRK(false), 1000);
                for (var i = 0; i < count; i++) {
                    let name = result.beneficiary_banks[i].name;
                    if (name === "PT. BANK CENTRAL ASIA TBK." || name === "PT. BANK OCBC NISP TBK." || name === "PT. BANK MANDIRI (PERSERO) TBK." || name === "PT. BANK MAYBANK INDONESIA TBK." || name === "PT. BANK BUKOPIN TBK." || name === "PT. BANK NEGARA INDONESIA (PERSERO)" || name === "PT. BANK DANAMON INDONESIA TBK." || name === "PT. BANK CIMB NIAGA TBK.") {
                        pertamax.push({ code: result.beneficiary_banks[i].code, value: result.beneficiary_banks[i].name })
                    } else {
                        keduax.push({ code: result.beneficiary_banks[i].code, value: result.beneficiary_banks[i].name })
                    }
                }

                setListBankApi(pertamax.concat(keduax));
                setFirstBank(pertamax.concat(keduax));
            })
            .catch(error => {
                Utils.alertPopUp(JSON.stringify(error))
                setshimmerRK(false)
            });
    }

    const handleSearch = (text) => {
        const beforeFilter = listBankApi;
        const afterFilter = beforeFilter.filter(bank => bank.value.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setFirstBank(afterFilter);
    };
    const handlePressed = (item) => {
        setbkKode(item.code)
        setbkName(item.value)
        actionSheetList.current?.setModalVisible(false)
    }

    const handleSubmit = async () => {
        setLoading(true)
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", reduxAuth);
        // myHeaders.append("Cookie", "ci_session=c93q2bi6ff2brqqqk67o3caanoh29scq");
        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     redirect: 'follow'
        // };

        // "bankCode": "mandiri",
        // "bankName": "PT. BANK CENTRAL ASIA TBK.",
        // "account": "1560015898705",
        // "branchOffice": "Bintara",
        // "city": "Bekasi"

        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "bankCode": bkKode,
            "bankName": bkName,
            "account": acc,
            "branchOffice": branch_office,
            "city": city
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/bankAccount", requestOptions)
            // fetch(`https://jaja.id/backend/order/rekeningCust?name=${namaPemilik}&bank_code=${bkKode}&bank_name=${bkName}&account=${acc}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result && Object.keys(result).length && result.status.code == 200) {
                    setbkKode("")
                    setbkName("")
                    setacc("")
                    setcity("")
                    setbranch_office("")
                    Utils.alertPopUp('Rekening kamu berhasil ditambahkan.')
                    navigation.goBack()
                } else if (result && Object.keys(result).length && result.status.message) {
                    Utils.alertPopUp(result.status.message)
                } else {
                    Utils.handleErrorResponse(error, "Error with status code : 12030")
                }
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                Utils.handleError(error, "Error with status code : 12031")
            });

    }

    const renderBank = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handlePressed(item)} style={styles.FL_TouchAble}>
                <Text style={styles.FL_TouchAbleItem}>{item.value}</Text>
            </TouchableOpacity >
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Rekening Kamu" />
            {loading ? <Loading /> : null}
            <View style={{ flex: 0, flexDirection: 'column', padding: '4%' }}>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%', borderBottomWidth: 1, borderBottomColor: '#C0C0C0', }}>
                    <Text style={styles.font_14}>Nama Pemilik</Text>
                    <TextInput style={styles.font_13} value={namaPemilik} onChangeText={(text) => {
                        setNamaPemilik(text)
                        setAlertNamaPemilik("")
                    }} placeholder="ex. Ridwan Hidayat" keyboardType="default" />
                </View>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%' }}>
                    <Text style={[styles.font_14]}>Nama Bank</Text>
                    <TouchableOpacity style={[styles.row_0, { borderBottomWidth: 1, borderBottomColor: '#C0C0C0', paddingHorizontal: '1%' }]} onPress={() => actionSheetList.current?.setModalVisible(true)} >
                        <Text numberOfLines={1} style={[styles.font_13, styles.py_3, { color: bkName ? colors.BlackGrayScale : colors.BlackGrey, width: '87%' }]}>{bkName ? bkName : "Pilih Bank"}</Text>
                        <TouchableNativeFeedback onPress={() => actionSheetList.current?.setModalVisible(true)}>
                            <Image
                                style={[{ tintColor: colors.BlueJaja, position: 'absolute', width: 25, height: 25, right: 10, bottom: 15 }]}
                                source={require('../../assets/icons/down-arrow.png')}
                            />
                        </TouchableNativeFeedback>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%', borderBottomWidth: 1, borderBottomColor: '#C0C0C0', }}>
                    <Text style={styles.font_14}>Nomor Rekening</Text>
                    <TextInput style={styles.font_13} value={acc} onChangeText={(text) => {
                        setacc(text)
                        setAlertRekening("")
                    }} placeholder="ex. 12920009209" keyboardType="numeric" />
                </View>
                <Text style={{ fontSize: 12, color: 'red' }}>{alertRekening}</Text>
                <View style={{ borderBottomWidth: 1, flex: 0, flexDirection: 'column', borderBottomColor: '#C0C0C0', marginTop: '2%' }}>
                    <Text style={styles.font_14}>Kantor Cabang</Text>
                    <TextInput style={styles.font_13} placeholder="ex. Harapan Indah" value={branch_office} onChangeText={(text) => setbranch_office(text)} />
                </View>
                <View style={{ borderBottomWidth: 1, flex: 0, flexDirection: 'column', borderBottomColor: '#C0C0C0', marginTop: '3%' }}>
                    <Text style={styles.font_14}>Kota</Text>
                    <TextInput style={styles.font_13} placeholder="ex. Kota Bekasi" value={city} onChangeText={(text) => setcity(text)} keyboardType="default" />
                </View>
                <Button onPress={() => handleSubmit()} mode="contained" color={colors.BlueJaja} labelStyle={[styles.font_13, styles.semi_bold, { color: colors.White }]} style={{ marginTop: '11%' }}>
                    Simpan
                </Button>
            </View>
            <ActionSheet delayActionSheetDraw={true} delayActionSheetDrawTime={100} footerHeight={80} containerStyle={{ padding: '4%' }}
                ref={actionSheetList}>
                <View style={[styles.column, styles.pb_5, { height: Hp('80%') }]}>
                    <View style={[styles.row, styles.mb_3]}>
                        <Text style={styles.actionSheetTitle}>Pilih Bank</Text>
                        <TouchableOpacity onPress={() => actionSheetList.current?.setModalVisible(false)}  >
                            <Image
                                style={[styles.icon_14, { tintColor: colors.BlueJaja }]}
                                source={require('../../assets/icons/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ flex: 0, flexDirection: 'row', width: '100%', backgroundColor: colors.WhiteGrey, paddingHorizontal: '3%', borderRadius: 11 }}>
                            <View style={{ width: '6%', marginRight: '1%' }}>
                                <Image
                                    source={require('../../assets/icons/loupe.png')}
                                    style={{
                                        height: undefined,
                                        width: undefined,
                                        flex: 1,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                            <TextInput
                                placeholder="Cari nama bank.."
                                style={[styles.font_13, styles.pl_2, { width: '90%', marginBottom: '-1%' }]}
                                onChangeText={(text) => handleSearch(text)}
                            />
                        </View>
                        <View style={{ flex: 1, height: '80%', paddingHorizontal: Wp('2%') }}>
                            <ScrollView style={{ flex: 1 }}>
                                <FlatList
                                    data={firstBank}
                                    renderItem={renderBank}
                                    keyExtractor={(item, index) => String(index) + "LH"} />
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </ActionSheet >
        </SafeAreaView >
    )
}
