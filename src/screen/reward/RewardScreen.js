import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, Platform, Modal, TextInput, ScrollView, Dimensions, RefreshControl, Alert } from 'react-native'
import { Button, TouchableRipple, Switch, IconButton } from 'react-native-paper'
import { colors, styles, Wp, Hp, Appbar, useNavigation, Utils, Loading, ServiceUser, useFocusEffect } from '../../export'
import { useSelector } from 'react-redux';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
const initialLayout = { width: Dimensions.get('window').width };

export default function RewardScreen() {
    const reduxUser = useSelector(state => state.user.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const navigation = useNavigation();
    const [nominal, setNominal] = useState(0);
    const [deskripsi, setDeskripsi] = useState('');
    const [index, setIndex] = useState(0)

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [doneCoin, setdoneCoin] = useState([])
    const [pendingCoin, setpendingCoin] = useState([])
    const [primary, setPrimary] = useState(null)
    const [listBK, setlistBK] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [countt, setCountt] = useState(0)

    const [count, setCount] = useState(0)

    useEffect(() => {
        setLoading(true)
        getItem()
        getPending()
        setTimeout(() => setLoading(false), 5000);
    }, [count])

    useFocusEffect(
        useCallback(() => {
            getList()
        }, []),
    );


    const [routes] = useState([
        { key: 'first', title: 'Withdraw' },
        { key: 'second', title: 'History' },

    ]);

    const renderScene = SceneMap({
        first: tabPending,
        second: tabDone,
        // third: Posts,
    });

    const getList = () => {
        try {
            ServiceUser.getListAccount(reduxAuth).then(res => {
                console.log("🚀 ~ file: RewardScreen.js ~ line 51 ~ ServiceUser.getListAccount ~ res", res)
                if (res && res.length) {
                    res.map(item => {
                        if (item.isPrimary) {
                            setPrimary(item)
                        }

                    })
                    setlistBK(res)
                    setCountt(countt + 1)
                }
            })
        } catch (error) {

        }
        setTimeout(() => setLoading(false), 1000);
    }

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=4an0u670mohqnot9kjg6vm2s9klamrdq");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/historyKoin", requestOptions)
            .then(response => response.text())
            .then(res => {
                // alert(JSON.stringify(res))
                try {
                    let result = JSON.parse(res)
                    if (result.status.code === 200 || result.status.code == 204) {
                        setdoneCoin(result.data.history)
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12057')
                    }
                } catch (error) {
                    Utils.handleError(JSON.stringify(error) + JSON.stringify(res), 'Error with status code : 12058')
                }
            })
            .catch(error => Utils.handleError(error, "Error with status code : 12059"));
    }

    const getPending = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=4an0u670mohqnot9kjg6vm2s9klamrdq");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/ListCustomerPayouts", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result.status.code === 200 || result.status.code == 204) {
                        setpendingCoin(result.data.items)
                    } else {
                        Utils.handleErrorResponse(data, 'Error with status code : 120560')
                    }
                } catch (error) {
                    Utils.handleError(error, 'Error with status code : 12061')
                }
            })
    }

    const handleRefund = () => {
        setShowModal(false)
        if (nominal >= 20000) {
            setLoading(true)
            let error = true
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=4an0u670mohqnot9kjg6vm2s9klamrdq");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/user/addCustomerPayouts?amount=${nominal}&noted=${deskripsi}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    error = false
                    setLoading(false)
                    try {
                        setNominal('')
                        setDeskripsi('')
                        setCount(0)
                        let data = JSON.parse(result)
                        if (data.status.code === 200) {
                            Utils.alertPopUp('Pengajuanmu berhasil dikirim!')
                        } else if (data.status.message === 'rekening empty') {
                            Utils.alertPopUp('Rekening anda masih kosong!')
                        } else if (data.status.message === 'nominal tidak sesuai') {
                            Utils.alertPopUp('Koin tidak cukup!')
                        } else {
                            Utils.handleErrorResponse(data, 'Error with status code : 12050')
                        }
                    } catch (err) {
                        Utils.alertPopUp(result)
                    }
                })
                .catch(err => {
                    setLoading(false)
                    error = false
                    Utils.handleError(err, 'Error with status code : 12051')
                });

            setTimeout(() => {
                Utils.CheckSignal().then(res => {
                    if (error) {
                        if (res.connect) {
                            Utils.alertPopUp('Sedang memuat..')
                            setTimeout(() => {
                                if (error) {
                                    Utils.alertPopUp('Tidak dapat terhubung, periksa kembali koneksi internet anda!')
                                    setLoading(false)
                                }
                            }, 5000);
                        } else {
                            setLoading(false)
                            Utils.alertPopUp('Tidak dapat terhubung, periksa kembali koneksi internet anda!')
                        }
                    }
                })
            }, 5000);
        } else {
            Utils.alertPopUp("Minimal penarika 20.000 koin")
        }
    }

    const handleChange = (text) => {
        let result = Utils.regex('number', text)
        setNominal(result)
    }
    const toggleSwitch = (idx) => {
        console.log("🚀 ~ file: RewardScreen.js ~ line 191 ~ toggleSwitch ~ idx", idx)
        try {
            let arr = listBK;
            if (!arr[idx].isPrimary) {
                arr[idx].isPrimary = !arr[idx].isPrimary;
                handleChangePrimary(arr[idx].id)
            }
            for (let index = 0; index < arr.length; index++) {
                if (index !== idx) {
                    arr[index].is_primary = false
                }
            }
            setCount(count + 1)
        } catch (error) {
            alert(error)
        }
        // setAddress(arr)

    }
    const handleChangePrimary = (val) => {
        console.log("🚀 ~ file: RewardScreen.js ~ line 223 ~ handleChangePrimary ~ val", val)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "bankAccountId": val
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/changePrimaryBankAccount", requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result.status.code === 200) {
                        getList()
                        Utils.alertPopUp('Akun utama berhasil diganti!')
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12066')
                    }
                } catch (error) {
                    // Alert()
                }
            })
            .catch(error => Utils.handleError(JSON.stringify(error), 'Error with status code : 12067'));
    }

    const handleDelete = val => {
        console.log("🚀 ~ file: RewardScreen.js ~ line 251 ~ RewardScreen ~ val", val)
        Alert.alert(
            "Hapus Rekening!",
            `Anda yakin ingin menhapus rekening?`,
            [

                {
                    text: "BATAL", onPress: () => console.log("pressed")

                },
                {
                    text: "HAPUS",
                    onPress: () => {
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", reduxAuth);

                        var requestOptions = {
                            method: 'DELETE',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`https://jaja.id/backend/user/bankAccount/${val}`, requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                alert(JSON.stringify(result))
                                try {
                                    let res = JSON.parse(result)
                                    if (res.status.code === 200) {
                                        Utils.alertPopUp('Rekening berhasil dihapus!')
                                        getList()
                                    } else {
                                        Utils.handleErrorResponse(res, 'Error with status code : 1268')
                                    }
                                } catch (error) {
                                    Utils.handleErrorResponse(result, 'Error with status code : 1267')

                                }
                            })
                            .catch(error => Utils.handleError(error, 'Error with status code : 12069'));
                    },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );

    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        getPending()
        getList()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Koin Jaja" />
            {loading ? <Loading /> : null}
            <View style={[styles.column, styles.p, { flex: 1 }]}>

                <ScrollView
                    nestedScrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />

                    }>
                    <View style={[styles.column, styles.pt_2, styles.mb_3, { backgroundColor: colors.White }]}>
                        <View style={[styles.row_between_center, styles.p_2, styles.mb_5]}>
                            <View style={[styles.column]}>
                                <View style={[styles.row_between_center]}>
                                    <Text style={[styles.font_14, styles.mb, styles.T_medium, { width: '50%' }]}>Koin Tersedia : </Text>
                                    <Text style={[styles.font_14, styles.mb, { width: '50%', alignSelf: 'flex-end', textAlign: 'right' }]}>{reduxUser.coin ? reduxUser.coin : '0'}</Text>
                                </View>
                                <View style={[styles.row_between_center]}>
                                    <Text style={[styles.font_14, styles.mb_3, styles.T_medium]}>Rekening : </Text>
                                    <Text style={[styles.font_14, styles.mb_3]}>{listBK && listBK.length ? "" : "Tidak ada"} </Text>

                                </View>
                                {listBK && listBK.length ?
                                    listBK.concat(listBK).map((res, idx) => {
                                        console.log("🚀 ~ file: RewardScreen.js ~ line 256 ~ listBK.map ~ res", res)
                                        if (res.isPrimary) {
                                            return (
                                                <View key={String(idx) + 'GF'} style={[styles.column_start_center, styles.mb_3, styles.py_3, { width: Wp('94%'), borderBottomWidth: 0.2, borderBottomColor: colors.Silver }]}>
                                                    <View key={String(idx) + 'GF'} style={[styles.row_between_center, styles.mb_3, { width: Wp('94%') }]}>
                                                        <View style={[styles.row_start_center, { width: Wp('50%') }]}>
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.font_12]}>{idx + 1}. {res.accountName} Alaynsyah saputa </Text>
                                                            {res.verified ?
                                                                <Text style={[styles.font_7, styles.T_semi_bold, { color: colors.BlueJaja, textAlignVertical: 'top', marginTop: '-2%' }]}>Verified</Text>

                                                                : null
                                                            }
                                                        </View>
                                                        <Text style={[styles.font_12, { color: res.isPrimary ? colors.BlueJaja : colors.BlackGrayScale }]}>{String(res.account).slice(0, 4)}XXXXXX</Text>
                                                    </View>
                                                    <View style={[styles.row_between_center, styles.mb, { width: Wp('94%') }]}>
                                                        {!res.isPrimary ?

                                                            // <TouchableRipple rippleColor={colors.White} style={[styles.px_3, styles.py, styles.mr_3, { alignSelf: 'flex-end', backgroundColor: colors.BlueJaja, borderRadius: 7 }]} onPress={() => {
                                                            //     if (res.verified) {
                                                            //         Utils.alertPopUp('Akun telah diverifikasi!')
                                                            //     } else {
                                                            //         Utils.alertPopUp('Cek email anda untuk verifikasi akun!')
                                                            //     }
                                                            // }}>
                                                            <Text numberOfLines={1} style={[styles.font_10, styles.T_semi_bold, { color: colors.BlueJaja }]}>Akun Utama</Text>
                                                            // </TouchableRipple>
                                                            :
                                                            <TouchableRipple rippleColor={colors.White} style={[styles.px_3, styles.py, styles.mr_3, { alignSelf: 'flex-end', backgroundColor: colors.BlueJaja, borderRadius: 4 }]} onPress={() => handleChangePrimary(res.id)}>
                                                                <Text numberOfLines={1} style={[styles.font_8, styles.T_semi_bold, { color: colors.White }]}>Jadikan Utama</Text>
                                                            </TouchableRipple>
                                                        }
                                                        <View style={[styles.row_end_center, { width: '50%' }]}>
                                                            {!res.verified ?
                                                                <TouchableRipple rippleColor={colors.White} style={[styles.px_4, styles.py, styles.mr_3, { alignSelf: 'flex-end', backgroundColor: colors.RedNotif, borderRadius: 4 }]} onPress={() => {
                                                                    Alert.alert(
                                                                        "Akun belum diverifikasi.",
                                                                        `Periksa email anda untuk verifikasi akun!`,
                                                                        [

                                                                            {
                                                                                text: "TUTUP", onPress: () => Utils.alertPopUp('Periksa email anda untuk verifikasi akun!')
                                                                            },
                                                                            // {
                                                                            //     text: "KIRIM ULANG",
                                                                            //     onPress: () => handleChangePrimary(res.id),
                                                                            //     style: "cancel"
                                                                            // },
                                                                        ],
                                                                        { cancelable: false }
                                                                    );


                                                                }}>
                                                                    <Text numberOfLines={1} style={[styles.font_8, styles.T_semi_bold, { color: colors.White }]}>Belum Verifikasi</Text>
                                                                </TouchableRipple>
                                                                : null
                                                            }
                                                            <IconButton
                                                                icon="delete"
                                                                style={{ padding: 0, margin: 0, backgroundColor: colors.Red }}
                                                                color={colors.White}
                                                                size={17}
                                                                onPress={() => handleDelete(res.id)}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    })
                                    : null}
                            </View>

                        </View>
                        <View style={[styles.row_center, styles.mb_2, { width: '98%', alignSelf: 'center' }]}>
                            <TouchableRipple disabled={listBK && listBK.length ? true : false} onPress={() => navigation.navigate('AddAccount')} style={[styles.row_center, styles.py_2, { width: '50%', backgroundColor: listBK && listBK.length ? colors.Silver : colors.GreenSuccess }]}>
                                <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>Tambah Rekening</Text>
                            </TouchableRipple>
                            <TouchableRipple disabled={reduxUser.coin && reduxUser.coin !== '0' ? false : true} onPress={() => setShowModal(true)} style={[styles.row_center, styles.py_2, { width: '50%', backgroundColor: reduxUser.coin && reduxUser.coin !== '0' ? colors.BlueJaja : colors.Silver }]}>
                                <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                    Ajukan Tarik Saldo
                                </Text>
                            </TouchableRipple>
                        </View>

                    </View>

                    <View style={[styles.container, { width: Wp('100%'), height: Hp('50%'), backgroundColor: colors.White }]}>
                        <TabView
                            tabBarPosition="top"
                            indicatorStyle={{ backgroundColor: 'white' }}
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={initialLayout}
                            style={{ width: '100%' }}

                            renderTabBar={props => (
                                <TabBar
                                    {...props}
                                    indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                                    // bounces={true}
                                    scrollEnabled={true}
                                    contentContainerStyle={{ padding: 0, height: '100%' }}
                                    style={{ backgroundColor: colors.White, width: Wp('100%') }}
                                    tabStyle={{ width: Wp('50%'), height: '100%', padding: 0 }} // here
                                    renderLabel={({ route, focused, color }) => {
                                        return (
                                            <View style={[styles.row_center, { width: Wp('50%'), minHeight: Wp('11%') }]}>
                                                {/* <Image style={[styles.icon_25, { tintColor: focused ? colors.BlueJaja : colors.BlackSilver }]} source={route.title == 'Halaman Toko' ? require('../../assets/icons/store.png') : route.title == 'Produk' ? require('../../assets/icons/goods.png') : require('../../assets/icons/store.png')} /> */}
                                                <Text style={[styles.font_12, styles.medium, { textAlign: 'center', color: focused ? colors.BlueJaja : colors.BlackGrayScale }]}>{route.title}</Text>
                                            </View>
                                        )
                                    }}
                                />
                            )}
                        />
                    </View>

                    <View style={[styles.column, style.card, styles.my_5, styles.pb_3, { width: '98%', alignSelf: 'center' }]}>
                        <View style={[style.banner, styles.px_3, styles.py_4]}>
                            <Text style={[styles.font_13, styles.T_medium, { color: colors.White }]}>Undang teman kamu untuk install Jaja.id dan dapatkan koin belanja hingga 100.000</Text>
                        </View>
                        <View style={[styles.column_start, styles.px_3, styles.py_2, { width: '100%' }]}>
                            <Text numberOfLines={1} style={styles.font_22}>0</Text>
                            <Text numberOfLines={1} style={[styles.font_14, styles.mb_5]}>Teman yang telah kamu undang</Text>
                        </View>
                        <TouchableRipple onPress={() => navigation.navigate('Referral')} onPressIn={() => navigation.navigate('Referral')} style={[styles.row_center, styles.py_2, { width: '97d%', alignSelf: 'center', backgroundColor: colors.BlueJaja, borderRadius: 3 }]}>
                            <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                Pelajari
                            </Text>
                        </TouchableRipple>
                    </View>
                </ScrollView>

            </View >
            <Modal visible={showModal} animationType="fade" transparent={true} onRequestClose={() => setShowModal(!showModal)}>
                <View style={[styles.row_center, { flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', zIndex: 999, }]}>
                    <View style={[styles.column, styles.p_3, {
                        width: Wp('90%'), height: Wp('50%'), backgroundColor: colors.White, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.36,
                        shadowRadius: 6.68,
                        elevation: 11,
                    }]}>
                        <Text style={[styles.font_14, styles.T_semi_bold, styles.mb_5, { color: colors.BlueJaja }]}>Tarik Saldo</Text>

                        <Text style={styles.font_13}>Masukkan Nominal</Text>
                        <TextInput keyboardType="numeric" style={[styles.font_13, styles.mb_5, { borderBottomWidth: 0.2 }]} value={String(nominal)} placeholder="20000" onChangeText={(text) => handleChange(text)} />
                        <View style={styles.row_end}>
                            <Button onPress={() => setShowModal(false)} mode="contained" color={colors.Silver} labelStyle={[styles.font_12, styles.T_medium, { color: colors.White }]} style={styles.mr_5}>
                                Tutup
                            </Button>
                            <Button onPress={handleRefund} mode="contained" color={colors.BlueJaja} labelStyle={[styles.font_12, styles.T_medium, { color: colors.White }]}>
                                Ajukan
                            </Button>
                        </View>
                    </View>



                </View>
            </Modal>
        </SafeAreaView >
    )

    function tabDone() {
        return <View style={[styles.column, { backgroundColor: colors.White, flex: 1 }]}>
            <View style={[styles.column, { borderWidth: 1, borderColor: colors.BlueJaja, width: '100%', height: '100%' }]}>
                <View style={[styles.row_center, styles.px_2, { borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                    <Text style={[styles.font_12, styles.py, { width: '15%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>No.</Text>
                    <Text style={[styles.font_12, styles.py, { width: '40%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text>
                    <Text style={[styles.font_12, styles.py, { width: '45%', textAlign: 'center' }]}>Note</Text>
                </View>
                {doneCoin.length ?
                    <ScrollView>

                        {doneCoin.map((item, idx) => {
                            return (
                                <View key={String(idx) + 'GH'} style={[styles.row_center, styles.px_2, { borderBottomWidth: 0.5 }]}>
                                    <View style={[styles.row_center, styles.p, { borderRightWidth: 0.5, width: '15%' }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{idx + 1}.</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p, { borderRightWidth: 0.5, width: '40%', }]}>
                                        {item.tipe_koin === 'plus' ?
                                            <Text style={[styles.font_12, { color: colors.GreenSuccess, textAlign: 'center' }]}>+ {item.koin}</Text>
                                            :
                                            <Text style={[styles.font_12, { color: colors.RedNotif, textAlign: 'center' }]}>- {item.koin}</Text>}
                                    </View>
                                    <View style={[styles.row_center, styles.p, { width: '45%', }]}>
                                        <Text style={[styles.font_10, { textAlign: 'center' }]}>{item.note}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    :
                    <View style={[styles.row_center, styles.p_5, styles.m_5]}>
                        <Text style={[styles.font_13, { textAlign: 'center', color: colors.Blackk }]}>Tidak ada data</Text>
                    </View>}
            </View>
        </View>;
    }

    function tabPending() {
        return <View style={[styles.column, { backgroundColor: colors.White, flex: 1 }]}>
            <View style={[styles.column, { borderWidth: 1, borderColor: colors.BlueJaja, width: '100%', height: '100%' }]}>
                <View style={[styles.row_center, { borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                    <Text style={[styles.font_12, styles.py, { width: '40%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Account</Text>
                    <Text style={[styles.font_12, styles.py, { width: '35%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text>
                    {/* <Text style={[styles.font_12, styles.py, { width: '30%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text> */}
                    <Text style={[styles.font_12, styles.py, { width: '25%', textAlign: 'center' }]}>Status</Text>
                </View>
                {pendingCoin.length ?
                    <ScrollView>
                        {pendingCoin.map((item, indx) => {
                            return (
                                <View key={String(indx) + 'HG'} style={[styles.row_center, { borderBottomWidth: 0.5 }]}>
                                    <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '40%' }]}>
                                        <Text style={[styles.font_10, { textAlign: 'center' }]}>{String(item.account).slice(0, 4)}XXXX</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '35%', }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{item.amount}</Text>
                                    </View>
                                    {/* <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '30%', }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{item.noted}Lorem id pariatur anim fugiat</Text>
                                    </View> */}
                                    <View style={[styles.row_center, styles.p_2, { width: '25%', }]}>
                                        <Text style={[styles.font_10, { textAlign: 'center', color: item.status === 'queued' ? colors.RedNotif : colors.GreenSuccess }]}>{item.status === 'queued' ? 'Pending' : 'Success'}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    :
                    <View style={[styles.row_center, styles.p_5, styles.m_5]}>
                        <Text style={[styles.font_13, { textAlign: 'center', color: colors.Blackk }]}>Tidak ada data</Text>
                    </View>}
            </View>
        </View>;
    }
}

const style = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        borderRadius: 3,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,
        elevation: 3,
    },
    banner: {
        backgroundColor: colors.BlueJaja,
        width: '100%',
        borderTopRightRadius: 3,
        borderTopLeftRadius: 3
    }
})