import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, AlertIOS, ToastAndroid, Platform, Modal, TextInput, ScrollView, Dimensions } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import { colors, styles, Wp, Hp, Appbar, useNavigation, Utils, Loading } from '../../export'
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

    const [count, setCount] = useState(0)

    useEffect(() => {
        getItem()
        getPending()
    }, [count])

    const [routes] = useState([
        { key: 'first', title: 'Withdraw' },
        { key: 'second', title: 'History' },

    ]);

    const renderScene = SceneMap({
        first: tabPending,
        second: tabDone,
        // third: Posts,
    });

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
            .then(result => {
                try {
                    let data = JSON.parse(result)
                    if (data.status.code == 200 || data.status.code == 204) {
                        setdoneCoin(data.data.history)
                    } else {
                        Utils.handleErrorResponse(data, 'Error with status code : 12057')
                    }
                } catch (error) {
                    Utils.handleError(data, 'Error with status code : 12058')
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
            .then(result => {
                try {
                    let data = JSON.parse(result)
                    console.log("🚀 ~ file: RewardScreen.js ~ line 84 ~ getPending ~ data", data.data.items)
                    if (data.status.code == 200 || data.status.code == 204) {
                        setpendingCoin(data.data.items)
                    } else {
                        Utils.handleErrorResponse(data, 'Error with status code : 120560')
                    }
                } catch (error) {
                    Utils.handleError(error, 'Error with status code : 12061')
                }
            })
            .catch(error => Utils.handleError(error, "Error with status code : 12062"));
        //     var myHeaders = new Headers();
        //     myHeaders.append("Authorization", reduxAuth);
        //     myHeaders.append("Cookie", "ci_session=4an0u670mohqnot9kjg6vm2s9klamrdq");

        //     var requestOptions = {
        //         method: 'GET',
        //         headers: myHeaders,
        //         redirect: 'follow'
        //     };

        //     fetch("https://jaja.id/backend/user/ListCustomerPayouts", requestOptions)
        //         .then(response => response.text())
        //         .then(result => {
        //             try {
        //                 let data = JSON.parse(result)
        //                 if (data.status.code == 200 || data.status.code == 204) {
        //                     setpendingCoin(data.data)
        //                 } else {
        //                     Utils.handleErrorResponse(data, 'Error with status code : 120560')
        //                 }
        //             } catch (error) {
        //                 Utils.handleError(error, 'Error with status code : 12061')
        //             }
        //         })
        //         .catch(error => Utils.handleError(error, "Error with status code : 12062"));
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
                        if (data.status.code == 200) {
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

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Koin Jaja" />
            {loading ? <Loading /> : null}
            <View style={[styles.column, styles.p, { flex: 1 }]}>
                <View style={[styles.column, { flex: 1, borderRadius: 5, }]}>
                    <View style={[styles.column, styles.pt_2, styles.mb_3, { backgroundColor: colors.White }]}>
                        <View style={[styles.row_between_center, styles.p_2, styles.mb_5]}>
                            <View style={[styles.column]}>
                                <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>Koin Tersedia</Text>
                                <Text style={[styles.font_13, styles.T_medium]}>Nomor Akun</Text>
                            </View>
                            <View style={styles.column_center_end}>
                                <Text style={[styles.font_13, styles.T_medium, styles.mb_3,]}>{reduxUser.coin}</Text>
                                <Text style={[styles.font_13, styles.T_medium,]}>{reduxUser.account ? String(reduxUser.account).slice(0, 4) + 'XXXXX' : '-'}</Text>
                            </View>
                        </View>
                        <View style={[styles.row_center, styles.mb_2, { width: '98%', alignSelf: 'center' }]}>
                            <TouchableRipple disabled={reduxUser.coin && reduxUser.coin !== '0' ? false : true} onPress={() => setShowModal(true)} style={[styles.row_center, styles.py_2, { width: '50%', backgroundColor: reduxUser.coin && reduxUser.coin !== '0' ? colors.GreenSuccess : colors.Silver }]}>
                                <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                    Tambah Rekening
                                </Text>
                            </TouchableRipple>
                            <TouchableRipple disabled={reduxUser.coin && reduxUser.coin !== '0' ? false : true} onPress={() => setShowModal(true)} style={[styles.row_center, styles.py_2, { width: '50%', backgroundColor: reduxUser.coin && reduxUser.coin !== '0' ? colors.BlueJaja : colors.Silver }]}>
                                <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                                    Ajukan Tarik Saldo
                                </Text>
                            </TouchableRipple>
                        </View>
                    </View>
                    <View style={[styles.container, { width: Wp('100%'), backgroundColor: colors.White }]}>
                        <TabView
                            tabBarPosition="top"
                            indicatorStyle={{ backgroundColor: 'white' }}
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={initialLayout}
                            style={{ width: '100%', height: '100%' }}

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
                </View>
                <View style={[styles.column, style.card, styles.mt_5, styles.pb_3]}>
                    <View style={[style.banner, styles.px_3, styles.py_4]}>
                        <Text style={[styles.font_13, styles.T_medium, { color: colors.White }]}>Undang teman kamu untuk install Jaja.id dan dapatkan koin belanja hingga 100.000</Text>
                    </View>
                    {/* <View style={[styles.row_between_center, styles.p_2, styles.mb_5]}>
                        <View style={[styles.column]}>
                            <Text style={[styles.font_13]}>Teman yang kamu undang</Text>
                        </View>
                        <View style={styles.column_center_end}>
                            <Text style={[styles.font_13, styles.T_medium,]}>0</Text>
                        </View>
                    </View> */}
                    <View style={[styles.column_start, styles.px_3, styles.py_2, { width: '100%' }]}>
                        <Text numberOfLines={1} style={styles.font_22}>0</Text>
                        <Text numberOfLines={1} style={[styles.font_14, styles.mb_5]}>Teman yang telah kamu undang</Text>
                        {/* <Text numberOfLines={2} style={[styles.font_13, { fontStyle: 'italic', color: colors.RedFlashsale }]}>* Promo ini hanya berlaku selama event berlangsung</Text> */}
                    </View>
                    <TouchableRipple onPress={() => navigation.navigate('Referral')} onPressIn={() => navigation.navigate('Referral')} style={[styles.row_center, styles.py_2, { width: '97d%', alignSelf: 'center', backgroundColor: colors.BlueJaja, borderRadius: 3 }]}>
                        <Text style={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}>
                            Pelajari
                        </Text>
                    </TouchableRipple>
                    {/* <View style={[styles.row_center_start, styles.p_4]}>
                        <View style={[styles.column_start, { width: '58%' }]}>
                            <View style={styles.row_center}>
                                <Text numberOfLines={1} style={styles.font_22}>{reduxUser.coin} </Text>
                                <Image style={styles.icon_21} source={require('../../assets/icons/coin.png')} />
                            </View>
                            <Text numberOfLines={2} style={styles.font_14}>Koin yang telah kamu dapatkan</Text>
                        </View>
                        <View style={{ borderRightWidth: 2, borderRightColor: colors.Silver, opacity: 0.2, height: '100%', marginHorizontal: '2%' }}></View>
                        <View style={[styles.column_start, { width: '38%' }]}>
                            <Text style={styles.font_22}>0</Text>
                            <Text numberOfLines={2} style={styles.font_14}>Teman yang telah kamu undang</Text>
                        </View>
                    </View>
                    <View style={[styles.column_center_start, styles.px_4, styles.pt, styles.pb_5]}>
                        <Text numberOfLines={2} style={[styles.font_13, styles.mb_5, { fontStyle: 'italic', color: colors.RedFlashsale }]}>* Promo ini hanya berlaku selama event berlangsung</Text>
                        <Button onPress={() => navigation.navigate('Referral')} color={colors.BlueJaja} labelStyle={{ color: colors.White, fontFamily: 'Poppins-SemiBold', fontSize: 12 }} mode="contained" style={{ borderRadius: 100 }}>Pelajari</Button>
                    </View> */}
                </View>
            </View>
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
                        <TextInput keyboardType="numeric" style={[styles.font_13, styles.mb_5, { borderBottomWidth: 0.2 }]} value={nominal} placeholder="20000" onChangeText={(text) => handleChange(text)} />
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
        return <View style={[styles.column, styles.mt_2, styles.p_2, { backgroundColor: colors.White, flex: 1 }]}>
            <View style={[styles.column, { borderWidth: 1, borderColor: colors.BlueJaja, width: '100%', height: '100%' }]}>
                <View style={[styles.row_center, styles.px_2, { borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                    <Text style={[styles.font_12, styles.py, { width: '20%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>No.</Text>
                    <Text style={[styles.font_12, styles.py, { width: '40%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text>
                    <Text style={[styles.font_12, styles.py, { width: '40%', textAlign: 'center' }]}>Note</Text>
                </View>
                {doneCoin.length ?
                    <ScrollView>
                        {doneCoin.map((item, idx) => {
                            return (
                                <View style={[styles.row_center, styles.px_2, { borderBottomWidth: 0.5 }]}>
                                    <View style={[styles.row_center, styles.p, { borderRightWidth: 0.5, width: '20%' }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{idx + 1}.</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p, { borderRightWidth: 0.5, width: '40%', }]}>
                                        {item.tipe_koin === 'plus' ?
                                            <Text style={[styles.font_12, { color: colors.GreenSuccess, textAlign: 'center' }]}>+ {item.koin}</Text>
                                            :
                                            <Text style={[styles.font_12, { color: colors.RedNotif, textAlign: 'center' }]}>- {item.koin}</Text>}
                                    </View>
                                    <View style={[styles.row_center, styles.p, { width: '40%', }]}>
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
        return <View style={[styles.column, styles.mt_2, styles.p_2, { backgroundColor: colors.White, flex: 1 }]}>
            <View style={[styles.column, { borderWidth: 1, borderColor: colors.BlueJaja, width: '100%', height: '100%' }]}>
                <View style={[styles.row_center, { borderBottomWidth: 1, borderColor: colors.BlueJaja }]}>
                    <Text style={[styles.font_12, styles.py, { width: '20%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Account</Text>
                    <Text style={[styles.font_12, styles.py, { width: '30%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text>
                    <Text style={[styles.font_12, styles.py, { width: '30%', borderRightWidth: 1, borderColor: colors.BlueJaja, textAlign: 'center' }]}>Jumlah</Text>

                    <Text style={[styles.font_12, styles.py, { width: '20%', textAlign: 'center' }]}>Status</Text>

                </View>
                {pendingCoin.length ?
                    <ScrollView>
                        {pendingCoin.map((item, indx) => {
                            console.log("🚀 ~ file: RewardScreen.js ~ line 353 ~ {pendingCoin.map ~ item", item)
                            return (
                                <View style={[styles.row_center, { borderBottomWidth: 0.5 }]}>
                                    <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '20%' }]}>
                                        <Text style={[styles.font_10, { textAlign: 'center' }]}>{String(item.account).slice(0, 6)}XXXX</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '30%', }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{item.amount}</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p_2, { borderRightWidth: 0.5, width: '30%', }]}>
                                        <Text style={[styles.font_12, { textAlign: 'center' }]}>{item.noted}Lorem id pariatur anim fugiat</Text>
                                    </View>
                                    <View style={[styles.row_center, styles.p_2, { width: '20%', }]}>
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