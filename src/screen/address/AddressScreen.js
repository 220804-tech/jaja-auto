import React, { useState, useEffect, useCallback, createRef, useRef } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image, RefreshControl, Alert, ToastAndroid, TouchableHighlight, TouchableWithoutFeedback } from "react-native";
import { Paragraph, Switch, Appbar, Button, TouchableRipple } from "react-native-paper";
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { colors, styles as style, ServiceUser, ServiceCheckout, Loading, Hp } from '../../export'
import * as Service from '../../services/Address';
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import Swipeable from 'react-native-swipeable';
import { StatusBar } from 'native-base';

export default function index(props) {
    const dispatch = useDispatch()
    const reduxUser = useSelector(state => state.user.user.location)
    const reduxAuth = useSelector(state => state.auth.auth)
    const navigation = useNavigation();
    const [refreshControl, setRefreshControl] = useState(false)
    const [count, setcount] = useState(0)
    const [count2, setcount2] = useState(0)
    const [auth, setAuth] = useState(0)
    const [status, setStatus] = useState("Profile")
    const [itemSelected, setSelectedItem] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setRefreshControl(false)
        getLocation()
        if (props.route.params && props.route.params.data) {
            setStatus(props.route.params.data)
        }
        console.log("🚀 ~ file: AddressScreen.js ~ line 34 ~ useEffect ~ props.route.params.data", props.route.params)

    }, [props])


    useFocusEffect(
        useCallback(() => {
            try {
                EncryptedStorage.getItem('token').then(res => {
                    if (res) {
                        setAuth(JSON.parse(res))
                    } else {
                        navigation.navigate(Login)
                    }
                })
            } catch (error) {
                console.log("🚀 ~ file: AddressScreen.js ~ line 59 ~ useEffect ~ error", error)
            }
            getItem()
            getData()
        }, [count]),
    );
    const onRefresh = useCallback(() => {
        setRefreshControl(false)
        navigation.navigate('Address')
        setcount(count + 1)
    }, []);


    const getItem = async () => {
        // try {
        //     let response = await Storage.getToko()
        //     setAddress(response.lokasi)
        //     setToko(response)
        // } catch (error) {
        //     ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        // }
    }

    const getData = async () => {
        try {
            ServiceUser.getProfile(reduxAuth).then(async res => {
                if (res) {
                    EncryptedStorage.setItem('user', JSON.stringify(res))
                    dispatch({ type: 'SET_USER', payload: res })
                    setcount2(count2 + 1)
                } else {
                    let resp = await EncryptedStorage.getItem('user')
                    if (resp) {
                        dispatch({ type: 'SET_USER', payload: JSON.parse(resp) })
                    }
                }
            }).catch(async err => {
                let resp = await EncryptedStorage.getItem('user')
                if (resp) {
                    dispatch({ type: 'SET_USER', payload: JSON.parse(resp) })
                }
            })

        } catch (error) {

        }
    }

    const getLocation = () => {
        setLoading(true)
        Service.getKecamatan().then((res) => {
            EncryptedStorage.setItem('kecamatanApi', JSON.stringify(res.kecamatan))
        });
        setTimeout(() => {
            setLoading(false)
        }, 3500);
    }

    const toggleSwitch = (idx) => {
        console.log("🚀 ~ file: AddressScreen.js ~ line 102 ~ toggleSwitch ~ idx", idx)
        try {
            let arr = reduxUser;
            console.log("🚀 ~ file: AddressScreen.js ~ line 104 ~ toggleSwitch ~ arr", arr)
            if (!arr[idx].is_primary) {
                arr[idx].is_primary = !arr[idx].is_primary;
                handleChangePrimary(arr[idx].id)
            }
            for (let index = 0; index < arr.length; index++) {
                if (index !== idx) {
                    arr[index].is_primary = false
                }
            }
            setcount(count + 1)
        } catch (error) {
            alert(error)
        }
        // setAddress(arr)

    }

    const handleChangePrimary = (addressId) => {
        setRefreshControl(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Content-Type", "application/json");
        console.log("🚀 ~ file: AddressScreen.js ~ line 90 ~ handleChangePrimary ~ addressId", addressId)
        console.log("🚀 ~ file: AddressScreen.js ~ line 96 ~ handleChangePrimary ~ auth", auth)
        var raw = JSON.stringify({
            "addressId": addressId
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/changePrimaryAddress", requestOptions)
            .then(response => response.json())
            .then(result => {
                setRefreshControl(false)
                if (result.status.code === 200) {
                    ServiceUser.getProfile(auth).then(res => {
                        if (res) {
                            EncryptedStorage.setItem('user', JSON.stringify(res))
                            dispatch({ type: 'SET_USER', payload: res })
                            if (props.route.params) {
                                navigation.goBack()
                                ServiceCheckout.getCheckout(auth, null).then(reps => {
                                    if (reps) {
                                        dispatch({ type: 'SET_CHECKOUT', payload: reps })
                                    }
                                })
                                ServiceCheckout.getShipping(auth).then(res => {
                                    console.log("🚀 ~ file: TrolleyScreen.js ~ line 161 ~ ServiceCheckout.getShipping ~ res", res)
                                    if (res) {
                                        dispatch({ type: 'SET_SHIPPING', payload: res })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    Alert.alert(
                        "Jaja.id",
                        String(result.status.message) + " => " + String(result.status.code),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                        ]
                    );
                }
            })
            .catch(error => {
                setLoading(false)
                Alert.alert(
                    "Jaja.id",
                    JSON.stringify(error),
                    [
                        {
                            text: "TUTUP",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                );
            })
    }

    const handleDelete = item => {
        swipeRef.recenter();

        Alert.alert(
            "Peringatan!",
            "Anda ingin menghapus alamat?",
            [
                {
                    text: "BATAL",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Hapus", onPress: () => {
                        setLoading(true)
                        ServiceUser.deleteAddress(reduxAuth, itemSelected.id).then(res => {
                            console.log("🚀 ~ file: AddressScreen.js ~ line 224 ~ ServiceUser.deleteAddress ~ res", res)
                            if (res && res.status && res.status === 200) {
                                ToastAndroid.show("Alamat berhasil dihapus.", ToastAndroid.LONG, ToastAndroid.CENTER)
                            }
                            getData()
                            setTimeout(() => setLoading(false), 1000);

                        })
                        setTimeout(() => setLoading(false), 3000);
                    }
                }],
            { cancelable: false }
        );
    }


    const rightButtons = [
        <TouchableOpacity onPress={() => status === "checkout" ? handleChangePrimary(item.id) : navigation.navigate("AddAddress", { data: itemSelected, edit: true })} style={[styles.card, style.column_center, { height: '100%', width: '20%', backgroundColor: colors.BlueJaja }]}>
            <Image style={[style.icon_25, { tintColor: colors.White }]} source={require('../../assets/icons/edit_pen.png')} />
        </TouchableOpacity>,
        // <TouchableOpacity onPress={handleDelete} style={[styles.card, style.column_center, { height: '100%', width: '20%', backgroundColor: colors.RedDanger }]}>
        //     <Image style={[style.icon_25, { tintColor: colors.White }]} source={require('../../assets/icons/delete.png')} />
        // </TouchableOpacity>
    ]
    const renderItem = ({ item, index }) => {
        return (
            // <Swipeable
            //     rightButtons={rightButtons}
            //     onRightActionRelease={() => {
            //         setSelectedItem(item)
            //     }}
            // >
            <TouchableRipple rippleColor={colors.BlueJaja} onPress={() => navigation.navigate("AddAddress", { data: item, edit: true })} style={[style.column_start_center, styles.card]}>
                <View style={styles.body}>
                    <View style={style.row_between_center}>
                        <Text numberOfLines={1} style={[styles.textName, { width: '55%' }]}>{item.nama_penerima ? item.nama_penerima : ""}</Text>
                        {status === "checkout" ?
                            <Button mode='contained' color={colors.BlueJaja} labelStyle={[style.font_10, style.T_semi_bold, { color: colors.White }]} onPress={() => handleChangePrimary(item.id)}>
                                Pilih Alamat
                            </Button> :
                            <View style={[style.row_end_center, { width: '40%' }]}>
                                <Text adjustsFontSizeToFit numberOfLines={1} style={[style.font_12, { fontFamily: 'Poppins-SemiBold', color: item.is_primary ? colors.BlueJaja : colors.Silver }]}>Alamat utama</Text>
                                {reduxUser && reduxUser.length > 1 ?
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#99e6ff" }}
                                        thumbColor={item.is_primary ? colors.BlueJaja : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch(index)}
                                        value={item.is_primary} />
                                    : null
                                }
                            </View>
                        }
                    </View>
                    <Text adjustsFontSizeToFit style={styles.textNum}>{item.no_telepon ? item.no_telepon : ""}</Text>
                    <Paragraph numberOfLines={3} style={styles.textAlamat}>{item.provinsi + ", " + item.kota_kabupaten + ", " + item.kecamatan + ", " + item.kelurahan + ", " + item.kode_pos + ", " + item.alamat_lengkap}</Paragraph>
                    <View style={[style.row_between_center, style.mt_3]}>
                        <Text style={[style.font_12, { color: colors.BlueJaja, fontFamily: 'Poppins-Regular' }]}>{item.label}</Text>
                        <View style={{ flex: 0, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <Text adjustsFontSizeToFit style={[styles.textAlamat, { fontSize: 12, textAlignVertical: "bottom", marginRight: '1%', fontFamily: 'Poppins-Regular', color: item.latitude ? colors.BlueJaja : colors.RedDanger }]}> {item.alamat_google ? "Lokasi sudah dipin" : "Lokasi belum dipin"}</Text>
                            <Image style={styles.map} source={require('../../assets/icons/google-maps.png')} />
                        </View>
                    </View>
                </View>
            </TouchableRipple>
            // </Swipeable >
        )
    }
    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    }
    return (
        <SafeAreaView style={[style.container, { backgroundColor: colors.BlueJaja }]}>
            <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />

            {loading ? <Loading /> : null}
            <Appbar.Header style={[style.appBar, { height: Hp('7%') }]}>
                <View style={style.row_start_center}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
                    </TouchableOpacity>
                    <Text adjustsFontSizeToFit style={style.appBarText}> Alamat</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
                    <Image style={style.appBarButton} source={require('../../assets/icons/more.png')} />
                </TouchableOpacity>
            </Appbar.Header>
            <View style={style.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
                    }
                    style={{ backgroundColor: colors.White }}
                    contentContainerStyle={{ paddingBottom: '15%' }}>
                    {reduxUser && reduxUser.length ?
                        <FlatList
                            data={reduxUser}
                            keyExtractor={(item, idx) => String(idx)}
                            renderItem={renderItem}
                        /> :
                        <Text style={[style.font_14, style.my_5, style.py_5, { alignSelf: 'center' }]}>Alamat kamu masih kosong!</Text>
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White, justifyContent: 'flex-start',
        elevation: 1,
        // marginBottom: '3%'
    },
    maps: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    map: { width: 21, height: 21, marginRight: '0%' },
    options: { width: 19, height: 19, marginRight: '0%', tintColor: colors.BlackGrey },

    buttonMaps: { flex: 0, borderRadius: 20 },
    body: { width: "100%", flex: 1, justifyContent: 'flex-start', paddingVertical: '4%', paddingHorizontal: '3%', marginBottom: '2%' },
    form: { flex: 0, flexDirection: 'column', paddingVertical: '1%', marginBottom: '3%' },
    textAlamat: { fontSize: 14, color: colors.BlackGrayScale, margin: 0, fontFamily: 'Poppins-Regular' },
    textName: { fontSize: 14, color: colors.BlueJaja, fontFamily: 'Poppins-SemiBold' },
    textNum: { fontSize: 13, color: colors.BlueJaja, fontFamily: 'Poppins-Regular' },

})
